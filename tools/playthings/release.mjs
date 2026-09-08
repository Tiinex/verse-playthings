#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import readline from 'node:readline/promises';
import {stdin as input,stdout as output} from 'node:process';
import {parseSemver,recommendRelease} from './release-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const npm=process.platform==='win32'?'npm.cmd':'npm';
const args=process.argv.slice(2);
const has=name=>args.includes(name);
const value=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:null;};
if (has('--help')) {
  console.log('Usage: node tools/playthings/release.mjs [--dry-run] [--yes] [--bump major|minor|patch] [--no-fetch]');
  console.log('Auto policy: explicit [release:*] markers > breaking/feat markers > public package surface diff > patch default. Before 1.0, automatic breaking changes map to minor unless major is explicit.');
  process.exit(0);
}
const dryRun=has('--dry-run'); const yes=has('--yes'); const override=value('--bump');
if (override && !['major','minor','patch'].includes(override)) throw new Error(`Invalid --bump ${override}`);
function command(bin,argv,{allowFail=false,encoding='utf8'}={}) {
  const result=spawnSync(bin,argv,{cwd:root,encoding,stdio:encoding?['ignore','pipe','pipe']:'inherit'});
  if (result.error) throw result.error;
  if (result.status!==0 && !allowFail) throw new Error(`${bin} ${argv.join(' ')} failed (${result.status})\n${result.stdout??''}\n${result.stderr??''}`);
  return result;
}
const git=(argv,opts={})=>command('git',argv,opts);
const text=(argv,opts={})=>String(git(argv,opts).stdout??'').trim();
function requireTool(bin,args=['--version']) {const r=command(bin,args,{allowFail:true});if(r.status!==0)throw new Error(`${bin} is required for releases`);}
requireTool('git'); requireTool(npm,['--version']); if (!dryRun) requireTool(process.platform==='win32'?'gh.exe':'gh',['--version']);
if (text(['rev-parse','--show-toplevel'])!==root) throw new Error('Run release from the Playthings repository root');
if (text(['status','--porcelain'])) throw new Error('Release requires a clean git worktree');
const branch=text(['branch','--show-current']);
if (branch!=='master') throw new Error(`Release requires master branch, found ${branch||'(detached)'}`);
const origin=text(['remote','get-url','origin']);
if (!/(?:github\.com[/:])Tiinex\/playthings(?:\.git)?$/i.test(origin)) throw new Error(`origin must be Tiinex/playthings, found ${origin}`);
if (!has('--no-fetch') && !dryRun) git(['fetch','origin','master','--tags','--prune']);
const upstream=git(['rev-parse','--verify','origin/master'],{allowFail:true});
if (upstream.status===0) {
  const [ahead,behind]=text(['rev-list','--left-right','--count','origin/master...HEAD']).split(/\s+/).map(Number);
  if (ahead>0) console.log(`Local branch has ${ahead} commit(s) not yet on origin/master; the release push will include them.`);
  if (behind>0) throw new Error(`Local master is ${behind} commit(s) behind origin/master; update before releasing`);
}
const pkg=JSON.parse(await fsp.readFile(path.join(root,'package.json'),'utf8'));
if (pkg.name!=='@tiinex/playthings') throw new Error(`Unexpected package name ${pkg.name}`);
const tags=text(['tag','--merged','HEAD','--list','v*','--sort=-v:refname']).split('\n').filter(Boolean);
let previousTag=null; let previousVersion=null;
for (const tag of tags) {try {const p=parseSemver(tag.slice(1));if(!p.prerelease){previousTag=tag;previousVersion=tag.slice(1);break;}}catch{}}
let previousPackage=null; let commitMessages=[];
if (previousTag) {
  previousPackage=JSON.parse(text(['show',`${previousTag}:package.json`]));
  const count=Number(text(['rev-list','--count',`${previousTag}..HEAD`]));
  if (!count) throw new Error(`No commits exist after ${previousTag}`);
  commitMessages=String(git(['log','--format=%B%x00',`${previousTag}..HEAD`]).stdout??'').split('\0').map(v=>v.trim()).filter(Boolean);
}
const recommendation=recommendRelease({currentVersion:pkg.version,previousVersion,previousPackage,currentPackage:pkg,commitMessages,override});
const targetTag=`v${recommendation.targetVersion}`;
console.log('\nPlaythings release recommendation');
console.log(`  current package: ${pkg.version}`);
console.log(`  latest release:  ${previousTag??'(none)'}`);
console.log(`  bump:            ${recommendation.bump}${recommendation.rawSeverity!==recommendation.bump?` (raw signal ${recommendation.rawSeverity})`:''}`);
console.log(`  target:          ${targetTag}`);
for (const reason of recommendation.reasons) console.log(`  - ${reason}`);
if (dryRun) {console.log('\nDry run only; no files, tags, pushes or GitHub Releases changed.');process.exit(0);}
const gh=process.platform==='win32'?'gh.exe':'gh';
if (command(gh,['auth','status'],{allowFail:true}).status!==0) throw new Error('GitHub CLI is not authenticated; run gh auth login first');
if (command(gh,['release','view',targetTag],{allowFail:true}).status===0) throw new Error(`GitHub Release ${targetTag} already exists`);
if (!yes) {
  const rl=readline.createInterface({input,output});
  const answer=(await rl.question(`\nRun qualification, create ${targetTag}, push atomically and publish a GitHub Release? [y/N] `)).trim().toLowerCase();
  rl.close(); if (!['y','yes'].includes(answer)) {console.log('Release cancelled.');process.exit(0);}
}
command(npm,['run','check'],{encoding:null});
let mutated=false; let committed=false;
try {
  command(npm,['version',recommendation.targetVersion,'--no-git-tag-version','--allow-same-version'],{encoding:null}); mutated=true;
  command(process.execPath,['tools/playthings/verify-release.mjs','--tag',targetTag],{encoding:null});
  git(['add','package.json','package-lock.json']);
  git(['commit','-m',`release: @tiinex/playthings ${targetTag}`],{encoding:null}); committed=true;
  git(['tag','-a',targetTag,'-m',`@tiinex/playthings ${targetTag}`],{encoding:null});
  git(['push','--atomic','origin','HEAD:master',targetTag],{encoding:null});
  command(gh,['release','create',targetTag,'--verify-tag','--generate-notes','--title',`@tiinex/playthings ${targetTag}`],{encoding:null});
  console.log(`\nGitHub Release ${targetTag} published. The npm publish workflow now owns registry publication.`);
} catch (error) {
  if (mutated && !committed) {
    command('git',['restore','--staged','package.json','package-lock.json'],{allowFail:true});
    command('git',['restore','package.json','package-lock.json'],{allowFail:true});
  }
  if (committed) console.error(`\nRelease commit/tag may exist locally or remotely. Do not rerun blindly; inspect git status, git log, git tag and gh release view ${targetTag}.`);
  throw error;
}
