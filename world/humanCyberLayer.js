import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// Human cultural/technical installations. The older elven architecture and
// living environment remain structurally independent of these additions.
export function* createHumanCyberLayer(scene) {
 const root=new THREE.Group();root.name='HUMAN_ADDED_CYBERPUNK_LAYER';scene.add(root);
 const neon=[0x82ebff,0xb58aff,0xec81d9,0x7cf4d5];
 const frame=new THREE.MeshStandardMaterial({color:0x141a29,metalness:.75,roughness:.3});
 const displayMat=neon.map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.62,depthWrite:false,side:THREE.DoubleSide}));
 const trims=neon.map(c=>new THREE.MeshBasicMaterial({color:c}));
 const geom={box:new THREE.BoxGeometry(1,1,1),ball:new THREE.SphereGeometry(1,10,8),ring:new THREE.TorusGeometry(1,.025,6,32)};
 const animated=[], signs=new Map();
 const mesh=(g,geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o;};
 function sign(g,words,x,y,z,w,h,tint='#8deaff',rotate=0){
  let tx=signs.get(words+tint);
  if(!tx){const cv=document.createElement('canvas');cv.width=768;cv.height=192;const p=cv.getContext('2d');
   p.fillStyle='rgba(5,11,21,.82)';p.fillRect(0,0,768,192);p.strokeStyle=tint;p.lineWidth=7;p.strokeRect(7,7,754,178);
   p.textAlign='center';p.textBaseline='middle';p.fillStyle='#ebf8ff';let fs=62;do{p.font=`700 ${fs--}px system-ui`}while(p.measureText(words).width>716&&fs>16);p.fillText(words,384,96);
   tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;signs.set(words+tint,tx);
  }
  const board=mesh(g,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:THREE.DoubleSide}),x,y,z);board.rotation.y=rotate;return board;
 }
 function holoFigure(g,x,y,z,scale,idx){
  const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(scale);g.add(p);
  const m=displayMat[idx%4];
  mesh(p,geom.ball,m,0,5.15,0,.55,.74,.45);
  mesh(p,geom.box,m,0,3.6,0,.86,2.05,.38);
  for(let side of [-1,1]){
   const arm=mesh(p,geom.box,m,side*.73,3.7,0,.24,1.8,.25);arm.rotation.z=side*.25;
   const leg=mesh(p,geom.box,m,side*.26,1.35,0,.29,2.7,.32);leg.rotation.z=side*.07;
  }
  let halo=mesh(p,geom.ring,trims[idx%4],0,5.2,0,1.02,1.02,1.02);halo.rotation.y=.5;
  animated.push((t)=>{p.rotation.y=Math.sin(t*.42+idx)*.26; p.position.y=y+Math.sin(t*.7+idx)*.17;halo.rotation.z=t*.13;});
 }
 // Independent monumental but sparse electronic installations near the tower.
 const tower=HEXCORE_WORLD.tower;
 const plaza=new THREE.Group();plaza.name='CENTRAL_HOLOGRAPHIC_FORUM';plaza.position.set(tower.x,0,tower.z);root.add(plaza);
 for(let side of [-1,1]){
  const x=side*95,z=-24;
  mesh(plaza,geom.box,frame,x,5,z,15,10,1.2);
  mesh(plaza,geom.box,displayMat[side<0?1:0],x,5,z+0.72,13.2,8.4,.06);
  sign(plaza,side<0?'EXPLORE HEXCORE':'WELCOME VISITORS',x,10.7,z+1,21,2.6);
  holoFigure(plaza,x,9,z+2.0,2.15,side<0?1:0);
  for(let j=0;j<3;j++)mesh(plaza,geom.box,trims[j%4],x,1+j*2,z+1.2,15-j*.8,.055,.07);
 }
 yield;
 // The installations are smaller than the natural architectural monuments.
 // They deliberately stand beside forecourts, not across doors at z+29.
 const labels=['ARENA LIVE','EXPEDITION','OPEN ROAD','STORY WORLDS','DISCOVER','NEW WORLDS','ADMIN','SUPPORT','COMMUNITY','PARTNERS','DEVELOPMENT','HARDWARE','MERCH','MUSEUM','ARCADE','RESIDENTIAL'];
 for(let i=0;i<HEXCORE_WORLD.sites.length;i++){
  const {x,z}=HEXCORE_WORLD.sites[i];const g=new THREE.Group();g.name='HUMAN_SITE_INSTALLATION_'+i;g.position.set(x,0,z);root.add(g);
  const side=i%2?1:-1;
  mesh(g,geom.box,frame,side*38,7,2,9,12,.75);
  mesh(g,geom.box,displayMat[i%4],side*38,7,2.5,7.7,10,.055);
  sign(g,labels[i],side*38,11,2.7,8,1.65,`#${neon[i%4].toString(16).padStart(6,'0')}`);
  for(let a=0;a<3;a++){const bar=mesh(g,geom.box,trims[(a+i)%4],side*(33+a*2.7),3.2,2.7,.11,3.8,.12);}
  if([0,8,13,14].includes(i))holoFigure(g,side*38,13,2,1.1,i);
  yield;
 }
 // Holographic performance installation in an entertainment area, positioned
 // away from destination doorway and the central ceremonial route.
 const stage=new THREE.Group();stage.name='AI_PERFORMANCE_GARDEN';stage.position.set(tower.x+150,0,tower.z-120);root.add(stage);
 mesh(stage,new THREE.CylinderGeometry(13,15,1.8,24),frame,0,1,0);
 for(let j=0;j<3;j++){const r=mesh(stage,geom.ring,trims[j%4],0,6+j*3,0,8+j*1.5,8+j*1.5,1);r.rotation.x=Math.PI/2;animated.push(t=>r.rotation.z=t*(j%2?.08:-.08));}
 holoFigure(stage,0,2,0,2.4,2);
 sign(stage,'HEXCORE // AI PERFORMANCE',0,16,0,28,3,'#d68fff');
 yield;
 let t=0;return ()=>{t+=.016;for(const fn of animated)fn(t);};
}
