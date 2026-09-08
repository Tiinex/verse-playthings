#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseSemver} from './release-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if (pkg.private===true) throw new Error('npm publication is disabled because package.json is private');
const parsed=parseSemver(pkg.version);
if (process.env.PLAYTHINGS_BOOTSTRAP_PUBLISH==='1') {
  if (!parsed.prerelease) throw new Error('Bootstrap publish is only allowed for a prerelease version');
  console.log(`Bootstrap publish guard PASS for ${pkg.name}@${pkg.version}`);
  process.exit(0);
}
const tag=process.env.PLAYTHINGS_RELEASE_TAG ?? '';
if (process.env.GITHUB_ACTIONS!=='true' || process.env.GITHUB_EVENT_NAME!=='release') {
  throw new Error('Normal npm publication is only allowed from the GitHub Release workflow; use npm run publish:bootstrap exactly once for registry bootstrap');
}
if (parsed.prerelease) throw new Error(`Release workflow cannot publish prerelease package version ${pkg.version}`);
if (tag!==`v${pkg.version}`) throw new Error(`Release tag ${tag||'(missing)'} does not match package version v${pkg.version}`);
console.log(`GitHub Release publish guard PASS for ${pkg.name}@${pkg.version}`);
