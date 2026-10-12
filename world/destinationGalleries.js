import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Visitor-only exhibit interiors: install each gallery on FIRST ENTRY, not during boot.
// Gallery elements share a small set of shapes and materials. No additional real-time lights.
const box = new THREE.BoxGeometry(1,1,1);
const orb = new THREE.IcosahedronGeometry(1,1);
const pillar = new THREE.CylinderGeometry(1,1,1,10);
const cone = new THREE.ConeGeometry(1,1,8);
const torus = new THREE.TorusGeometry(1,.045,7,48);
const black = new THREE.MeshStandardMaterial({color:0x0a1424,metalness:.75,roughness:.26});
const silvery = new THREE.MeshStandardMaterial({color:0x445574,metalness:.7,roughness:.26});
const violet = new THREE.MeshBasicMaterial({color:0x9c6aff});
const cyan = new THREE.MeshBasicMaterial({color:0x65dbff});
const mint = new THREE.MeshBasicMaterial({color:0x63ffd3});
const warm = new THREE.MeshBasicMaterial({color:0xffba80});
const rose = new THREE.MeshBasicMaterial({color:0xf788ed});
const lights=[violet,cyan,mint,warm,rose];
function shape(g,geometry,material,x,y,z,sx,sy,sz){
 const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);g.add(m);return m;
}
function slab(g,x,y,z,sx,sy,sz,mat=black){return shape(g,box,mat,x,y,z,sx,sy,sz);}
function ring(g,x,y,z,r,material=cyan,tilt=0){const m=shape(g,torus,material,x,y,z,r,r,r);m.rotation.x=tilt;return m;}
function beacon(g,x,z,mat=violet){slab(g,x,1,z,5,2,5);slab(g,x,2.1,z,5.3,.14,5.3,mat);shape(g,orb,mat,x,5,z,1.6,2.5,1.6);}
function forest(g){for(let i=0;i<12;i++){
 const x=-29+(i%6)*11,z=-12+Math.floor(i/6)*23;
 shape(g,pillar,silvery,x,4,z,.35,8,.35);
 shape(g,cone,i%3?mint:cyan,x,10,z,2.5,8,2.5);
 ring(g,x,6,z,2.4,mint,Math.PI/2);
 }}
function arena(g,animated){
 for(let n=0;n<5;n++){const r=ring(g,-2,9,-1,5+n*.8,n%2?cyan:violet,n*.3);animated.push(r);}
 for(let i=0;i<6;i++) {const a=i*Math.PI/3;beacon(g,Math.cos(a)*23,Math.sin(a)*17,i%2?cyan:violet);}
 slab(g,0,0.3,0,29,.5,25);
 for(const x of [-12,12]) {slab(g,x,4,-2,.3,8,23,cyan);slab(g,x,8,-2,2,.3,23,violet);}
}
function racing(g,animated){
 const track=new THREE.Group();g.add(track);
 for(let i=0;i<24;i++){const a=i*Math.PI/12;const x=Math.cos(a)*23,z=Math.sin(a)*14;
  const seg=slab(track,x,1.1,z,5,.35,6,i%3?black:cyan);seg.rotation.y=-a;}
 for(let i=0;i<5;i++){const x=-21+i*11;shape(g,pillar,black,x,3,-24,.5,6,.5);ring(g,x,7,-24,3,warm,.6);}
 animated.push(ring(g,0,12,0,6,warm,.6));
}
function gothic(g){for(let i=0;i<7;i++){
 const x=-30+i*10;
 shape(g,pillar,black,x,9,-25,1.1,18,1.1);
 shape(g,cone,silvery,x,21,-25,2.5,12,2.5);
 ring(g,x,13,-23,2.5,rose,.1);
 }slab(g,0,.5,0,20,1,19);}
function hardware(g,animated){for(let i=0;i<5;i++){
 const x=-26+i*13;slab(g,x,2,-12,9,3,6);
 slab(g,x,5,-12,8,.3,6,cyan);
 const r=ring(g,x,9,-12,3.5,i%2?violet:cyan,.25);animated.push(r);
 } }
function arcade(g,animated){for(let i=0;i<6;i++){
 const x=-29+i*11;slab(g,x,4,-11,7,7,5);
 slab(g,x,5,-8.4,5,3,.25,i%2?cyan:violet);
 const r=ring(g,x,11,-11,2.3,i%2?rose:cyan,.4);animated.push(r);
 }}
function museum(g,animated){for(let i=0;i<5;i++){
 const x=-28+i*14;
 slab(g,x,.7,-10,9,1.4,9);
 const m=shape(g,orb,lights[i],x,8,-10,3,5,3);animated.push(m);
 ring(g,x,8,-10,5,cyan,.4);
 }}
function central(g,animated){for(let i=0;i<3;i++){
 const r=ring(g,0,7+i*3,-2,6+i*2,lights[i],.6+i*.22);animated.push(r);
 }for(const x of [-26,26])for(const z of [-23,17])beacon(g,x,z,mint);}
export function installDestinationGallery(site, room) {
 const gallery=new THREE.Group();gallery.name='HEXCORE_'+site.id.toUpperCase()+'_GALLERY';room.add(gallery);
 const animated=[];
 switch(site.id){
 case 'cyber':arena(gallery,animated);break;
 case 'survival':forest(gallery);break;
 case 'racing':racing(gallery,animated);break;
 case 'thief':gothic(gallery);break;
 case 'hardware':hardware(gallery,animated);break;
 case 'arcade':arcade(gallery,animated);break;
 case 'gallery':museum(gallery,animated);break;
 case 'residential':forest(gallery);break;
 default:central(gallery,animated);break;
 }
 let elapsed=0;
 return (dt=0.016)=>{
  elapsed+=dt;
  for(let i=0;i<animated.length;i++) {
   animated[i].rotation.y+=dt*(i%2?-.09:.13);
  }
 };
}
