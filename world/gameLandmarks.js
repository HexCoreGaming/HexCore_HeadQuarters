import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// Four deliberately different exteriors. These replace the shared generic
// building shells; all entrances are open at local (+0, +29 Z).
export function* createGameLandmarks(scene) {
 const root = new THREE.Group(); root.name = 'HEXCORE_FOUR_GAME_ARCHITECTURE'; scene.add(root);
 const obsidian = new THREE.MeshPhysicalMaterial({color:0x081320,metalness:.62,roughness:.3,clearcoat:.6,side:THREE.DoubleSide});
 const alloy = new THREE.MeshStandardMaterial({color:0x1d3147,metalness:.78,roughness:.25,side:THREE.DoubleSide});
 const stone = new THREE.MeshStandardMaterial({color:0x172433,metalness:.28,roughness:.75,side:THREE.DoubleSide});
 const bark = new THREE.MeshStandardMaterial({color:0x183432,roughness:.82,side:THREE.DoubleSide});
 const nightGlass = new THREE.MeshPhysicalMaterial({color:0x18435a,metalness:.28,roughness:.19,transparent:true,opacity:.52,depthWrite:false,side:THREE.DoubleSide});
 const neon = [0xaf79ff,0x68f6dd,0xffcb75,0xf18bc1].map(color=>new THREE.MeshStandardMaterial({color:0x101c26,emissive:color,emissiveIntensity:1.7,metalness:.5,roughness:.25,side:THREE.DoubleSide}));
 const blade = new THREE.ConeGeometry(1,1,7), boxGeom=new THREE.BoxGeometry(1,1,1);
 function box(g,x,y,z,w,h,d,m){const o=new THREE.Mesh(boxGeom,m);o.position.set(x,y,z);o.scale.set(w,h,d);g.add(o);return o;}
 function path(g,pts,thick,mat){const cr=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)),false,'centripetal');const m=new THREE.Mesh(new THREE.TubeGeometry(cr,Math.max(32,pts.length*10),thick,7,false),mat);g.add(m);return m;}
 function spire(g,x,z,r,h,material){const m=new THREE.Mesh(blade,material);m.scale.set(r,h,r);m.position.set(x,h/2,z);g.add(m);return m;}
 function floor(g,material){const disk=new THREE.Mesh(new THREE.CylinderGeometry(31,33,.75,64),material);disk.position.y=-.42;g.add(disk);}
 function entrance(g,mat){ // open portal on positive Z, approaching at z+29
  path(g,[[-7,0,22],[-8,10,24],[-5,20,23],[0,24,22],[5,20,23],[8,10,24],[7,0,22]],.33,mat);
  for(const x of [-8.5,8.5])path(g,[[x,0,21],[x*1.03,10,22],[x*.9,19,22]],.19,alloy);
 }
 function radialLoft(g,func,material,radial=64,vertical=32,skip=null){
  const pos=[],idx=[];
  for(let j=0;j<=vertical;j++){const t=j/vertical;for(let i=0;i<=radial;i++){const a=i/radial*2*Math.PI;const p=func(a,t);pos.push(p[0],p[1],p[2]);}}
  for(let j=0;j<vertical;j++)for(let i=0;i<radial;i++){
   const a=(i+.5)/radial*Math.PI*2;
   if(skip && skip(a,j/vertical))continue;
   const k=j*(radial+1)+i;idx.push(k,k+radial+1,k+1,k+1,k+radial+1,k+radial+2);
  }
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geom.setIndex(idx);geom.computeVertexNormals();const mesh=new THREE.Mesh(geom,material);g.add(mesh);return mesh;
 }
 function cyber(g){
  // Fractured multi-ring arena citadel, with a solid ring-shaped shell and open gateway.
  radialLoft(g,(a,t)=>{let r=24*(1-.17*t)+2.2*Math.sin(6*a+4*t);return [Math.sin(a)*r,2+t*30,Math.cos(a)*r-3];},obsidian,80,28,(a,t)=>Math.cos(a)>.88 && Math.abs(Math.sin(a))<.24 && t<.68);
  for(let k=0;k<3;k++){
   const ring=new THREE.Mesh(new THREE.TorusGeometry(23-k*2,.48,10,100),neon[k%2?1:0]);ring.rotation.x=Math.PI/2;ring.rotation.z=.08*k;ring.position.set(0,9+k*9,-3);g.add(ring);
  }
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const x=Math.sin(a)*23,z=Math.cos(a)*23-3;
   path(g,[[x,0,z],[x*1.1,11,z*1.08],[x*.8,26,z*.9],[x*.5,34,z*.6]],.8,alloy);
   path(g,[[x,1,z],[x*1.1,12,z*1.08],[x*.8,26,z*.9]],.14,neon[0]);
  }
  spire(g,0,-4,5,53,obsidian);
 }
 function survival(g){
  // Living cathedral: interlocked luminous roots grow into branching canopy.
  radialLoft(g,(a,t)=>{const swell=3.5*Math.cos(5*a+4*t);const r=(20+4*Math.sin(t*Math.PI))* (1-.14*t)+swell;
   return [Math.sin(a)*r,1+36*t,Math.cos(a)*r-3];},nightGlass,72,30,(a,t)=>Math.cos(a)>.86&&Math.abs(Math.sin(a))<.3&&t<.7);
  for(let i=0;i<10;i++){
   const a=i*Math.PI/5,x=Math.sin(a)*20,z=Math.cos(a)*19-3;
   path(g,[[x,0,z],[x*1.14,8,z*1.17],[x*1.12,23,z*1.13],[x*.5,37,z*.48],[0,45,-3]],.9,bark);
   path(g,[[x,5,z],[x*1.1,16,z*1.12],[x*.9,28,z*.9],[x*.4,38,z*.4]],.14,neon[1]);
   for(let b=0;b<3;b++){const h=13+b*8;spire(g,x*(1-b*.16),z*(1-b*.14),2+b*.3,5+b*2,neon[1]);}
  }
  for(let i=0;i<20;i++){let a=i*2.4,r=12+(i%4)*3;spire(g,Math.sin(a)*r,Math.cos(a)*r-2,.9+(i%3)*.5,3+(i%4)*2,neon[1]);}
 }
 function horizon(g){
  // Open, sculpted wing-shaped engineering pavilion: flowing parallel speed forms.
  for(const side of [-1,1]){
   for(let i=0;i<4;i++){
    const shift=i*4.4;
    path(g,[[side*(10+shift),0,-24],[side*(26+shift),7,-21],[side*(35+shift),16,-6],[side*(27+shift),25,10],[side*(14+shift),32,17],[side*7,36,5]],.85,i%2?alloy:obsidian);
    path(g,[[side*(10+shift),.8,-24],[side*(26+shift),7.8,-21],[side*(35+shift),16.8,-6],[side*(27+shift),25.8,10]],.15,neon[2]);
   }
  }
  // Floating blade sails, not an enclosed box. Entrance remains open.
  for(const x of [-21,21])for(let j=0;j<3;j++){
   const pts=[[x,5,-19+j*16],[x*1.2,15,-13+j*16],[x*.75,26,-5+j*16]];
   path(g,pts,.75,nightGlass);
  }
  const coil=new THREE.Mesh(new THREE.TorusGeometry(15,.65,10,72),neon[2]);coil.rotation.x=.47;coil.position.set(0,27,-7);g.add(coil);
 }
 function ashes(g){
  // Gothic elven sanctuary: pointed petal walls and arc-buttresses with an open front.
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4, x=Math.sin(a)*25,z=Math.cos(a)*23-3;
   if(Math.cos(a)>.85)continue;
   path(g,[[x,0,z],[x*1.08,12,z*1.1],[x*.8,30,z*.8],[x*.32,44,z*.32]],1.5,stone);
   path(g,[[x,1,z],[x*1.075,13,z*1.09],[x*.8,30,z*.8],[x*.32,44,z*.32]],.13,neon[3]);
   spire(g,x,z,2.7,37,stone);
  }
  for(const side of [-1,1]){
   path(g,[[side*25,0,-8],[side*34,12,-8],[side*27,31,-4],[side*5,51,-3]],.92,stone);
   path(g,[[side*25,0,-8],[side*34,12,-8],[side*27,31,-4]],.14,neon[3]);
  }
  spire(g,0,-15,5,55,stone);
  for(let j=0;j<4;j++)path(g,[[-19+j*12,4,-21],[-19+j*12,16,-21],[-13+j*12,22,-21]],.18,neon[3]);
 }
 const builders=[cyber,survival,horizon,ashes];
 for(let i=0;i<4;i++){
  const pos=HEXCORE_WORLD.sites[i],group=new THREE.Group();group.name='HEXCORE_DISTINCT_GAME_BUILDING_'+i;group.position.set(pos.x,0,pos.z);root.add(group);
  floor(group,obsidian);builders[i](group);entrance(group,neon[i]);
  yield;
 }
 return ()=>{};
}
