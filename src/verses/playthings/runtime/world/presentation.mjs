import {freeze} from '../shared/values.mjs';

/**
 * Select the renderer input without weakening the spatial gate.
 * A qualified companion world may replace the Root scaffold only when its
 * geometry and navigation are both complete. Otherwise the bounded scaffold
 * remains the presentation source.
 */
export function selectPresentationWorld({spatialCandidate,rootWorld}={}) {
  if(!rootWorld?.world||!rootWorld?.locations)throw new TypeError('Root presentation fallback required');
  const spatial=spatialCandidate?.spatialWorld;
  const hasSpatialActivation=spatialCandidate?.capabilities?.records?.some(record=>
    record.capabilities?.tiles===true||record.capabilities?.structure===true)===true;
  const qualified=hasSpatialActivation&&spatialCandidate?.status==='ready'&&spatial?.status==='ready'&&
    spatial.geometryQualified===true&&spatial.navigationCompiled===true&&spatial.spatialCapabilitiesApplied===true;
  if(qualified)return freeze({
    kind:'playthings-world-presentation',
    mode:'qualified-spatial',
    world:spatial.world,
    locations:spatial.locations,
    geometry:spatial.geometry,
    findings:spatialCandidate.findings??spatial.findings??[],
    surfaceIds:spatial.world.surfaces.map(surface=>surface.id),
    spatialCapabilitiesApplied:true,
    geometryQualified:true,
    semanticPixelsQualified:spatial.semanticPixelsQualified===true,
    boundary:'Qualified companion capability may activate deterministic multi-surface presentation geometry. Geometry remains presentation, not Tiinex spatial source truth.'
  });
  return freeze({
    kind:'playthings-world-presentation',
    mode:'root-scaffold',
    world:rootWorld.world,
    locations:rootWorld.locations,
    geometry:[],
    findings:rootWorld.findings??[],
    surfaceIds:rootWorld.world.surfaces.map(surface=>surface.id),
    spatialCapabilitiesApplied:false,
    geometryQualified:false,
    semanticPixelsQualified:false,
    boundary:'Bounded Root fallback remains active because no complete qualified spatial renderer input is available.'
  });
}
