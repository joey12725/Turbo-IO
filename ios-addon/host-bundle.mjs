// Output identity only. Stock input validation always uses the original bundle ID.
export const STOCK_BUNDLE='com.rayneo.venus.pub';
export function validateBundle(bundle){
  if(typeof bundle!=='string'||!/^com\.rayneo\.venus\.pub(?:\.[a-z0-9]{1,24})?$/.test(bundle)||bundle.trim()!==bundle)throw Error('invalid_bundle');
  return bundle;
}
export function alternateBundleMarker(bundle){return `turbo alternate bundle=${validateBundle(bundle)}`;}
export function validateAddonBundle(addon,bundle){
  validateBundle(bundle);
  if(!Buffer.isBuffer(addon)||!addon.includes(Buffer.from(bundle+'\0')))throw Error('addon_bundle_mismatch');
  const prefix=Buffer.from('turbo alternate bundle='),at=addon.indexOf(prefix);
  if(bundle===STOCK_BUNDLE){if(at!==-1)throw Error('addon_bundle_mismatch');}
  else {
    const marker=Buffer.from(alternateBundleMarker(bundle)+'\0');
    if(at===-1||!addon.subarray(at,at+marker.length).equals(marker)||addon.indexOf(prefix,at+prefix.length)!==-1)throw Error('addon_bundle_mismatch');
  }
  return true;
}
