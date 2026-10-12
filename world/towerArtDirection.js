import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// HEXCORE // Stage 2 architectural dressing. No external assets or credentials.
// Scene positions match the existing, fully usable instanced rooms.
export function createTowerArtDirection(scene) {
  const dark=new THREE.MeshStandardMaterial({color:0x070d1d,metalness:.84,roughness:.24});
  const metal=new THREE.MeshStandardMaterial({color:0x253453,metalness:.9,roughness:.17});
  const glass=new THREE.MeshPhysicalMaterial({color:0x4478b1,metalness:.24,roughness:.12,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide});
  const pearl=new THREE.MeshStandardMaterial({color:0xb0c7ed,metalness:.75,roughness:.22});
  const cyan=new THREE.MeshBasicMaterial({color:0x62e8ff});
  const violet=new THREE.MeshBasicMaterial({color:0xb65aff});
  const gold=new THREE.MeshBasicMaterial({color:0xfcd69b});
  const accents=[cyan,violet,gold];
  const anim=[];
  const unitBox=new THREE.BoxGeometry(1,1,1);
  const B=(g,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(unitBox,m);o.position.set(x,y,z);o.scale.set(w,h,d);g.add(o);return o;};
  const C=(g,r1,r2,h,x,y,z,m,n=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),m);o.position.set(x,y,z);g.add(o);return o;};
  const R=(g,r,t,x,y,z,m,rx=0)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,44),m);o.position.set(x,y,z);o.rotation.x=rx;g.add(o);return o;};
  function glyph(g,txt,w,h,x,y,z,clr='#a4eaff',ry=0){
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;let q=canvas.getContext('2d');
    q.clearRect(0,0,1024,256);q.fillStyle='rgba(3,8,20,.72)';q.fillRect(0,0,1024,256);
    q.strokeStyle=clr;q.lineWidth=6;q.strokeRect(7,7,1010,242);
    q.font='bold 65px system-ui';while(q.measureText(txt).width>930&&parseInt(q.font)>22)q.font=`bold ${parseInt(q.font)-3}px system-ui`;
    q.textAlign='center';q.textBaseline='middle';q.fillStyle='#ecf6ff';q.shadowColor=clr;q.shadowBlur=20;q.fillText(txt,512,127);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true,side:THREE.DoubleSide}));o.position.set(x,y,z);o.rotation.y=ry;g.add(o);
  }
  function planter(g,x,z){const box=B(g,3,1.5,3,x,.8,z,metal);B(g,3.1,.1,3.1,x,1.62,z,cyan);const trunk=C(g,.18,.32,3,x,3.1,z,pearl,7);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leaf=new THREE.Mesh(new THREE.ConeGeometry(1.05,3.1,5),new THREE.MeshStandardMaterial({color:0x214b61,emissive:0x0e8c8a,emissiveIntensity:.35,metalness:.28}));leaf.position.set(x+Math.cos(a)*.55,5,z+Math.sin(a)*.55);leaf.rotation.z=Math.cos(a)*.25;g.add(leaf);}}
  function kiosk(g,x,z,m){B(g,5,1.5,2.8,x,.8,z,metal);B(g,4.4,.1,2.9,x,1.61,z,m);B(g,4.1,2,.12,x,3.3,z-.6,glass);B(g,4,.1,.2,x,2.2,z-.52,m);}
  // Central tower lobby: ceremonial entry, giant kinetic atrium and interactive stations.
  const L=new THREE.Group();L.position.set(800,0,800);scene.add(L);
  for(let x of [-35.5,35.5])for(let z=-27;z<=27;z+=9){B(L,.65,16,.75,x,9,z,metal);B(L,.18,16,.2,x,9,z,cyan);}
  for(let z of [-32.5,32.5])for(let x=-29;x<=29;x+=9){B(L,.7,16,.7,x,9,z,metal);B(L,.19,16,.2,x,9,z,violet);}
  for(let x=-28;x<=28;x+=7)B(L,1.8,.18,65,x,18.8,0,metal);
  for(let z=-28;z<=28;z+=7)B(L,66,.18,1.7,0,18.8,z,metal);
  for(let x of [-26,26])for(let z of [-25,25])planter(L,x,z);
  for(let x of [-16,16])for(let z of [-24,24]){C(L,1.2,1.5,2,x,1,z,dark,9);R(L,1.2,.12,x,2.1,z,cyan,Math.PI/2);}
  C(L,6.2,7.2,.6,0,.31,5,metal,16);C(L,5.7,6.5,.16,0,.7,5,glass,16);
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(3.2,1),new THREE.MeshStandardMaterial({color:0x4a99cb,metalness:.8,roughness:.09,emissive:0x1753a0,emissiveIntensity:.65,flatShading:true}));orb.position.set(0,7,5);L.add(orb);anim.push((t,dt)=>{orb.rotation.y+=dt*.2;orb.rotation.z+=dt*.08;orb.position.y=7+Math.sin(t*.8)*.6;});
  for(let i=0;i<3;i++){let ring=R(L,5+i*.8,.13,0,7,5,i%2?cyan:violet,.3+i*.6);anim.push((t,dt)=>ring.rotation.y+=dt*(i%2?-.2:.15));}
  glyph(L,'WELCOME TO HEXCORE CITY',35,3.1,0,15,-34.4);
  glyph(L,'YOUR WORLD. YOUR GAMES.',23,2,0,12,-34.25,'#cf9aff');
  glyph(L,'INFORMATION & DISCOVERY',15,2,-22,7,-16,'#83f0ff');
  for(let x of [-22,22])kiosk(L,x,-7,x<0?cyan:violet);
  // Overhead floating navigation arrows and directional walkway lamps
  for(let z=-16;z<=25;z+=7){B(L,8,.04,.08,0,.11,z,violet);for(let x of [-5,5])C(L,.15,.15,.15,x,.2,z,cyan,8);}
  // Administration lobby floor and department offices: architecture and furniture.
  function room(cx,cz,index){const G=new THREE.Group();G.position.set(cx,0,cz);scene.add(G);const accent=accents[index%3];
    for(let x of [-42.7,42.7])for(let z=-33;z<=33;z+=11){B(G,1,18,1,x,9,z,metal);B(G,.13,17,.18,x,9,z,accent);}
    for(let z of [-40,40])for(let x=-32;x<=32;x+=10){B(G,1,18,1,x,9,z,metal);B(G,.13,17,.18,x,9,z,accent);}
    for(let x=-36;x<=36;x+=12){B(G,2,.2,76,x,18,0,pearl);B(G,.22,.07,76,x,17.84,0,accent);}
    for(let z=-36;z<=36;z+=12)B(G,83,.17,1.2,0,18,z,metal);
    B(G,38,.16,13,0,.12,-20,metal);
    for(let x of [-30,30])for(let z of [-30,27])planter(G,x,z);
    for(let x of [-21,21]){B(G,13,1.1,4,x,.55,19,dark);B(G,12,.1,4,x,1.17,19,accent);B(G,10,2.9,.2,x,3.2,17,glass);}
    for(let x of [-30,30])for(let z of [-9,9]){B(G,6,.7,3,x,.65,z,metal);B(G,5.7,.08,2.9,x,1.06,z,pearl);B(G,2.9,2,.2,x,2.15,z-.7,glass);}
    for(let x of [-32,32])for(let z=-26;z<=26;z+=13){C(G,.55,.62,4.5,x,2.3,z,dark,8);C(G,.28,.3,.1,x,4.6,z,accent,8);}
    // Shared hemispheric lighting replaces 20 per-room dynamic point lights.
    G.add(new THREE.HemisphereLight(0xb1c4ff,0x181027,0.38));
    const subjects=['SUPPORT // YOUR QUESTIONS MATTER','COMMUNITY // THE CITY IS ALIVE','BUSINESS // BUILD WITH HEXCORE','DEVELOPMENT // NEW WORLDS AWAIT','HARDWARE // THE NEXT FRONTIER'];
    glyph(G,subjects[index],46,3,0,14,-41.65,index%2?'#b68bff':'#81e9ff');
  }
  for(let i=0;i<5;i++)room(1150+i*125,1150,i);
  // Admin vestibule (does not touch the existing admin room and its NPC logic).
  const A=new THREE.Group();A.position.set(900,0,900);scene.add(A);
  for(let x of [-21,21])for(let z of [-21,21]){C(A,.6,.85,12,x,6,z,metal,8);C(A,.13,.13,11.5,x,6,z,violet,8);}
  for(let z=-18;z<=18;z+=9){B(A,44,.1,.14,0,.13,z,cyan);B(A,44,.12,.5,0,12.5,z,metal);}
  glyph(A,'ADMINISTRATION & LEGAL',32,3.2,0,11,-24.5,'#d6a9ff');
  // High-tech tower exterior entrance island (no collision changes).
  const T=new THREE.Group();T.position.set(0,0,300);scene.add(T);
  for(let x of [-23,23])for(let z of [-22,22]){C(T,.5,.85,12,x,6,z,metal,8);R(T,1,.18,x,12,z,violet,Math.PI/2);}
  for(let y=10;y<104;y+=12){R(T,23-(y/104)*11,.16,0,y,0,y%24===10?cyan:violet,Math.PI/2);}
  for(let i=0;i<16;i++){const a=i*Math.PI/8;const h=13+i%4*2;C(T,.28,.5,h,Math.cos(a)*27,h/2,Math.sin(a)*27,metal,7);C(T,.4,.4,.3,Math.cos(a)*27,h+.1,Math.sin(a)*27,i%2?cyan:violet,8);}
  glyph(T,'HEXCORE GAMING // ENTER THE FUTURE',30,3.5,-25,12,0,'#a9dfff',-Math.PI/2);
  let time=0;return ()=>{time+=.016;for(const f of anim)f(time,.016);};
}
