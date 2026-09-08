#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Developer tooling only: use an explicitly supplied, qualified Tiinex integrity
// implementation. No copied Core implementation and no Site-relative runtime import.
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node tools/playthings/reseal-local-lineage.mjs <workspace> --integrity-module <qualified-local-module.mjs-or-js> [--check]');
  process.exit(0);
}
const moduleFlag = args.indexOf('--integrity-module');
if (moduleFlag < 0 || !args[moduleFlag + 1] || args[moduleFlag + 1].startsWith('--')) {
  console.error('An explicit qualified Tiinex --integrity-module is required; no Core/Site path is guessed.');
  process.exit(2);
}
const modulePath = path.resolve(args[moduleFlag + 1]);
const { canonicalC14nV2SelfState, sealC14nV2Self } = await import(pathToFileURL(modulePath).href);
if (typeof canonicalC14nV2SelfState !== 'function' || typeof sealC14nV2Self !== 'function') throw new TypeError('Qualified module lacks the required integrity operations');

const root = path.resolve(process.argv[2] || '.');
function walk(d){ let out=[]; for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) out=out.concat(walk(p)); else if(/\.(trace|workspace)\.md$/i.test(e.name)) out.push(p); } return out; }
function digestOf(p){ const s=canonicalC14nV2SelfState(fs.readFileSync(p,'utf8')); return ['verified','mismatch','prepared'].includes(s.state) ? s.computedValue : ''; }
function updateTargetValues(p,text){
  const lines=text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
  let changed=false;
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^\s*-\s+Towards:\s+\[[^\]]+\]\(([^)]+)\)\s*$/);
    if(!m) continue;
    const target=m[1].trim();
    if(!target || /^[a-z]+::/i.test(target) || /^[a-z]+:\/\//i.test(target) || target.startsWith('#')) continue;
    const abs=path.resolve(path.dirname(p),target.split('#')[0]);
    if(!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
    const d=digestOf(abs); if(!d) continue;
    for(let j=i+1;j<Math.min(lines.length,i+5);j++){
      const v=lines[j].match(/^(\s+-\s+Value:)\s*(.*)$/);
      if(v){ const nl=`${v[1]} ${d}`; if(lines[j]!==nl){ lines[j]=nl; changed=true; } break; }
      if(/^\s*-\s+Towards:/.test(lines[j])) break;
    }
  }
  return { text: lines.join('\n'), changed };
}
const files=walk(path.join(root,'.topics'));
if (args.includes('--check')) {
  const findings=[];
  for (const p of files) {
    const text=fs.readFileSync(p,'utf8');
    const state=canonicalC14nV2SelfState(text);
    if (state.state!=='verified') findings.push({path:path.relative(root,p),kind:'self-integrity',state:state.state});
    // Compare values, not whitespace style; already verified artifacts stay byte-stable.
    const updated=updateTargetValues(p,text).text;
    const values=t=>[...t.matchAll(/^\s+-\s+Value:\s*(\S+)\s*$/gm)].map(m=>m[1]);
    if (JSON.stringify(values(text))!==JSON.stringify(values(updated))) findings.push({path:path.relative(root,p),kind:'local-target-integrity'});
  }
  console.log(JSON.stringify({status:findings.length?'findings':'clean',files:files.length,findings},null,2));
  process.exit(findings.length?2:0);
}
let totalWrites=0;
for(let pass=0; pass<20; pass++){
  let writes=0;
  for(const p of files){
    let text=fs.readFileSync(p,'utf8');
    const upd=updateTargetValues(p,text); text=upd.text;
    const s=sealC14nV2Self(text);
    if(s.state!=='sealed') continue;
    const next=s.markdown+'\n';
    if(next!==fs.readFileSync(p,'utf8')){ fs.writeFileSync(p,next); writes++; }
  }
  totalWrites+=writes;
  if(!writes){ console.log(JSON.stringify({status:'stable',passes:pass+1,totalWrites,files:files.length},null,2)); process.exit(0); }
}
console.error(JSON.stringify({status:'unstable',totalWrites},null,2)); process.exit(2);
