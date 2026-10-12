import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// Individual permanent architecture for the six public non-game destinations.
// All entryways stay unobstructed near local x=0, z=+29.
export function* createPublicLandmarks(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_SIX_DISTINCT_PUBLIC_LANDMARKS';
  scene.add(root);
  const stone = new THREE.MeshStandardMaterial({color:0x182f35,metalness:.4,roughness:.44,side:THREE.DoubleSide});
  const obsidian = new THREE.MeshStandardMaterial({color:0x0b1224,metalness:.72,roughness:.27,side:THREE.DoubleSide});
  const glass = new THREE.MeshPhysicalMaterial({color:0x265869,metalness:.33,roughness:.22,transparent:true,opacity:.62,side:THREE.DoubleSide,depthWrite:false});
  const bark = new THREE.MeshStandardMaterial({color:0x233936,metalness:.15,roughness:.74});
  const accents=[0x85f7f2,0xa889ff,0xffa5d9,0x7ce8ff,0xeeadff,0x9dffc5];
  const emissive=accents.map(c=>new THREE.MeshStandardMaterial({color:0x11232b,emissive:c,emissiveIntensity:1.25,metalness:.4,roughness:.28}));
  const orb=new THREE.SphereGeometry(1,16,12);
  const cone=new THREE.ConeGeometry(1,1,8);
  const trunk=new THREE.CylinderGeometry(1,1,1,8);
  function add(g,geom,mat,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geom,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);g.add(m);return m;}
  function arc(g,pts,mat,r=.35){const curve=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(30,pts.length*9),r,7,false),mat);g.add(mesh);return mesh;}
  function portal(g,material){arc(g,[[-7,0,23],[-8,11,24],[-4,19,24],[0,22,24],[4,19,24],[8,11,24],[7,0,23]],material,.34);}
  function pedestal(g,material){add(g,new THREE.CylinderGeometry(29,31,.7,56),material,0,-.48,0);}
  function academy(g,mat){
    // Open-sided learning observatory with six branching elven arch-petals.
    for(let i=0;i<6;i++){const a=i*Math.PI/3;
      const p=(r,y)=>[Math.sin(a)*r,y,Math.cos(a)*r-3];
      arc(g,[p(24,0),p(28,11),p(23,28),p(10,36),p(0,38)],stone,1.15);
      arc(g,[p(24,1),p(27.5,11),p(22.5,28),p(9.5,36)],mat,.16);
    }
    for(let i=0;i<3;i++){const r=8+i*4;const tor=add(g,new THREE.TorusGeometry(r,.22,8,68),mat,0,23+i*4,-4);tor.rotation.x=.35+i*.35;}
    add(g,orb,glass,0,29,-4,4.4,4.4,4.4);
  }
  function future(g,mat){
    // Three sweeping feather-like observation wings with an open visitor atrium.
    for(let wing=0;wing<3;wing++){
      const a=wing*2*Math.PI/3+.25;
      for(let j=0;j<4;j++){
        const p=(r,y)=>[Math.sin(a)*r,y,Math.cos(a)*r-5];
        arc(g,[p(15+j*3,0),p(24+j*3,8),p(29+j*4,18),p(23+j*3,29),p(11+j*2,42)],j%2?glass:stone,.6);
      }
    }
    add(g,orb,mat,0,30,-7,3.3,3.3,3.3);
  }
  function merch(g,mat){
    // A sweeping low crescent market gallery, not an office block.
    for(const side of [-1,1])for(let j=0;j<5;j++){
      const z=-21+j*10;
      arc(g,[[side*24,0,z],[side*27,8,z-2],[side*19,16,z-3],[side*7,21,z-1]],stone,.85);
      arc(g,[[side*23.6,0,z],[side*26.6,8,z-2],[side*18.6,16,z-3]],mat,.13);
    }
    arc(g,[[-30,11,-25],[-29,17,-10],[-25,21,5],[-15,24,17],[0,25,18],[15,24,17],[25,21,5],[29,17,-10],[30,11,-25]],glass,1.6);
  }
  function museum(g,mat){
    // Gallery built like a blooming double-helix of elven fins.
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      const x=Math.sin(a)*23,z=Math.cos(a)*21-4;
      arc(g,[[x,0,z],[x*1.1,8,z*1.05],[x*.85,21,z*.85],[x*.4,31,z*.5]],stone,.85);
      arc(g,[[x,2,z],[x*1.07,9,z*1.02],[x*.83,22,z*.83]],mat,.12);
    }
    add(g,orb,glass,0,24,-3,7,7,7);
    for(let y=8;y<30;y+=7){const m=add(g,new THREE.TorusGeometry(12+y*.1,.15,8,72),mat,0,y,-3);m.rotation.x=.25;}
  }
  function arcade(g,mat){
    // Distinct faceted cantilever arcade pavilion with playable central court.
    for(const side of [-1,1])for(let i=0;i<4;i++){
      const zz=-22+i*13;
      arc(g,[[side*24,0,zz],[side*30,10,zz-2],[side*26,20,zz-3],[side*10,28,zz-6]],obsidian,.95);
      arc(g,[[side*23,1,zz],[side*29,11,zz-2],[side*25,20,zz-3]],mat,.18);
    }
    for(let i=0;i<3;i++){
      const r=9+i*5,m=add(g,new THREE.TorusGeometry(r,.28,8,72),mat,0,17+i*4,-9);
      m.rotation.y=i*.3;m.rotation.x=.8;
    }
  }
  function residences(g,mat){
    // Tree-shaped living terraces with integrated nature rather than apartments as towers.
    for(let i=0;i<7;i++){
      const a=i*2*Math.PI/7;
      const r=18+i%2*4,x=Math.cos(a)*r,z=Math.sin(a)*r-4;
      add(g,trunk,bark,x,10,z,2.5,20,2.5);
      arc(g,[[x,0,z],[x*1.1,11,z*1.1],[x*.88,24,z*.86],[x*.56,34,z*.66]],stone,1.1);
      add(g,orb,glass,x*.75,28,z*.77,8,3.8,8);
      add(g,orb,mat,x*.75,31,z*.77,4.5,1.4,4.5);
    }
    for(let i=0;i<8;i++){const a=i*Math.PI/4,r=15+i%2*8;add(g,cone,emissive[5],Math.sin(a)*r,2.6,Math.cos(a)*r-4,1.6,5.2,1.6);}
  }
  const builders=new Map([[4,academy],[5,future],[12,merch],[13,museum],[14,arcade],[15,residences]]);
  for(const [i,build] of builders){
    const loc=HEXCORE_WORLD.sites[i];
    const g=new THREE.Group();g.name='HEXCORE_PUBLIC_LANDMARK_'+i;g.position.set(loc.x,0,loc.z);root.add(g);
    pedestal(g,obsidian);
    const a=emissive[[4,5,0,3,1,5][[...builders.keys()].indexOf(i)]];
    build(g,a);portal(g,a);
    yield;
  }
  return ()=>{};
}
