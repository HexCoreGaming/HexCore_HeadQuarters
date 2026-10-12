import { HEXCORE_WORLD } from '../world/worldLayout.js';

// Non-teleporting visitor guide. All positions come from canonical world coordinates.
export function installVisitorDirectory() {
  const names = [
    'Cyber_Arena HEX//BREAK','Where Light Dies','Untamed Horizon','The Forgotten Ashes',
    'The Academy','Future Game Worlds','Administration & Legal','Customer Support',
    'Community & Events','Business & Partnerships','Game Development','HexCore Hardware Lab',
    'HexCore Merchandise','Future Worlds Museum','HexCore Arcade','Gamer Residences'
  ];
  const css=document.createElement('style');css.textContent=`
  #hc-site-tools {position:fixed;right:max(12px,env(safe-area-inset-right));top:max(12px,env(safe-area-inset-top));z-index:150;display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end;max-width:55vw}
  .hc-tool {background:#0b1426e8;border:1px solid #845ada;color:#bdeeff;border-radius:7px;padding:10px 12px;font:600 12px Consolas,monospace;cursor:pointer;min-height:42px}
  .hc-tool:focus-visible,.hc-dest:focus-visible {outline:2px solid #82e9ff;outline-offset:3px}
  #hc-directory-overlay {position:fixed;inset:0;z-index:600;display:none;align-items:center;justify-content:center;padding:14px;background:#040816e8;color:#eef7ff;font:14px system-ui,sans-serif}
  #hc-directory-box {width:min(870px,96vw);max-height:88dvh;overflow:auto;background:linear-gradient(145deg,#101a30,#17102b);border:1px solid #7864c1;border-radius:14px;padding:22px;box-shadow:0 18px 70px #000c}
  .hc-dest {display:block;width:100%;text-align:left;cursor:pointer;padding:12px 14px;border-radius:8px;background:#152641;border:1px solid #3b4e70;color:#ebf2ff;margin:7px 0;font:13px system-ui,sans-serif}
  #hc-directory-points {display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:7px}
  #hc-directory-box h2 {margin-top:0;color:#aee7ff}
  #hc-directory-box small {color:#aebbd3}
  #hc-directory-target {position:fixed;bottom:15%;left:50%;transform:translateX(-50%);z-index:149;background:#0a132aea;border:1px solid #8b6add;border-radius:8px;padding:10px 15px;color:#d8eaff;display:none;max-width:90vw;font:12px Consolas,monospace;pointer-events:none;text-align:center}
  @media(max-width:650px){#hc-site-tools{max-width:85vw;top:10px;right:8px;gap:4px}.hc-tool{padding:9px 8px;font-size:10px}#hc-directory-box{padding:14px}}
  `;document.head.appendChild(css);
  const toolbar=document.createElement('div');toolbar.id='hc-site-tools';document.body.appendChild(toolbar);
  const openButton=document.createElement('button');openButton.type='button';openButton.className='hc-tool';openButton.textContent='CITY DIRECTORY';toolbar.appendChild(openButton);
  const overlay=document.createElement('div');overlay.id='hc-directory-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','City directory');document.body.appendChild(overlay);
  const box=document.createElement('div');box.id='hc-directory-box';overlay.appendChild(box);
  const title=document.createElement('h2');title.textContent='HEXCORE CITY // VISITOR DIRECTORY';box.appendChild(title);
  const intro=document.createElement('p');intro.textContent='Choose a landmark to display its direction and distance. Follow the direction marker while exploring; this guide does not teleport you.';box.appendChild(intro);
  const close=document.createElement('button');close.className='hc-tool';close.textContent='CLOSE DIRECTORY';box.appendChild(close);
  const list=document.createElement('div');list.id='hc-directory-points';box.appendChild(list);
  const target=document.createElement('div');target.id='hc-directory-target';target.setAttribute('role','status');document.body.appendChild(target);
  let current={x:0,z:0},goal=null,opened=false;
  const nodes=[{name:'HexCore Tower',x:HEXCORE_WORLD.tower.x,z:HEXCORE_WORLD.tower.z},{name:'Starting Headquarters',x:HEXCORE_WORLD.hub.x,z:HEXCORE_WORLD.hub.z},...names.map((name,i)=>({name,x:HEXCORE_WORLD.sites[i].x,z:HEXCORE_WORLD.sites[i].z+29}))];
  for(const node of nodes){const b=document.createElement('button');b.className='hc-dest';b.textContent=node.name;b.addEventListener('click',()=>{goal=node;hide();updateTarget();});list.appendChild(b);}
  function show(){if(opened)return;opened=true;overlay.style.display='flex';if(window.hexcoreUIFocus)window.hexcoreUIFocus.open();else window.hexcoreDialogueOpen=true;close.focus();}
  function hide(){if(!opened)return;opened=false;overlay.style.display='none';if(window.hexcoreUIFocus)window.hexcoreUIFocus.close();else window.hexcoreDialogueOpen=false;openButton.focus();}
  function updateTarget(){if(!goal){target.style.display='none';return;}const dx=goal.x-current.x,dz=goal.z-current.z,dist=Math.hypot(dx,dz);if(dist<13){target.textContent='ARRIVED NEAR: '+goal.name;return;}const angle=Math.atan2(dx,dz)*180/Math.PI;const heading=((angle+360)%360).toFixed(0);target.textContent='DESTINATION: '+goal.name+'  //  '+Math.round(dist)+'m  //  COMPASS '+heading+'°';target.style.display='block';}
  openButton.addEventListener('click',show);close.addEventListener('click',hide);
  overlay.addEventListener('click',e=>{if(e.target===overlay)hide();});
  document.addEventListener('keydown',e=>{if(e.code==='Escape'&&opened){e.stopImmediatePropagation();hide();}});
  let last=0;
  window.addEventListener('hexcore-player-position',e=>{current=e.detail;if(goal&&performance.now()-last>160){last=performance.now();updateTarget();}});
  return {toolbar,registerButton:(label,onClick)=>{const button=document.createElement('button');button.className='hc-tool';button.textContent=label;button.addEventListener('click',onClick);toolbar.appendChild(button);return button;},setGoal:(name)=>{goal=nodes.find(n=>n.name===name)||null;updateTarget();}};
}
