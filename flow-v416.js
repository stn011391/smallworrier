// V4.16 next unfinished dungeon + true 30/30 completion screen.
(()=>{
  function nextUncleared(after=st.world){return worlds.find(w=>w.id>after&&!st.cleared.includes(w.id))||worlds.find(w=>!st.cleared.includes(w.id));}
  window.v416Scroll=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  window.showV416Victory=function(){
    const totalDex=Array.isArray(st.monsterDex)?st.monsterDex.length:150,petCount=st.pets?Object.values(st.pets).filter(x=>Number(x)>0).length:0,gearCount=(st.lootGear||[]).length;
    if($('screen'))$('screen').innerHTML=`<div class="v416Victory"><div class="crown">👑🏆🌌</div><h2>30 / 30 COMPLETE！</h2><p>六大章節全部攻略完成。你已成為傳說勇者！</p><div class="v416VictoryStats"><b>📖 怪物圖鑑 ${Math.min(150,totalDex)}/150</b><b>🐾 寵物 ${petCount}/6</b><b>⚔️ 裝備收藏 ${gearCount}</b></div><div class="v416VictoryActions"><button class="btn gold" onclick="v416Scroll('monsterDex')">📖 查看怪物圖鑑</button><button class="btn purple" onclick="v416Scroll('petsPanel')">🐾 查看寵物</button><button class="btn blue" onclick="v416Scroll('progressionPanel')">🏅 查看六大世代</button></div></div>`;
    toast('👑 30 大地下城全部完成！');
  };
  window.v416NextDungeon=function(){const n=nextUncleared();if(n){openWorld(n.id);setTimeout(()=>$('screen')?.scrollIntoView({behavior:'smooth'}),50);}else showV416Victory();};
  nextWorld=function(){return v416NextDungeon()};

  const oldClearWorldFlow=clearWorld;
  clearWorld=function(id){
    const r=oldClearWorldFlow.apply(this,arguments);
    if(window.v416Challenge?.syncMilestones)v416Challenge.syncMilestones();
    if(typeof renderMap==='function')renderMap();
    const n=nextUncleared(id);
    if(!n){showV416Victory();return r;}
    if($('statusText'))$('statusText').innerHTML=`🏆 Dungeon ${id} 完成！下一個未完成地下城是 <b>Dungeon ${n.id}｜${n.name}</b>。`;
    if($('actions'))$('actions').innerHTML='<button class="btn gold" onclick="v416NextDungeon()">➡️ 前往下一個未完成地下城</button>';
    return r;
  };

  startAdventure=function(){const n=nextUncleared(0);if(n){openWorld(n.id);setTimeout(()=>$('screen')?.scrollIntoView({behavior:'smooth'}),50);}else showV416Victory();};
})();