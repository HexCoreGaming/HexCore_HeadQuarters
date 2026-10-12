import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// STRUCTURAL ART PASS: original elven architecture with a later electric retrofit.
// Shared geometry / instanced assemblies; no external downloads or per-object lights.
export function* createSculptedArchitecture(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_SCULPTED_ARCHITECTURE';
  scene.add(root);
  const shell = new THREE.MeshStandardMaterial({color:0x101a27,metalness:.65,roughness:.31,side:THREE.DoubleSide});
  const pearl = new THREE.MeshStandardMaterial({color:0x31465a,metalness:.51,roughness:.29,side:THREE.DoubleSide});
  const translucent = new THREE.MeshStandardMaterial({color:0x244f55,metalness:.32,roughness:.31,transparent:true,opacity:.78,depthWrite:false,side:THREE.DoubleSide,emissive:0x063a43,emissiveIntensity:.3});
  const lights = [0x9c69ee,0x7adcf3,0xc962ba,0x6fcab8].map(c=>new THREE.MeshBasicMaterial({color:c}));
  // One swept-leaf structural geometry reused across all pavilions, shaped from
  // a tapering organic spine instead of stacked boxes or cylinders.
  function finGeometry(length=1) {
    const v=[],u=[],idx=[]; const n=15;
    for(let i=0;i<=n;i++) {
      const t=i/n, y=t*length;
      const half=(.06+.94*Math.pow(Math.sin(Math.PI*t),.82));
      const curved=Math.sin(t*Math.PI)*.36;
      v.push(-half,y,curved, half,y,curved-.18);
      u.push(0,t,1,t);
      if(i<n){const a=2*i;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(u,2));g.setIndex(idx);g.computeVertexNormals();return g;
  }
  const fin=finGeometry();
  const diamond=new THREE.OctahedronGeometry(1,0);
  const stem=new THREE.CylinderGeometry(.13,.23,1,6);
  const matTemp=new THREE.Object3D();
  function populate(parent,geo,mat,placements,name) {
    if(!placements.length)return;
    const obj=new THREE.InstancedMesh(geo,mat,placements.length);
    obj.name=name;obj.frustumCulled=true;
    placements.forEach((p,i)=>{
      matTemp.position.set(p[0],p[1],p[2]);matTemp.rotation.set(p[6]||0,p[7]||0,p[8]||0);
      matTemp.scale.set(p[3],p[4],p[5]);matTemp.updateMatrix();obj.setMatrixAt(i,matTemp.matrix);
    });
    obj.instanceMatrix.needsUpdate=true;obj.computeBoundingSphere();parent.add(obj);
  }
  function spine(parent,points,radius,mat) {
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.min(44,points.length*9),radius,5,false),mat);
    parent.add(mesh);return mesh;
  }
  function pavilion(site,i) {
    const g=new THREE.Group();g.name='ORGANIC_SITE_'+String(i+1).padStart(2,'0');g.position.set(site.x,0,site.z);root.add(g);
    const col=lights[i%4];const height=25+i%4*2;
    const ribs=[],crystals=[],footings=[];
    for(let j=0;j<12;j++){
      const a=j*Math.PI/6;const x=Math.sin(a)*27,z=Math.cos(a)*26;
      ribs.push([x,1,z,2.6,height,1.15,0,-a,0]);
      crystals.push([x, height*.84,z,1.0,2.2,1.0,0,a,0]);
      footings.push([x,2,z,.8,4.2,.8]);
    }
    populate(g,fin,shell,ribs,'SWEPT_ELVEN_SUPPORTS');
    populate(g,diamond,col,crystals,'ELECTRIC_RETROFIT_CRYSTALS');
    populate(g,stem,pearl,footings,'FOUNDATION_STEMS');
    // Interlacing hyperbolic roof canopy: structural leaf-form arches with negative space.
    for(let side of [-1,1]){
      spine(g,[[side*26,1,-13],[side*27,13,-10],[side*15,31,-7],[side*4,36,-5],[0,38,-4]],.38,pearl);
      spine(g,[[side*25,1,15],[side*26,12,13],[side*16,29,7],[side*5,35,-3],[0,38,-4]],.23,col);
    }
    // Faceted translucent secondary canopy, behind the existing usable entrance.
    const canopy=new THREE.Mesh(new THREE.ConeGeometry(17.5,8,8,1,true),translucent);
    canopy.position.set(0,29,-4);canopy.rotation.y=Math.PI/8;g.add(canopy);
    // Keep south-facing door at site.z+29 completely open and unobstructed.
    for(let s of [-1,1]){
      spine(g,[[s*11,0,23],[s*11,9,23],[s*8,16,24],[s*3,20,24]],.42,shell);
      spine(g,[[s*10.4,1,23.35],[s*10.4,9,23.35],[s*7.6,16,24.35],[s*2.9,20,24.35]],.10,col);
    }
  }
  // Tower's architectural ribs are attached to its *existing* center (0,300),
  // not a second moved duplicate tower. Long tapered spans merge with its crown.
  const tower=new THREE.Group();tower.name='CENTRAL_TOWER_ORGANIC_BUTTRESSES';tower.position.set(0,0,300);root.add(tower);
  for(let j=0;j<10;j++){
    const a=j*Math.PI*2/10,dx=Math.sin(a),dz=Math.cos(a);
    spine(tower,[[dx*57,0,dz*57],[dx*63,19,dz*63],[dx*57,46,dz*57],[dx*42,103,dz*42],[dx*21,188,dz*21],[dx*9,259,dz*9]],.69,j%2?pearl:shell);
    spine(tower,[[dx*58,4,dz*58],[dx*60,25,dz*60],[dx*53,49,dz*53],[dx*39,101,dz*39],[dx*18,189,dz*18],[dx*8.6,255,dz*8.6]],.13,lights[j%4]);
  }
  // Native foliage-aligned satellite arches frame the approach rather than
  // building a skyline of generic rectangles along it.
  for(let k=0;k<6;k++){
    const z=74+k*33,g=new THREE.Group();g.position.set(0,0,z);g.name='PROCESSIONAL_CANOPY_'+k;root.add(g);
    const radius=28+k%2*6;
    for(let s of [-1,1]){
      spine(g,[[s*radius,0,0],[s*radius*1.08,11,0],[s*radius*.87,23,-2],[s*radius*.48,32,-3],[0,36,-4]],.49,shell);
      spine(g,[[s*(radius+.3),2,.3],[s*radius*1.08,11,.3],[s*radius*.87,23,-1.7],[s*radius*.48,32,-2.7],[0,36,-3.7]],.11,lights[k%4]);
    }
  }
  yield;
  for(let i=0;i<HEXCORE_WORLD.sites.length;i++){
    pavilion(HEXCORE_WORLD.sites[i],i);
    yield;
  }
  return ()=>{};
}
