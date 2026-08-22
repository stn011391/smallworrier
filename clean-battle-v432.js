// V4.32/V4.33 bridge: keep the compact battle layout and load automatic encounter flow.
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

  function applyV433Labels(){
    document.title='勇者學院 V4.33｜自動接戰版';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='勇者學院 V4.33：取消主線怪物預告卡與「繼續前進」按鈕。進入地下城後直接遭遇下一隻怪物，勝利後自動接續事件與下一戰，一路推進到 Boss。所有題目維持四選一。';
    const brand=document.querySelector('.brand');
    if(brand)brand.textContent='⚔️ 勇者學院 V4.33｜自動接戰版';
    const hero=document.querySelector('.hero');
    if(hero){
      const h=hero.querySelector('h1');
      const p=hero.querySelector('p');
      if(h)h.textContent='進入地下城就直接開打，一路自動推進到 Boss！';
      if(p)p.textContent='V4.33 取消怪物預告卡與「繼續前進，遭遇下一隻」按鈕。每場勝利後會直接銜接地下城事件與下一隻怪物，不再多一層確認畫面；主線維持線性推進，題目全部四選一。';
    }
  }

  function loadV433(){
    if(window.v433AutoEncounter){applyV433Labels();return;}
    if(document.querySelector('script[data-v433]'))return;
    const s=document.createElement('script');
    s.src='auto-encounter-v433.js';
    s.dataset.v433='1';
    s.onload=applyV433Labels;
    document.body.appendChild(s);
  }

  hideMainSubtitle();
  loadV433();
})();
