// V4.33: remove the intermediate monster-preview step and auto-chain main-story encounters.
(()=>{
  const modalOpen=id=>document.getElementById(id)?.classList.contains('show');
  const isTower=()=>!!battle?.tower427;
  const nextIndex=w=>window.v431Linear?.nextMonsterIndex?.(w) ?? (()=>{
    const done=Array.isArray(st.defeated?.[w.id])?st.defeated[w.id]:[];
    for(let i=0;i<w.m.length;i++)if(!done.includes(i))return i;
    return -1;
  })();

  function canStartMainEncounter(){
    if(isTower()||battle?.active)return false;
    if(modalOpen('qModal')||modalOpen('eventModal')||modalOpen('levelModal'))return false;
    const w=worlds[st.world-1];
    if(!w||st.cleared.includes(w.id))return false;
    return nextIndex(w)>=0;
  }

  function startNextEncounter(){
    if(!canStartMainEncounter())return false;
    const w=worlds[st.world-1],idx=nextIndex(w);
    if(idx<0)return false;
    selectEnemy(idx);
    return true;
  }

  function queueNextEncounter(delay=180){
    setTimeout(()=>startNextEncounter(),delay);
  }

  // Remove the entire preview/selection card. The arena itself remains and the next monster starts automatically.
  const oldRenderEnemies433=renderEnemies;
  renderEnemies=function(){
    if(isTower())return oldRenderEnemies433.apply(this,arguments);
    const holder=$('enemyGrid');
    if(holder){holder.innerHTML='';holder.classList.add('v433AutoEncounter');}
    if($('actions')&&!battle?.active)$('actions').innerHTML='';
  };

  // Entering the current dungeon immediately starts its next undefeated monster.
  const oldOpenWorld433=openWorld;
  openWorld=function(id){
    const r=oldOpenWorld433.apply(this,arguments);
    queueNextEncounter(220);
    return r;
  };

  // A normal victory no longer asks the player to press "探索下一區域 / 繼續前進".
  let pendingAdvance=false;
  const oldWinBattle433=winBattle;
  winBattle=function(){
    const wasMain=!!battle&&!battle.rare&&!battle.tower427;
    const r=oldWinBattle433.apply(this,arguments);
    if(!wasMain)return r;
    if($('actions'))$('actions').innerHTML='';
    pendingAdvance=true;
    setTimeout(v433AdvanceAfterWin,650);
    return r;
  };

  window.v433AdvanceAfterWin=function(){
    if(!pendingAdvance)return;
    if(modalOpen('levelModal'))return;
    pendingAdvance=false;
    if(typeof continueAdventure==='function')continueAdventure();
    // continueAdventure normally opens a dungeon event. If no event appears, move on immediately.
    setTimeout(()=>{if(!modalOpen('eventModal'))startNextEncounter()},120);
  };

  // If a level-up interrupts the automatic transition, resume after the player closes it.
  const oldCloseLevel433=closeLevel;
  closeLevel=function(){
    const r=oldCloseLevel433.apply(this,arguments);
    if(pendingAdvance)setTimeout(v433AdvanceAfterWin,120);
    return r;
  };

  // After any shop/chest/fountain/fork/trap event is resolved, immediately meet the next main monster.
  const oldContinueAfterEvent433=continueAfterEvent;
  continueAfterEvent=function(){
    const r=oldContinueAfterEvent433.apply(this,arguments);
    queueNextEncounter(160);
    return r;
  };

  // Rare-monster loot can still be acknowledged, but returning from it now rejoins the automatic main-story chain.
  const oldReturnAfterRare433=returnAfterRare;
  returnAfterRare=function(){
    const r=oldReturnAfterRare433.apply(this,arguments);
    queueNextEncounter(160);
    return r;
  };

  // Clean any stale preview produced by older render wrappers.
  const oldRenderScreen433=renderScreen;
  renderScreen=function(){
    const r=oldRenderScreen433.apply(this,arguments);
    if(!isTower()){
      const holder=$('enemyGrid');
      if(holder)holder.innerHTML='';
      if($('actions')&&!battle?.active)$('actions').innerHTML='';
    }
    return r;
  };

  window.v433AutoEncounter={startNextEncounter,queueNextEncounter};
})();
