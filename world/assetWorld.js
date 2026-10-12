import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import {HEXCORE_WORLD,HEXCORE_EXTERIOR_SITES} from './worldLayout.js';

// Production-asset stage: each model loads from the site's real GLB file.
// No extra buildings, and no corporate-department exterior duplications.
export function* createAssetWorld(scene){
 const root=new THREE.Group();root.name='HEXCORE_REAL_MODEL_ARCHITECTURE';scene.add(root);
 const loader=new GLTFLoader();
 const materials={};
 const textureLoader=new THREE.TextureLoader();
 for(const name of ['obsidian','bioluminescent_bark','moss','metal','luminous_stone']){
  const t=textureLoader.load('./assets/textures/'+name+'.png');t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  materials[name]=new THREE.MeshStandardMaterial({map:t,metalness:name==='metal'?.74:.2,roughness:name==='obsidian'?.27:.69});
 }
 const coords=HEXCORE_WORLD.sites;
 const modelFiles=['hexcore_destination_01.glb','hexcore_destination_02.glb','hexcore_destination_03.glb','hexcore_destination_04.glb','hexcore_destination_05.glb','hexcore_destination_06.glb','hexcore_destination_07.glb','hexcore_destination_08.glb','hexcore_destination_09.glb','hexcore_destination_10.glb'];
 const placed=[];
 const jobs=[{file:'hexcore_tower_sculpted.glb',x:0,z:300,kind:'tower'},...HEXCORE_EXTERIOR_SITES.map((site,i)=>({file:modelFiles[i],x:coords[site].x,z:coords[site].z,kind:'destination'}))];
 for(const job of jobs){
  let outcome=null,error=null;
  loader.load('./assets/models/'+job.file,g=>outcome=g,undefined,e=>error=e);
  while(!outcome && !error)yield;
  if(error){console.error('HEXCORE MODEL ASSET',job.file,error);throw error;}
  const obj=outcome.scene;obj.position.set(job.x,0,job.z);obj.traverse(node=>{if(node.isMesh){node.frustumCulled=true;node.castShadow=false;node.receiveShadow=true;}});
  root.add(obj);placed.push(obj);
  yield;
 }
 // Ground material accent plates to show real tileable visual surfaces.
 const ground=materials.obsidian;
 const landing=new THREE.Mesh(new THREE.CylinderGeometry(61,61,.8,96),ground);landing.position.set(0,-.58,300);root.add(landing);
 // Bioluminescent bark and moss are placed in gardens, not pasted over doors.
 for(let i=0;i<10;i++){
   const coord=coords[HEXCORE_EXTERIOR_SITES[i]];
   const ring=new THREE.Mesh(new THREE.TorusGeometry(38,.7,12,100),materials.bioluminescent_bark);
   ring.rotation.x=-Math.PI/2;ring.position.set(coord.x,.05,coord.z);root.add(ring);
 }
 return ()=>{};
}
