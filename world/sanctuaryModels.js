import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

// Elven sanctuary landmarks are self-contained GLB assets, placed off primary
// corridors and building door triggers. Never mount them twice.
const SITES = [
  [-99,98], [94,93], [-118,186], [120,190],
  [-96,415], [101,424], [-180,523], [172,525]
];
export function* createSanctuaryModels(scene){
 const root=new THREE.Group();root.name='HEXCORE_SCULPTED_SANCTUARIES';scene.add(root);
 const loader=new GLTFLoader();
 for(let i=0;i<SITES.length;i++){
  const filename='./assets/models/hexcore_elven_sanctuary_'+String(i+1).padStart(2,'0')+'.glb';
  let result=null,error=null;
  loader.load(filename,v=>result=v,undefined,e=>error=e);
  const deadline=performance.now()+15000;
  while(!result&&!error&&performance.now()<deadline) yield;
  if(!result){console.warn('HexCore sanctuary model unavailable',filename,error||'timeout');continue;}
  const obj=result.scene;
  obj.position.set(SITES[i][0],0,SITES[i][1]);
  obj.rotation.y=i*.57;
  obj.traverse(n=>{if(n.isMesh){n.frustumCulled=true;n.castShadow=false;n.receiveShadow=false;}});
  root.add(obj);
  yield;
 }
 return ()=>{};
}
