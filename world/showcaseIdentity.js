import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// Original architectural identities for the major visitor destinations.
// Relative sculpture coordinates leave (site.x, site.z + 29) unobstructed.
// Build one destination per generator step; no downloads or dynamic lights.
export function* createShowcaseIdentity(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_SHOWCASE_IDENTITIES';
  scene.add(root);
  const materials = {
    shell: new THREE.MeshStandardMaterial({color:0x0b1220,metalness:.8,roughness:.29,side:THREE.DoubleSide}),
    satin: new THREE.MeshStandardMaterial({color:0x202f4a,metalness:.7,roughness:.32,side:THREE.DoubleSide}),
    violet: new THREE.MeshBasicMaterial({color:0x9e77ff,side:THREE.DoubleSide}),
    cyan: new THREE.MeshBasicMaterial({color:0x78edff,side:THREE.DoubleSide}),
    jade: new THREE.MeshBasicMaterial({color:0x66f3c8,side:THREE.DoubleSide}),
    rose: new THREE.MeshBasicMaterial({color:0xeb88cc,side:THREE.DoubleSide}),
    amber: new THREE.MeshBasicMaterial({color:0xffc27b,side:THREE.DoubleSide}),
  };
  const cylGeo = new THREE.CylinderGeometry(1,1,1,10);
  const crystalGeo = new THREE.OctahedronGeometry(1,0);
  const boxGeo = new THREE.BoxGeometry(1,1,1);
  const anim = [];
  const add = (g,geo,mat,x,y,z) => {const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m;};
  function piece(g,x,y,z,w,h,d,mat=materials.shell){const m=add(g,boxGeo,mat,x,y,z);m.scale.set(w,h,d);return m;}
  function column(g,x,y,z,r,h,mat){const m=add(g,cylGeo,mat,x,y,z);m.scale.set(r,h,r);return m;}
  function gem(g,x,y,z,w,h,d,mat){const m=add(g,crystalGeo,mat,x,y,z);m.scale.set(w,h,d);return m;}
  function hoop(g,x,y,z,r,mat,tilt=0){const m=add(g,new THREE.TorusGeometry(r,.13,7,48),mat,x,y,z);m.rotation.x=tilt;return m;}
  function arc(g,points,mat,r=.25){const crv=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return add(g,new THREE.TubeGeometry(crv,32,r,6,false),mat,0,0,0);}
  function platform(g,x,z,accent){column(g,x,.42,z,10,.9,materials.shell);hoop(g,x,.94,z,9.4,accent,Math.PI/2);}
  const destinations = HEXCORE_WORLD.sites;
  for(let i=0;i<destinations.length;i++) {
    const {x,z}=destinations[i];
    const g = new THREE.Group();g.name=`SITE_${String(i+1).padStart(2,'0')}_ART_IDENTITY`;g.position.set(x,0,z);root.add(g);
    const a=[materials.violet,materials.jade,materials.amber,materials.rose,materials.cyan][i%5];
    // Art stays behind or to either side of the site, never in the door approach.
    platform(g,0,-21,a);
    for(const side of [-1,1]) {
      const px=side*30;
      gem(g,px,11,-2,2.2,9,2.2,a);
      piece(g,px,4,-2,.7,8,.7,materials.satin);
      hoop(g,px,18,-2,3.5,a,Math.PI/2);
    }
    if(i===0) { // Cyber_Arena: local-gravity orbital combat core.
      for(let k=0;k<5;k++){const r=9+k*2.1;const h=12+k*2.8;const m=hoop(g,0,h,-21,r,k%2?materials.cyan:materials.violet,k*.31);anim.push([m,.0003*(k%2?1:-1)]);}
      gem(g,0,17,-21,5,7,5,materials.violet);
    } else if(i===1) { // Where Light Dies: luminous ancient rainforest.
      for(let k=0;k<9;k++){const t=k*Math.PI*2/9,px=Math.cos(t)*13,pz=-21+Math.sin(t)*13;
        column(g,px,6,pz,.65,12,materials.shell);gem(g,px,15,pz,2.7,4.5,2.7,k%2?materials.jade:materials.cyan);
      }
      arc(g,[[-15,1,-21],[-9,20,-21],[0,29,-21],[9,20,-21],[15,1,-21]],materials.jade,.48);
    } else if(i===2) { // Untamed Horizon: sweeping racing ribbon and track gates.
      for(let k=0;k<3;k++){const y=8+k*6;
        arc(g,[[-20,y-5,-22],[-9,y+2,-26],[0,y+6,-19],[10,y+3,-15],[20,y-4,-23]],k%2?materials.cyan:materials.amber,.55);
      }
      for(const s of [-1,1])hoop(g,s*14,4,-24,4,materials.amber,0);
    } else if(i===3) { // Forgotten Ashes: sharp gothic spires, stained-light geometry.
      for(let k=-2;k<=2;k++){const h=18+ (2-Math.abs(k))*7;
        gem(g,k*9,h*.58,-23,2.8,h*.65,2.8,k%2?materials.rose:materials.satin);
        piece(g,k*9,1,-23,4,2,4,materials.shell);
      }
      arc(g,[[-18,1,-25],[-11,18,-25],[0,31,-25],[11,18,-25],[18,1,-25]],materials.rose,.4);
    } else if(i===4){ // Academy: elevated runic orrery.
      for(let k=0;k<3;k++) {const m=hoop(g,0,16,-21,8+k*4,k%2?materials.cyan:materials.violet,.4+k*.5);anim.push([m,.00027*(k%2?1:-1)]);}
      gem(g,0,16,-21,4,5,4,materials.cyan);
    } else if(i===13){ // Museum: framed sculptural gallery.
      for(let k=-2;k<=2;k++){arc(g,[[k*7-3,0,-26],[k*7-3,12,-26],[k*7,17,-26],[k*7+3,12,-26],[k*7+3,0,-26]],k%2?materials.cyan:materials.violet,.3);}
    } else if(i===14){ // Arcade: cascading energy rings.
      for(let k=0;k<6;k++){const m=hoop(g,0,9+k*3,-21,5+k*1.6,k%2?materials.cyan:materials.rose,.25*k);anim.push([m,.00027*(k%2?1:-1)]);}
    } else if(i===11) { // Hardware: open engineering kinetic sculpture.
      for(let k=0;k<5;k++){const m=hoop(g,0,13+k*4,-21,5+k*2,k%2?materials.jade:materials.cyan,.3+k*.21);anim.push([m,.0002*(k%2?1:-1)]);}
      column(g,0,10,-21,1.4,19,materials.satin);
    } else { // Other districts: coherent design, accent-specific crowns.
      for(let k=0;k<6;k++){const t=k*Math.PI/3;gem(g,Math.sin(t)*9,11+ k%2*5,-21+Math.cos(t)*9,1.4,7,1.4,k%2?materials.satin:a);}
      const m=hoop(g,0,20,-21,12,a,.28);anim.push([m,.0002]);
    }
    yield;
  }
  return () => {for(const [m,v] of anim)m.rotation.y+=v;};
}
