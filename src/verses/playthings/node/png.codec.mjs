import {inflateSync,deflateSync} from 'node:zlib';
import {Buffer} from 'node:buffer';
import {inspectPng,crc32,PNG_SIGNATURE} from '../runtime/companions/png.inspect.mjs';
import {validateRaster,compileAtlas} from '../runtime/companions/atlas.compile.mjs';
const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};

/** Strict bounded RGB/RGBA8 non-interlaced codec. Unsupported encodings fail closed.
 * Ancillary metadata is not interpreted as world meaning. Output is straight RGBA.
 */
export function decodePng(bytes,options={}) {
  const info=inspectPng(bytes,options);
  if(!info.supportedByBoundedCodec) throw new TypeError('PNG codec supports only non-interlaced 8-bit RGB/RGBA');
  const channels=info.colorType===6?4:3,stride=info.width*channels;
  const compressed=Buffer.concat(info.chunks.filter(c=>c.type==='IDAT').map(c=>Buffer.from(bytes.subarray(c.dataOffset,c.dataOffset+c.length))));
  const expected=(stride+1)*info.height;
  const inflated=inflateSync(compressed,{maxOutputLength:expected,info:true});
  if(inflated.buffer.length!==expected || inflated.engine.bytesWritten!==compressed.length) throw new TypeError('PNG inflated length or compressed stream boundary mismatch');
  const raw=inflated.buffer,data=new Uint8Array(info.width*info.height*4);
  let previous=new Uint8Array(stride),cursor=0;
  const transparency=info.chunks.find(c=>c.type==='tRNS');
  const t=transparency?new DataView(bytes.buffer,bytes.byteOffset+transparency.dataOffset,transparency.length):null;
  const key=t?[t.getUint16(0),t.getUint16(2),t.getUint16(4)]:null;
  for(let y=0;y<info.height;y++) {
    const filter=raw[cursor++]; if(filter>4) throw new TypeError('Invalid PNG row filter');
    const row=new Uint8Array(stride);
    for(let i=0;i<stride;i++) {
      const a=i>=channels?row[i-channels]:0,b=previous[i],c=i>=channels?previous[i-channels]:0;
      const prediction=filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c);
      row[i]=(raw[cursor++]+prediction)&255;
    }
    for(let x=0;x<info.width;x++) {
      const from=x*channels,to=(y*info.width+x)*4;
      data[to]=row[from];data[to+1]=row[from+1];data[to+2]=row[from+2];
      data[to+3]=channels===4?row[from+3]:key&&key.every((v,i)=>v===row[from+i])?0:255;
    }
    previous=row;
  }
  return {width:info.width,height:info.height,data};
}
function chunk(type,payload) {
  const result=Buffer.alloc(payload.length+12);result.writeUInt32BE(payload.length,0);result.write(type,4,'ascii');
  result.set(payload,8);result.writeUInt32BE(crc32(result.subarray(4,result.length-4)),result.length-4);return result;
}
/** Lossless RGBA8 output, filter 0 and zlib level 9. Pixel determinism across codecs;
 * identical PNG bytes are qualified for the same Node/zlib version only. */
export function encodePng(raster,options={}) {
  validateRaster(raster,options.maxPixels);
  const header=Buffer.alloc(13);header.writeUInt32BE(raster.width,0);header.writeUInt32BE(raster.height,4);header[8]=8;header[9]=6;
  const stride=raster.width*4,raw=Buffer.alloc((stride+1)*raster.height);
  for(let y=0;y<raster.height;y++) raw.set(raster.data.subarray(y*stride,(y+1)*stride),y*(stride+1)+1);
  return new Uint8Array(Buffer.concat([Buffer.from(PNG_SIGNATURE),chunk('IHDR',header),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));
}
export function compilePngAtlas(sourceBytes,specification,options={}) {
  const raster=compileAtlas(decodePng(sourceBytes,options),specification,options);
  return {bytes:encodePng(raster,options),layout:raster.layout,semanticPixelsQualified:false};
}
