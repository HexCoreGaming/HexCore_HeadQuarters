// HEXCORE // Shared pointer-lock behavior for every public interface.
// User must be able to click modal options; browser may require a click to resume looking.
export function installInteractionFocus(renderer) {
  const canvas=renderer.domElement;
  const desktop=()=>!window.matchMedia('(pointer: coarse)').matches;
  const focus={openCount:0,returnToLook:false};
  window.hexcoreUIFocus={
    open(){
      if(focus.openCount++===0){focus.returnToLook=desktop()&&document.pointerLockElement===canvas;}
      window.hexcoreDialogueOpen=true;
      if(document.pointerLockElement)document.exitPointerLock();
    },
    close(){
      focus.openCount=Math.max(0,focus.openCount-1);
      if(focus.openCount!==0)return;
      window.hexcoreDialogueOpen=false;
      if(desktop()&&focus.returnToLook&&document.pointerLockElement!==canvas){
        canvas.requestPointerLock().catch(()=>{
          let tip=document.getElementById('hexcore-resume-look');
          if(!tip){tip=document.createElement('div');tip.id='hexcore-resume-look';tip.textContent='CLICK THE WORLD TO RESUME LOOKING';tip.style.cssText='position:fixed;left:50%;top:16%;transform:translateX(-50%);padding:12px 18px;color:#b4eaff;background:rgba(4,7,18,.87);border:1px solid #8bdcff;z-index:180;pointer-events:none;font:12px Consolas,monospace';document.body.appendChild(tip);}
          tip.style.display='block';
        });
      }
      focus.returnToLook=false;
    }
  };
  document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement===canvas){let tip=document.getElementById('hexcore-resume-look');if(tip)tip.style.display='none';}});
}
