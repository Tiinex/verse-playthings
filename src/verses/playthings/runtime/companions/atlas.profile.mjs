import { freeze, requireInteger } from '../shared/values.mjs';

/** Candidate layout profile 1. Filename and dimensions, never alpha, determine layout.
 * This profile is implementable/tested, not visual acceptance of generated sources.
 * Provider discovery, inheritance, append and capability qualification belong to Core/App.
 */
export const ATLAS_PROFILE = 'playthings-atlas-candidate-1';
export const COMPANION_CHANNELS = Object.freeze(['character','verb','blueprint','portrait','tiles','structure','props']);
const characterRows = ['hybrid-idle','walk-down','walk-left','walk-right','walk-up','rest','born','expire'];
const portraitStates = ['neutral','active','warning','dormant','ambient-1','ambient-2','ambient-3','ambient-4'];
const propStates = ['default','active','alternate-open','carried','damaged','recovered','placed','removed'];
const directions = ['north','east','south','west'];
export function companionChannel(filename) {
  if (typeof filename !== 'string') return null;
  // This is a provider-returned filename, not an artifact or filesystem identity.
  const name = filename.split(/[\\/]/).at(-1);
  const match = /^(?<owner>.+)\.playthings\.(?<channel>[a-z]+)\.png$/.exec(name);
  return match && COMPANION_CHANNELS.includes(match.groups.channel) ? match.groups.channel : null;
}

/** Validate atlas geometry. A result never certifies pixels as matching their semantic roles. */
export function validateAtlas({channel,width,height}, options = {}) {
  const maxPixels = requireInteger(options.maxPixels ?? 16_777_216, 'maxPixels', 1);
  const findings = [];
  const fail = (code, message) => findings.push({severity:'error',code,message});
  if (!COMPANION_CHANNELS.includes(channel)) fail('channel.unknown','Expected one of seven named Playthings PNG channels');
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) fail('dimensions.invalid','Dimensions must be positive safe integers');
  if (findings.length) return freeze({status:'invalid',profile:ATLAS_PROFILE,findings});
  if (width * height > maxPixels || !Number.isSafeInteger(width * height)) fail('dimensions.budget','Atlas exceeds the pixel budget');
  let cellWidth = width / 8, cellHeight, rows, collectionCount = 1, rowsPerItem = 1;
  if (!Number.isInteger(cellWidth)) fail('grid.columns','Atlas width must contain exactly eight complete columns');
  if (channel === 'character') {
    cellWidth=128; cellHeight=192; rows=8; rowsPerItem=8;
    if (width !== 1024 || height !== 1536) fail('character.dimensions','Character requires 8×8 cells of 128×192');
  } else if (channel === 'tiles' || channel === 'structure') {
    cellWidth=32; cellHeight=32; rows=height/32;
    rowsPerItem=channel==='tiles'?2:6;
    collectionCount=height/(32*rowsPerItem);
    if (width !== 256 || !Number.isInteger(collectionCount)) fail('architecture.dimensions',`${channel} requires width 256 and complete ${rowsPerItem}-row families`);
  } else if (channel === 'props') {
    cellHeight=cellWidth; rows=height/cellHeight; collectionCount=rows;
    if (!Number.isInteger(rows)) fail('props.rows','Each prop occupies one complete square-cell row');
  } else {
    rows=1; cellHeight=height;
    // Verb choreography may be taller than it is wide. Its full image is one row.
    if (channel !== 'verb' && cellHeight !== cellWidth) fail('cell.square',`${channel} uses square cells`);
  }
  if (cellWidth > 512 || cellHeight > 512) fail('cell.budget','Candidate profile limits each cell axis to 512 px');
  return freeze({status:findings.length?'invalid':'valid',profile:ATLAS_PROFILE,channel,width,height,
    columns:8,rows,cellWidth,cellHeight,rowsPerItem,collectionCount,findings,semanticPixelsQualified:false});
}

/** Pixel rectangle and role at a zero-based family/item + slot. */
export function atlasSlot(layout, item, slot) {
  if (layout?.status!=='valid' || layout.profile!==ATLAS_PROFILE) throw new TypeError('Use a valid candidate atlas layout');
  requireInteger(item,'item'); requireInteger(slot,'slot');
  const size=layout.rowsPerItem*8;
  if (item>=layout.collectionCount || slot>=size) throw new RangeError('Atlas item/slot out of range');
  const {channel}=layout; let role;
  if(channel==='tiles') role=`floor-mask-${slot}`;
  else if(channel==='structure') role=slot<16?`wall-mask-${slot}`:slot<32?`roof-mask-${slot-16}`:
    `${['doorway','window','stairs-up','stairs-down'][Math.floor((slot-32)/4)]}-${directions[(slot-32)%4]}`;
  else if(channel==='portrait') role=portraitStates[slot];
  else if(channel==='props') role=propStates[slot];
  else if(channel==='character') role=slot<8?(slot<4?`idle-${['down','left','right','up'][slot]}`:`idle-ambient-${slot-3}`):`${characterRows[Math.floor(slot/8)]}-${slot%8+1}`;
  else role=`${channel==='verb'?'action':'reveal'}-${slot+1}`;
  return freeze({item,slot,role,x:(slot%8)*layout.cellWidth,y:(item*layout.rowsPerItem+Math.floor(slot/8))*layout.cellHeight,
    width:layout.cellWidth,height:layout.cellHeight});
}
