import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// The elven civilization grows out of bioluminescent nature; human electronic
// technology is an independent overlay. All biological meshes share geometries
// and are instanced in small geographic clusters for affordable draw calls.
export function* createLivingWorld(scene) {
  const world = new THREE.Group(); world.name = 'HEXCORE_ELVEN_BIOLUMINESCENT_WORLD'; scene.add(world);
  const trunkGeo = new THREE.CylinderGeometry(.45,.9,1,7);
  const crownGeo = new THREE.IcosahedronGeometry(1,1);
  const grassGeo = new THREE.ConeGeometry(1,1,5);
  const flowerGeo = new THREE.OctahedronGeometry(1);
  const mats = {
    bark:new THREE.MeshStandardMaterial({color:0x182a35,roughness:.79,metalness:.06}),
    leaf:new THREE.MeshStandardMaterial({color:0x184f57,emissive:0x087e86,emissiveIntensity:.52,roughness:.66,flatShading:true}),
    leaf2:new THREE.MeshStandardMaterial({color:0x35577a,emissive:0x3468c3,emissiveIntensity:.38,roughness:.66,flatShading:true}),
    moss:new THREE.MeshStandardMaterial({color:0x195353,emissive:0x117775,emissiveIntensity:.32,roughness:.89,flatShading:true}),
    bloom:new THREE.MeshBasicMaterial({color:0x9a75ff}),
    bloom2:new THREE.MeshBasicMaterial({color:0x77e7ed})
  };
  const rand = (n)=>{const x=Math.sin(n*127.1+31.83)*43758.5453;return x-Math.floor(x)};
  const place=(mesh,items)=>{const d=new THREE.Object3D();items.forEach(([x,y,z,sx,sy,sz,rot],i)=>{
    d.position.set(x,y,z);d.scale.set(sx,sy,sz);d.rotation.set(0,rot||0,0);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);
  });mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.frustumCulled=true;world.add(mesh);};
  const rootCenters = [[-42,70],[48,105],[-55,175],[58,200],[-71,258],[73,330],[-63,405],[60,460],[0,510]];
  const centers = [...rootCenters,...HEXCORE_WORLD.sites.flatMap((s,i)=>{
    const a=i*2.4;return [[s.x+Math.cos(a)*39,s.z+Math.sin(a)*39], [s.x+Math.cos(a+2.3)*41,s.z+Math.sin(a+2.3)*41]];
  })];
  let batchNo=0;
  for(let start=0;start<centers.length;start+=7){
    const trunks=[],crowns=[],crowns2=[],moss=[],blooms=[],blooms2=[];
    centers.slice(start,start+7).forEach(([cx,cz],j)=>{
      const seed=start+j+1;const trees=3+(seed%3);
      for(let k=0;k<trees;k++){
        const a=(k/trees)*Math.PI*2+rand(seed+k)*.9;
        const r=2+k*2.2;const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
        // Preserve clear corridors and public-building door zones.
        if(Math.hypot(x,z-300)<51 || (Math.abs(x)<16&&z>20&&z<277)) continue;
        if(HEXCORE_WORLD.sites.some(s=>Math.abs(x-s.x)<17&&z>s.z+12&&z<s.z+43))continue;
        const tall=11+rand(seed*50+k)*10;
        trunks.push([x,tall*.5,z,.95,tall,.95,a]);
        crowns.push([x,tall+2,z,4.3,tall*.34,4.3,a]);
        crowns2.push([x+1.1,tall+4,z-.7,2.7,tall*.21,2.7,a]);
      }
      for(let k=0;k<15;k++){
        const a=k*2.399+seed,r=3+rand(seed*20+k)*13;
        const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
        if(Math.hypot(x,z-300)<51 || Math.abs(x)<15&&z>20&&z<278) continue;
        moss.push([x,.32,z,.62,1.1,.62,a]);
        const bloom=(k%2?blooms:blooms2);bloom.push([x,1.2,z,.27,.64,.27,a]);
      }
    });
    for(const [geo,mat,items] of [[trunkGeo,mats.bark,trunks],[crownGeo,mats.leaf,crowns],[crownGeo,mats.leaf2,crowns2],[grassGeo,mats.moss,moss],[flowerGeo,mats.bloom,blooms],[flowerGeo,mats.bloom2,blooms2]]){
      if(items.length)place(new THREE.InstancedMesh(geo,mat,items.length),items);
    }
    world.children.slice(-6).forEach(o=>{if(o.isInstancedMesh)o.name='BIOLUMINESCENT_CLUSTER_'+batchNo;});
    batchNo++;
    yield;
  }
  // Nature is emissive and does not require dozens of expensive dynamic lights.
  return ()=>{};
}
