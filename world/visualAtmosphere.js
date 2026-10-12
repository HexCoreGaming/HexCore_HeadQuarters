import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD, HEXCORE_EXTERIOR_SITES } from './worldLayout.js';

// Visual pass for the original digital civilization. No replacement coordinates,
// no interactive meshes, no per-frame texture creation, no shadow-casting lights.
export function* createVisualAtmosphere(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_VISUAL_ATMOSPHERE';
  scene.add(root);
  const ink = new THREE.MeshStandardMaterial({color:0x080d1c,metalness:.86,roughness:.24});
  const etched = new THREE.MeshStandardMaterial({color:0x24334e,metalness:.83,roughness:.26});
  const crystal = new THREE.MeshStandardMaterial({color:0x354e87,metalness:.49,roughness:.2,emissive:0x2b174c,emissiveIntensity:.44});
  const cyan = new THREE.MeshBasicMaterial({color:0x69e2ff});
  const violet = new THREE.MeshBasicMaterial({color:0xb379ff});
  const rose = new THREE.MeshBasicMaterial({color:0xf586dc});
  const palette=[violet,cyan,rose];
  const sharedBox = new THREE.BoxGeometry(1,1,1);
  const tubeGeom = new THREE.CylinderGeometry(1,1,1,7);
  const rhombusGeom = new THREE.OctahedronGeometry(1,0);
  function mesh(parent,geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
  function beam(parent,a,b,width,mat){
    const mid=a.clone().add(b).multiplyScalar(.5), delta=b.clone().sub(a);
    const v=mesh(parent,sharedBox,mat,mid.x,mid.y,mid.z);v.scale.set(width,delta.length(),width);
    v.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return v;
  }
  function halo(parent,x,y,z,r,mat,rotation=Math.PI/2){
    const t=mesh(parent,new THREE.TorusGeometry(r,.095,6,48),mat,x,y,z);t.rotation.x=rotation;return t;
  }
  function spire(parent,x,z,height,mat){
    const base=mesh(parent,tubeGeom,ink,x,height*.24,z);base.scale.set(1.1,height*.48,1.1);
    const tip=mesh(parent,rhombusGeom,mat,x,height*.75,z);tip.scale.set(1.6,height*.26,1.6);
    const foot=mesh(parent,rhombusGeom,etched,x,.85,z);foot.scale.set(2.1,1.3,2.1);
  }
  function flyingArch(parent,x,z,r,h,mat){
    const pts=[[-r,0],[-r*.94,h*.37],[-r*.58,h*.81],[0,h],[r*.58,h*.81],[r*.94,h*.37],[r,0]];
    const curve=new THREE.CatmullRomCurve3(pts.map(([px,py])=>new THREE.Vector3(x+px,py,z)));
    parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve,34,.25,6,false),mat));
  }
  function floorSeal(parent,x,z,rad,mat){
    halo(parent,x,.17,z,rad,mat);
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;const p=new THREE.Vector3(x+Math.cos(a)*rad*.6,.18,z+Math.sin(a)*rad*.6);
      const q=new THREE.Vector3(x+Math.cos(a+Math.PI/3)*rad*.6,.18,z+Math.sin(a+Math.PI/3)*rad*.6);
      beam(parent,p,q,.09,mat);
    }
  }
  // Begin outside of the headquarters door and lead the eye to the tower.
  const avenue=new THREE.Group();avenue.name='APPROACH_DETAILS';root.add(avenue);
  for(const z of [58,112,166,216]){
    for(const side of [-1,1]){
      spire(avenue,side*(24+z*.025),z,12+z*.045,side>0?violet:cyan);
      const x=side*(24+z*.025);
      beam(avenue,new THREE.Vector3(x,3,z-3),new THREE.Vector3(x,18+z*.045,z),.22,etched);
    }
    floorSeal(avenue,0,z,5.4,z%2?cyan:violet);
  }
  for(let i=0;i<3;i++)flyingArch(avenue,0,94+i*50,21+i*3,31+i*5, i%2?cyan:violet);
  yield;
  // Centre: ceremonial ring, eight cantilevering elven/digital arms and
  // staggered translucent crystalline markers around the visible tower.
  const centre=new THREE.Group();centre.name='TOWER_CEREMONIAL_DETAILS';root.add(centre);
  floorSeal(centre,0,300,58,cyan);
  floorSeal(centre,0,300,69,violet);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const ox=Math.sin(a)*69,oz=300+Math.cos(a)*69;
    spire(centre,ox,oz,21+i%3*5,palette[i%3]);
    const tip=new THREE.Vector3(ox,25,oz),foot=new THREE.Vector3(ox*.6,8,300+(oz-300)*.6);
    beam(centre,foot,tip,.38,etched);
    beam(centre,new THREE.Vector3(ox,22,oz),new THREE.Vector3(ox*.55,48,300+(oz-300)*.55),.16,palette[i%3]);
  }
  for(let i=0;i<4;i++){
    halo(centre,0,35+i*28,300,47-i*5,palette[i%3],.3+i*.3);
  }
  yield;
  // Four distinct game destinations gain their own identifying architectural
  // silhouettes; public interaction zones at z+29 remain unobstructed.
  for(const i of HEXCORE_EXTERIOR_SITES){
    const loc=HEXCORE_WORLD.sites[i],g=new THREE.Group();g.name=`DESTINATION_VISUAL_${i}`;root.add(g);
    const {x,z}=loc,c=palette[i%3];
    floorSeal(g,x,z,28,c);
    for(const side of [-1,1]){
      // Details are placed beyond the doorway's x +/- 7 approach, away from E trigger.
      const px=x+side*26;
      spire(g,px,z+5,14+(i%4)*3,c);
      flyingArch(g,px,z-6,5.2,16+(i%3)*4,etched);
    }
    const yaw=i*.4;
    for(let j=0;j<3;j++){
      const a=yaw+j*Math.PI*2/3;
      const dx=Math.sin(a)*19,dz=Math.cos(a)*19;
      const shard=mesh(g,rhombusGeom,i<4?crystal:etched,x+dx,15+(j%2)*4,z+dz);
      shard.scale.set(2.5,8,2.5);shard.rotation.y=a;
    }
    // Unique crest for each featured game, without conventional block skyline.
    if(i===0){for(let q=0;q<3;q++)halo(g,x,33+q*5,z-5,8+q*2, q%2?cyan:violet,.35+q*.2);}
    if(i===1){for(let q=0;q<7;q++){const a=q*Math.PI*2/7;spire(g,x+Math.cos(a)*29,z+Math.sin(a)*28,9+q%3*4,cyan);}}
    if(i===2){for(let q=0;q<3;q++)flyingArch(g,x+(q-1)*11,z-12,6,10+q*3,rose);}
    if(i===3){for(let q=-1;q<=1;q++){spire(g,x+q*9,z-15,22+Math.abs(q)*8,etched);}}
    yield;
  }
  // Distant, nonblocking abstract digital landforms instead of ordinary offices.
  const horizon=new THREE.Group();horizon.name='ABSTRACT_HORIZON';root.add(horizon);
  for(let i=0;i<24;i++){
    const a=i*Math.PI*2/24,rr=740+(i%3)*50;
    const x=Math.sin(a)*rr,z=300+Math.cos(a)*rr;
    const h=48+(i*11)%64;
    spire(horizon,x,z,h,i%3===0?violet:etched);
    if(i%4===0)halo(horizon,x,h*.8,z,6,cyan,.55);
  }
  yield;
  return ()=>{};
}
