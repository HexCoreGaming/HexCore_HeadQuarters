import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// ELVEN TERRAIN // natural sanctuaries with small human electric additions.
// Uses shared geometry, batched instancing and no real-time lights.
export function* createBioluminescentSanctuaries(scene) {
  const group = new THREE.Group();
  group.name = 'HEXCORE_BIOLUMINESCENT_SANCTUARIES';
  scene.add(group);
  const leaf = new THREE.MeshStandardMaterial({color:0x153b35,emissive:0x147e76,emissiveIntensity:.55,roughness:.52,side:THREE.DoubleSide});
  const luminous = new THREE.MeshBasicMaterial({color:0x75e9d4,transparent:true,opacity:.77,depthWrite:false,side:THREE.DoubleSide});
  const violet = new THREE.MeshBasicMaterial({color:0xb48cf7,transparent:true,opacity:.7,depthWrite:false});
  const rock = new THREE.MeshStandardMaterial({color:0x172938,metalness:.32,roughness:.55,flatShading:true});
  const water = new THREE.MeshBasicMaterial({color:0x2e8cbd,transparent:true,opacity:.58,side:THREE.DoubleSide,depthWrite:false});
  const trunkGeo = new THREE.CylinderGeometry(.26,.7,1,7), bulbGeo = new THREE.IcosahedronGeometry(1,1), petalGeo = new THREE.SphereGeometry(1,8,5);
  const temp = new THREE.Object3D(), seed = n => {let q=Math.sin(n*127.1+18.8)*43758.5453;return q-Math.floor(q);};
  const trunks=[],bulbs=[],petals=[];
  // Small sanctuaries are placed between destinations, not on the approach axis or at doors.
  const sanctuaries = [[-102,232],[102,232],[-115,360],[116,370],[-210,300],[210,300],[-70,560],[68,562],[-68,112],[67,112]];
  for(let s=0;s<sanctuaries.length;s++) {
    const [cx,cz]=sanctuaries[s];
    const base=new THREE.Group();base.position.set(cx,0,cz);group.add(base);
    const floor=new THREE.Mesh(new THREE.CircleGeometry(15,32),new THREE.MeshBasicMaterial({color:0x173731,transparent:true,opacity:.53,depthWrite:false}));
    floor.rotation.x=-Math.PI/2;floor.position.y=.045;base.add(floor);
    const pond=new THREE.Mesh(new THREE.CircleGeometry(5.5,36),water);pond.rotation.x=-Math.PI/2;pond.position.set(0,.08,0);base.add(pond);
    for(let j=0;j<11;j++) {
      const a=j*Math.PI*2/11, r=6.8+seed(s*55+j)*5.1, x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
      const height=5.5+seed(j*2+s*7)*6;
      trunks.push([x,height/2,z,.45,height,.45]);
      bulbs.push([x,height+1,z,1.5+seed(s*20+j)*1.3,2.6+seed(j+s*13)*1.8,1.5]);
      for(let k=0;k<3;k++) {
        const phi=k*Math.PI*2/3;
        petals.push([x+Math.cos(phi)*1.45,height+.9+Math.sin(phi)*.65,z+Math.sin(phi)*1.45,.85,1.6,.65]);
      }
    }
    // Sculptural root paths and gently glowing, shallow waterfall ribbons.
    for(let side of [-1,1]) {
      const points=[];
      for(let t=0;t<=12;t++) {let p=t/12;points.push(new THREE.Vector3(side*(4+p*10),.13+Math.sin(p*Math.PI)*.45,Math.sin(p*5+s)*2.1));}
      const channel=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.12,5,false),luminous);
      base.add(channel);
    }
    const ancient=new THREE.Mesh(new THREE.TorusGeometry(3.7,.22,7,52,Math.PI*1.67),rock);
    ancient.position.set(0,4.6,-5.4); ancient.rotation.z=.2;base.add(ancient);
    const electric=new THREE.Mesh(new THREE.TorusGeometry(3.4,.055,5,52,Math.PI*1.67),violet);
    electric.position.copy(ancient.position); electric.position.z+=.16;electric.rotation.copy(ancient.rotation);base.add(electric);
    yield;
  }
  function upload(geometry,material,items,name) {
    const mesh=new THREE.InstancedMesh(geometry,material,items.length);mesh.name=name;
    items.forEach((i,n)=>{temp.position.set(i[0],i[1],i[2]);temp.rotation.set(0,0,0);temp.scale.set(i[3],i[4],i[5]);temp.updateMatrix();mesh.setMatrixAt(n,temp.matrix);});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);
  }
  upload(trunkGeo,rock,trunks,'ELVEN_ROOT_COLUMNS');yield;
  upload(bulbGeo,leaf,bulbs,'LUMINOUS_TREE_CANOPIES');yield;
  upload(petalGeo,luminous,petals,'BIOFLOWER_CLUSTERS');yield;
  // Keep site placements and tower position driven only by the shared world layout.
  group.userData.center=HEXCORE_WORLD.tower;
  return ()=>{};
}
