import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// HEXCORE 2.0 // Replacement city environment.
// The former cityBuildings, cityPlaza and plazaExtras are deliberately not created.
// Existing headquarters, tower interior and public-building interaction systems are preserved.
export function* createRemadeWorldProgressive(scene,camera){
 const root=new THREE.Group();root.name='HEXCORE_REMADERENDER_WORLD';scene.add(root);
 const palette=[0x9d5bff,0x57dffc,0xe15eff,0x637dff,0x7ce3c1];
 const dark=new THREE.MeshStandardMaterial({color:0x080d1b,metalness:.72,roughness:.28});
 const steel=new THREE.MeshStandardMaterial({color:0x1c2742,metalness:.68,roughness:.29});
 const chrome=new THREE.MeshStandardMaterial({color:0x53658a,metalness:.88,roughness:.2});
 const glass=new THREE.MeshPhysicalMaterial({color:0x20345c,metalness:.3,roughness:.12,transparent:true,opacity:.72,side:THREE.DoubleSide});
 const stone=new THREE.MeshStandardMaterial({color:0x20243c,metalness:.33,roughness:.65});
 const glow=palette.map(c=>new THREE.MeshBasicMaterial({color:c}));
 const grass=new THREE.MeshStandardMaterial({color:0x0c403a,roughness:.82});
 const leaf=new THREE.MeshStandardMaterial({color:0x28acaa,roughness:.6,emissive:0x07636b,emissiveIntensity:.38});
 const geoms={box:new THREE.BoxGeometry(1,1,1),oct:new THREE.CylinderGeometry(1,1,1,8),spire:new THREE.ConeGeometry(1,1,6),ring:new THREE.TorusGeometry(1,.055,8,48),sphere:new THREE.IcosahedronGeometry(1,1)};
 const inst=new Map(),temp=new THREE.Object3D();
 function instance(k,mat,x,y,z,w,h,d,ry=0){const key=k+':'+mat.uuid;let a=inst.get(key);if(!a){a={geometry:geoms[k],material:mat,items:[]};inst.set(key,a);}a.items.push([x,y,z,w,h,d,ry]);}
 function box(x,y,z,w,h,d,mat=steel,rot=0){instance('box',mat,x,y,z,w,h,d,rot)}
 function column(x,y,z,r,h,mat=steel){instance('oct',mat,x,y,z,r,h,r)}
 function pyramid(x,y,z,r,h,mat=steel){instance('spire',mat,x,y,z,r,h,r)}
 function ring(x,y,z,r,mat,tilt=0){const m=new THREE.Mesh(geoms.ring,mat);m.position.set(x,y,z);m.scale.setScalar(r);m.rotation.x=tilt;root.add(m);return m;}
 function panel(x,y,z,w,h,text,accent='#76def9',rot=0){const c=document.createElement('canvas');c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#070d21';ctx.fillRect(0,0,1024,192);ctx.strokeStyle=accent;ctx.lineWidth=5;ctx.strokeRect(6,5,1012,182);ctx.fillStyle='#f0f5ff';ctx.textAlign='center';ctx.textBaseline='middle';let fs=82;do{ctx.font=`700 ${fs--}px system-ui`}while(ctx.measureText(text).width>955&&fs>20);ctx.fillText(text,512,96);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=rot;root.add(m);}
 function arc(x,y,z,r,mat,start=0,end=Math.PI){const m=new THREE.Mesh(new THREE.TorusGeometry(r,.12,7,36,end-start),mat);m.position.set(x,y,z);m.rotation.z=start;root.add(m);return m;}
 // Upload nearby construction to the renderer before proceeding farther out.
 let batchCount=0;
 function flushInstances(){
   for(const item of inst.values()){
     if(!item.items.length)continue;
     const mesh=new THREE.InstancedMesh(item.geometry,item.material,item.items.length);
     mesh.frustumCulled=false;
     item.items.forEach((a,i)=>{const [x,y,z,w,h,d,rot]=a;temp.position.set(x,y,z);temp.rotation.set(0,rot,0);temp.scale.set(w,h,d);temp.updateMatrix();mesh.setMatrixAt(i,temp.matrix);});
     mesh.instanceMatrix.needsUpdate=true;
     mesh.name='CITY_STAGE_'+batchCount++;root.add(mesh);
     item.items.length=0;
   }
 }
 // Floating sky-platform network; uninterrupted pedestrian walkways link existing HQ, corporate tower and visitor district.
 function road(x,z,w,d){box(x,-.3,z,w,.55,d,dark);box(x,-.015,z,w,.045,d,stone);box(x-w/2+.2,.08,z,.16,.07,d,glow[1]);box(x+w/2-.2,.08,z,.16,.07,d,glow[0]);}
 road(0,120,118,195);road(140,110,155,17);road(224,110,130,130);road(281,110,58,20);road(448,110,326,340);
 road(-214,115,140,130);road(-108,115,90,16);road(0,255,20,280);road(0,345,150,155);
 for(const x of [337,411,485,559])road(x,110,16,335);
 for(const z of [-4,72,148,224])road(448,z,319,14);
 for(let z=35;z<=235;z+=14){box(-56,.08,z,.14,.07,4,glow[1]);box(56,.08,z,.14,.07,4,glow[2]);}
 flushInstances();yield; // nearest connection is drawn before constructing the outer architecture.
 // Main approach procession and distinct building silhouettes.
 function monument(x,z,scale=1){column(x,3*scale,z,2*scale,6*scale,chrome);pyramid(x,11*scale,z,2*scale,12*scale,glow[0]);ring(x,10*scale,z,5*scale,glow[1],.65)}
 for(let i=0;i<16;i++){const z=42+i*11;for(const sx of [-1,1]){const x=sx*53;column(x,3.4,z,.8,7,steel);column(x,7.3,z,1.5,.5,glow[i%2]);}}
 flushInstances();yield; // next frame: skyline
 // High density skyline, inset from walking zone; highly batched InstancedMesh architecture, not thousands of draw calls.
 function skyscraper(x,z,w,d,h,seed){const neon=glow[seed%5];box(x,h*.5,z,w,h,d,steel);box(x,h*.53,z,w*.83,h*.88,d*.85,glass);box(x,h+2,z,w*1.12,4,d*1.1,dark);box(x,h+4.4,z,w*.8,.55,d*.8,neon);
  for(let iy=2;iy<h-3;iy+=6){box(x,iy,z+d*.51,w*.88,.17,.12,neon);box(x,iy,z-d*.51,w*.88,.17,.12,neon);box(x+w*.51,iy,z,.12,.15,d*.9,neon);box(x-w*.51,iy,z,.12,.15,d*.9,neon);}
  for(const side of [-1,1]){box(x+side*(w*.43),h*.53,z+d*.53,.35,h*.88,.24,neon);box(x+side*(w*.43),h*.53,z-d*.53,.35,h*.88,.24,neon);}
  pyramid(x,h+12,z,w*.24,15,chrome);
 }
 for(let i=0;i<25;i++){let side=i%2?1:-1;let z=48+(i*31)%200;let x=side*(78+((i*19)%40));skyscraper(x,z,10+(i%4)*4,11+(i%3)*5,28+(i*17)%57,i);if(i%4===3)flushInstances();yield;}
 for(let i=0;i<30;i++){const side=i%2?1:-1;let x=448+side*(174+(i%3)*24);let z=-55+(i*47)%330;skyscraper(x,z,10+(i%4)*3,11+(i%5)*2,31+(i*13)%76,i+1);if(i%4===3)flushInstances();yield;}
 flushInstances();yield; // next frame: corporate tower
 // Corporate tower: asymmetric octagonal tiered dark-glass citadel, elven flying buttresses and a luminous crown.
 const tx=224,tz=110;
 for(const [height,width] of [[41,39],[88,29],[136,21],[177,13]]){
  box(tx,height/2,tz,width,height,width,steel);box(tx,height/2,tz,width*.86,height*.96,width*.86,glass);
  for(let y=9;y<height;y+=10){box(tx,y,tz+width*.51,width,.24,.24,glow[1]);box(tx,y,tz-width*.51,width,.24,.24,glow[0]);}
 }
 for(let j=0;j<8;j++){let a=j*Math.PI/4;let x=tx+Math.sin(a)*25,z=tz+Math.cos(a)*25;column(x,46,z,1.4,90,chrome);pyramid(x,103,z,2.1,24,glow[j%3]);}
 for(let j=0;j<4;j++){let r=16+j*3;ring(tx,170+j*5,tz,r,glow[j%2],.22+j*.16)}
 pyramid(tx,213,tz,8,62,chrome);column(tx,248,tz,1.2,18,glow[0]);
 panel(tx,142,tz+21,44,7,'HEXCORE', '#b67bff');panel(tx,30,tz+26,28,4,'HEXCORE TOWER','#81e4ff');
 flushInstances();yield; // next frame: public showcase outlines
 // Sixteen original visitor spaces retain their exact exterior positions / door coordinates.
 const ax=[-111,-37,37,111],az=[-114,-38,38,114];
 const names=['CYBER_ARENA HEX//BREAK','WHERE LIGHT DIES','UNTAMED HORIZON','THE FORGOTTEN ASHES','THE ACADEMY','FUTURE GAME WORLDS','ADMINISTRATION & LEGAL','CUSTOMER SUPPORT','COMMUNITY & EVENTS','BUSINESS & PARTNERSHIPS','GAME DEVELOPMENT','HEXCORE HARDWARE LAB','HEXCORE MERCHANDISE','FUTURE WORLDS MUSEUM','HEXCORE ARCADE','GAMER RESIDENCES'];
 function pavilion(x,z,i){const neon=glow[i%5],w=48,d=42,h=19+(i%4)*5;
  // Four exposed pillars, faceted double-shell, arched doorway and multiple tiers.
  box(x,h/2,z-3,w,h,d,steel);box(x,h/2+2,z-3,w*.87,h*.77,d*.87,glass);
  box(x,3,z+20,w*.92,6,2,dark);box(x,h+1,z-3,w+7,2,d+6,chrome);box(x,h+2.3,z-3,w+3,.35,d+2,neon);
  for(const side of [-1,1]){let px=x+side*24;column(px,h/2,z+17,1.8,h+4,chrome);pyramid(px,h+8,z+17,2.4,10,neon);}
  for(let level=5;level<h;level+=5){box(x,level,z+19,w*.85,.2,.3,neon);box(x,level,z-25,w*.85,.2,.3,neon);}
  for(const xo of [-17,-10,10,17])box(x+xo,h*.58,z+19.8,4,h*.59,.5,glass);
  for(let k=0;k<4;k++){const a=-Math.PI/2+k*Math.PI/3;let xx=x+(k-1.5)*7;arc(xx,12,z+21,3.7,neon,0,Math.PI)}
  // Door spans world z+~21 to z+28, preserving existing interact coordinate z+29.
  box(x,h*.5,z+22,10,h*.65,.8,dark);box(x-5,7,z+22,1.3,14,1,neon);box(x+5,7,z+22,1.3,14,1,neon);box(x,14,z+22,12,.6,1,neon);
  panel(x,h+6,z+20,43,4.5,names[i], '#'+palette[i%5].toString(16).padStart(6,'0'));
  if(i===0){for(let j=0;j<5;j++)ring(x,h+12+j*3,z-4,4+j*.75,glow[j%2],.3)}
  if(i===1){for(let j=0;j<10;j++){let a=j*6.283/10;let px=x+Math.cos(a)*19,pz=z+Math.sin(a)*17;column(px,9,pz,.5,17,grass);pyramid(px,18,pz,3,11,leaf);}}
  if(i===2){for(let k=0;k<4;k++){let xx=x-19+k*12;box(xx,4,z+23,8,.8,2,chrome);ring(xx,3,z+25,2.7,glow[1]);}}
  if(i===3){for(let k=0;k<3;k++){const xx=x-15+k*15;pyramid(xx,h+15,z-5,4,24,stone);pyramid(xx,h+18,z-5,2.3,17,glow[2]);}}
  if(i===13){for(let k=0;k<4;k++){column(x+(k-1.5)*10,17,z-3,1.6,30,chrome);ring(x,26,z-3,12,glow[0],1.1);}}
 }
 for(let i=0;i<16;i++){pavilion(448+ax[i%4],110+az[(i/4)|0],i);if(i%2===1)flushInstances();yield;}
 flushInstances();yield; // next frame: environmental detailing
 // Gamer's paradise: garden terraces and futuristic elven fountains.
 for(let i=0;i<65;i++){let px=280+(i*71)%336,pz=-54+(i*41)%327;let tooClose=ax.some(xx=>Math.abs(px-(448+xx))<29)&&az.some(zz=>Math.abs(pz-(110+zz))<31);if(tooClose)continue;
  if(i%12===0)flushInstances();yield;column(px,2.6,pz,.4,5,chrome);pyramid(px,6.8,pz,2.2,4,leaf);column(px,8.4,pz,.13,1.5,glow[i%5]);}
 for(const [x,z] of [[448,110],[448,-42],[448,260],[-210,110]]){column(x,1.5,z,11,3,dark);column(x,3,z,8,.5,glow[1]);pyramid(x,12,z,2,16,glass);ring(x,14,z,10,glow[0],.8)}
 for(let i=0;i<22;i++){let x=308+(i*53)%290,z=-46+(i*37)%302;box(x,.6,z,5,1.2,1.5,steel);box(x,1.3,z,5,.14,1.5,glow[0]);}
 flushInstances();yield; // next frame: draw call batches
 // The last remaining structures are uploaded now.
 flushInstances();
 const ambient=new THREE.HemisphereLight(0x96acff,0x151028,1.55);root.add(ambient);
 const sun=new THREE.DirectionalLight(0xaebeff,1.35);sun.position.set(-120,180,-90);root.add(sun);
 scene.background=new THREE.Color(0x070c1f);scene.fog=new THREE.FogExp2(0x070a20,.00115);
 const deco=ring(tx,206,tz,23,glow[0],.3);
 return ()=>{deco.rotation.y+=.0018};
}
