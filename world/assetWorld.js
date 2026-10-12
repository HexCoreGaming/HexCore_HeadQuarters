import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import {HEXCORE_WORLD,HEXCORE_EXTERIOR_SITES} from './worldLayout.js';

// Physically loaded GLB models. This module is invoked by the boot sequence.
export function* createAssetWorld(scene){
 const root=new THREE.Group();root.name='HEXCORE_MODELLED_LANDMARKS';scene.add(root);
 const loader=new GLTFLoader();
 const filenames=['hexcore_destination_01.glb','hexcore_destination_02.glb','hexcore_destination_03.glb','hexcore_destination_04.glb','hexcore_destination_05.glb','hexcore_destination_06.glb','hexcore_destination_07.glb','hexcore_destination_08.glb','hexcore_destination_09.glb','hexcore_destination_10.glb'];
 const jobs=[{file:'hexcore_tower_sculpted.glb',x:0,z:300,kind:'tower'},...HEXCORE_EXTERIOR_SITES.map((site,i)=>({file:filenames[i],x:HEXCORE_WORLD.sites[site].x,z:HEXCORE_WORLD.sites[site].z,kind:'destination'}))];
 for(const job of jobs){
  let outcome=null,error=null;
  loader.load('./assets/models/'+job.file, gltf=>{outcome=gltf;},undefined,e=>{error=e;});
  const timeout=performance.now()+25000;
  while(!outcome&&!error&&performance.now()<timeout)yield;
  if(!outcome){console.error('Failed to load HexCore GLB',job.file,error||'timeout');if(job.kind==='tower'){const old=scene.getObjectByName('02_HEXCORE_TOWER_CENTER_OF_WORLD');if(old)old.visible=true;}continue;}
  const object=outcome.scene;object.name='MODEL_'+job.file;object.position.set(job.x,0,job.z);
  object.traverse(node=>{if(node.isMesh){node.frustumCulled=true;node.castShadow=false;node.receiveShadow=false;}});
  root.add(object);
  yield;
 }
 return ()=>{};
}
