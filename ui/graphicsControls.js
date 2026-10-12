// Live renderer controls: safe for static hosting; no backend required.
export function installGraphicsControls(renderer, scene, camera, tools) {
 const overlay=document.createElement('div');overlay.id='hc-graphics-dialog';overlay.style.cssText='display:none;position:fixed;inset:0;z-index:620;align-items:center;justify-content:center;background:#040816e8;padding:14px;color:#eef7ff;font:14px system-ui,sans-serif';document.body.appendChild(overlay);
 const p=document.createElement('section');p.style.cssText='background:#11182f;border:1px solid #8460dc;border-radius:14px;padding:24px;max-width:480px;width:94vw;box-shadow:0 20px 65px #000b';overlay.appendChild(p);
 const h=document.createElement('h2');h.textContent='HEXCORE // GRAPHICS';p.appendChild(h);
 const explain=document.createElement('p');explain.textContent='Change quality immediately. Lower settings can improve frame rate on phones and older computers.';p.appendChild(explain);
 const lab=document.createElement('label');lab.textContent='Render quality';lab.style.display='block';p.appendChild(lab);
 const select=document.createElement('select');select.style.cssText='display:block;width:100%;padding:12px;margin:10px 0;background:#132446;border:1px solid #7097c3;color:white';
 [['low','PERFORMANCE (60%)'],['balanced','BALANCED (85%)'],['high','QUALITY (100%)']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;select.appendChild(o);});p.appendChild(select);
 const bright=document.createElement('label');bright.textContent='Scene brightness';bright.style.display='block';p.appendChild(bright);
 const range=document.createElement('input');range.type='range';range.min='.75';range.max='1.45';range.step='.05';range.value='1.08';range.style.width='100%';p.appendChild(range);
 const status=document.createElement('p');status.style.color='#a6dfff';p.appendChild(status);
 const close=document.createElement('button');close.className='hc-tool';close.textContent='SAVE AND CLOSE';p.appendChild(close);
 const quality={low:.6,balanced:.85,high:1};
 function apply(){const ratio=Math.min(window.devicePixelRatio||1,1.25)*quality[select.value];renderer.setPixelRatio(ratio);renderer.setSize(window.innerWidth,window.innerHeight);renderer.toneMappingExposure=Number(range.value);status.textContent='Render scale: '+Math.round(quality[select.value]*100)+'%';try{localStorage.setItem('hexcoreGraphics',JSON.stringify({q:select.value,b:range.value}));}catch{}}
 try{const saved=JSON.parse(localStorage.getItem('hexcoreGraphics')||'null');select.value=quality[saved?.q]?saved.q:'balanced';range.value=Number(saved?.b)>0?String(saved.b):'1.08';}catch{select.value='balanced';}
 select.addEventListener('change',apply);range.addEventListener('input',apply);apply();
 let shown=false;function open(){if(shown)return;shown=true;overlay.style.display='flex';if(window.hexcoreUIFocus)window.hexcoreUIFocus.open();else window.hexcoreDialogueOpen=true;close.focus();}
 function hide(){if(!shown)return;shown=false;overlay.style.display='none';if(window.hexcoreUIFocus)window.hexcoreUIFocus.close();else window.hexcoreDialogueOpen=false;}
 close.addEventListener('click',hide);overlay.addEventListener('click',e=>{if(e.target===overlay)hide();});
 document.addEventListener('keydown',e=>{if(e.code==='Escape'&&shown)hide();});tools.registerButton('GRAPHICS',open);
}
