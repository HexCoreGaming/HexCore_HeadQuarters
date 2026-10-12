import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// DIGITAL CIVILIZATION // landmark sculpture and terrain pass.
// All geometry lives outside the doors, and uses shared geometry/materials.
// One destination is constructed each yield; gameplay coordinates never move.
export function* createDigitalLandmarks(scene) {
 const root=new THREE.Group();root.name='HEXCORE_DIGITAL_LANDMARKS';scene.add(root);
 const metal=new THREE.MeshStandardMaterial({color:0x10172a,metalness:.84,roughness:.26});
 const etched=new THREE.MeshStandardMaterial({color:0x303b64,metalness:.72,roughness:.3});
 const ink=new THREE.MeshStandardMaterial({color:0x080b18,metalness:.89,roughness:.19});
 const crystal=new THREE.MeshStandardMaterial({color:0x30417d,emissive:0x372171,emissiveIntensity:.38,metalness:.62,roughness:.22,flatShading:true});
 const colors=[0xaa70ff,0x78e8ff,0xff7bdc,0x628bff,0x74f3cc];
 const lights=colors.map(c=>new THREE.MeshBasicMaterial({color:c}));
 const boxGeo=new THREE.BoxGeometry(1,1,1), octGeo=new THREE.OctahedronGeometry(1,0);
 const geoRing=new THREE.TorusGeometry(1,.012,6,84);
 const animations=[];
 function add(g,geo,mat,pos){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);g.add(m);return m;}
 function beam(g,a,b,w,mat){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),delta=q.clone().sub(p);const m=add(g,boxGeo,mat,p.add(q).multiplyScalar(.5).toArray());m.scale.set(w,delta.length(),w);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;}
 function ring(g,x,y,z,r,mat,tilt=0){const m=add(g,geoRing,mat,[x,y,z]);m.scale.setScalar(r);m.rotation.x=tilt;return m;}
 function shard(g,x,y,z,sx,sy,sz,mat=crystal){const m=add(g,octGeo,mat,[x,y,z]);m.scale.set(sx,sy,sz);return m;}
 function arc(g,cx,cz,r,h,mat,ry=0){const pts=[];for(let i=0;i<=24;i++){const t=i/24,a=Math.PI*t;pts.push(new THREE.Vector3((t-.5)*r*2,Math.sin(a)*h,Math.sin(t*Math.PI)*1.4));}
  const curve=new THREE.CatmullRomCurve3(pts);const m=add(g,new THREE.TubeGeometry(curve,32,.28,6,false),mat,[cx,0,cz]);m.rotation.y=ry;return m;}
 function dais(g,x,z,r,accent){const m=add(g,new THREE.CylinderGeometry(r,r+.9,.72,48),ink,[x,-.42,z]);m.rotation.y=Math.PI/8;ring(g,x,.025,z,r-.4,accent,-Math.PI/2);ring(g,x,.04,z,r-2,etched,-Math.PI/2);}
 function cluster(g,x,z,variant,i){
   const accent=lights[i%lights.length];dais(g,x,z,9,accent);
   const scale=1+(i%3)*.14;
   if(variant===0){ // cathedral beacon / faceted digital obelisk
      for(let k=0;k<6;k++){const a=k*Math.PI/3;const xx=x+Math.cos(a)*5.5,zz=z+Math.sin(a)*5.5;shard(g,xx,8,zz,1,7*scale,1.3,k%2?etched:crystal);
       beam(g,[xx,8,zz],[x,24*scale,z],.17,accent);}
      shard(g,x,25*scale,z,2.1,9*scale,2.1,crystal);ring(g,x,20*scale,z,5.6,accent,.65);
   } else if(variant===1){ // suspended rings, crystalline altar
      shard(g,x,9,z,2.7,8,2.7,crystal);
      for(let k=0;k<3;k++){let m=ring(g,x,11+k*5,z,5.2+k*1.7,k%2?lights[(i+1)%5]:accent,.25+k*.45);animations.push([m,.001*(k%2?1:-1)]);}
      for(let k=0;k<4;k++){const a=k*Math.PI/2;shard(g,x+Math.cos(a)*6.6,5.5,z+Math.sin(a)*6.6,1.2,3,1.2,etched);}
   }else if(variant===2){ // pointed elven energy arcade
      for(const r of [4,6.5,9])arc(g,x,z,r,15*scale,accent,.23*r);
      shard(g,x,17*scale,z,1.4,6,1.4,crystal);
   }else{ // hexagonal petal pavilion, asymmetric fin structure
      for(let k=0;k<7;k++){const a=k*2*Math.PI/7;const px=x+Math.cos(a)*5,pz=z+Math.sin(a)*5;
       beam(g,[px,0,pz],[x+Math.cos(a)*2,18*scale,z+Math.sin(a)*2],.4,k%2?etched:metal);
       shard(g,px,6,pz,1.1,5.2,1.1,k%2?crystal:etched);
      }
      ring(g,x,18*scale,z,8,accent,Math.PI/2);
   }
 }
 // Faceted sanctuaries sit in the outer approaches, not across a visitor building's door.
 for(let i=0;i<HEXCORE_WORLD.sites.length;i++){
   const site=HEXCORE_WORLD.sites[i],group=new THREE.Group();group.name='CIVIC_SCULPTURES_'+i;root.add(group);
   const dx=site.x, dz=site.z;
   // The public interaction position is (site.x,site.z+29); sculptures remain to each side.
   cluster(group,dx-49,dz-4,i%4,i);
   cluster(group,dx+49,dz-4,(i+1)%4,(i+1)%lights.length);
   const accent=lights[i%lights.length];
   for(const s of [-1,1]){
     const px=dx+s*34;
     beam(group,[px,0,dz+10],[px+s*6,12,dz+6],.3,etched);
     shard(group,px+s*6,14,dz+6,1.6,4,1.6,crystal);
     ring(group,px+s*6,14,dz+6,3.7,accent,.33);
   }
   yield;
 }
 // Light pillars around the original perimeter; no downtown skyline or office cubes.
 const perimeter=new THREE.Group();perimeter.name='OUTER_VOID_CONSTRUCTS';root.add(perimeter);
 for(let i=0;i<18;i++){
   const a=i*Math.PI*2/18,r=710+(i%4)*33,x=Math.sin(a)*r,z=300+Math.cos(a)*r;
   const h=36+(i%5)*15;
   beam(perimeter,[x-4,0,z],[x,h,z],2,metal);
   beam(perimeter,[x+4,0,z],[x,h,z],2,etched);
   shard(perimeter,x,h+9,z,3,11,3,crystal);
   ring(perimeter,x,h*.7,z,12,lights[i%5],.3+(i%3)*.2);
 }
 yield;
 return ()=>{for(const [m,speed] of animations){m.rotation.y+=speed;}};
}
