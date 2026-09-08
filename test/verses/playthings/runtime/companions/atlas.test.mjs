import test from 'node:test';
import assert from 'node:assert/strict';
import {COMPANION_CHANNELS,companionChannel,validateAtlas,atlasSlot,compileAtlas,inspectPng} from '../../../../../src/verses/playthings/runtime/companions/index.mjs';
import {decodePng,encodePng,compilePngAtlas} from '../../../../../src/verses/playthings/node/index.mjs';
import {crc32,PNG_SIGNATURE} from '../../../../../src/verses/playthings/runtime/companions/png.inspect.mjs';
import {deflateSync} from 'node:zlib';
const raster=(w,h)=>({width:w,height:h,data:Uint8Array.from({length:w*h*4},(_,i)=>(i*17+31)%256)});
const dimensions={character:[1024,1536],verb:[1536,256],blueprint:[1024,128],portrait:[1024,128],tiles:[256,64],structure:[256,192],props:[1024,384]};
for(const c of COMPANION_CHANNELS) test(`atlas ${c}: named, valid and slot-addressable`,()=>{
 const [width,height]=dimensions[c],layout=validateAtlas({channel:c,width,height});
 assert.equal(layout.status,'valid');assert.equal(companionChannel(`.topics/001-a.playthings.${c}.png`),c);
 const rects=[];for(let i=0;i<layout.collectionCount;i++) for(let slot=0;slot<layout.rowsPerItem*8;slot++) rects.push(atlasSlot(layout,i,slot));
 assert.equal(rects.length,layout.rows*8);assert.equal(new Set(rects.map(r=>`${r.x}:${r.y}`)).size,rects.length);
 assert.ok(rects.every(r=>r.x+r.width<=width&&r.y+r.height<=height));assert.equal(layout.semanticPixelsQualified,false);
});
test('geometry rejects partial grids, unknown channel, excessive memory and partial families',()=>{
 for(const input of [{channel:'tiles',width:256,height:32},{channel:'structure',width:256,height:256},{channel:'props',width:1024,height:129},{channel:'portrait',width:1025,height:128},{channel:'blueprint',width:1024,height:64},{channel:'character',width:1024,height:1024},{channel:'prop',width:8,height:1},{channel:'props',width:4096,height:9000},{channel:'verb',width:8,height:0}]) assert.equal(validateAtlas(input).status,'invalid');
});
test('dimensions carry family count, alpha never determines type',()=>{
 assert.equal(validateAtlas({channel:'tiles',width:256,height:192}).collectionCount,3);
 assert.equal(validateAtlas({channel:'structure',width:256,height:384}).collectionCount,2);
 const source=raster(1,1);source.data.fill(0);
 const result=compileAtlas(source,{channel:'props',width:8,height:1,cells:Array.from({length:8},()=>({empty:true}))});
 assert.equal(result.layout.collectionCount,1);assert.equal(result.layout.channel,'props');
});
test('channel detection does not admit legacy generic, typo or query-path filenames',()=>{
 for(const p of ['x.png','x.playthings.png','x.playthings..tiles.png','x.playthings.prop.png','x.playthings.tiles.PNG','x.playthings.tiles.png?state=a']) assert.equal(companionChannel(p),null);
});
test('role grammar matches accepted fixed state meanings and architecture split',()=>{
 const t=validateAtlas({channel:'tiles',width:256,height:64}),s=validateAtlas({channel:'structure',width:256,height:192});
 assert.equal(atlasSlot(t,0,15).role,'floor-mask-15');
 assert.equal(atlasSlot(s,0,0).role,'wall-mask-0');assert.equal(atlasSlot(s,0,31).role,'roof-mask-15');
 assert.equal(atlasSlot(s,0,32).role,'doorway-north');assert.equal(atlasSlot(s,0,47).role,'stairs-down-west');
 const p=validateAtlas({channel:'portrait',width:64,height:8});assert.equal(atlasSlot(p,0,4).role,'ambient-1');
 assert.throws(()=>atlasSlot(p,1,0));assert.throws(()=>atlasSlot(p,0,8));
});
test('explicit compiler preserves RGBA including hidden RGB and never mutates input',()=>{
 const input=raster(16,2),copy=input.data.slice(),cells=Array.from({length:8},(_,i)=>({source:{x:i*2,y:0,width:2,height:2}}));
 const result=compileAtlas(input,{channel:'portrait',width:16,height:2,cells});
 assert.deepEqual(result.data,input.data);assert.deepEqual(input.data,copy);assert.notEqual(result.data,input.data);
});
test('clockwise rotations and post-rotation flips work on rectangular source cells',()=>{
 const input={width:3,height:2,data:new Uint8Array(24)};
 [1,2,3,4,5,6].forEach((v,i)=>input.data.set([v,0,0,255],i*4));
 for(let turns=0;turns<4;turns++) for(const flipX of [false,true]) for(const flipY of [false,true]) {
   const w=turns%2?2:3,h=turns%2?3:2;
   const result=compileAtlas(input,{channel:'verb',width:w*8,height:h,cells:Array.from({length:8},()=>({source:{x:0,y:0,width:3,height:2},quarterTurns:turns,flipX,flipY}))});
   let expected=[[1,2,3],[4,5,6]];
   for(let n=0;n<turns;n++) expected=expected[0].map((_,x)=>expected.map(row=>row[x]).reverse());
   if(flipX) expected=expected.map(row=>[...row].reverse());if(flipY) expected.reverse();
   for(let y=0;y<h;y++) for(let x=0;x<w;x++) assert.equal(result.data[(y*w*8+x)*4],expected[y][x]);
 }
});
test('compiler rejects incomplete, ambiguous, out-of-bounds and invalid mappings',()=>{
 const input=raster(2,2),spec={channel:'portrait',width:16,height:2,cells:Array.from({length:8},()=>({source:{x:0,y:0,width:2,height:2}}))};
 for(const cell of [{},{empty:true,source:{}},{source:{x:1,y:0,width:2,height:2}},{source:{x:0,y:0,width:2,height:2},quarterTurns:4},{source:{x:0,y:0,width:2,height:2},flipX:'yes'}]) assert.throws(()=>compileAtlas(input,{...spec,cells:[cell,...spec.cells.slice(1)]}));
 assert.throws(()=>compileAtlas(input,{...spec,cells:[]}));assert.throws(()=>compileAtlas({...input,data:new Uint8Array(4)},spec));
});
test('RGBA PNG roundtrip is byte-repeatable in current codec and pixel-exact over 80 rasters',()=>{
 for(let n=1;n<=80;n++){
  const source=raster(n%19+1,n%11+1),png=encodePng(source);assert.deepEqual(decodePng(png),source);assert.deepEqual(encodePng(source),png);
  assert.equal(inspectPng(png).pixelsDecoded,false);
 }
});
const chunk=(type,payload)=>{const b=Buffer.alloc(payload.length+12);b.writeUInt32BE(payload.length);b.write(type,4);b.set(payload,8);b.writeUInt32BE(crc32(b.subarray(4,b.length-4)),b.length-4);return b;};
function pngFromRaw({width=2,height=1,type=6,depth=8,interlace=0,raw,extra=[],tail=Buffer.alloc(0)}) {
 const h=Buffer.alloc(13);h.writeUInt32BE(width);h.writeUInt32BE(height,4);h[8]=depth;h[9]=type;h[12]=interlace;
 return Buffer.concat([Buffer.from(PNG_SIGNATURE),chunk('IHDR',h),...extra,chunk('IDAT',Buffer.concat([deflateSync(raw),tail])),chunk('IEND',Buffer.alloc(0))]);
}
test('all five PNG row filters decode correctly',()=>{
 // Independent residual encoder used only in fixture; production encoder always filter 0.
 const source=raster(3,5),stride=12,raw=Buffer.alloc((stride+1)*5);
 const paeth=(a,b,c)=>{const p=a+b-c;return [[a,Math.abs(p-a)],[b,Math.abs(p-b)],[c,Math.abs(p-c)]].sort((a,b)=>a[1]-b[1])[0][0];};
 for(let y=0;y<5;y++){
  raw[y*(stride+1)]=y;
  for(let x=0;x<stride;x++){
   const a=x<4?0:source.data[y*stride+x-4],b=y?source.data[(y-1)*stride+x]:0,c=y&&x>=4?source.data[(y-1)*stride+x-4]:0;
   const predict=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][y];raw[y*(stride+1)+x+1]=(source.data[y*stride+x]-predict+256)%256;
  }
 }
 assert.deepEqual(decodePng(pngFromRaw({width:3,height:5,raw})),source);
});
test('RGB and RGB color-key transparency decode without inventing alpha',()=>{
 const key=Buffer.from([0,1,0,2,0,3]);
 const png=pngFromRaw({type:2,raw:Buffer.from([0,1,2,3,4,5,6]),extra:[chunk('tRNS',key)]});
 assert.deepEqual([...decodePng(png).data],[1,2,3,0,4,5,6,255]);
});
test('bad CRC, truncation, trailing bytes and decompression bombs are rejected',()=>{
 const png=encodePng(raster(2,1)),bad=png.slice();bad[20]^=1;
 for(const bytes of [bad,png.subarray(0,20),png.subarray(0,png.length-12),Uint8Array.from([...png,0])]) assert.throws(()=>decodePng(bytes));
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.alloc(1000)})));
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.from([0])})));
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.alloc(9),tail:Buffer.from([1,2,3])})));
 assert.throws(()=>decodePng(png,{maxPixels:1}));assert.throws(()=>inspectPng(png,{maxBytes:1}));
});
test('animated, unknown critical chunks, invalid row filters and unsupported encodings fail closed',()=>{
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.alloc(9),extra:[chunk('acTL',Buffer.alloc(8))]})));
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.alloc(9),extra:[chunk('ABCD',Buffer.alloc(0))]})));
 assert.throws(()=>decodePng(pngFromRaw({raw:Buffer.from([5,0,0,0,0,0,0,0,0])})));
 assert.throws(()=>decodePng(pngFromRaw({depth:16,raw:Buffer.alloc(17)})),/supports only/);
 assert.throws(()=>decodePng(pngFromRaw({interlace:1,raw:Buffer.alloc(9)})),/supports only/);
});
test('PNG offsets respect a Uint8Array view, not its backing-buffer prefix',()=>{
 const png=encodePng(raster(3,2)),padded=new Uint8Array(png.length+19);padded.set(png,7);
 assert.deepEqual(decodePng(padded.subarray(7,7+png.length)),raster(3,2));
});
test('combined old 64-slot atlas can be mechanically split with EXPLICIT known fixture mapping',()=>{
 const src=raster(8,8),cell=i=>({source:{x:i%8,y:Math.floor(i/8),width:1,height:1}});
 const sourcePng=encodePng(src);
 for(const [channel,start,count,height] of [['tiles',0,16,64],['structure',16,48,192]]) {
  const output=compilePngAtlas(sourcePng,{channel,width:256,height,cells:Array.from({length:count},(_,i)=>cell(start+i))});
  const pixels=decodePng(output.bytes);assert.equal(output.semanticPixelsQualified,false);
  for(let n=0;n<count;n++) assert.deepEqual([...pixels.data.subarray((Math.floor(n/8)*32*256+(n%8)*32)*4,(Math.floor(n/8)*32*256+(n%8)*32)*4+4)], [...src.data.subarray((start+n)*4,(start+n)*4+4)]);
 }
});
test('RGB transparency samples outside declared depth are invalid',()=>{
 assert.throws(()=>decodePng(pngFromRaw({type:2,raw:Buffer.alloc(7),extra:[chunk('tRNS',Buffer.from([1,0,0,0,0,0]))]})),/depth/);
});
