import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// HEXCORE // Interactive public departments and visitor services.
// GitHub Pages contains no private authentication or payment credentials.
export function createTowerDepartments(scene) {
  const departments = [
    {id:'02',name:'CUSTOMER SUPPORT',lead:'Visitor Services Specialist',color:0x57dafc,topics:[['Website & navigation','Explore the city using WASD and mouse on desktop or the dual touch joysticks on mobile. Use E or INTERACT when a prompt appears.'],['Game support','HexCore game support is being prepared. Please include the game title, platform, version, and a detailed description when requesting assistance.'],['Submit a support request','The public ticket form is a prepared interface; a secure server-side ticket service is required before requests can actually be delivered.'],["Before contacting support","For game issues, record the title, platform, approximate time, any error message, and clear steps that reproduce the issue. Never share your passwords or payment card data."],["Website controls","On desktop: WASD to move, mouse to look, E to interact, and Escape to release cursor. On mobile use the movement and look controls. Select the on-screen button to interact."],["Response and privacy","No support-ticket server is connected. A copied request stays under your control. Do not include sensitive personal information in public posts or screenshots."]]},
    {id:'03',name:'COMMUNITY & EVENTS',lead:'Community Director',color:0xc87bff,topics:[['Community','HexCore City is designed as a welcoming place for gamers. Future community features can link to official channels once their links are configured.'],['Launch-night celebrations','The city plans to host midnight release queues, fireworks, public countdowns, and special NPC events.'],['Creator updates','Explore the Future Worlds gallery and the Development division to learn what is in progress.'],["Community spaces","The city includes plazas, showcase galleries, an arcade and future spaces for player gatherings. These are designed as an account-free solo browsing experience."],["Events calendar","No live event dates are currently configured. When confirmed, announcements should appear here and through official community channels."],["Community safety","Official moderation, report handling and voice chat are not live website services. Any future community service needs explicit terms and a secure moderation workflow."]]},
    {id:'04',name:'BUSINESS & PARTNERSHIPS',lead:'Partnership Coordinator',color:0xffc984,topics:[['Working with HexCore','Partnership and business contact channels will be published when the company enables them.'],['Funding and supporters','Game support and funding information will be presented with clear terms and verified destinations before any money is accepted.'],['Merchandise','Merchandise displays are previews only until a secure checkout provider is connected.'],["For creators and collaborators","HexCore Gaming aims to show work-in-progress games transparently through demonstrations, written updates and official project showcases. Collaboration inquiries will use verified business contact channels once published."],["Media and press","Visit individual game showcases for accurate project descriptions and development status. Gameplay footage should be identified as gameplay only when recorded from an actual running build."],["Business contact status","The building is informative today. There is no connected inbox, investor portal, contracting system or payment processor here."]]},
    {id:'05',name:'GAME DEVELOPMENT',lead:'Development Producer',color:0x9f9dff,topics:[['Cyber_Arena HEX//BREAK','A skill-based, high-mobility arena FPS defined by walkable surfaces and changing gravity. The playable offline demo is in development.'],['Where Light Dies','A wilderness survival game with a haunting atmosphere, realistic threats, and beautiful bioluminescent nights.'],['Untamed Horizon','A large-world off-road motorsport and exploration game with varied terrain and multiple vehicle classes.'],['Future worlds','Other planned worlds include a fantasy academy, a story-driven stealth city, and additional projects.'],["Demo versus alpha","Cyber_Arena HEX//BREAK is planned to begin with a free offline demo. A later paid alpha is intended to add online play as the project develops; timelines and availability must be separately confirmed."],["Movement systems","Cyber_Arena experiments with fast traversal, sliding, wall movement and surface-relative gravity. These are project design goals, not promises that every mechanic is already released."],["Other titles","Where Light Dies focuses on survival atmosphere; Untamed Horizon on off-road exploration; and The Forgotten Ashes on consequence-driven stealth. Visit their dedicated city buildings for more detail."]]},
    {id:'06',name:'HARDWARE LAB',lead:'Hardware Engineering Guide',color:0x69f0cc,topics:[['HexCore gaming system','A proposed hybrid console and PC experience with an interactive hub world, local storage, and clear advertised hardware specifications.'],['HexCore controller','A PC-compatible controller concept with additional buttons and triggers designed around HexCore games.'],['Physical games','Full-release physical games are planned on preloaded solid-state USB or SSD storage instead of optical discs.'],['Development status','These are concepts and ongoing development goals, not products currently available for purchase.'],["System software philosophy","The planned HexCore System emphasizes user control, transparent specifications, separate user profiles, a native social hub and gaming storefront integration. This is a design vision, not a retail product."],["Controller compatibility","The proposed controller targets standard PC and Steam workflows, with extra inputs for games that benefit from more actions. Hardware, driver support and certification remain future engineering work."],["Physical editions","The project plans full-release standalone games on preloaded solid-state drives and a limited collector edition for Cyber_Arena. Compatibility and plug-and-play behavior depend on platform capabilities."]]}
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
    // ZIP 2 // Department-specific staffed exhibits, spatial wayfinding and lounge furniture.
    const accent=new THREE.MeshStandardMaterial({color:d.color,emissive:d.color,emissiveIntensity:.32,metalness:.62,roughness:.22});
    const fabric=new THREE.MeshStandardMaterial({color:0x27213e,roughness:.88});
    const silver=new THREE.MeshStandardMaterial({color:0x8796b7,metalness:.78,roughness:.2});
    const screen=new THREE.MeshBasicMaterial({color:d.color,transparent:true,opacity:.68,side:THREE.DoubleSide});
    for(const side of [-1,1]){
      // Curved light-gate silhouettes and differentiated waiting areas.
      box(g,.65,10,1.1,side*27,5,-31,accent);
      box(g,.65,10,1.1,side*37,5,-31,accent);
      box(g,10.6,.5,1.1,side*32,10.3,-31,accent);
      for(let n=0;n<3;n++){
        const x=side*24,z=15+n*8;
        box(g,11,.75,4,x,1.15,z,fabric);
        box(g,11,2,.85,x,2.3,z+2,fabric);
        box(g,.85,1.6,4,x-side*5,1.8,z,silver);
      }
      box(g,7,1.5,7,side*35,1,-7,dark);
      const botanical=new THREE.Mesh(new THREE.IcosahedronGeometry(2.7,1),accent);
      botanical.position.set(side*35,5,-7);g.add(botanical);
    }
    // Wall-mounted exhibitions double as information about what this team handles.
    for(let k=0;k<3;k++){
      const x=-23+k*23;
      box(g,18,10,.35,x,8,-40.5,silver);
      box(g,17.2,9.2,.15,x,8,-40.25,screen);
      board(g,['EXPLORE','INFORMATION','VISITOR DESK'][k],x,8,-39.8,15,2,'#ffffff');
    }
    if(d.id==='02'){
      // Customer Support: staffed help stations and queue markers.
      for(let k=-2;k<=2;k++) {box(g,11,1.6,5,k*15,1.3,-2,dark);box(g,5,3,.4,k*15,4,-4,screen);box(g,5,.15,2,k*15,2.3,-1,accent);}
      board(g,'HELP / REQUEST DRAFTS',0,11,26,30,3);
    } else if(d.id==='03'){
      // Community & Events: auditorium and announcement stage.
      box(g,39,1.2,12,0,.8,-5,dark);
      for(let r=0;r<3;r++)for(let k=-3;k<=3;k++)box(g,4,1.3,3,k*7,.9,12+r*6,fabric);
      board(g,'EVENTS / GATHERINGS',0,9,-12,34,3);
    } else if(d.id==='04'){
      // Business: conference desk, seating, private consultation zones.
      box(g,33,1.6,11,0,2,8,silver);
      for(let k=-3;k<=3;k++)for(let side of [-1,1])box(g,3,2,3,k*4.5,1.2,8+side*9,fabric);
      board(g,'PARTNERSHIP INFORMATION',0,10,26,35,3);
    } else if(d.id==='05'){
      // Game development: mock holographic display benches and prototype stations.
      for(let k=-2;k<=2;k++){
        box(g,11,1.5,8,k*15,1.3,1,dark);
        const shape=new THREE.Mesh(new THREE.IcosahedronGeometry(2.8,k%2?1:0),accent);
        shape.position.set(k*15,5,1);g.add(shape);
      }
      board(g,'PROJECT DEVELOPMENT',0,10,27,30,3);
    } else {
      // Hardware: modular system prototypes, display pedestals, controllers.
      for(let k=-2;k<=2;k++){
        box(g,10,1.4,8,k*15,1,0,silver);
        box(g,5,5,3,k*15,4.2,0,dark);
        box(g,5,.3,3,k*15,7,0,accent);
        box(g,8,.35,5,k*15,1.9,0,screen);
      }
      board(g,'CONCEPT LAB / NOT FOR SALE',0,10,26,38,3);
    }
    // Staff silhouette is a world marker for the existing information interaction.
    const staff=new THREE.Group();staff.position.set(0,0,-17);g.add(staff);
    const skin=new THREE.MeshStandardMaterial({color:0xb6a6b4,roughness:.85});
    box(staff,1.9,3,.95,0,3.2,0,accent);
    for(const a of [-1,1]){box(staff,.48,2.5,.55,a*.48,1.1,0,silver);box(staff,.45,2.7,.65,a*1.32,3.1,0,skin);}
    const head=new THREE.Mesh(new THREE.SphereGeometry(.85,12,10),skin);head.position.y=5.4;staff.add(head);
    board(g,'E / INTERACT WITH REPRESENTATIVE',0,9,-15,35,2.4);
    g.add(new THREE.HemisphereLight(0xb9c8ff,0x18152a,1.6));let light=new THREE.PointLight(d.color,18,95);light.position.set(0,13,0);g.add(light);
  }
  let active=null,player={x:0,z:0},open=false,near=false;
  const overlay=document.createElement('div');overlay.id='hexcore-department-panel';Object.assign(overlay.style,{display:'none',position:'fixed',inset:'0',zIndex:410,background:'rgba(4,7,17,.88)',alignItems:'center',justifyContent:'center',padding:'18px',fontFamily:'Consolas,monospace',color:'#e8eaff'});
  const panel=document.createElement('section');Object.assign(panel.style,{background:'#10152c',border:'1px solid #9057f5',boxShadow:'0 0 55px #392070',padding:'24px',width:'min(650px,96vw)',maxHeight:'83dvh',overflowY:'auto'});overlay.appendChild(panel);document.body.appendChild(overlay);
  const hint=document.createElement('button');hint.textContent='E / TAP // TALK TO DEPARTMENT';Object.assign(hint.style,{display:'none',position:'fixed',zIndex:185,bottom:'115px',left:'50%',transform:'translateX(-50%)',padding:'11px 17px',background:'#101229',border:'1px solid #8cdbfd',color:'#8cdbfd',fontFamily:'Consolas,monospace'});document.body.appendChild(hint);
  function close(){if(!open)return;open=false;overlay.style.display='none';if(window.hexcoreUIFocus)window.hexcoreUIFocus.close();else window.hexcoreDialogueOpen=false;}
  function btn(label,callback){const b=document.createElement('button');b.textContent=label;Object.assign(b.style,{display:'block',width:'100%',background:'#211c46',border:'1px solid #7151b1',padding:'13px',color:'#f0e9ff',margin:'9px 0',font:'13px Consolas,monospace',cursor:'pointer',textAlign:'left'});b.onclick=callback;panel.appendChild(b);}
  function text(title,body){panel.replaceChildren();const h=document.createElement('h2');h.style.color='#8cdbfd';h.textContent=title;panel.appendChild(h);const p=document.createElement('p');p.style.lineHeight='1.7';p.textContent=body;panel.appendChild(p);}
  function supportForm(){text('SUPPORT REQUEST // PREVIEW','You can draft a support request below. Sending requires a secure ticket backend, which is not connected yet. No information is transmitted or saved on the server.');
    const fields=[['Your email','email'],['Game or subject','text'],['Description of the issue','textarea']];const inputs=[];
    for(let [title,type] of fields){let label=document.createElement('label');label.textContent=title;label.style.display='block';label.style.marginTop='13px';let el=document.createElement(type==='textarea'?'textarea':'input');if(type!=='textarea')el.type=type;el.placeholder=title;el.style.cssText='display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:11px;background:#070d20;border:1px solid #674ca1;color:white;font:13px Consolas,monospace';if(type==='textarea')el.rows=5;label.appendChild(el);panel.appendChild(label);inputs.push(el);}
    btn('COPY REQUEST TO CLIPBOARD',async()=>{const msg=`HexCore Support Request\nEmail: ${inputs[0].value}\nSubject: ${inputs[1].value}\nIssue: ${inputs[2].value}`;try{await navigator.clipboard.writeText(msg);alert('Draft copied. This has NOT been submitted.');}catch{alert('Copy unavailable in this browser. Select and copy your text manually.');}});btn('BACK TO SUPPORT DESK',()=>show());}
  function show(){if(!active)return;if(!open){open=true;if(window.hexcoreUIFocus)window.hexcoreUIFocus.open();else window.hexcoreDialogueOpen=true;}overlay.style.display='flex';hint.style.display='none';if(document.pointerLockElement)document.exitPointerLock();const d=active;text(`HEXCORE // ${d.name}`,`${d.lead}: Welcome to the ${d.name.toLowerCase()} department. What would you like to explore?`);
    d.topics.forEach(([topic,answer])=>btn(topic,()=>{text(topic,answer);if(topic==='Submit a support request')btn('OPEN SUPPORT DRAFT',supportForm);btn('BACK TO DEPARTMENT',()=>show());}));btn('CLOSE',close);}
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
