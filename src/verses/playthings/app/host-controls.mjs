/** Optional host adapter input, not a registry owned by Playthings. Duplicates
 * and malformed inventory fail closed. Missing inventory still permits exit. */
export function projectHostVerseChoices(inventory,currentId='playthings') {
  if(!Array.isArray(inventory))return Object.freeze({status:'unavailable',choices:Object.freeze([])});
  const seen=new Set(),choices=[];
  for(const item of inventory){if(!item||typeof item.id!=='string'||!item.id.trim()||typeof item.label!=='string'||seen.has(item.id))return Object.freeze({status:'invalid',choices:Object.freeze([])});seen.add(item.id);if(item.id!==currentId&&item.id!=='viewer'&&item.enabled!==false)choices.push(Object.freeze({id:item.id,label:item.label}));}
  return Object.freeze({status:'ready',choices:Object.freeze(choices)});
}
