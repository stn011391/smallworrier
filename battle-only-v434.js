// V4.34: main story uses one continuous battle stage; no continue/next-monster screen.
(()=>{
  const modalOpen=id=>document.getElementById(id)?.classList.contains('show');
  const isTower=()=>!!battle?.tower427;
  const mainWorld=()=>worlds?.[Number(st.world||1)-1]||null;
  const nextIndex=w=>{
    if(!w)return -1;
    if(window.v431Linear?.nextMonsterIndex)return window.v431Linear.nextMonsterIndex(w);
    const done=Array.isArray(st.defeated?.[w.id])?st.defeated[w.id]:[];
    for(let i=0;i<w.m.length;i++)if(!done.includes(i))return i;
    return -1;
  };

  function hideNonBattleUI(){
    if(isTower())return;
    const screen=$('screen');
    const sub=screen?.querySelector('.sub');
    const grid=$('enemyGrid');
    if(sub)sub.style.display='none';
    if(grid){grid.innerHTML='';grid.style.display='none';}
    if($('actions')&&!battle?.active)$('actions').innerHTML='';
  }

  function canStart(){
    if(isTower()||battle?.active)return false;
    if(modalOpen('qModal')||modalOpen('eventModal')||modalOpen('levelModal'))return false;
    const w=mainWorld();
    return !!w&&!st.cleared.includes(w.id)&&nextIndex(w)>=0;
  }

  function startNextNow(){
    hideNonBattleUI();
    if(!canStart())return false;
    const w=mainWorld(),idx=nextIndex(w);
    if(idx<0)return false;
    selectEnemy(idx);
    return true;
  }

  // Never render the monster preview / "continue forward" area in the main story.
  const oldRenderEnemies434=renderEnemies;
  renderEnemies=function(){
    if(isTower())return oldRenderEnemies434.apply(this,arguments);
    const grid=$('enemyGrid');
    if(grid){grid.innerHTML='';grid.style.display='none';}
    return undefined;
  };

  const oldRenderScreen434=renderScreen;
  renderScreen=function(){
    const r=oldRenderScreen434.apply(this,arguments);
    hideNonBattleUI();
    return r;
  };

  // Enter the dungeon and immediately put the next monster into the same battle stage.
  const oldOpenWorld434=openWorld;
  openWorld=function(id){
    const r=oldOpenWorld434.apply(this,arguments);
    hideNonBattleUI();
    setTimeout(startNextNow,0);
    return r;
  };

  // Suppress every legacy "continue / next area" button after a main-story victory.
  let pendingAdvance=false;
  const oldWinBattle434=winBattle;
  winBattle=function(){
    const main=!!battle&&!battle.rare&&!battle.tower427;
    const r=oldWinBattle434.apply(this,arguments);
    if(!main)return r;
    if($('actions'))$('actions').innerHTML='';
    pendingAdvance=true;
    setTimeout(v434Advance,420);
    return r;
  };

  window.v434Advance=function(){
    if(!pendingAdvance)return;
    if(modalOpen('levelModal'))return;
    pendingAdvance=false;
    if(typeof continueAdventure==='function')continueAdventure();
    hideNonBattleUI();
    // Normal dungeon events may appear here. If there is no modal, place the next monster immediately.
    setTimeout(()=>{if(!modalOpen('eventModal'))startNextNow()},0);
  };

  // If level-up temporarily interrupts the chain, resume without an intermediate page.
  const oldCloseLevel434=closeLevel;
  closeLevel=function(){
    const r=oldCloseLevel434.apply(this,arguments);
    hideNonBattleUI();
    if(pendingAdvance)setTimeout(v434Advance,0);
    return r;
  };

  // Closing any dungeon event returns straight to the battle stage and loads the next monster.
  const oldContinueAfterEvent434=continueAfterEvent;
  continueAfterEvent=function(){
    const r=oldContinueAfterEvent434.apply(this,arguments);
    hideNonBattleUI();
    setTimeout(startNextNow,0);
    return r;
  };

  const oldReturnAfterRare434=returnAfterRare;
  returnAfterRare=function(){
    const r=oldReturnAfterRare434.apply(this,arguments);
    hideNonBattleUI();
    setTimeout(startNextNow,0);
    return r;
  };

  // Tower keeps its own layout; main-story battle returns to battle-only mode on exit/openWorld.
  const oldTowerStart434=window.v427StartTower;
  if(typeof oldTowerStart434==='function'){
    window.v427StartTower=function(){
      const grid=$('enemyGrid');if(grid)grid.style.display='';
      return oldTowerStart434.apply(this,arguments);
    };
  }

  hideNonBattleUI();
  window.v434BattleOnly={startNextNow,hideNonBattleUI};
})();
