// V4.32: hide the non-functional main-dungeon explanatory subtitle while preserving tower text.
(()=>{
  const hideMainSubtitle=()=>{
    if(battle?.tower427)return;
    const sub=$('screen')?.querySelector('.sub');
    if(sub){sub.textContent='';sub.style.display='none';}
  };

  const oldRenderScreen432=renderScreen;
  renderScreen=function(){
    const r=oldRenderScreen432.apply(this,arguments);
    hideMainSubtitle();
    return r;
  };

  const oldTowerStart432=window.v427StartTower;
  if(typeof oldTowerStart432==='function'){
    window.v427StartTower=function(){
      const r=oldTowerStart432.apply(this,arguments);
      setTimeout(()=>{
        if(battle?.tower427){
          const sub=$('screen')?.querySelector('.sub');
          if(sub)sub.style.display='';
        }
      },0);
      return r;
    };
  }

  hideMainSubtitle();
})();
