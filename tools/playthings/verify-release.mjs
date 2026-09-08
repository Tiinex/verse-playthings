#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseSemver} from './release-policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const args=process.argv.slice(2);
const tagIndex=args.indexOf('--tag');
const tag=tagIndex>=0?args[tagIndex+1]:(process.env.PLAYTHINGS_RELEASE_TAG??'');
if (!tag) throw new Error('Missing release tag; pass --tag vX.Y.Z');
const version=parseSemver(pkg.version);
if (version.prerelease) throw new Error(`Release package version must be stable, found ${pkg.version}`);
if (pkg.private===true) throw new Error('Release package must not be private');
if (tag!==`v${pkg.version}`) throw new Error(`Release tag ${tag} does not match package version v${pkg.version}`);
if (pkg.repository?.url!=='git+https://github.com/Tiinex/playthings.git') throw new Error(`repository.url must exactly identify git+https://github.com/Tiinex/playthings.git for npm trusted publishing`);
console.log(JSON.stringify({status:'pass',package:pkg.name,version:pkg.version,tag,repository:pkg.repository.url}));
