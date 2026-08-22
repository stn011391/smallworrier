// V4.34 bridge: battle-only main-story stage. No continue/next-monster page.
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

  function applyV434Labels(){
    document.title='勇者學院 V4.34｜純戰鬥主線版';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='勇者學院 V4.34：主線取消「繼續前進／下一隻怪物」畫面，只保留單一戰鬥舞台。進入地下城後直接顯示戰鬥，擊敗怪物後下一隻直接換進同一戰鬥區。所有題目維持四選一。';
    const brand=document.querySelector('.brand');
    if(brand)brand.textContent='⚔️ 勇者學院 V4.34｜純戰鬥主線版';
    const hero=document.querySelector('.hero');
    if(hero){
      const h=hero.querySelector('h1');
      const p=hero.querySelector('p');
      if(h)h.textContent='主線只顯示戰鬥畫面，打完一隻直接接下一隻！';
      if(p)p.textContent='V4.34 完全取消主線中的「繼續前進」與下一隻怪物預告區塊。進入地下城後直接停留在同一個戰鬥舞台，怪物被擊敗後下一隻直接換上場；題目全部維持四選一。';
    }
  }

  function loadV434(){
    if(window.v434BattleOnly){applyV434Labels();return;}
    if(document.querySelector('script[data-v434]'))return;
    const s=document.createElement('script');
    s.src='battle-only-v434.js';
    s.dataset.v434='1';
    s.onload=applyV434Labels;
    document.body.appendChild(s);
  }

  hideMainSubtitle();
  loadV434();
})();
