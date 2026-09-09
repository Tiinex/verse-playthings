import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const tool=fileURLToPath(new URL('../../../../../tools/playthings/playthings-assets.mjs',import.meta.url));
test('asset location auditor recognizes the accepted structure companion suffix',()=>{
  const root=mkdtempSync(path.join(tmpdir(),'playthings-vocabulary-'));
  try {
    mkdirSync(path.join(root,'.topics/.workspaces'),{recursive:true});
    writeFileSync(path.join(root,'.topics/.workspaces/tiinex-verse-playthings.workspace.md'),'fixture workspace marker');
    mkdirSync(path.join(root,'src/schemas'),{recursive:true});
    // Tests naming/location only; this is deliberately not a PNG decoding test.
    writeFileSync(path.join(root,'src/schemas/example.playthings.structure.png'),'filename-only-fixture');
    const result=spawnSync(process.execPath,[tool,'audit','--workspace',root],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).status,'clean');
  } finally {rmSync(root,{recursive:true,force:true});}
});
