import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD } from './worldLayout.js';

// HEXCORE // PUBLIC WEBSITE CITY. All copy is informational; no fictitious live services.
// Reusable independent buildings, visitor navigation, featured games, support and hardware.
export function createPublicCity(scene) {
  const HUB={x:0,z:300}; // Tower is the heart of HexCore City.
  const themes={violet:0x9b62ff,cyan:0x64deff,gold:0xffcd83,pink:0xff6ec8,green:0x83edb8};
  const sites=[
    {id:'cyber',title:'CYBER_ARENA HEX//BREAK',tag:'FEATURED GAME',theme:'violet',subject:'Skill-based arena FPS',desc:'An extreme movement arena shooter where every surface is walkable. Local gravity, skill-based combat, movement gadgets, and HEX//BREAK objective play define the experience.',facts:['Offline demo in development','Gravity-shifting arena maps','HEX//BREAK and Team Deathmatch','Human and elf character customization'],staff:'Arena Guide'},
    {id:'survival',title:'WHERE LIGHT DIES',tag:'FEATURED GAME',theme:'green',subject:'Survival / wilderness',desc:'A co-op wilderness survival project set in an Amazon-inspired environment. Realistic threats, shifting nighttime soundscapes and surreal bioluminescence contrast horror with beauty.',facts:['Survival exploration','Bioluminescent night environments','Co-operative world concept','Crafting and environmental storytelling'],staff:'Expedition Guide'},
    {id:'racing',title:'UNTAMED HORIZON',tag:'FEATURED GAME',theme:'gold',subject:'Off-road exploration and racing',desc:'A sweeping open world for dirt bikes, ATVs and future vehicle types. Scenic journeys, tricks, trails and relaxed exploration are central to the vision.',facts:['Dirt bike first playable target','Expansive interconnected terrain','Controller-first driving','Races, activities and passive mode'],staff:'Motorsport Guide'},
    {id:'thief',title:'THE FORGOTTEN ASHES',tag:'FEATURED GAME',theme:'pink',subject:'Immersive stealth story',desc:'A stealth-focused single-player world inspired by dark Victorian streets, theft and meaningful choices. Actions and failures can permanently reshape quests and the world.',facts:['Immersive first-person stealth','Consequential quests and endings','Atmospheric connected districts','Working title also explored: City of Thieves'],staff:'Story Curator'},
    {id:'academy',title:'THE ACADEMY',tag:'FUTURE WORLD',theme:'cyan',subject:'Learning and exploration',desc:'A planned cyberpunk, fantasy and Victorian-inspired interactive academy, with educational experiences, NPC instructors and a vast social city.',facts:['Financial literacy is the first planned subject','Interactive teaching and activities','Future creator spaces','Coming Soon — not a playable game'],staff:'Academy Registrar'},
    {id:'future',title:'FUTURE GAME WORLDS',tag:'COMING SOON',theme:'violet',subject:'Future projects',desc:'Reserved exhibition for future HexCore Gaming games. Projects without established names remain labeled Coming Soon until they are officially announced.',facts:['New worlds will receive dedicated galleries','No unannounced release dates','Playable demos added when ready'],staff:'Exhibition Curator'},
    {id:'administration',title:'ADMINISTRATION & LEGAL',tag:'COMPANY DEPARTMENT',theme:'gold',subject:'Corporate information',desc:'Learn about HexCore Gaming and navigate to the existing Administration & Legal office for its established representatives and detailed dialogues.',facts:['Company Representative','Legal Counsel','Privacy Officer','Intellectual Property Counsel'],staff:'Company Receptionist',legacy:true},
    {id:'support',title:'CUSTOMER SUPPORT',tag:'COMPANY DEPARTMENT',theme:'cyan',subject:'Help and technical questions',desc:'Information for gamers and visitors. The request composer can prepare and copy a support message, but cannot submit a real ticket until a secure ticket provider is connected.',facts:['Technical assistance information','Help for HexCore games','Support request draft composer','No live server-side ticket service yet'],staff:'Support Representative',support:true},
    {id:'community',title:'COMMUNITY & EVENTS',tag:'COMPANY DEPARTMENT',theme:'pink',subject:'Gatherings and updates',desc:'Discover HexCore City community plans: launch-night queues, creator showcases, LAN parties, open-world festivities and future event announcements.',facts:['Community gatherings','Midnight release celebrations','Creator showcases','Official dates will appear when confirmed'],staff:'Community Director'},
    {id:'business',title:'BUSINESS & PARTNERSHIPS',tag:'COMPANY DEPARTMENT',theme:'gold',subject:'Business inquiries',desc:'Learn about future partnership, collaboration and supporter pathways. No unverified funding terms or payment options are presented as active.',facts:['Business introductions','Partnership inquiries','Responsible supporter communication','Contact and payments pending provider integration'],staff:'Partnership Coordinator'},
    {id:'development',title:'GAME DEVELOPMENT',tag:'COMPANY DEPARTMENT',theme:'violet',subject:'Behind the simulations',desc:'An overview of the HexCore development approach: early prototypes, playable proof of concept, ongoing development updates and worlds built over time.',facts:['Cyber_Arena development','Proof-of-concept showcases','World design and technology','Upcoming project announcements'],staff:'Development Producer'},
    {id:'hardware',title:'HEXCORE HARDWARE LAB',tag:'COMPANY DEPARTMENT',theme:'green',subject:'Gaming hardware concepts',desc:'Explore the intended HexCore System, special PC controller and high-speed physical games on preloaded USB/SSD storage. These are not currently offered for sale.',facts:['Hybrid console / PC vision','Steam and PC compatibility goals','Extra controller buttons and triggers','Physical solid-state game editions at full release'],staff:'Hardware Engineer'},
    {id:'merch',title:'HEXCORE MERCHANDISE',tag:'SHOWROOM',theme:'pink',subject:'Merch and collector concepts',desc:'A preview of future HexCore merchandise and physical editions. The showroom is informational until products, stock and payment checkout are actually configured.',facts:['Branded merchandise concepts','Limited collector-edition plans','No purchase processing in this version'],staff:'Showroom Host'},
    {id:'gallery',title:'FUTURE WORLDS MUSEUM',tag:'CULTURAL DISTRICT',theme:'violet',subject:'Game concept exhibits',desc:'A museum celebrating the worlds in development, featuring their distinct settings, themes and current vision. No fictional screenshots are represented as finished gameplay.',facts:['Cyberpunk arena exhibit','Bioluminescent rainforest exhibit','Vast wilderness / racing exhibit','Dark Victorian stealth exhibit'],staff:'Museum Curator'},
    {id:'arcade',title:'HEXCORE ARCADE',tag:'INTERACTIVE',theme:'cyan',subject:'Browser arcade',desc:'A home for small playable website attractions and future mini versions of the games. The existing lobby arcade contains Neon Reflex and Memory Matrix.',facts:['Neon Reflex microgame','Memory Matrix microgame','Additional arcade games coming later'],staff:'Arcade Attendant',arcade:true},
    {id:'residential',title:'GAMER RESIDENCES',tag:'CITY DISTRICT',theme:'green',subject:'In-world apartments',desc:'Explore the residential district and imagine future apartments, gaming rooms, LAN parties and in-world social events. No accounts or residential rentals are required.',facts:['Decorated city apartments','Gaming lounge scenes','NPC residents and conversations','Future neighborhood expansions'],staff:'Resident Concierge'}
  ];
  const dark=new THREE.MeshStandardMaterial({color:0x0e1225,roughness:.4,metalness:.48});
  const stone=new THREE.MeshStandardMaterial({color:0x1c2743,roughness:.72,metalness:.18});
  const floorMat=new THREE.MeshStandardMaterial({color:0x151a34,roughness:.36,metalness:.65});
  const glass=new THREE.MeshStandardMaterial({color:0x28385a,roughness:.14,metalness:.56,transparent:true,opacity:.72});
  const getGlow=(color,strength=.7)=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:strength,metalness:.55,roughness:.23});
  const sharedBoxGeometry=new THREE.BoxGeometry(1,1,1);
  function cube(parent,x,y,z,w,h,d,mat){const o=new THREE.Mesh(sharedBoxGeometry,mat);o.position.set(x,y,z);o.scale.set(w,h,d);parent.add(o);return o;}
  const sharedCylinderGeometry=new THREE.CylinderGeometry(1,1.1,1,8);
  function cyl(parent,x,y,z,r,h,mat,sides=8){const o=new THREE.Mesh(sharedCylinderGeometry,mat);o.position.set(x,y,z);o.scale.set(r,h,r);parent.add(o);return o;}
  const labelCache=new Map();
  function sign(parent,words,x,y,z,w=26,h=3.5,accent='#ad95ff',rotation=0){
    let key=words+'|'+accent;let texture=labelCache.get(key);
    if(!texture){let canvas=document.createElement('canvas');canvas.width=1024;canvas.height=180;let p=canvas.getContext('2d');p.fillStyle='#0b1024';p.fillRect(0,0,1024,180);p.strokeStyle=accent;p.lineWidth=9;p.strokeRect(6,6,1012,168);p.fillStyle='#f4f5ff';p.textAlign='center';p.textBaseline='middle';let fs=72;do{p.font=`700 ${fs--}px Arial`}while(p.measureText(words).width>950&&fs>23);p.fillText(words,512,90);texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;labelCache.set(key,texture);}
    let o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));o.position.set(x,y,z);o.rotation.y=rotation;parent.add(o);return o;
  }
  const district=new THREE.Group();district.position.set(HUB.x,0,HUB.z);scene.add(district);
  // ZIP 1 REMAKE: former procedural building facades removed completely.
  // Standalone remadeWorld renders the new pedestrian city and all sixteen external buildings.
  // Information, instanced interiors and dialogue systems below remain unchanged.
  // Same four-column street map as remadeWorld: doors must match visible buildings.
  const anchorX=[-111,-37,37,111], anchorZ=[-114,-38,38,114];
  const colMats=Object.fromEntries(Object.entries(themes).map(([key,color])=>[key,getGlow(color,.48)]));
  for(const [i,site] of sites.entries()){
    site.x=HEXCORE_WORLD.sites[i].x; site.z=HEXCORE_WORLD.sites[i].z;
    site.interior={x:3500+i*145,z:3500};
    // Interior is built on demand, or one at a time after the public city loads.
  }
  const centerpiece={rotation:{y:0},position:{y:10}};
  const walkers=[];
  // Indoor spaces: actual rooms with furniture, NPC reception stands, screens, themed installations.
  function makeInterior(site,index){
    const p=site.interior,g=new THREE.Group();g.position.set(p.x,0,p.z);scene.add(g);site.room=g;
    const glow=colMats[site.theme],cc=themes[site.theme],hex='#'+cc.toString(16).padStart(6,'0');
    cube(g,0,-.45,0,82,.85,72,floorMat);cube(g,0,19,0,82,.5,72,stone);
    cube(g,0,9.5,-36,82,19,.5,dark);cube(g,-41,9.5,0,.5,19,72,stone);cube(g,41,9.5,0,.5,19,72,stone);
    cube(g,-28,9.5,36,26,19,.5,stone);cube(g,28,9.5,36,26,19,.5,stone);cube(g,0,16,36,30,6,.5,stone);
    for(let xx=-35;xx<36;xx+=10){cube(g,xx,.08,0,.12,.1,68,glow);cube(g,xx,18.65,0,.23,.1,70,glow);}
    for(let zz=-30;zz<=30;zz+=10)cube(g,0,.09,zz,77,.12,.14,glow);
    for(let xx of [-35,35])for(let zz of [-27,-9,9,27]){cyl(g,xx,9,zz,.95,18,dark);cube(g,xx,14,zz,2,6,2,glow);}
    sign(g,site.title,0,14,-35.5,56,5.3,hex);sign(g,site.tag,0,8,-35.4,22,2.5,hex);
    sign(g,'EXIT TO CITY DISTRICT',0,7,35.3,28,3,'#9de9ff',Math.PI);
    // A reception representative with head, torso, arms and legs (site dialogue terminal in front).
    cube(g,0,1.1,-19,22,2,9,dark);cube(g,0,2.2,-14.1,22,.25,.35,glow);
    cyl(g,0,4.2,-23,1.6,3.3,glass);cyl(g,0,6.8,-23,1.1,1.9,getGlow(0xd3d2ff,.12));
    for(let xx of [-1.45,1.45]){cube(g,xx,4,-23,.65,3.8,.8,glow);cube(g,xx/2,1.25,-23,.7,2.1,.8,dark);}
    sign(g,site.staff.toUpperCase(),0,5,-13.75,17,2.1,hex);
    // Curated visual exhibit behind conversation desk.
    if(site.id==='cyber')for(let k=0;k<6;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(3.8+k*.45,.1,6,32),k%2?colMats.cyan:colMats.violet);r.position.set((k%3-1)*16,9,-30+k*.06);r.rotation.set(.3*k,.25*k,0);g.add(r);}
    else if(site.id==='survival'||site.id==='residential')for(let k=0;k<9;k++){let x=(k%3-1)*13,z=-32+Math.floor(k/3)*5;cyl(g,x,2.4,z,.45,5,stone);cyl(g,x,5.5,z,2.8,2.8,getGlow(k%2?0x56e3db:0xa3ffb3,.25));}
    else if(site.id==='racing')for(let k=-2;k<=2;k++){cube(g,k*9,2,-27,6,1.3,2,stone);for(let dx of [-2,2])cyl(g,k*9+dx,1.3,-26,1.35,1,colMats.gold);}
    else if(site.id==='thief')for(let k=0;k<5;k++){cube(g,-29+k*14,8,-34,6,15,2,stone);cube(g,-29+k*14,16.5,-34,8,2,3,dark);}
    else if(site.id==='hardware')for(let k=-1;k<=1;k++){cube(g,k*20,3,-29,14,2,9,dark);cube(g,k*20,5,-29,11,3,6,glass);}
    else if(site.id==='arcade')for(let k=-2;k<=2;k++){cube(g,k*12,4,-30,8,7,4,dark);cube(g,k*12,5,-27.7,6,4,.2,glow);}
    else for(let k=-2;k<=2;k++){cube(g,k*13,6,-34,9,8,.7,glass);cube(g,k*13,6,-33.55,6,.5,.1,glow);}
    for(let x of [-22,22]){cube(g,x,1.3,-4,12,2,5,dark);cube(g,x,3,-3,10,.15,.4,glow);}
    sign(g,'VISITOR INFORMATION',0,3,-10,19,2.3,hex);
    // Existing world illumination reaches these rooms; no additional shadow-casting point lights per room.
    const light=new THREE.AmbientLight(0xadbfff,.34);g.add(light);
  }
  // PUBLIC DISTRICT // physically connected to the existing city, NOT inside HexCore Tower.
  // Westward boulevard reaches the eastern shore of the original tower island.
  const approach=new THREE.Group();scene.add(approach);
  // The monumental central approach is rendered by remadeWorld.
  sign(approach,'HEXCORE CITY // CENTRAL CIRCULAR PROMENADE',0,9,215,53,4,'#97ebff');
  // No tower portal: all public buildings are approached through their physical city entrances.
  const display=document.createElement('div');display.id='hexcore-fullcity-panel';display.style.cssText='display:none;position:fixed;inset:0;background:rgba(3,6,17,.94);z-index:490;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;color:#eaf0ff;font:14px Consolas,monospace';document.body.appendChild(display);
  const panel=document.createElement('section');panel.style.cssText='background:linear-gradient(140deg,#101a32,#1a1036);border:1px solid #8558d8;box-shadow:0 0 50px #37165a;width:min(850px,98vw);max-height:90dvh;overflow:auto;padding:22px;box-sizing:border-box';display.appendChild(panel);
  const prompt=document.createElement('button');prompt.style.cssText='display:none;position:fixed;bottom:115px;left:50%;transform:translateX(-50%);z-index:195;background:#130d2c;border:1px solid #a9eaff;color:#d1eeff;font:12px Consolas,monospace;padding:12px 16px;cursor:pointer';document.body.appendChild(prompt);
  const state={pos:{x:0,z:0},zone:'other',site:null,open:false,near:null,cooldown:0};
  function element(tag,content,styles){let node=document.createElement(tag);node.textContent=content;if(styles)node.style.cssText=styles;panel.appendChild(node);return node;}
  function button(label,action){let b=element('button',label,'display:block;width:100%;margin:8px 0;min-height:43px;padding:12px 15px;background:#20204a;border:1px solid #6866a2;color:#eef3ff;cursor:pointer;text-align:left;font:13px Consolas,monospace');b.onclick=action;return b;}
  function header(title,copy){panel.replaceChildren();element('h2',title,'color:#9be7ff;letter-spacing:1px;font-size:20px');element('p',copy,'line-height:1.65;color:#cfcee9');}
  function close(){state.open=false;display.style.display='none';if(window.hexcoreUIFocus)window.hexcoreUIFocus.close();else window.hexcoreDialogueOpen=false;}
  function modal(render){if(state.open||window.hexcoreDialogueOpen)return;state.open=true;if(window.hexcoreUIFocus)window.hexcoreUIFocus.open();else window.hexcoreDialogueOpen=true;display.style.display='flex';if(document.pointerLockElement)document.exitPointerLock();render();}
  function teleport(x,z,bounds){close();state.cooldown=performance.now()+700;window.hexcoreInteriorActive=true;window.hexcoreInteriorBounds=bounds;window.hexcoreTeleportPlayer(x,z,0);}
  function goDistrict(site=null){
    // Return the visitor to the exterior doorway rather than a remote teleport hub.
    state.zone='district';state.site=null;close();state.cooldown=performance.now()+650;
    window.hexcoreInteriorActive=false;window.hexcoreInteriorBounds=null;
    window.hexcoreTeleportPlayer(site?site.x:HUB.x-144,site?site.z+32:HUB.z,0);
  }
  function goLobby(){state.zone='other';state.site=null;if(typeof window.hexcoreTowerReturnToLobby==='function'){close();window.hexcoreTowerReturnToLobby();}else teleport(800,800+24,{minX:800-36,maxX:800+36,minZ:800-33,maxZ:800+33});}
  function goSite(site){if(!site.room)makeInterior(site,sites.indexOf(site));state.zone='site';state.site=site;let p=site.interior;teleport(p.x,p.z+26,{minX:p.x-39,maxX:p.x+39,minZ:p.z-34,maxZ:p.z+34});}
  function showDirectory(){header('HEXCORE CITY // VISITOR DIRECTORY','The public game, commerce, and cultural destinations encircle HexCore Tower. Follow the luminous promenades and enter each attraction through its physical doorway. This directory provides information only.');
    for(let s of sites){button(`${s.title}  //  ${s.tag}`,()=>showSiteInfo(s,true));}button('CLOSE DIRECTORY',close);
  }
  function showSiteInfo(site,fromDirectory=false){header(site.title,site.desc);element('p',site.subject+'  //  '+site.tag,'color:#a5ddfb');for(let f of site.facts)element('p','◆  '+f,'margin:9px 0;color:#e3dcff');
    if(!fromDirectory && state.near && state.near.type==='building' && state.near.site===site)button('ENTER '+site.title,()=>goSite(site));
    if(site.legacy)button('EXISTING ADMINISTRATION & LEGAL OFFICE',()=>{close();if(typeof window.hexcoreEnterAdminInterior==='function')window.hexcoreEnterAdminInterior();else{header('ADMINISTRATION','The original Administration entrance remains available in the city. This new district is an informational annex.');button('BACK',()=>showSiteInfo(site,fromDirectory));}});
    if(site.support)button('DRAFT A SUPPORT REQUEST',supportComposer);
    if(site.arcade)element('p','The arcade is its own destination in this city district.','color:#a5ddfb');
    button(fromDirectory?'BACK TO DIRECTORY':'BACK TO INFORMATION',()=>fromDirectory?showDirectory():showDesk(site));
    button('CLOSE',close);
  }
  function showDesk(site){header(site.staff.toUpperCase()+' // '+site.title,`Welcome to ${site.title}. Choose a topic to learn more, or visit another building in HexCore City.`);
    button('ABOUT THIS DEPARTMENT',()=>showSiteInfo(site));
    if(site.support)button('SUPPORT MESSAGE COMPOSER',supportComposer);
    if(site.legacy)button('ADMINISTRATION AND LEGAL REPRESENTATIVES',()=>{header('ADMINISTRATION & LEGAL','The existing Administration office contains the four established representatives and their detailed topic menus. It remains accessible in the original city.');button('BACK',()=>showDesk(site));});
    button('EXPLORE ANOTHER BUILDING',()=>goDistrict(site));button('CLOSE',close);
  }
  function supportComposer(){header('CUSTOMER SUPPORT // REQUEST DRAFT','This form creates a text draft to copy. It is not transmitted or submitted; no live ticket backend is connected.');const entries=[];
    for(let [title,type] of [['Email for reply','email'],['Game or subject','text'],['Issue details','textarea']]){const lab=element('label',title,'display:block;margin:12px 0;color:#bcceff');const input=document.createElement(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.style.cssText='display:block;width:100%;box-sizing:border-box;padding:12px;margin:7px 0;background:#0a0e1e;border:1px solid #6f569e;color:white;font:14px Consolas,monospace';if(type==='textarea')input.rows=5;lab.appendChild(input);entries.push(input);}
    button('COPY REQUEST DRAFT',async()=>{const text=`HexCore Gaming support request\nEmail: ${entries[0].value}\nSubject: ${entries[1].value}\nDetails: ${entries[2].value}`;try{await navigator.clipboard.writeText(text);alert('Copied. This has NOT been submitted.');}catch{alert('Clipboard unavailable. You can select and copy the fields manually.');}});button('BACK TO SUPPORT',()=>showDesk(sites.find(s=>s.id==='support')));button('CLOSE',close);
  }
  prompt.onclick=()=>interact();
  function interact(){if(state.open||window.hexcoreDialogueOpen)return;if(state.near&&state.near.type==='building')modal(()=>showSiteInfo(state.near.site));else if(state.near&&state.near.type==='desk')modal(()=>showDesk(state.near.site));else if(state.near==='roomExit')modal(()=>{header('RETURN TO THE CITY','Leave the department and continue exploring the public district.');button('EXIT BUILDING',()=>goDistrict(state.site));button('STAY HERE',close);});}
  window.addEventListener('keydown',ev=>{if(ev.code==='KeyE'&&!ev.repeat)interact();if(ev.code==='Escape'&&state.open)close();});
  window.addEventListener('hexcore-player-position',ev=>{if(ev.detail)state.pos=ev.detail;});
  // Optimized decorative animation: only centerpiece and limited exterior details.
  let frames=0;
  function update(){
    // Interiors are created ONLY on entry, not continuously while exploring.
    const {x,z}=state.pos;frames++;
    centerpiece.rotation.y+=.003;centerpiece.position.y=10+Math.sin(frames*.02)*.5;
    for(const walker of walkers){if(!walker.moving)continue;walker.person.position.z=walker.baseZ+Math.sin(frames*.006+walker.phase)*8;walker.person.rotation.y=Math.cos(frames*.006+walker.phase)>0?0:Math.PI;}
    if(state.open){prompt.style.display='none';return;}
    let nearest=null,label='';
    // Detect the district from real world coordinates; no teleporter or tower lobby required.
    const inDistrict=Math.hypot(x-HUB.x,z-HUB.z)<425;
    if(inDistrict && state.zone!=='site')state.zone='district';
    if(!inDistrict && state.zone==='district')state.zone='other';
    if(state.zone==='district'){
      for(let site of sites){const d=Math.hypot(x-site.x,z-(site.z+29));if(d<13){nearest={type:'building',site};label=`E / TAP // ENTER ${site.title}`;break;}}
    }else if(state.zone==='site'&&state.site){const s=state.site,p=s.interior;
      if(Math.hypot(x-p.x,z-(p.z-16))<14){nearest={type:'desk',site:s};label=`E / TAP // SPEAK TO ${s.staff.toUpperCase()}`;}
      else if(z>p.z+29&&Math.abs(x-p.x)<13){nearest='roomExit';label='E / TAP // EXIT BUILDING';}
    }
    state.near=nearest;prompt.textContent=label;prompt.style.display=nearest?'block':'none';
  }
  // Always-available directory button while visiting the new district, including touch and accessibility.
  const quick=document.createElement('button');quick.textContent='HEXCORE // DIRECTORY';quick.style.cssText='display:none;position:fixed;top:57px;left:14px;z-index:160;padding:9px 10px;color:#b1e8ff;background:rgba(8,10,32,.86);border:1px solid #7672c8;font:11px Consolas,monospace;cursor:pointer';document.body.appendChild(quick);
  quick.onclick=()=>modal(showDirectory);
  const existingUpdate=update;
  return ()=>{existingUpdate();quick.style.display=(state.zone==='district'||state.zone==='site')&&!state.open?'block':'none';};
}
