#!/usr/bin/env python3
"""Supplementary real-browser primitives, NOT React/App/Verse acceptance.
Requires the optional Python playwright package and an installed Chromium.
No dependency installation, external server, npm publication or repo writes.
"""
from __future__ import annotations
import argparse
import base64
import hashlib
import re
import functools
import json
import os
from pathlib import Path
import shutil
import struct
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
import zlib

ROOT = Path(__file__).resolve().parents[2]
SIZES = {'character': (1024, 1536, 128, 192), 'verb': (128, 24, 16, 24),
         'blueprint': (128, 16, 16, 16), 'portrait': (128, 16, 16, 16),
         'tiles': (256, 64, 32, 32), 'structure': (256, 192, 32, 32),
         'props': (128, 16, 16, 16)}


def chunk(kind: bytes, data: bytes) -> bytes:
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)


def png(channel: str, corrupt_pixels: bool = False) -> bytes:
    width, height, cw, ch = SIZES[channel]
    rows = []
    for y in range(height):
        row = b''.join(bytes(((slot * 29 + 17) % 256, (slot * 43 + 47) % 256,
                             (slot * 61 + 89) % 256, 255)) * cw
                       for slot in range((y // ch) * 8, (y // ch) * 8 + 8))
        rows.append(b'\x00' + row)
    body = b'not a zlib stream' if corrupt_pixels else zlib.compress(b''.join(rows))
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', body) + chunk(b'IEND', b''))


FIXTURES = {f'/fixtures/{name}.png': png(name) for name in SIZES}
FIXTURES['/fixtures/invalid-pixels.png'] = png('portrait', True)


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path in FIXTURES:
            value = FIXTURES[path]
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.send_header('Content-Length', str(len(value)))
            self.end_headers()
            self.wfile.write(value)
            return
        candidate = (ROOT / path.lstrip('/')).resolve()
        allowed = any(candidate.is_relative_to(ROOT / prefix)
                      for prefix in ('src/verses/playthings', 'test/browser/experience'))
        if not allowed or not candidate.is_file() or candidate.suffix not in ('.mjs', '.html'):
            self.send_error(404)
            return
        return super().do_GET()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser', default=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome'))
    parser.add_argument('--transport', choices=['memory', 'http'], default='memory', help='Default embeds exact local module bytes with import-specifier mapping; requires no browser network permission.')
    parser.add_argument('--out', type=Path, help='JSON receipt outside or inside a deliberate evidence path')
    parser.add_argument('--screenshot', type=Path, help='Diagnostic primitive page, not the Playthings Verse')
    parser.add_argument('--no-sandbox', action='store_true', help='Only for an isolated CI/container that cannot run Chromium sandbox')
    args = parser.parse_args()
    if not args.browser or not Path(args.browser).is_file():
        parser.error('An installed Chromium executable is required; supply --browser.')
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        parser.error('Optional Python playwright is absent. This supplemental gate is unrun, not PASS.')
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    report = {'scope': 'native-browser-primitives-only', 'transport': args.transport, 'reactMounted': False, 'appHostMounted': False, 'sigmaAcceptance': False}
    try:
        with sync_playwright() as play:
            with play.chromium.launch(executable_path=args.browser, headless=True,
                                      args=['--no-sandbox'] if args.no_sandbox else []) as browser:
                page = browser.new_page(viewport={'width': 1280, 'height': 800})
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                if args.transport == 'http':
                    page.goto(f'http://127.0.0.1:{server.server_port}/test/browser/experience/primitives.html')
                else:
                    # No HTTP policy override. Only already-readable local fixture
                    # and source bytes are embedded; browser networking is unused.
                    imports, source_hashes = {}, {}
                    pattern = re.compile(r"((?:import|export)\s+[^;]*?\sfrom\s*['\"])([^'\"]+)(['\"])")
                    def embed(path):
                        path = path.resolve()
                        if not path.is_relative_to(ROOT):
                            raise ValueError('Fixture import escapes source root')
                        key = 'playthings:' + path.relative_to(ROOT).as_posix()
                        if key in imports:
                            return key
                        imports[key] = ''
                        source = path.read_bytes()
                        source_hashes[path.relative_to(ROOT).as_posix()] = hashlib.sha256(source).hexdigest()
                        def rewrite(match):
                            specifier = match.group(2)
                            if not specifier.startswith('.'):
                                raise ValueError('Primitive gate may not replace a missing package dependency: ' + specifier)
                            return match.group(1) + embed(path.parent / specifier) + match.group(3)
                        mapped = pattern.sub(rewrite, source.decode('utf-8'))
                        imports[key] = 'data:text/javascript;base64,' + base64.b64encode(mapped.encode()).decode()
                        return key
                    entry = embed(ROOT / 'test/browser/experience/primitives.mjs')
                    html = (ROOT / 'test/browser/experience/primitives.html').read_text().replace('<script type="module" src="./primitives.mjs"></script>', '')
                    page.set_content(html)
                    page.evaluate('(fixtures)=>{window.__playthingsFixtureUrls=fixtures}', {
                        Path(path).stem: 'data:image/png;base64,' + base64.b64encode(data).decode()
                        for path, data in FIXTURES.items()})
                    page.add_script_tag(type='importmap', content=json.dumps({'imports': imports}))
                    page.add_script_tag(type='module', content='import ' + json.dumps(entry) + ';')
                    report['sourceSha256'] = source_hashes
                    report['moduleLoading'] = 'Local ES-module sources; only static specifiers mapped to in-memory modules. No React/package substitutes.' 
                page.wait_for_function('window.__playthingsPrimitiveResult', timeout=30000)
                report.update(page.evaluate('window.__playthingsPrimitiveResult'))
                page.click('#open-gate')
                assert page.locator('#gate').evaluate('(d)=>d.open && d.matches(":modal")')
                assert page.evaluate('document.activeElement.id') == 'close-gate'
                page.keyboard.press('Tab')
                assert page.evaluate('document.activeElement.id') == 'other-control'
                page.keyboard.press('Escape')
                assert not page.locator('#gate').evaluate('(d)=>d.open')
                assert page.evaluate('document.activeElement.id') == 'open-gate'
                report['results'].append({'name': 'native modal opens, focuses its controls, Escape closes and restores focus', 'status': 'pass'})
                if args.screenshot:
                    args.screenshot.parent.mkdir(parents=True, exist_ok=True)
                    page.screenshot(path=str(args.screenshot), full_page=True)
                report['browserVersion'] = browser.version
                report['pageErrors'] = errors
                report['status'] = 'pass' if not errors and all(r['status'] == 'pass' for r in report['results']) else 'fail'
    except Exception as error:
        report['status'] = 'fail'
        report['error'] = str(error)
    finally:
        server.shutdown()
        server.server_close()
    serialized = json.dumps(report, indent=2) + '\n'
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(serialized, encoding='utf-8')
    print(serialized)
    return 0 if report.get('status') == 'pass' else 1


if __name__ == '__main__':
    raise SystemExit(main())
