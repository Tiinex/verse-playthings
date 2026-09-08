#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseSemver} from './release-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const npm=process.platform==='win32'?'npm.cmd':'npm';
if (!parseSemver(pkg.version).prerelease) throw new Error(`Bootstrap publish requires a prerelease version, found ${pkg.version}`);
function run(args,extra={}) {
  const result=spawnSync(npm,args,{cwd:root,stdio:'inherit',env:{...process.env,...extra}});
  if (result.error) throw result.error;
  if (result.status!==0) process.exit(result.status??1);
}
console.log(`One-time npm registry bootstrap: ${pkg.name}@${pkg.version} will publish under dist-tag "dev", not "latest".`);
run(['run','check']);
run(['publish','--access','public','--tag','dev'],{PLAYTHINGS_BOOTSTRAP_PUBLISH:'1'});
