import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// Dedicated streets, sky-trams, social scenes and environmental dressing.
export function createCivicLife(scene){
 const hub={x:448,z:110};const group=new THREE.Group();group.position.set(hub.x,0,hub.z);scene.add(group);
 const metal=new THREE.MeshStandardMaterial({color:0x15192b,roughness:.36,metalness:.72});
 const teal=new THREE.MeshStandardMaterial({color:0x4ad7ff,emissive:0x1d9cca,emissiveIntensity:.64,metalness:.3});
 const violet=new THREE.MeshStandardMaterial({color:0x9a60fe,emissive:0x54259c,emissiveIntensity:.65,metalness:.38});
 const glass=new THREE.MeshPhysicalMaterial({color:0x5bbbc6,transparent:true,opacity:.52,metalness:.4,roughness:.16,side:THREE.DoubleSide});
 const leaf=new THREE.MeshStandardMaterial({color:0x265e5d,emissive:0x10332b,emissiveIntensity:.3,roughness:.7});
 function box(x,y,z,w,h,d,m,parent=group){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;}
 function column(x,y,z,r,h,m,parent=group){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),m);o.position.set(x,y,z);parent.add(o);return o;}
 // True navigable public streets; signs and arcades are not tower floors.
 for (const z of [-58,42]) {box(0,.16,z,312,.15,18,metal);for(let x=-148;x<=148;x+=12)box(x,.26,z,5,.06,.13,teal);}
 for (const x of [-84,-28,28,84]) {box(x,.16,-8,13,.15,320,metal);for(let z=-156;z<=156;z+=12)box(x,.25,z,.16,.06,4,violet);}
 // Pedestrian courtyards with seating, planter beds, living trees, and lamps.
 for(let n=0;n<38;n++){
   const row=Math.floor(n/10),slot=n%10,x=-144+slot*32,z=-142+row*92;
   if(Math.abs(x)<10&&Math.abs(z)<28)continue;
   box(x,.4,z,8,.7,8,metal);
   column(x,3,z,.7,5,metal);
   const canopy=new THREE.Mesh(new THREE.IcosahedronGeometry(3.2,1),leaf);canopy.position.set(x,7,z);group.add(canopy);
   for(let k of [-1,1]){box(x+k*5,.5,z,5,.9,1.6,metal);box(x+k*5,1.4,z,5,.18,1.7,violet);}
 }
 for(let x of [-154,154])for(let z=-156;z<=156;z+=25){column(x,6,z,.4,12,metal);box(x,12,z,2,.8,3,teal);}
 // Light rail overhead circling plaza; no player collision.
 for(let x of [-148,148]){box(x,19,0,.5,.5,306,teal);for(let z=-140;z<=140;z+=34)column(x,9,z,.5,18,metal);}
 for(let z of [-148,148])box(0,19,z,296,.5,.5,teal);
 const cars=[];
 for(let k=0;k<3;k++){
   const car=new THREE.Group();group.add(car);box(0,0,0,12,3.6,5,metal,car);box(0,1.5,0,10,2,5,glass,car);box(0,-1.4,0,12,.25,5,violet,car);
   cars.push({car,t:k/3});
 }
 // Skyline art and landing court next to the actual avenue connection.
 for(let i=0;i<6;i++){const x=-145+i*55;
   const sculpture=new THREE.Mesh(new THREE.OctahedronGeometry(2.5,0),i%2?teal:violet);sculpture.position.set(x,10,-158);group.add(sculpture);
 }
 let elapsed=0;
 return function updateCivicLife(){elapsed+=.00055;
   for(let {car,t} of cars){const u=(elapsed+t)%1;
     const l=u*4;
     if(l<1){car.position.set(-148+296*l,17,-148);car.rotation.y=0;}
     else if(l<2){car.position.set(148,17,-148+296*(l-1));car.rotation.y=-Math.PI/2;}
     else if(l<3){car.position.set(148-296*(l-2),17,148);car.rotation.y=Math.PI;}
     else {car.position.set(-148,17,148-296*(l-3));car.rotation.y=Math.PI/2;}
   }
 };
}
