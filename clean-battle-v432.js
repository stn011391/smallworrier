// V4.38 bridge: battle-only main story loader. Version labels are controlled ONLY by index.html.
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

  function loadBattleOnly(){
    if(window.v434BattleOnly)return;
    if(document.querySelector('script[data-v434]'))return;
    const s=document.createElement('script');
    s.src='battle-only-v434.js?v=438';
    s.dataset.v434='1';
    document.body.appendChild(s);
  }

  hideMainSubtitle();
  loadBattleOnly();
})();
