import {freeze,requireInteger} from '../shared/values.mjs';
export const PNG_SIGNATURE=Object.freeze([137,80,78,71,13,10,26,10]);
const table=new Uint32Array(256);
for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++) c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}
export function crc32(data){let crc=0xffffffff;for(const b of data) crc=table[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}

/** Bounded container/CRC inspection. Does not inflate IDAT or qualify artwork semantics. */
export function inspectPng(bytes,options={}) {
  const maxBytes=requireInteger(options.maxBytes??96*1024*1024,'maxBytes',1);
  const maxPixels=requireInteger(options.maxPixels??16_777_216,'maxPixels',1);
  if(!(bytes instanceof Uint8Array)) throw new TypeError('PNG bytes must be Uint8Array');
  if(bytes.length>maxBytes) throw new RangeError('PNG byte budget exceeded');
  if(bytes.length<8 || PNG_SIGNATURE.some((b,i)=>bytes[i]!==b)) throw new TypeError('Invalid PNG signature');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),chunks=[];
  let offset=8,header=null,ended=false,idat=false,afterIdat=false,palette=false,transparency=false;
  while(offset<bytes.length) {
    if(chunks.length>=4096) throw new RangeError('PNG chunk budget exceeded');
    if(offset+12>bytes.length) throw new RangeError('Truncated PNG chunk');
    const length=view.getUint32(offset),type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
    const end=offset+12+length;
    if(end>bytes.length) throw new RangeError('PNG chunk exceeds source bytes');
    if(!/^[A-Za-z]{4}$/.test(type) || type[2]!==type[2].toUpperCase()) throw new TypeError('Invalid PNG chunk type');
    if(crc32(bytes.subarray(offset+4,end-4))!==view.getUint32(end-4)) throw new TypeError(`PNG CRC mismatch: ${type}`);
    if(!header && type!=='IHDR') throw new TypeError('IHDR must be first');
    if(type==='IHDR') {
      if(header || length!==13) throw new TypeError('PNG requires exactly one 13-byte IHDR');
      const width=view.getUint32(offset+8),height=view.getUint32(offset+12),bitDepth=bytes[offset+16],colorType=bytes[offset+17];
      const compression=bytes[offset+18],filter=bytes[offset+19],interlace=bytes[offset+20];
      if(!width||!height||width>0x7fffffff||height>0x7fffffff||width*height>maxPixels) throw new RangeError('PNG dimensions exceed budget');
      const depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
      if(!depths[colorType]?.includes(bitDepth)||compression!==0||filter!==0||interlace>1) throw new TypeError('Invalid PNG encoding declaration');
      header={width,height,bitDepth,colorType,compression,filter,interlace};
    } else if(type==='PLTE') {
      if(palette||idat||transparency||!length||length%3||length>768||[0,4].includes(header.colorType)) throw new TypeError('Invalid PLTE');
      if(header.colorType===3 && length/3>2**header.bitDepth) throw new TypeError('Palette exceeds bit depth');
      palette=true;
    } else if(type==='tRNS') {
      if(transparency||idat||[4,6].includes(header.colorType)) throw new TypeError('Invalid transparency chunk');
      if(header.colorType===0&&length!==2 || header.colorType===2&&length!==6 || header.colorType===3&&(!palette||!length||length>chunks.find(c=>c.type==='PLTE').length/3)) throw new TypeError('Invalid tRNS length/order');
      if(header.colorType===2&&header.bitDepth===8&&[0,2,4].some(i=>view.getUint16(offset+8+i)>255)) throw new TypeError('Transparency sample exceeds bit depth');
      if(header.colorType===0&&view.getUint16(offset+8)>=2**header.bitDepth) throw new TypeError('Transparency sample exceeds bit depth');
      transparency=true;
    } else if(type==='IDAT') {
      if(afterIdat || header.colorType===3&&!palette) throw new TypeError('IDAT order/palette invalid');
      idat=true;
    } else if(type==='IEND') {
      if(length!==0||!idat||end!==bytes.length) throw new TypeError('IEND must terminate a complete PNG');
      ended=true;
    } else {
      if(['acTL','fcTL','fdAT'].includes(type)) throw new TypeError('APNG is not a static companion atlas');
      if(type[0]===type[0].toUpperCase()) throw new TypeError(`Unsupported critical PNG chunk: ${type}`);
    }
    if(idat && type!=='IDAT') afterIdat=true;
    chunks.push({type,length,dataOffset:offset+8});offset=end;
  }
  if(!ended) throw new TypeError('PNG IEND missing');
  return freeze({...header,chunks,containerIntegrity:'verified',pixelsDecoded:false,
    supportedByBoundedCodec:header.bitDepth===8&&[2,6].includes(header.colorType)&&header.interlace===0});
}
