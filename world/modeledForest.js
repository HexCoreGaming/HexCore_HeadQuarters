import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

// New actual GLB plant meshes for the organic elven world. Grouped away from entrances.
export function* createModeledForest(scene){
 const root=new THREE.Group();root.name='HEXCORE_GLTF_LIVING_FOREST';scene.add(root);
 const positions=[[-85,84],[-101,135],[90,86],[108,156],[-162,172],[159,175],[-96,391],[91,390],[-154,528],[145,519],[-230,542],[226,553]];
 const loader=new GLTFLoader();
 for(let i=0;i<positions.length;i++){
   const file='./assets/models/hexcore_living_tree_'+String(i+1).padStart(2,'0')+'.glb';
   let gltf=null,error=null;loader.load(file,v=>{gltf=v;},undefined,e=>{error=e;});
   const timeout=performance.now()+25000;
   while(!gltf&&!error&&performance.now()<timeout)yield;
   if(!gltf){console.error('Forest GLB failed',file,error);throw Error('Forest 3D asset failed: '+file);}
   const obj=gltf.scene;obj.position.set(positions[i][0],0,positions[i][1]);
   obj.scale.setScalar(.9+(i%3)*.12);
   obj.traverse(n=>{if(n.isMesh){n.castShadow=false;n.receiveShadow=false;n.frustumCulled=true;}});
   root.add(obj);yield;
 }
 return ()=>{};
}
