import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
// Separate modeled landscape islands; placed away from all entrance/corridor routes.
// Constructed only during the blocking welcome-screen loading sequence.
const positions=[[-112,75],[112,75],[-112,180],[112,180],[-123,395],[123,395],[-142,515],[142,515]];
export function* createLivingTerrainModels(scene){
 const root=new THREE.Group();root.name='HEXCORE_LIVING_LANDSCAPE_MODELS';scene.add(root);
 const loader=new GLTFLoader();let failures=0;
 for(let i=0;i<positions.length;i++){
  let done=false,model=null,error=null;
  const file='./assets/models/hexcore_living_landscape_'+String(i+1).padStart(2,'0')+'.glb';
  loader.load(file,v=>{model=v.scene;done=true;},undefined,e=>{error=e;done=true;});
  const deadline=performance.now()+20000;
  while(!done&&performance.now()<deadline)yield;
  if(model){model.position.set(positions[i][0],0,positions[i][1]);model.name='BIO_LANDSCAPE_'+(i+1);root.add(model);}
  else{failures++;console.warn('HexCore living terrain unavailable',file,error||'timeout');}
  yield;
 }
 window.hexcoreLivingTerrainFailures=failures;
 return ()=>{};
}
