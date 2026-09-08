import { requireInteger } from '../shared/values.mjs';
import { validateAtlas, atlasSlot } from './atlas.profile.mjs';

/** RGBA8 values are straight (not premultiplied) alpha. Caller owns the returned buffer. */
export function validateRaster(raster, maxPixels=16_777_216) {
  requireInteger(maxPixels,'maxPixels',1);
  if(!raster) throw new TypeError('Raster required');
  const width=requireInteger(raster.width,'width',1),height=requireInteger(raster.height,'height',1);
  if(width*height>maxPixels || !Number.isSafeInteger(width*height)) throw new RangeError('Raster pixel budget exceeded');
  if(!(raster.data instanceof Uint8Array) && !(raster.data instanceof Uint8ClampedArray)) throw new TypeError('RGBA data must be Uint8Array');
  if(raster.data.length!==width*height*4) throw new RangeError('RGBA buffer length does not match dimensions');
  return raster;
}

/** Compile exact ordered cells; no segmentation, semantic classification or hidden pruning.
 * Every destination slot needs an explicit source rectangle (or {empty:true}).
 * quarterTurns is clockwise; flips apply after rotation. Nearest-neighbour resampling
 * is deterministic and preserves RGBA values, but has NOT been visually accepted.
 */
export function compileAtlas(source, specification, options={}) {
  validateRaster(source, options.maxPixels);
  const layout=validateAtlas(specification,options);
  if(layout.status!=='valid') throw new RangeError(layout.findings.map(f=>f.code).join(', '));
  const expected=layout.columns*layout.rows, cells=specification.cells;
  if(!Array.isArray(cells) || cells.length!==expected) throw new RangeError(`Exactly ${expected} ordered cell mappings required`);
  // Validate ALL mappings before allocating/writing any output pixels.
  const mappings=cells.map((cell,i)=>{
    if(!cell || typeof cell!=='object') throw new TypeError(`Cell ${i} requires an explicit mapping`);
    if(cell.empty===true) {
      if(cell.source!==undefined) throw new TypeError('Empty cell cannot also specify source');
      return {empty:true};
    }
    if(cell.empty!==undefined && cell.empty!==false) throw new TypeError('empty must be boolean');
    const r=cell.source;
    if(!r) throw new TypeError(`Cell ${i} lacks a source rectangle`);
    const x=requireInteger(r.x,'source.x'),y=requireInteger(r.y,'source.y');
    const width=requireInteger(r.width,'source.width',1),height=requireInteger(r.height,'source.height',1);
    if(x+width>source.width || y+height>source.height) throw new RangeError('Source rectangle outside raster');
    const turns=requireInteger(cell.quarterTurns??0,'quarterTurns');
    if(turns>3) throw new RangeError('quarterTurns must be 0..3');
    for(const flag of ['flipX','flipY']) if(cell[flag]!==undefined && typeof cell[flag]!=='boolean') throw new TypeError(`${flag} must be boolean`);
    return {x,y,width,height,turns,flipX:cell.flipX===true,flipY:cell.flipY===true};
  });
  const data=new Uint8Array(layout.width*layout.height*4);
  for(let i=0;i<mappings.length;i++) {
    const m=mappings[i]; if(m.empty) continue;
    const dest=atlasSlot(layout,Math.floor(i/(layout.rowsPerItem*8)),i%(layout.rowsPerItem*8));
    const rw=m.turns%2?m.height:m.width,rh=m.turns%2?m.width:m.height;
    for(let y=0;y<dest.height;y++) for(let x=0;x<dest.width;x++) {
      let u=Math.min(rw-1,Math.floor((x+.5)*rw/dest.width));
      let v=Math.min(rh-1,Math.floor((y+.5)*rh/dest.height));
      if(m.flipX) u=rw-1-u; if(m.flipY) v=rh-1-v;
      const [sx,sy]=m.turns===0?[u,v]:m.turns===1?[v,m.height-1-u]:m.turns===2?[m.width-1-u,m.height-1-v]:[m.width-1-v,u];
      const from=((m.y+sy)*source.width+m.x+sx)*4,to=((dest.y+y)*layout.width+dest.x+x)*4;
      data.set(source.data.subarray(from,from+4),to);
    }
  }
  return {width:layout.width,height:layout.height,data,layout,semanticPixelsQualified:false};
}
