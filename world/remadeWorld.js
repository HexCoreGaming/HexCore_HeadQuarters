import { createAssetWorld } from './assetWorld.js';


import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD, HEXCORE_EXTERIOR_SITES } from './worldLayout.js';
import { createVisualAtmosphere } from './visualAtmosphere.js';
import { createDigitalLandmarks } from './digitalLandmarks.js';
import { createShowcaseIdentity } from './showcaseIdentity.js';
import { createLivingWorld } from './livingWorld.js';
import { createElvenArchitecture } from './elvenArchitecture.js';
import { createHumanCyberLayer } from './humanCyberLayer.js';
import { createSculptedArchitecture } from './sculptedArchitecture.js';
import { createBioluminescentSanctuaries } from './bioluminescentSanctuaries.js';

// HEXCORE CITY / ORIGINAL DIGITAL WORLD (not the old city-grid geometry).
// Single coordinate contract: tower (0,300), headquarters (0,0), site doors site.z+29.
// Progressive: a stage per landmark, while the welcome loader owns visibility.
export function* createRemadeWorldProgressive(scene,camera) {
 const root=new THREE.Group();root.name='HEXCORE_ORIGINAL_DIGITAL_CIVILIZATION';scene.add(root);
 const C={void:0x050611,night:0x090d19,basalt:0x111626,metal:0x1a2339,edge:0x313d59,
   violet:0x9c6dff,cyan:0x74edff,blue:0x568dff,pink:0xf076ed,teal:0x67efdb,gold:0xffca8f};
 const body=new THREE.MeshStandardMaterial({color:C.night,metalness:.79,roughness:.24});
 const outer=new THREE.MeshStandardMaterial({color:C.basalt,metalness:.77,roughness:.25});
 const accentMetal=new THREE.MeshStandardMaterial({color:C.edge,metalness:.75,roughness:.25});
 const glass=new THREE.MeshStandardMaterial({color:0x173459,emissive:0x101b3c,emissiveIntensity:.2,metalness:.55,roughness:.24,side:THREE.DoubleSide});
 const darkFloor=new THREE.MeshStandardMaterial({color:0x101526,metalness:.78,roughness:.28});
 const glows=[C.violet,C.cyan,C.pink,C.blue,C.teal,C.gold].map(color=>new THREE.MeshStandardMaterial({color:0x101424,emissive:color,emissiveIntensity:1.35,metalness:.5,roughness:.25}));
 const commonBox=new THREE.BoxGeometry(1,1,1), commonColumn=new THREE.CylinderGeometry(1,1,1,8);
 const signs=new Map(), animated=[];
 const box=(g,x,y,z,w,h,d,m=body)=>{const o=new THREE.Mesh(commonBox,m);o.position.set(x,y,z);o.scale.set(w,h,d);g.add(o);return o;};
 const cyl=(g,x,y,z,r,h,m=outer,sides=8)=>{const o=new THREE.Mesh(sides===8?commonColumn:new THREE.CylinderGeometry(1,1,1,sides),m);o.position.set(x,y,z);o.scale.set(r,h,r);g.add(o);return o;};
 const torus=(g,x,y,z,r,t,m,rotX=0,rotY=0)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,7,64),m);o.position.set(x,y,z);o.rotation.set(rotX,rotY,0);g.add(o);return o;};
 function sign(g,t,x,y,z,w=30,h=4,color='#9eefff',ry=0){
   let texture=signs.get(t+color);
   if(!texture){const c=document.createElement('canvas');c.width=1024;c.height=196;const p=c.getContext('2d');
    p.fillStyle='rgba(5,7,21,.88)';p.fillRect(0,0,1024,196);p.strokeStyle=color;p.lineWidth=5;p.strokeRect(5,5,1014,186);
    p.fillStyle='#f1f5ff';p.textAlign='center';p.textBaseline='middle';let f=77;do{p.font=`700 ${f--}px system-ui`;}while(p.measureText(t).width>951 && f>18);p.fillText(t,512,100);
    texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;signs.set(t+color,texture);
   }
   const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,transparent:true,depthWrite:false}));o.position.set(x,y,z);o.rotation.y=ry;g.add(o);return o;
 }
 // Walkable ground is exactly y=0, consistent with player movement.
 function circularPlate(g,x,z,r){
   const disk=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1.25,64),darkFloor);disk.position.set(x,-.7,z);g.add(disk);
   const border=torus(g,x,.07,z,r-.5,.19,glows[1],-Math.PI/2);
   torus(g,x,.08,z,r-7,.09,glows[0],-Math.PI/2);
   return border;
 }
 function ribbon(g,pts,width=12,mat=darkFloor){
   const curve=new THREE.CatmullRomCurve3(pts.map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal');
   const count=Math.max(12,pts.length*16),verts=[],uvs=[],ids=[],left=[],right=[];
   for(let i=0;i<=count;i++){
    const t=i/count,p=curve.getPoint(t),d=curve.getTangent(t);let nx=-d.z,nz=d.x;
    const len=Math.hypot(nx,nz)||1;nx/=len;nz/=len;
    verts.push(p.x+nx*width/2,.06,p.z+nz*width/2,p.x-nx*width/2,.06,p.z-nz*width/2);
    uvs.push(0,t*6,1,t*6);left.push(new THREE.Vector3(p.x+nx*(width/2-.55),.14,p.z+nz*(width/2-.55)));
    right.push(new THREE.Vector3(p.x-nx*(width/2-.55),.14,p.z-nz*(width/2-.55)));
    if(i<count){let j=i*2;ids.push(j,j+2,j+1,j+1,j+2,j+3);}
   }
   const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geom.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geom.setIndex(ids);geom.computeVertexNormals();
   const path=new THREE.Mesh(geom,mat);path.material.side=THREE.DoubleSide;g.add(path);
   for(const [line,m] of [[left,glows[1]],[right,glows[0]]]){
    let geometry=new THREE.BufferGeometry().setFromPoints(line);
    const strip=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:m.emissive,transparent:true,opacity:.85}));g.add(strip);
   }
 }
 function arch(g,x,z,r,h,material){
   // Distinctive pointed elven digital-arch silhouette with no box towers.
   const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(x-r,0,z),new THREE.Vector3(x-r*.82,h*.57,z),
    new THREE.Vector3(x-r*.34,h*.92,z),new THREE.Vector3(x,h*1.1,z),
    new THREE.Vector3(x+r*.34,h*.92,z),new THREE.Vector3(x+r*.82,h*.57,z),
    new THREE.Vector3(x+r,0,z)
   ]);
   g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,36,.28,6,false),material));
 }
 function petal(g,x,z,r,baseH,mat,ry=0){
   const o=new THREE.Mesh(new THREE.ConeGeometry(r,baseH,5),mat);o.position.set(x,baseH/2,z);o.rotation.y=ry;g.add(o);return o;
 }
 // Ambient digital universe, not an ordinary earthlike city skyline.
 scene.background=new THREE.Color(C.void);scene.fog=new THREE.FogExp2(0x080b19,.00088);
 root.add(new THREE.HemisphereLight(0xb6c6ff,0x171124,1.85));
 const sun=new THREE.DirectionalLight(0xb6caff,1.2);sun.position.set(-140,240,-130);root.add(sun);
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1040,32,16),new THREE.MeshBasicMaterial({color:0x050715,side:THREE.BackSide}));root.add(sky);
 const starPos=[];for(let i=0;i<1150;i++){const a=i*2.39996,p=0.15+((i*0.618033)%1)*1.12,r=790;starPos.push(Math.cos(a)*Math.sin(p)*r,Math.cos(p)*r+180,Math.sin(a)*Math.sin(p)*r+300);}
 const stars=new THREE.BufferGeometry();stars.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));root.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0xd3dcff,size:2.6,sizeAttenuation:true})));
 // A single continuous ceremonial route from the old hub exit to tower foreground.
 const first=new THREE.Group();first.name='01_HUB_TO_HEXCORE_CENTRAL_AXIS';root.add(first);
 ribbon(first,[[0,28],[0,80],[-18,128],[0,181],[0,232],[0,268]],24);
 arch(first,0,68,18,37,glows[0]);arch(first,0,120,23,45,glows[1]);arch(first,0,180,27,49,glows[3]);
 sign(first,'HEXCORE DIGITAL WORLD',0,17,86,44,5,'#a2ddff');
 // Interlaced floating causeways; each site path ends at its usable doorway.
 const hub={x:0,z:300};
 circularPlate(first,hub.x,hub.z,87);
 for(let i=0;i<12;i++){
   const a=i*Math.PI/6,x=hub.x+Math.sin(a)*82,z=hub.z+Math.cos(a)*82;
   const p=petal(first,x,z,2.9,11,i%2?glows[0]:glows[1],a);
   p.scale.set(1,.85,1);
 }
 yield;
 // Tower is THE center. One coherent building, not layered conventional skyscrapers.
 const T=new THREE.Group();T.name='02_HEXCORE_TOWER_CENTER_OF_WORLD';T.position.set(0,0,300);root.add(T);
 circularPlate(T,0,0,48);
 // A single continuous elven-built shell replaces the former stacked cylinder tower.
 // Curvature and fluting are part of its physical profile, not decorative add-ons.
 const levels=64, facets=48, vertices=[],uvs=[],faces=[];
 const section=[[0,38],[12,42],[34,39],[62,32],[96,29],[136,23],[180,19],[221,13],[263,7],[291,2]];
 function radiusAt(y){for(let k=0;k<section.length-1;k++){const a=section[k],b=section[k+1];if(y<=b[0]){const t=(y-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*(t*t*(3-2*t));}}return 2;}
 for(let j=0;j<=levels;j++){const y=j/levels*291,r=radiusAt(y);
  for(let k=0;k<=facets;k++){const a=k/facets*Math.PI*2;
   const floral=1+.055*Math.cos(a*8)+.018*Math.sin(a*16+y*.029);
   vertices.push(Math.sin(a)*r*floral,y,Math.cos(a)*r*floral);
   uvs.push(k/facets,j/levels);
  }
 }
 for(let j=0;j<levels;j++)for(let k=0;k<facets;k++){let i=j*(facets+1)+k;faces.push(i,i+1,i+facets+1,i+1,i+facets+2,i+facets+1);}
 const hullGeo=new THREE.BufferGeometry();hullGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));hullGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));hullGeo.setIndex(faces);hullGeo.computeVertexNormals();
 const towerSkin=new THREE.Mesh(hullGeo,new THREE.MeshPhysicalMaterial({color:0x101b2b,metalness:.66,roughness:.24,clearcoat:.58,side:THREE.DoubleSide}));T.add(towerSkin);
 // Sparse integrated light contours: no ring stack hiding the silhouette.
 for(const y of [24,85,146,207,259]){const r=radiusAt(y);torus(T,0,y,0,r*1.035,.13,glows[y%2?0:1],-Math.PI/2);}
 // Eight tapering cathedral fins, a digital crown and curving luminous tracery.
 for(let i=0;i<8;i++){
   const a=i*Math.PI/4,r=33,x=Math.sin(a)*r,z=Math.cos(a)*r;
   const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,0,z),new THREE.Vector3(x*.98,40,z*.98),new THREE.Vector3(x*.64,116,z*.64),new THREE.Vector3(x*.28,231,z*.28),new THREE.Vector3(0,294,0)]);
   T.add(new THREE.Mesh(new THREE.TubeGeometry(curve,48,.55,7,false),i%2?glows[1]:glows[0]));
   petal(T,x,z,4.2,50,accentMetal,a);
 }
 const crown=torus(T,0,265,0,19,.32,glows[2],Math.PI/2);animated.push([crown,.00038]);
 const crown2=torus(T,0,251,0,25,.24,glows[1],Math.PI/2,.5);animated.push([crown2,-.00028]);
 cyl(T,0,310,0,1.1,37,glows[1]);
 sign(T,'HEXCORE',0,126,30,42,7,'#d0a7ff');
 // Actual interactive entrance remains near (0,268).
 arch(T,0,-33,13,19,glows[1]);
 box(T,0,6,-33,15,12,1.4,body);
 sign(T,'ENTER THE TOWER',0,13.5,-34,24,3,'#82edff');
 // Modelled tower from the single world asset loader replaces this legacy shell.
 T.visible=false;
 yield;
 // Create site forecourts and paths in user-facing order. All 16 site coordinates are authoritative.
 const labels=['CYBER_ARENA HEX//BREAK','WHERE LIGHT DIES','UNTAMED HORIZON','THE FORGOTTEN ASHES','THE ACADEMY','FUTURE WORLDS','ADMINISTRATION & LEGAL','CUSTOMER SUPPORT','COMMUNITY & EVENTS','BUSINESS & PARTNERSHIPS','GAME DEVELOPMENT','HEXCORE HARDWARE','HEXCORE MERCHANDISE','FUTURE WORLDS MUSEUM','HEXCORE ARCADE','GAMER RESIDENCES'];
 function buildSanctuary(index){
  const {x,z}=HEXCORE_WORLD.sites[index],g=new THREE.Group();g.name='LANDMARK_'+(index+1)+'_'+labels[index].replaceAll(' ','_');root.add(g);
  const mat=glows[index%6],sx=Math.sign(x)||1;
  // Routes curve outward from the central circular plaza; they are not streets or grids.
  const startR=76,rad=Math.hypot(x,z-300),dirx=x/rad,dirz=(z-300)/rad;
  const mid={x:x*.7,z:300+(z-300)*.7};
  ribbon(g,[[dirx*startR,300+dirz*startR],[mid.x,mid.z],[x,z+45],[x,z+29]],13);
  circularPlate(g,x,z,33);
  // The building facade is authored by sculptedShells, not a second
  // intersecting collection of blocky landmark geometry.
  // Keep forecourt and readable destination sign as independent navigation elements.
  sign(g,labels[index],x,34,z+23,Math.max(27,labels[index].length*.9),3.5,'#9feaff');
  // Entrance sign is visually close; all original site interaction/room teleports still map exactly.
 }
 for(const i of HEXCORE_EXTERIOR_SITES){buildSanctuary(i);yield;}
 // Outer rim is a collection of elegant digital monoliths and raised waveforms,
 // not boxy, office-style skyscrapers. Kept beyond visitor attractions.
 const far=new THREE.Group();far.name='OUTER_DIGITAL_HORIZON';root.add(far);
 for(let i=0;i<30;i++){
   const a=i*2*Math.PI/30,r=550+(i%3)*35,x=Math.sin(a)*r,z=300+Math.cos(a)*r;
   const h=40+(i*13)%80;
   const o=new THREE.Mesh(new THREE.CylinderGeometry(1.8,8,h,5),i%3?outer:accentMetal);o.position.set(x,h/2-1,z);o.rotation.y=a;far.add(o);
   torus(far,x,h+3,z,5.5,.12,i%2?glows[0]:glows[1],Math.PI/2);
 }
 yield;
 yield* createLivingWorld(scene);
 const updateArchitecture = null; // retired overlapping old ornamental arches
 yield* createVisualAtmosphere(scene);
 const updateLandmarks = null; // old duplicate landmark outlines retired
 const updateShowcases = null; // old duplicate facade sculptures retired
 const updateCyber = yield* createHumanCyberLayer(scene);
 const updateSculpted = null; // old extra scaffold retired
 const updateSanctuaries = yield* createBioluminescentSanctuaries(scene);
 const updateAssets = yield* createAssetWorld(scene);
 // Static scene plus a limited number of gentle animated monumental rings.
 return ()=>{for(const [mesh,speed] of animated){mesh.rotation.y+=speed;}if(typeof updateArchitecture==='function')updateArchitecture();if(typeof updateLandmarks==='function')updateLandmarks();if(typeof updateShowcases==='function')updateShowcases();if(typeof updateCyber==='function')updateCyber();if(typeof updateSculpted==='function')updateSculpted();if(typeof updateSanctuaries==='function')updateSanctuaries();if(typeof updateShells==='function')updateShells();};
}
