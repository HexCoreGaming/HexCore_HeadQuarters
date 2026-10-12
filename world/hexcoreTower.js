import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE TOWER // LANDMARK, LOBBY, ELEVATOR, DEPARTMENTS
// =====================================================
export function createHexcoreTower(scene, renderer) {
    // SECTION 01 // LOCATIONS
    const SITE = {x: 224, z: 110};
    const LOBBY = {x: 800, z: 800};
    const FLOOR = {x: 900, z: 900};
    const player = {x: 0, z: 15};
    let mode = "city", cooldown = 0, elapsed = 0;
    let dialogueOpen = false, elevatorOpen = false;
    const mat = (color, glow=0) => new THREE.MeshStandardMaterial({
        color, metalness:0.76, roughness:0.32,
        emissive:color, emissiveIntensity:glow
    });
    const black = mat(0x0d101d), glass = mat(0x1b2541), violet=mat(0x7235d2,0.4), aqua=mat(0x5cdbff,0.6), pink=mat(0xc03ce7,0.45), gold=mat(0xe4a761,0.2);
    const makeBox=(g,w,h,d,x,y,z,m)=>{ const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o;};
    const pole=(g,r1,r2,h,x,y,z,m,n=6)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),m);o.position.set(x,y,z);g.add(o);return o;};
    const sign=(g,text,w,h,x,y,z,color="#9BE8FF",rotation=0)=>{
        const cv=document.createElement("canvas");cv.width=1024;cv.height=256;
        const ctx=cv.getContext("2d");ctx.fillStyle="#100d20";ctx.fillRect(0,0,1024,256);
        ctx.strokeStyle=color;ctx.lineWidth=9;ctx.strokeRect(7,7,1010,242);
        ctx.fillStyle="#ffffff";ctx.textAlign="center";ctx.textBaseline="middle";
        let f=96;do{ctx.font=`bold ${f}px Arial`;f-=4;}while(ctx.measureText(text).width>960 && f>23);
        ctx.fillText(text,512,130);
        const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;
        const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));
        o.position.set(x,y,z);o.rotation.y=rotation;g.add(o);return o;
    };

    // SECTION 02 // EXTERIOR: EXTRAVAGANT GEOMETRY
    const tower = new THREE.Group(); tower.position.set(SITE.x,0,SITE.z);scene.add(tower);
    makeBox(tower,56,1,56,0,-0.45,0,black);
    makeBox(tower,52,.12,52,0,.05,0,glass);
    pole(tower,17,21,34,0,17,0,black,7);
    pole(tower,13,16,38,0,53,0,glass,8);
    pole(tower,9,13,30,0,85,0,black,6);
    pole(tower,1.1,3,32,0,113,0,violet,6);
    const shards=[];
    for(let i=0;i<9;i++){
        let a=i*Math.PI*2/9;
        const o=makeBox(tower,4.5,30+(i%3)*8,6.5,Math.cos(a)*17,32+(i%2)*9,Math.sin(a)*17,i%2?aqua:violet);
        o.rotation.z=Math.sin(a)*.33;o.rotation.x=Math.cos(a)*.22;shards.push(o);
    }
    for(let y=8;y<104;y+=9){
        const radius=y<34?18:y<72?14:10;
        for(let a=0;a<8;a++){let rad=a*Math.PI/4;
            makeBox(tower,.5,3,.45,Math.cos(rad)*radius,y,Math.sin(rad)*radius,a%2?aqua:pink);
        }
    }
    const halos=[];
    for(let i=0;i<3;i++){
        const ring=new THREE.Mesh(new THREE.TorusGeometry(13-i*2,.22,8,68),i%2?aqua:violet);
        ring.position.y=78+i*10;ring.rotation.x=.3+i*.25; tower.add(ring);halos.push(ring);
    }
    // Massive HEXCORE signs visible facing both main-city and outer island.
    sign(tower,"HEXCORE",34,7,0,108,-13,"#A24CFF");
    sign(tower,"HEXCORE",34,7,0,108,13,"#A24CFF",Math.PI);
    // Tower entrance faces city to the west.
    makeBox(tower,1,9,13,-18,4.6,0,violet);
    makeBox(tower,1,1,13,-18,9.6,0,aqua);
    sign(tower,"WELCOME TO HEXCORE",16,3,-20,13,0,"#8CD6FD",-Math.PI/2);
    // Walkable bridge runs from east side of main island to tower island.
    const bridge = new THREE.Group();scene.add(bridge);
    makeBox(bridge,85,.55,10,140,-.25,110,black);
    makeBox(bridge,85,.09,.15,140,.08,105,violet);
    makeBox(bridge,85,.09,.15,140,.08,115,aqua);
    for(let x=102;x<183;x+=10)makeBox(bridge,.22,.07,10,x,.1,110,gold);
    const lantern=new THREE.PointLight(0x8650e8,18,65);lantern.position.set(SITE.x,25,SITE.z);tower.add(lantern);

    // SECTION 03 // GRAND LOBBY (SEPARATE ROOM)
    const hall=new THREE.Group();hall.position.set(LOBBY.x,0,LOBBY.z);scene.add(hall);
    makeBox(hall,76,.3,70,0,-.15,0,black);
    makeBox(hall,76,.4,70,0,19,0,glass);
    makeBox(hall,76,19,.4,0,9.5,-35,glass);
    makeBox(hall,.4,19,70,-38,9.5,0,glass);
    makeBox(hall,.4,19,70,38,9.5,0,glass);
    makeBox(hall,31,19,.4,-22.5,9.5,35,glass);
    makeBox(hall,31,19,.4,22.5,9.5,35,glass);
    makeBox(hall,14,13,.4,0,12.5,35,glass);
    for(let x=-30;x<=30;x+=10){makeBox(hall,.11,.06,65,x,.12,0,violet);}
    for(let z=-30;z<=30;z+=10){makeBox(hall,70,.06,.11,0,.12,z,aqua);}
    for(let x of [-32,32])for(let z of [-28,-12,4,20]){
        pole(hall,.65,.8,18,x,9,z,glass,8);pole(hall,.15,.15,12,x,11,z,violet,8);
    }
    sign(hall,"HEXCORE // CENTRAL TOWER",27,5,0,12,-34.4,"#BC80FF");
    sign(hall,"ELEVATOR",10,2,0,5,-28,"#8CD6FD");
    makeBox(hall,12,.3,4,0,1,-30,black);
    makeBox(hall,.4,7,11,-6.2,3.5,-29,magentaFallback());
    makeBox(hall,.4,7,11,6.2,3.5,-29,violet);
    function magentaFallback(){return pink;}
    makeBox(hall,15,.35,5,-23,1,-13,glass);
    sign(hall,"VISITOR SERVICES",11,2,-23,4,-16,"#8CD6FD");
    sign(hall,"EXIT TO CITY",9,2,0,7,34.4,"#8CD6FD",Math.PI);
    hall.add(new THREE.HemisphereLight(0xbac9ff,0x15101e,2.1));
    for(let [x,z,c] of [[-20,-14,0x8550e8],[20,-14,0x8cdbfd],[0,15,0xc23be7]]){
        const l=new THREE.PointLight(c,26,48);l.position.set(x,9,z);hall.add(l);
    }

    // SECTION 04 // DEPARTMENT FLOOR & THEMED PORTAL
    const floor=new THREE.Group();floor.position.set(FLOOR.x,0,FLOOR.z);scene.add(floor);
    makeBox(floor,50,.3,50,0,-.15,0,black);
    makeBox(floor,50,.3,50,0,13,0,glass);
    makeBox(floor,50,13,.4,0,6.5,-25,glass);
    makeBox(floor,.4,13,50,-25,6.5,0,glass);
    makeBox(floor,.4,13,50,25,6.5,0,glass);
    makeBox(floor,20,13,.4,-15,6.5,25,glass);
    makeBox(floor,20,13,.4,15,6.5,25,glass);
    makeBox(floor,10,6,.4,0,10,25,glass);
    sign(floor,"ADMINISTRATION & LEGAL",27,4,0,9,-24.6,"#C89BFF");
    makeBox(floor,12,.3,.5,0,7,-20,violet);
    makeBox(floor,.5,7,.5,-6,3.5,-20,aqua);
    makeBox(floor,.5,7,.5,6,3.5,-20,aqua);
    sign(floor,"ENTER ADMINISTRATION",17,2.5,0,8,-19.5,"#D8B3FF");
    sign(floor,"RETURN TO ELEVATOR",18,2.5,0,7,24.4,"#8CD6FD",Math.PI);
    floor.add(new THREE.HemisphereLight(0xbab0ff,0x15101e,2.2));

    // SECTION 05 // IN-GAME ELEVATOR AND FLOOR SELECTION UI
    const overlay=document.createElement('div');
    Object.assign(overlay.style,{position:'fixed',inset:0,display:'none',alignItems:'center',justifyContent:'center',background:'rgba(6,5,16,.84)',zIndex:320,padding:'12px',boxSizing:'border-box',fontFamily:'Consolas,monospace'});
    const panel=document.createElement('div');
    Object.assign(panel.style,{background:'#100c21',color:'#eee6ff',border:'1px solid #8c50e8',boxShadow:'0 0 30px #5627a7',padding:'20px',width:'min(540px,96vw)',maxHeight:'88dvh',overflowY:'auto'});
    overlay.appendChild(panel);document.body.appendChild(overlay);
    const hint=document.createElement('button');hint.type='button';
    Object.assign(hint.style,{position:'fixed',bottom:'110px',left:'50%',transform:'translateX(-50%)',border:'1px solid #8c50e8',background:'#110e20',color:'#8cdbfd',padding:'12px',zIndex:175,cursor:'pointer',fontFamily:'Consolas,monospace',display:'none'});
    document.body.appendChild(hint);
    const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.style,{display:'block',width:'100%',margin:'8px 0',padding:'12px',color:'#eee6ff',background:'#25163e',border:'1px solid #7549bc',cursor:'pointer',textAlign:'left',fontFamily:'Consolas,monospace',touchAction:'manipulation'});b.onclick=fn;panel.appendChild(b);};
    function close(){overlay.style.display='none';dialogueOpen=false;elevatorOpen=false;window.hexcoreDialogueOpen=false;}
    function openElevator(){if(dialogueOpen||window.hexcoreDialogueOpen===true)return;dialogueOpen=true;elevatorOpen=true;window.hexcoreDialogueOpen=true;overlay.style.display='flex';hint.style.display='none';panel.replaceChildren();
        const h=document.createElement('h2');h.textContent='HEXCORE // TOWER ELEVATOR';h.style.color='#8cdbfd';panel.appendChild(h);
        button('01 // ADMINISTRATION & LEGAL',()=>{close();travel('floor');});
        for(const name of ['02 // CUSTOMER SUPPORT','03 // COMMUNITY','04 // BUSINESS & PARTNERSHIPS','05 // DEVELOPMENT','06 // HARDWARE','B1 // FUTURE MMORPG WORLD']){
            button(name,()=>{
                const id=name.slice(0,2);
                if(id==='B1'){const info=document.getElementById('hexcore-floor-message');if(info)info.textContent='The MMORPG gateway is reserved for future development.';return;}
                close();if(typeof window.hexcoreVisitTowerDepartment==='function'){mode='department';window.hexcoreVisitTowerDepartment(id);}else{const info=document.getElementById('hexcore-floor-message');if(info)info.textContent='This department is initializing.';}
            });
        }
        const note=document.createElement('p');note.id='hexcore-floor-message';note.style.color='#cdb4ff';panel.appendChild(note);
        button('GROUND // RETURN TO LOBBY',()=>{close();travel('lobby');});
        button('CLOSE',close);
        if(document.pointerLockElement)document.exitPointerLock();
    }
    function travel(destination){if(typeof window.hexcoreTeleportPlayer!=='function')return;
        mode=destination;cooldown=1.4;
        if(destination==='city') {window.hexcoreInteriorActive=false;window.hexcoreInteriorBounds=null;window.hexcoreTeleportPlayer(196,110,Math.PI/2);}
        if(destination==='lobby'){window.hexcoreInteriorActive=true;window.hexcoreInteriorBounds={minX:LOBBY.x-37,maxX:LOBBY.x+37,minZ:LOBBY.z-34,maxZ:LOBBY.z+34};window.hexcoreTeleportPlayer(800,824,0);}
        if(destination==='floor'){window.hexcoreInteriorActive=true;window.hexcoreInteriorBounds={minX:875,maxX:925,minZ:875,maxZ:925};window.hexcoreTeleportPlayer(900,913,0);}
    }
    // Tower and staff interfaces are additive; don't overwrite receptionist binding.
    window.hexcoreTowerReturnToLobby = () => {close();travel('lobby');};
    const oldInteract=window.hexcoreInteract;
    window.hexcoreInteract=function(){if(mode==='lobby'||mode==='floor'){if(hint.style.display!=='none')interact();else if(mode==='lobby'&&typeof window.hexcoreExperienceInteract==='function')window.hexcoreExperienceInteract();}else if(mode==='department' && typeof window.hexcoreDepartmentInteract==='function'){window.hexcoreDepartmentInteract();}else if(typeof oldInteract==='function')oldInteract();};
    function interact(){if(window.hexcoreDialogueOpen===true)return;
        if(mode==='lobby' && Math.hypot(player.x-800,player.z-772)<10)openElevator();
        else if(mode==='floor' && player.z>911)openElevator();
    }
    window.addEventListener('keydown',e=>{if(e.code==='KeyE'&&!e.repeat)interact();if(e.code==='Escape'&&elevatorOpen)close();});
    hint.onclick=interact;
    window.addEventListener('hexcore-player-position',e=>{player.x=e.detail.x;player.z=e.detail.z;});
    // after Administration sends player to tower floor, restore floor mode
    window.addEventListener('hexcore-admin-exited',()=>{mode='floor';cooldown=1.2;});

    // SECTION 06 // PER-FRAME TRANSITIONS
    const clock=new THREE.Clock();
    function updateHexcoreTower(){const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;cooldown=Math.max(0,cooldown-dt);
        for(let i=0;i<halos.length;i++)halos[i].rotation.y+=dt*(.12+i*.06);
        lantern.intensity=14+Math.sin(elapsed*1.7)*4;
        let nearElevator=false;
        if(mode==='city' && cooldown===0 && window.hexcoreDoorUnlocked===true && window.hexcoreDialogueOpen!==true && Math.abs(player.x-197)<5 && Math.abs(player.z-110)<7)travel('lobby');
        if(mode==='lobby'){
            if(cooldown===0 && Math.abs(player.x-800)<6 && player.z>831){travel('city');return;}
            nearElevator=Math.hypot(player.x-800,player.z-772)<10;
        }
        if(mode==='floor'){
            if(cooldown===0 && Math.abs(player.x-900)<6 && player.z<882){
                // Return to the existing room, without rebuilding its NPC dialogue.
                if(typeof window.hexcoreEnterAdminRoom==='function'){
                    window.hexcoreAdminReturn={x:900,z:908,yaw:Math.PI};
                    mode='admin';cooldown=1.4;window.hexcoreEnterAdminRoom();return;
                }
            }
            nearElevator=player.z>911 && Math.abs(player.x-900)<9;
        }
        hint.style.display=nearElevator && !dialogueOpen && window.hexcoreDialogueOpen!==true?'block':'none';
        hint.textContent=mode==='lobby'?'E / TAP // USE HEXCORE ELEVATOR':'E / TAP // FLOOR DIRECTORY';
    }
    return updateHexcoreTower;
}
