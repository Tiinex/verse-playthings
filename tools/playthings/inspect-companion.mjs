#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {companionChannel,validateAtlas} from '../../src/verses/playthings/runtime/companions/index.mjs';
import {decodePng} from '../../src/verses/playthings/node/index.mjs';
const filename=process.argv[2],channel=process.argv[3]??companionChannel(filename);
try {
  if(!filename||!channel) throw new TypeError('Usage: node tools/playthings/inspect-companion.mjs <file.png> [channel]');
  const raster=decodePng(new Uint8Array(await readFile(filename)));
  const result=validateAtlas({...raster,channel});
  console.log(JSON.stringify({...result,pixelsDecoded:true},null,2));
  if(result.status!=='valid') process.exitCode=2;
} catch(error) {console.error(error.message);process.exitCode=2;}
