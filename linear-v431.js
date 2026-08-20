// V4.31 linear main-story flow + forced multiple-choice questions.
(()=>{
  const total=()=>Array.isArray(worlds)?worlds.length:30;
  const isTower=()=>!!battle?.tower427;
  const nextDungeon=()=>worlds.find(w=>!st.cleared.includes(w.id))||null;
  const currentMain=()=>nextDungeon();
  const linearPassed=()=>{let n=0;for(let i=1;i<=total();i++){if(st.cleared.includes(i))n=i;else break;}return n;};
  const doneFor=w=>Array.isArray(st.defeated?.[w.id])?st.defeated[w.id]:[];
  const nextMonsterIndex=w=>{const done=doneFor(w);for(let i=0;i<w.m.length;i++)if(!done.includes(i))return i;return -1;};

  function syncWorld(){
    const n=nextDungeon();
    if(n&&!isTower()&&Number(st.world)!==Number(n.id)){
      st.world=n.id;
      if(typeof store==='function')store();
    }
    return n;
  }

  // ---------- Main dungeon: one destination only ----------
  renderMap=function(){
    const holder=$('map');if(!holder)return;
    const n=syncWorld(),passed=linearPassed(),pct=Math.round(passed/Math.max(1,total())*100);
    if(!n){
      holder.innerHTML=`<div class="v431Journey done"><div class="v431JourneyTop"><span>🏆 MAIN STORY</span><b>30 / 30</b></div><h3>全部地下城完成！</h3><div class="v431JourneyBar"><i style="width:100%"></i></div><p>你已完成全部主線，不需要再選關卡。</p></div>`;
      return;
    }
    const prev=n.id>1?worlds[n.id-2]:null,next=n.id<total()?worlds[n.id]:null;
    holder.innerHTML=`<div class="v431Journey"><div class="v431JourneyTop"><span>🧭 MAIN STORY｜Chapter ${n.chapter}</span><b>${passed} / ${total()}</b></div><div class="v431JourneyBar"><i style="width:${pct}%"></i></div><div class="v431Route"><div class="v431RouteNode past">${prev?`✅ Dungeon ${prev.id}<small>${prev.name}</small>`:'🏁 冒險起點'}</div><div class="v431RouteArrow">➜</div><div class="v431RouteNode current"><span>${n.e}</span><b>Dungeon ${n.id}｜${n.name}</b><small>${n.theme}</small><button class="btn gold" onclick="openWorld(${n.id});setTimeout(()=>$('screen')?.scrollIntoView({behavior:'smooth'}),50)">▶️ 進入目前關卡</button></div><div class="v431RouteArrow locked">➜</div><div class="v431RouteNode future">🔒 ${next?`Dungeon ${next.id}<small>${next.name}</small>`:'最終終點'}</div></div><p class="v431LinearNote">主線採單一路線：完成目前地下城後，才會自動開啟下一關。</p></div>`;
  };

  const oldOpen431=openWorld;
  openWorld=function(id){
    const n=nextDungeon();
    if(!n){if(typeof showV416Victory==='function')showV416Victory();return;}
    if(Number(id)!==Number(n.id)){
      toast(`🔒 請先完成 Dungeon ${n.id}｜${n.name}`);
      return;
    }
    return oldOpen431.call(this,n.id);
  };

  startAdventure=function(){
    const n=nextDungeon();
    if(!n){if(typeof showV416Victory==='function')showV416Victory();return;}
    openWorld(n.id);
    setTimeout(()=>$('screen')?.scrollIntoView({behavior:'smooth'}),50);
  };

  // ---------- Monster flow: only the next undefeated monster ----------
  renderEnemies=function(){
    const w=worlds[st.world-1],holder=$('enemyGrid');if(!w||!holder)return;
    const done=doneFor(w),idx=nextMonsterIndex(w);
    const stages=w.m.map((m,i)=>{
      const state=done.includes(i)?'done':i===idx?'current':'locked';
      return `<div class="v431MonsterStep ${state}"><span>${done.includes(i)?'✅':i===idx?m[0]:'🔒'}</span><b>${i+1}</b><small>${m[3]?'Boss':i===3?'精英':i===2?'進階':'普通'}</small></div>`;
    }).join('');
    if(idx<0){
      holder.innerHTML=`<div class="v431MonsterFlow"><div class="v431MonsterSteps">${stages}</div><div class="v431CurrentMonster cleared"><div class="e">🏆</div><h3>本關 5 隻怪物全部擊敗</h3><p>繼續前進即可結算地下城並開啟下一關。</p></div></div>`;
      return;
    }
    const m=w.m[idx],rank=rankLabel(idx,m);
    holder.innerHTML=`<div class="v431MonsterFlow"><div class="v431MonsterSteps">${stages}</div><div class="v431CurrentMonster ${m[3]?'boss':''}"><div class="v431EncounterNo">第 ${idx+1} / 5 戰</div><div class="e">${m[0]}</div><h3>${m[1]}</h3><p>${rank}｜HP ${m[2]}</p><button class="btn ${m[3]?'red':'purple'}" onclick="v431StartNextMonster()">${m[3]?'🔥 挑戰本關 Boss':'⚔️ 繼續前進，遭遇下一隻'}</button><small>怪物由主線依序安排，不需要選擇。</small></div></div>`;
    if($('statusText')&&!battle?.active)$('statusText').textContent=`🧭 下一個遭遇：第 ${idx+1} 戰｜${m[1]}。按「繼續前進」開始戰鬥。`;
    if($('actions')&&!battle?.active)$('actions').innerHTML='';
  };

  window.v431StartNextMonster=function(){
    if(battle?.active){toast('⚔️ 目前戰鬥還沒結束！');return;}
    const n=currentMain();
    if(!n){if(typeof showV416Victory==='function')showV416Victory();return;}
    if(Number(st.world)!==Number(n.id)){st.world=n.id;store();render();return;}
    const idx=nextMonsterIndex(n);
    if(idx<0){if(typeof continueAdventure==='function')continueAdventure();return;}
    selectEnemy(idx);
  };

  const oldSelect431=selectEnemy;
  selectEnemy=function(i){
    if(isTower())return oldSelect431.apply(this,arguments);
    const n=currentMain();if(!n)return;
    if(Number(st.world)!==Number(n.id)){toast(`🔒 請先完成 Dungeon ${n.id}`);return;}
    const expected=nextMonsterIndex(n);
    if(Number(i)!==Number(expected)){
      const m=n.m[expected];toast(m?`🧭 下一隻固定是 ${m[1]}`:'本關已完成');return;
    }
    return oldSelect431.call(this,expected);
  };

  // ---------- Questions: force every battle question back to four choices ----------
  const oldAsk431=askQuestion;
  askQuestion=function(){
    // V4.28 rotates interaction modes using this counter. Reset before it runs so it renders choice mode directly.
    st.qMode428=0;
    const r=oldAsk431.apply(this,arguments);
    if(!currentQ||!Array.isArray(currentQ.o))return r;
    const box=$('qAnswers'),title=$('qTitle');
    if(title)title.textContent='🎯 四選一｜選出正確答案';
    if(box){
      box.dataset.mode428='choice';
      box.innerHTML=currentQ.o.map((x,i)=>`<button class="ans" onclick="answerQuestion(this,${i})">${x}</button>`).join('');
    }
    return r;
  };

  // Rewrite stale screen wording from older versions after all existing screen decorators have run.
  const oldRenderScreen431=renderScreen;
  renderScreen=function(){
    const r=oldRenderScreen431.apply(this,arguments);
    if(!isTower()){
      const sub=$('screen')?.querySelector('.sub');
      if(sub)sub.textContent='本區共 5 隻怪獸，依序逐隻推進；擊敗前一隻後才會出現下一隻，最後迎戰 Boss。';
      renderEnemies();
    }
    return r;
  };

  syncWorld();
  if(typeof render==='function')render();
  window.v431Linear={nextDungeon,nextMonsterIndex,linearPassed};
})();
