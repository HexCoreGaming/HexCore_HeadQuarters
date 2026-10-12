import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// HEXCORE // Interactive public departments and visitor services.
// GitHub Pages contains no private authentication or payment credentials.
export function createTowerDepartments(scene) {
  const departments = [
    {id:'02',name:'CUSTOMER SUPPORT',lead:'Visitor Services Specialist',color:0x57dafc,topics:[['Website & navigation','Explore the city using WASD and mouse on desktop or the dual touch joysticks on mobile. Use E or INTERACT when a prompt appears.'],['Game support','HexCore game support is being prepared. Please include the game title, platform, version, and a detailed description when requesting assistance.'],['Submit a support request','The public ticket form is a prepared interface; a secure server-side ticket service is required before requests can actually be delivered.']]},
    {id:'03',name:'COMMUNITY & EVENTS',lead:'Community Director',color:0xc87bff,topics:[['Community','HexCore City is designed as a welcoming place for gamers. Future community features can link to official channels once their links are configured.'],['Launch-night celebrations','The city plans to host midnight release queues, fireworks, public countdowns, and special NPC events.'],['Creator updates','Explore the Future Worlds gallery and the Development division to learn what is in progress.']]},
    {id:'04',name:'BUSINESS & PARTNERSHIPS',lead:'Partnership Coordinator',color:0xffc984,topics:[['Working with HexCore','Partnership and business contact channels will be published when the company enables them.'],['Funding and supporters','Game support and funding information will be presented with clear terms and verified destinations before any money is accepted.'],['Merchandise','Merchandise displays are previews only until a secure checkout provider is connected.']]},
    {id:'05',name:'GAME DEVELOPMENT',lead:'Development Producer',color:0x9f9dff,topics:[['Cyber_Arena HEX//BREAK','A skill-based, high-mobility arena FPS defined by walkable surfaces and changing gravity. The playable offline demo is in development.'],['Where Light Dies','A wilderness survival game with a haunting atmosphere, realistic threats, and beautiful bioluminescent nights.'],['Untamed Horizon','A large-world off-road motorsport and exploration game with varied terrain and multiple vehicle classes.'],['Future worlds','Other planned worlds include a fantasy academy, a story-driven stealth city, and additional projects.']]},
    {id:'06',name:'HARDWARE LAB',lead:'Hardware Engineering Guide',color:0x69f0cc,topics:[['HexCore gaming system','A proposed hybrid console and PC experience with an interactive hub world, local storage, and clear advertised hardware specifications.'],['HexCore controller','A PC-compatible controller concept with additional buttons and triggers designed around HexCore games.'],['Physical games','Full-release physical games are planned on preloaded solid-state USB or SSD storage instead of optical discs.'],['Development status','These are concepts and ongoing development goals, not products currently available for purchase.']]}
  ];
  const dark=new THREE.MeshStandardMaterial({color:0x101528,metalness:.65,roughness:.34});
  const trim=new THREE.MeshStandardMaterial({color:0x563394,emissive:0x52238e,emissiveIntensity:.55,metalness:.55});
  const textMat=0xffffff;
  function box(g,w,h,d,x,y,z,m){let a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);g.add(a);return a;}
  function board(g,label,x,y,z,w=25,h=3,color='#b990ff',rotation=0){let c=document.createElement('canvas');c.width=1024;c.height=160;let v=c.getContext('2d');v.fillStyle='#090e21';v.fillRect(0,0,c.width,c.height);v.strokeStyle=color;v.lineWidth=10;v.strokeRect(7,7,1010,146);v.fillStyle='#fff';v.textAlign='center';v.textBaseline='middle';let fs=72;do{v.font=`bold ${fs--}px Arial`;}while(v.measureText(label).width>940&&fs>28);v.fillText(label,512,80);let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;let mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;g.add(mesh);}
  const centers=new Map();
  for (const [i,d] of departments.entries()){
    const center={x:1150+i*125,z:1150};centers.set(d.id,center);
    let g=new THREE.Group();g.position.set(center.x,0,center.z);scene.add(g);
    let glow=new THREE.MeshStandardMaterial({color:d.color,emissive:d.color,emissiveIntensity:.65,metalness:.52,roughness:.3});
    box(g,92,.5,84,0,-.35,0,dark);box(g,92,.5,84,0,20,0,dark);
    box(g,92,20,.5,0,10,-42,dark);box(g,.5,20,84,-46,10,0,dark);box(g,.5,20,84,46,10,0,dark);
    box(g,34,20,.5,-29,10,42,dark);box(g,34,20,.5,29,10,42,dark);box(g,24,12,.5,0,14,42,dark);
    for(let n=-35;n<=35;n+=10){box(g,.15,.08,78,n,.08,0,glow);box(g,85,.07,.16,0,.08,n,trim);}
    for(let x of [-38,38])for(let z of [-32,-10,12,34])box(g,1.4,17,1.4,x,8.5,z,trim);
    box(g,32,2,10,0,1,-24,dark);box(g,32,.15,.5,0,2,-19,glow);
    board(g,d.name,0,14,-40,39,4,`#${d.color.toString(16).padStart(6,'0')}`);
    board(g,d.lead.toUpperCase(),0,5,-19,20,2);
    board(g,'RETURN TO ELEVATOR',0,8,41.5,26,2.7,'#80dcff',Math.PI);
    board(g,'VISITOR INFORMATION',0,4,-13,24,2.4,'#a7eaff');
    for(let n=0;n<d.topics.length;n++){const tx=(n-(d.topics.length-1)/2)*20;box(g,14,6,.7,tx,4,9,glow);board(g,`0${n+1} // INFO`,tx,7,9.6,12,2,'#ffffff');}
    g.add(new THREE.HemisphereLight(0xb9c8ff,0x18152a,1.6));let light=new THREE.PointLight(d.color,18,95);light.position.set(0,13,0);g.add(light);
  }
  let active=null,player={x:0,z:0},open=false,near=false;
  const overlay=document.createElement('div');overlay.id='hexcore-department-panel';Object.assign(overlay.style,{display:'none',position:'fixed',inset:'0',zIndex:410,background:'rgba(4,7,17,.88)',alignItems:'center',justifyContent:'center',padding:'18px',fontFamily:'Consolas,monospace',color:'#e8eaff'});
  const panel=document.createElement('section');Object.assign(panel.style,{background:'#10152c',border:'1px solid #9057f5',boxShadow:'0 0 55px #392070',padding:'24px',width:'min(650px,96vw)',maxHeight:'83dvh',overflowY:'auto'});overlay.appendChild(panel);document.body.appendChild(overlay);
  const hint=document.createElement('button');hint.textContent='E / TAP // TALK TO DEPARTMENT';Object.assign(hint.style,{display:'none',position:'fixed',zIndex:185,bottom:'115px',left:'50%',transform:'translateX(-50%)',padding:'11px 17px',background:'#101229',border:'1px solid #8cdbfd',color:'#8cdbfd',fontFamily:'Consolas,monospace'});document.body.appendChild(hint);
  function close(){open=false;overlay.style.display='none';window.hexcoreDialogueOpen=false;}
  function btn(label,callback){const b=document.createElement('button');b.textContent=label;Object.assign(b.style,{display:'block',width:'100%',background:'#211c46',border:'1px solid #7151b1',padding:'13px',color:'#f0e9ff',margin:'9px 0',font:'13px Consolas,monospace',cursor:'pointer',textAlign:'left'});b.onclick=callback;panel.appendChild(b);}
  function text(title,body){panel.replaceChildren();const h=document.createElement('h2');h.style.color='#8cdbfd';h.textContent=title;panel.appendChild(h);const p=document.createElement('p');p.style.lineHeight='1.7';p.textContent=body;panel.appendChild(p);}
  function supportForm(){text('SUPPORT REQUEST // PREVIEW','You can draft a support request below. Sending requires a secure ticket backend, which is not connected yet. No information is transmitted or saved on the server.');
    const fields=[['Your email','email'],['Game or subject','text'],['Description of the issue','textarea']];const inputs=[];
    for(let [title,type] of fields){let label=document.createElement('label');label.textContent=title;label.style.display='block';label.style.marginTop='13px';let el=document.createElement(type==='textarea'?'textarea':'input');if(type!=='textarea')el.type=type;el.placeholder=title;el.style.cssText='display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;background:#070d20;border:1px solid #674ca1;color:white;font:13px Consolas,monospace';if(type==='textarea')el.rows=5;label.appendChild(el);panel.appendChild(label);inputs.push(el);}
    btn('COPY REQUEST TO CLIPBOARD',async()=>{const msg=`HexCore Support Request\nEmail: ${inputs[0].value}\nSubject: ${inputs[1].value}\nIssue: ${inputs[2].value}`;try{await navigator.clipboard.writeText(msg);alert('Draft copied. This has NOT been submitted.');}catch{alert('Copy unavailable in this browser. Select and copy your text manually.');}});btn('BACK TO SUPPORT DESK',()=>show());}
  function show(){if(!active||open)return;open=true;window.hexcoreDialogueOpen=true;overlay.style.display='flex';hint.style.display='none';if(document.pointerLockElement)document.exitPointerLock();const d=active;text(`HEXCORE // ${d.name}`,`${d.lead}: Welcome to the ${d.name.toLowerCase()} department. What would you like to explore?`);
    d.topics.forEach(([topic,answer])=>btn(topic,()=>{text(topic,answer);if(topic==='Submit a support request')btn('OPEN SUPPORT DRAFT',supportForm);btn('BACK TO DEPARTMENT',()=>{open=false;show();});}));btn('CLOSE',close);}
  window.hexcoreVisitTowerDepartment=(id)=>{const d=departments.find(a=>a.id===id),p=centers.get(id);if(!d||!p||typeof window.hexcoreTeleportPlayer!=='function')return;close();active=d;window.hexcoreInteriorActive=true;window.hexcoreInteriorBounds={minX:p.x-44,maxX:p.x+44,minZ:p.z-40,maxZ:p.z+40};window.hexcoreTeleportPlayer(p.x,p.z+32,0);};
  window.hexcoreDepartmentInteract=()=>{if(active&&near&&!open)show();};
  hint.onclick=()=>window.hexcoreDepartmentInteract();
  window.addEventListener('hexcore-player-position',event=>{player=event.detail||player;});
  window.addEventListener('keydown',event=>{if(event.code==='KeyE'&&!event.repeat&&active&&near&&!open)show();if(event.code==='Escape'&&open)close();});
  function update(){if(!active)return;let p=centers.get(active.id);let z=player.z-p.z, x=player.x-p.x;
    if(!open&&z>36&&Math.abs(x)<12){active=null;near=false;hint.style.display='none';if(typeof window.hexcoreTowerReturnToLobby==='function')window.hexcoreTowerReturnToLobby();return;}
    near=Math.hypot(x,z+19)<13;hint.style.display=near&&!open?'block':'none';
  }
  return update;
}
