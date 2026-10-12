import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// Architectural pass: the elven-built shell and living landscape precede the
// smaller human-installed electric details. Keeps door approaches at z + 29 open.
export function* createElvenArchitecture(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_ELVEN_ARCHITECTURE';
  scene.add(root);
  const shell = new THREE.MeshStandardMaterial({color:0x111b29,metalness:.58,roughness:.32,side:THREE.DoubleSide});
  const inlay = new THREE.MeshStandardMaterial({color:0x294b56,metalness:.48,roughness:.4,side:THREE.DoubleSide});
  const translucent = new THREE.MeshStandardMaterial({color:0x1d4852,emissive:0x0e564c,emissiveIntensity:.35,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide});
  const life = [0x64efca,0x80dfff,0xcf8aff].map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.83,depthWrite:false,side:THREE.DoubleSide}));
  const curveCache = new Map();
  const quill = new THREE.ConeGeometry(1,1,7);
  const prism = new THREE.IcosahedronGeometry(1,0);
  const temp = new THREE.Object3D();
  const animated=[];

  function pipe(group,points,r,mat) {
    const path = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const segments=Math.max(20,points.length*9);
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,segments,r,6,false),mat);
    group.add(mesh);return mesh;
  }
  function fin(group,x,z,height,tilt=1,mat=shell) {
    // Slender leaves taper to an organic point, rather than box-shaped facades.
    const verts=new Float32Array([
      x-2,0,z-1, x+2,0,z-1, x-1.1,height*.72,z+tilt*4,
      x+2,0,z-1, x+1.1,height*.72,z+tilt*4, x-1.1,height*.72,z+tilt*4,
      x-1.1,height*.72,z+tilt*4, x+1.1,height*.72,z+tilt*4, x,height,z+tilt*7
    ]);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(verts,3));geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,mat);group.add(m);
    pipe(group,[[x-2,0,z-1],[x-1.1,height*.72,z+tilt*4],[x,height,z+tilt*7]],.12,life[1]);
    return m;
  }
  function plantPatch(group,x,z,r,n,seed){
    const mesh=new THREE.InstancedMesh(quill,life[seed%life.length],n);
    for(let i=0;i<n;i++){
      const angle=i*2.39996+seed*1.3;
      const radial=Math.sqrt((i+.5)/n)*r;
      const height=.38 + (((i*13+seed*17)%11)/11)*1.3;
      temp.position.set(x+Math.cos(angle)*radial,height*.48,z+Math.sin(angle)*radial);
      temp.scale.set(.17+height*.13,height,.17+height*.13);
      temp.rotation.set(0,angle,Math.sin(angle)*.15);temp.updateMatrix();mesh.setMatrixAt(i,temp.matrix);
    }
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);
  }

  // The centerpiece: naturally flowing buttresses and a ring of elevated,
  // bioluminescent leaf-canopies surrounding the canonical central tower.
  const heart=new THREE.Group();heart.name='CENTRAL_TOWER_ELVEN_FOUNDATIONS';
  heart.position.set(HEXCORE_WORLD.tower.x,0,HEXCORE_WORLD.tower.z);root.add(heart);
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6,ca=Math.cos(a),sa=Math.sin(a),r=64;
    const pts=[[sa*r,0,ca*r],[sa*(r+4),17,ca*(r+4)],[sa*(r-5),40,ca*(r-5)],[sa*47,75,ca*47],[sa*30,112,ca*30]];
    pipe(heart,pts,1.45,shell);
    pipe(heart,pts.map(([x,y,z])=>[x+ca*.7,y,z-sa*.7]),.2,life[i%3]);
    const leaf=new THREE.Mesh(prism,translucent);
    leaf.position.set(sa*(r+7),25,ca*(r+7));leaf.scale.set(2.4,12,4.8);leaf.rotation.y=a;heart.add(leaf);
  }
  // Sculptural architraves remain open toward the hub on the negative-Z side.
  for(let ring=0;ring<2;ring++){
    const radius=80+ring*17;
    for(let k=0;k<6;k++){
      const a=(k+.5)*Math.PI/3;
      const x=Math.sin(a)*radius,z=Math.cos(a)*radius;
      if(z < -radius*.65 && Math.abs(x)<35)continue;
      fin(heart,x,z,24+ring*8,k%2?1:-1,ring?shell:inlay);
    }
  }
  plantPatch(heart,-92,-30,10,120,1);
  plantPatch(heart,92,-30,10,120,2);
  yield;

  // Individual sanctuaries express a grown elven structure with humans adding
  // energy rails and holograms later. Preserve canonical doorways.
  for(let i=0;i<HEXCORE_WORLD.sites.length;i++){
    const {x,z}=HEXCORE_WORLD.sites[i];
    const g=new THREE.Group();g.name=`ELVEN_DESTINATION_${String(i+1).padStart(2,'0')}`;
    g.position.set(x,0,z);root.add(g);
    const mat=i===1?translucent:shell;
    for(const side of [-1,1]){
      const xx=side*24;
      pipe(g,[[xx,0,2],[xx*1.15,10,-8],[xx*.85,24,-12],[xx*.5,35,-16]],.8,mat);
      pipe(g,[[xx,1,2],[xx*1.15,10,-8],[xx*.85,24,-12],[xx*.5,35,-16]],.12,life[i%3]);
      fin(g,side*30,-14,17+i%4*3,side,mat);
    }
    // Rear curved canopy leaves the forward entrance free.
    pipe(g,[[-18,9,-23],[-12,28,-27],[0,34,-30],[12,28,-27],[18,9,-23]],.95,shell);
    pipe(g,[[-18,9,-23],[-12,28,-27],[0,34,-30],[12,28,-27],[18,9,-23]],.13,life[(i+1)%3]);
    for(const side of [-1,1]) plantPatch(g,side*32,-3,5,42,i+Math.round(side+2));
    if(i===1 || i===13 || i===15){
      for(let j=0;j<3;j++){
        const xx=(j-1)*12;
        const crown=new THREE.Mesh(prism,translucent);crown.position.set(xx,8,-36);crown.scale.set(3.5,9+j*2,3.5);g.add(crown);
      }
    }
    yield;
  }
  // Naturally grown landmark spines out beyond the public ring, spaced widely.
  const horizon=new THREE.Group();horizon.name='ORGANIC_HORIZON';root.add(horizon);
  for(let i=0;i<20;i++){
    const a=i*Math.PI*2/20;
    const radius=625+(i%4)*37;
    const x=Math.cos(a)*radius,z=HEXCORE_WORLD.tower.z+Math.sin(a)*radius;
    const h=35+(i*17)%67;
    const spine=pipe(horizon,[[x,0,z],[x+Math.cos(a)*12,h*.34,z+Math.sin(a)*12],[x+Math.cos(a)*5,h*.8,z+Math.sin(a)*5],[x,h,z]],1.8,shell);
    if(i%3===0)plantPatch(horizon,x,z,11,90,i);
    if(i%4===0)yield;
  }
  return ()=>{for(const m of animated)m.rotation.y+=.0002;};
}
