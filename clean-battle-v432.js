// V4.35 bridge: keep battle-only main story and label the expanded-question release.
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

  function applyV435Labels(){
    document.title='勇者學院 V4.35｜大題庫版';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='勇者學院 V4.35：大幅擴充數學、英文、科學與邏輯題庫。同一學習概念加入更多問法與情境，最終防重複歷史延長到 500 題；保留純戰鬥主線、四選一、自適應學習與英文 1/3。';
    const brand=document.querySelector('.brand');
    if(brand)brand.textContent='⚔️ 勇者學院 V4.35｜大題庫版';
    const hero=document.querySelector('.hero');
    if(hero){
      const h=hero.querySelector('h1');
      const p=hero.querySelector('p');
      if(h)h.textContent='題庫大幅擴充，同一概念不再一直看到相似題！';
      if(p)p.textContent='V4.35 新增大量動態題型：數學不只換數字，還加入應用、反推、比較與不同情境；英文增加字彙、拼字、時態、複數、文法與短閱讀；科學與邏輯題也同步擴充。一般出題的最終防重複紀錄提升到 500 題。';
    }
  }

  function loadBattleOnly(){
    if(window.v434BattleOnly){applyV435Labels();return;}
    if(document.querySelector('script[data-v434]'))return;
    const s=document.createElement('script');
    s.src='battle-only-v434.js';
    s.dataset.v434='1';
    s.onload=applyV435Labels;
    document.body.appendChild(s);
  }

  hideMainSubtitle();
  loadBattleOnly();
  setTimeout(applyV435Labels,0);
})();
