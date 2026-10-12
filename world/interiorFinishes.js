import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// ZIP 02: architectural detailing placed only in the 16 established public interiors.
// All coordinates align with publicCity's interior allocation: x=3500+i*145, z=3500.
export function createInteriorFinishes(scene) {
 const root=new THREE.Group();root.name='HEXCORE_ZIP2_INTERIOR_FINISHES';scene.add(root);
 const base=new THREE.MeshStandardMaterial({color:0x111b30,metalness:.6,roughness:.33});
 const silver=new THREE.MeshStandardMaterial({color:0x66789a,metalness:.82,roughness:.23});
 const seats=new THREE.MeshStandardMaterial({color:0x242038,metalness:.18,roughness:.82});
 const accents=[0xa665ff,0x65ebc0,0xffc68c,0xf586ce,0x7bd5ff];
 const shape=new THREE.BoxGeometry(1,1,1);
 const cache=new Map();
 function material(i){if(!cache.has(i))cache.set(i,new THREE.MeshBasicMaterial({color:accents[i%5]}));return cache.get(i)}
 const groups=new Map();
 function add(i,x,y,z,w,h,d,mat){let key=mat.uuid;let a=groups.get(key);if(!a){a={mat,items:[]};groups.set(key,a)}a.items.push([3500+i*145+x,y,3500+z,w,h,d]);}
 for(let i=0;i<16;i++){
  const glow=material(i);
  // Vaulted frame repeated along the gallery: ribs, piers and inset luminaires.
  for(const z of [-22,-7,8,23]){
   for(const x of [-33,33]){add(i,x,9,z,1.5,17,1.7,silver);add(i,x,17.4,z,3,.26,2,glow);}
   add(i,0,17.2,z,64,.45,.65,base);
   add(i,0,17.46,z,60,.1,.15,glow);
  }
  // Each interior gets staffed lounge furniture instead of bare placeholder floors.
  for(const side of [-1,1])for(const z of [-2,10,22]){
   const x=side*23;
   add(i,x,1.05,z,9,1.2,3.8,seats);
   add(i,x,2.18,z+1.8,9,2,.5,seats);
   add(i,x,1.5,z-3.2,5,.18,3,base);
   add(i,x,2,z-3.2,4,.07,2,glow);
  }
  // Vertical feature wall and a lit information sculpture.
  add(i,0,6,-33,44,10,.5,base);
  for(let k=-4;k<=4;k++)add(i,k*5,6,-32.6,.14,8,.16,glow);
  add(i,0,3.3,5,6,6,2,base);
  add(i,0,6.6,5,7,.22,3,glow);
 }
 const t=new THREE.Object3D();for(const [key,item] of groups){let mesh=new THREE.InstancedMesh(shape,item.mat,item.items.length);mesh.frustumCulled=true;mesh.boundingSphere=null;item.items.forEach(([x,y,z,w,h,d],j)=>{t.position.set(x,y,z);t.scale.set(w,h,d);t.rotation.set(0,0,0);t.updateMatrix();mesh.setMatrixAt(j,t.matrix)});mesh.instanceMatrix.needsUpdate=true;root.add(mesh)}
 return ()=>{};
}
