// HEXCORE ZIP 2 // Visitor tower directory; informational, no account or backend.
export function installTowerDirectory() {
  const button=document.createElement('button');
  button.id='hexcore-tower-directory-button';
  button.textContent='TOWER DIRECTORY';
  button.style.cssText='position:fixed;top:50px;left:14px;z-index:170;background:rgba(12,16,35,.85);border:1px solid #9867e8;color:#cbeaff;padding:9px 12px;font:11px Consolas,monospace;cursor:pointer;display:none';
  document.body.appendChild(button);
  const overlay=document.createElement('div');
  overlay.style.cssText='display:none;position:fixed;inset:0;z-index:600;align-items:center;justify-content:center;padding:16px;background:rgba(4,7,20,.91);font-family:Consolas,monospace;color:#e9eaff';
  const card=document.createElement('section');
  card.style.cssText='width:min(650px,95vw);max-height:87dvh;overflow:auto;background:linear-gradient(145deg,#101d37,#1c1035);border:1px solid #9867e8;box-shadow:0 0 55px #392070;padding:22px;box-sizing:border-box';
  overlay.appendChild(card);document.body.appendChild(overlay);
  const floors=[['G','HEXCORE TOWER LOBBY','Visitor services, city access, Future Worlds and general information'],['01','ADMINISTRATION & LEGAL','Company representative, legal counsel, privacy officer and intellectual property counsel'],['02','CUSTOMER SUPPORT','Help articles, support preparation and request draft'],['03','COMMUNITY & EVENTS','City celebrations, community information and planned release gatherings'],['04','BUSINESS & PARTNERSHIPS','Company introductions, collaborators and partnership information'],['05','GAME DEVELOPMENT','Game production, project pipeline and demonstration philosophy'],['06','HARDWARE LAB','System, controller and physical game concepts'],['B1','FUTURE MMORPG ENTRY','Reserved for future development; not an accessible RPG yet']];
  let opened=false;
  function close(){if(!opened)return;opened=false;overlay.style.display='none';if(window.hexcoreUIFocus)window.hexcoreUIFocus.close();else window.hexcoreDialogueOpen=false;}
  function show(){if(opened||window.hexcoreDialogueOpen)return;opened=true;overlay.style.display='flex';if(window.hexcoreUIFocus)window.hexcoreUIFocus.open();else window.hexcoreDialogueOpen=true;card.replaceChildren();
    const heading=document.createElement('h2');heading.textContent='HEXCORE // TOWER DIRECTORY';heading.style.color='#a5e7ff';card.appendChild(heading);
    const intro=document.createElement('p');intro.textContent='Use the lobby elevator to reach a department. This directory displays public visitor information only.';card.appendChild(intro);
    for(const [num,name,desc] of floors){let row=document.createElement('div');row.style.cssText='padding:12px 7px;border-bottom:1px solid #453570';const nameNode=document.createElement('strong');nameNode.style.color='#dfbdff';nameNode.textContent=num+' // '+name;row.appendChild(nameNode);let detail=document.createElement('p');detail.textContent=desc;detail.style.cssText='font-size:12px;line-height:1.5;margin:5px 0';row.appendChild(detail);card.appendChild(row);}
    const exit=document.createElement('button');exit.textContent='CLOSE DIRECTORY';exit.style.cssText='width:100%;margin-top:15px;padding:13px;background:#352255;border:1px solid #9962ed;color:#fff;cursor:pointer';exit.onclick=close;card.appendChild(exit);
  }
  button.onclick=show;
  window.addEventListener('hexcore-player-position',e=>{const p=e.detail;if(!p)return;const loc=Math.abs(p.x-800)<40&&Math.abs(p.z-800)<36;const mainFloor=Math.abs(p.x-900)<25&&Math.abs(p.z-900)<25;const dep=Math.abs(p.z-1150)<45&&p.x>=1100&&p.x<1750;button.style.display=loc||mainFloor||dep?'block':'none';if(!loc&&!mainFloor&&!dep)close();});
  window.addEventListener('keydown',e=>{if(e.code==='Escape'&&opened)close();});
}
