// V4.16 Strategy layer: challenge guidance, elemental combat, Boss telegraphs, over-level rewards, and robust next-dungeon flow.
(()=>{
  const genNames=['青銅','白銀','黃金','魔法','龍魂','神話'];
  const genIcons=['🟤','⚪','🟡','🔮','🐲','🌌'];
  const milestoneRewards=[null,'bronze_guard_blade','silver_moon_blade','golden_lion_blade','arcane_star_blade','dragon_soul_blade_v415','mythic_cosmos_blade'];
  const skillMeta={
    slash:{icon:'⚔️',short:'斬擊'},fire:{icon:'🔥',short:'火焰斬'},heavy:{icon:'💫',short:'重擊'},
    heal:{icon:'💚',short:'治癒術'},thunder:{icon:'⚡',short:'雷電術'},ice:{icon:'❄️',short:'冰凍術'},ultimate:{icon:'💥',short:'勇者必殺'}
  };

  function currentGeneration(){
    if(window.v415Progression&&typeof v415Progression.unlockedGeneration==='function')return v415Progression.unlockedGeneration();
    let g=1;[5,10,15,20,25].forEach((id,i)=>{if(st.cleared.includes(id)&&g===i+1)g=i+2});return g;
  }
  const recommendedGeneration=id=>Math.max(1,Math.min(6,Math.ceil(id/5)));
  function dangerFor(id){
    const cur=currentGeneration(),rec=recommendedGeneration(id),gap=rec-cur;
    if(gap<=0)return {key:'ready',icon:'🟢',label:'適合挑戰',gap:0};
    if(gap===1)return {key:'hard',icon:'🟡',label:'有點困難',gap};
    if(gap===2)return {key:'danger',icon:'🔴',label:'極度危險',gap};
    return {key:'skull',icon:'💀',label:'越級挑戰',gap};
  }

  // Fix out-of-order chapter clears: if a save already satisfies a generation gate, make sure the representative reward is not lost.
  function syncMilestones(){
    st.chapterRewards=st.chapterRewards&&typeof st.chapterRewards==='object'?st.chapterRewards:{};
    const cur=currentGeneration();let changed=false;
    for(let g=1;g<=cur;g++){
      if(st.chapterRewards[g])continue;
      const id=milestoneRewards[g],gearItem=lootCatalog.find(x=>x.id===id);
      if(gearItem&&!st.lootGear.includes(id)){st.lootGear.push(id);if(!st.equipped[gearItem.slot])st.equipped[gearItem.slot]=id;}
      st.chapterRewards[g]=1;st.coins+=12+g*6;if(typeof st.petEggs==='number')st.petEggs++;changed=true;
    }
    if(changed)store();
  }
  syncMilestones();

  renderMap=function(){
    const holder=$('map');if(!holder)return;
    const cur=currentGeneration();
    holder.style.display='block';
    holder.innerHTML=chapterNames.map((chapterName,idx)=>{
      const list=worlds.filter(w=>w.chapter===idx+1),range=`Dungeon ${idx*5+1}–${idx*5+5}`;
      return `<section class="v416Chapter"><div class="v416ChapterHead"><h3>📖 Chapter ${idx+1}｜${chapterName}</h3><b>${range}</b></div><div class="v416MapGrid">${list.map(w=>{
        const cleared=st.cleared.includes(w.id),d=dangerFor(w.id),rec=recommendedGeneration(w.id);
        const bonus=d.gap>0?'<div class="v416Bonus">🎁 越級勝利：金幣 / XP ×1.5＋額外蛋率</div>':'';
        return `<button class="zone v416Zone ${st.world===w.id?'active':''} ${cleared?'clear locked':''} danger-${d.key}" ${cleared?'disabled':`onclick="openWorld(${w.id})"`}>
          <div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small>
          <div class="v416Danger">${cleared?'✅ 已完成':`${d.icon} ${d.label}`}</div>
          <small>建議：${genIcons[rec-1]} ${genNames[rec-1]}｜目前：${genIcons[cur-1]} ${genNames[cur-1]}</small>${cleared?'':bonus}
        </button>`;
      }).join('')}</div></section>`;
    }).join('');
  };

  const oldOpenWorld=openWorld;
  openWorld=function(id){
    const d=dangerFor(id),r=oldOpenWorld.apply(this,arguments);
    if(!st.cleared.includes(id)&&d.gap>0){
      toast(`${d.icon} ${d.label}！打贏可獲金幣 / XP ×1.5`);
      if($('statusText'))$('statusText').innerHTML=`${d.icon} <b>${d.label}</b>｜建議 ${genIcons[recommendedGeneration(id)-1]} ${genNames[recommendedGeneration(id)-1]}世代。你仍可自由挑戰，越級勝利有額外獎勵！`;
    }
    return r;
  };

  function affinity(m,w){
    const name=(m?.[1]||'')+' '+(m?.[0]||'')+' '+(w?.name||'');
    if(/火|炎|熔岩|烈焰|火山/.test(name))return {type:'🔥 火焰',weak:['ice'],resist:['fire']};
    if(/冰|霜|雪|極地/.test(name))return {type:'❄️ 冰霜',weak:['fire'],resist:['ice']};
    if(/水|海|鯊|蟹|魷|河豚|沼/.test(name))return {type:'🌊 水系',weak:['thunder'],resist:['fire']};
    if(/機|齒輪|螺帽|鋼鐵|工廠|衛星|飛碟|戰艦|機器人|導電|雷射/.test(name))return {type:'🤖 機械',weak:['thunder'],resist:['slash']};
    if(/樹|竹|葉|菇|植物|森林/.test(name))return {type:'🌿 自然',weak:['fire'],resist:['ice']};
    if(/石|岩|水晶|晶怪|巨人|石像|魔像|骷髏/.test(name))return {type:'🪨 重甲',weak:['heavy'],resist:['slash']};
    if(/幽靈|幽魂|暗影|暗星|混沌|魔王|女巫|木乃伊|鬼/.test(name))return {type:'👻 闇影',weak:['ultimate'],resist:['slash']};
    if(/龍|dragon/i.test(name))return {type:'🐲 龍族',weak:['ultimate'],resist:['fire']};
    return {type:'⚪ 一般',weak:[],resist:[]};
  }
  function affinityForBattle(){if(!battle)return {type:'⚪ 一般',weak:[],resist:[]};return affinity(currentMonster(),worlds[(battle.world||st.world)-1]);}
  const skillText=s=>`${skillMeta[s]?.icon||''} ${skillMeta[s]?.short||s}`;

  const bossIntents=[
    {icon:'🔥',name:'灼熱吐息',counter:'ice',bonus:2,text:'高溫能量正在聚集'},
    {icon:'⚡',name:'雷霆蓄能',counter:'heavy',bonus:2,text:'核心正在高速充能'},
    {icon:'🌑',name:'暗影猛攻',counter:'slash',bonus:1,text:'Boss 正準備高速突進'},
    {icon:'💢',name:'毀滅衝擊',counter:'thunder',bonus:2,text:'地面開始劇烈震動'}
  ];
  function isBossBattle(){const m=battle&&currentMonster();return !!(battle&&m&&m[3]&&!battle.rare)}
  function rollBossIntent(){
    if(!isBossBattle())return null;
    let list=bossIntents;
    if(st.combo<5)list=list.filter(x=>x.counter!=='ultimate');
    battle.v416Intent=list[Math.floor(Math.random()*list.length)];
    battle.v416CounterChosen=false;
    return battle.v416Intent;
  }
  function intentHtml(){
    if(!isBossBattle()||!battle.v416Intent)return '';
    const i=battle.v416Intent;
    return `<div class="v416Intent"><b>👁️ Boss 招式預告：${i.icon} ${i.name}</b><span>${i.text}｜用 ${skillText(i.counter)} 成功答對可「COUNTER」並提高傷害</span></div>`;
  }

  const oldSkillButtons=skillButtons;
  skillButtons=function(){
    if(!battle)return oldSkillButtons();
    const a=affinityForBattle();
    const badge=s=>a.weak.includes(s)?'<em class="weakTag">WEAK ×1.5</em>':a.resist.includes(s)?'<em class="resistTag">RESIST ×0.6</em>':'';
    const counter=s=>isBossBattle()&&battle.v416Intent?.counter===s?'<em class="counterTag">COUNTER</em>':'';
    return `${intentHtml()}<div class="v416Affinity">屬性：<b>${a.type}</b>　弱點：<b>${a.weak.length?a.weak.map(skillText).join('、'):'無明顯弱點'}</b>　抗性：<b>${a.resist.length?a.resist.map(skillText).join('、'):'無'}</b></div>
      <button class="btn blue" onclick="chooseSkill('slash')">⚔️ 斬擊<br><small>免費</small>${badge('slash')}${counter('slash')}</button>
      <button class="btn red" onclick="chooseSkill('fire')">🔥 火焰斬<br><small>2 MP</small>${badge('fire')}${counter('fire')}</button>
      <button class="btn purple" onclick="chooseSkill('heavy')">💫 重擊<br><small>3 MP</small>${badge('heavy')}${counter('heavy')}</button>
      <button class="btn green" onclick="chooseSkill('heal')">💚 治癒術<br><small>3 MP</small></button>
      <button class="btn gold" onclick="chooseSkill('thunder')">⚡ 雷電術<br><small>3 MP</small>${badge('thunder')}${counter('thunder')}</button>
      <button class="btn iceBtn" onclick="chooseSkill('ice')">❄️ 冰凍術<br><small>2 MP</small>${badge('ice')}${counter('ice')}</button>
      <button class="btn ultimateBtn" onclick="chooseSkill('ultimate')">💥 必殺技<br><small>Combo 5＋4 MP</small>${badge('ultimate')}${counter('ultimate')}</button>
      <button class="btn itemBtn" onclick="useBattleItem('potion')">🍎 HP藥 ×${st.items.potion}</button>
      <button class="btn itemBtn" onclick="useBattleItem('ether')">🔷 MP藥 ×${st.items.ether}</button>`;
  };

  const oldSelectEnemy=selectEnemy;
  selectEnemy=function(i){
    const worldId=st.world,d=dangerFor(worldId),r=oldSelectEnemy.apply(this,arguments);
    if(battle){
      battle.v416Overlevel=d.gap;
      battle.v416RewardMult=d.gap>0?1.5:1;
      if(isBossBattle())rollBossIntent();
      const a=affinityForBattle();
      if($('statusText'))$('statusText').innerHTML+=`<br><span class="v416BattleHint">${a.type}｜弱點 ${a.weak.length?a.weak.map(skillText).join('、'):'未知'}${d.gap>0?'｜🎁 越級獎勵 ×1.5':''}</span>`;
      if($('actions'))$('actions').innerHTML=skillButtons();
    }
    return r;
  };

  const oldChooseSkill=chooseSkill;
  chooseSkill=function(s){
    if(battle&&isBossBattle())battle.v416CounterChosen=!!(battle.v416Intent&&battle.v416Intent.counter===s);
    return oldChooseSkill.apply(this,arguments);
  };

  function petDamageBonus(skill){
    const id=st.activePet,lv=Math.max(0,Math.min(3,Number(st.pets?.[id]||0)));
    if(id==='wolf'&&skill!=='heal')return lv;
    if(id==='dragon'&&skill==='fire')return lv;
    return 0;
  }
  function predictedDamage(skill){
    const extra={slash:0,fire:2,heavy:4,thunder:3,ice:1,ultimate:7}[skill]||0;
    const base=attack()+extra+petDamageBonus(skill),combo=1+Math.min(st.combo,5)*.12;
    return Math.max(1,Math.round(base*combo));
  }

  const oldResolveSkill=resolveSkill;
  resolveSkill=function(ok){
    if(!battle||!ok||battle.skill==='heal')return oldResolveSkill.apply(this,arguments);
    const b=battle,a=affinityForBattle(),skill=b.skill,normal=predictedDamage(skill);
    let mult=a.weak.includes(skill)?1.5:a.resist.includes(skill)?.6:1;
    const counter=isBossBattle()&&b.v416CounterChosen;
    if(counter)mult*=1.25;
    mult=Math.min(1.75,mult);
    const target=Math.max(1,Math.round(normal*mult)),delta=target-normal;
    if(delta>0)b.mhp=Math.max(0,b.mhp-delta);else if(delta<0)b.mhp+=(-delta);
    const effect=a.weak.includes(skill)?'WEAK!':a.resist.includes(skill)?'RESIST':'';
    const r=oldResolveSkill.apply(this,arguments);
    setTimeout(()=>{
      if(battle!==b)return;
      if(effect)toast(effect==='WEAK!'?`💥 WEAK ×1.5！${target} 傷害`:`🛡️ RESIST ×0.6｜${target} 傷害`);
      if(counter&&b.active)toast(`⚔️ COUNTER 成功！${skillText(skill)} 打斷 Boss 招式！`);
      if(b.active&&isBossBattle()){
        rollBossIntent();
        if($('actions'))$('actions').innerHTML=skillButtons();
      }
    },260);
    return r;
  };

  const oldWrongDamage416=wrongAnswerDamage;
  wrongAnswerDamage=function(){
    const base=oldWrongDamage416.apply(this,arguments);
    if(base===0)return 0;
    return base+(isBossBattle()?(battle.v416Intent?.bonus||0):0);
  };

  const oldEnemyAttack416=enemyAttack;
  enemyAttack=function(){
    const b=battle,r=oldEnemyAttack416.apply(this,arguments);
    setTimeout(()=>{
      if(battle===b&&b?.active&&isBossBattle()){
        rollBossIntent();
        if($('actions'))$('actions').innerHTML=skillButtons();
      }
    },520);
    return r;
  };

  const oldBattleReward=battleReward;
  battleReward=function(i,boss){
    const r=oldBattleReward.apply(this,arguments),mult=battle?.v416RewardMult||1;
    if(mult>1){r.coin=Math.round(r.coin*mult);r.xp=Math.round(r.xp*mult);r.label=`越級${r.label}`;}
    return r;
  };

  const oldWinBattle416=winBattle;
  winBattle=function(){
    const over=battle?.v416Overlevel||0,b=battle;
    const r=oldWinBattle416.apply(this,arguments);
    if(over>0&&b&&!b.rare){
      const chance=Math.min(.30,.10+over*.07);
      if(Math.random()<chance){
        st.petEggs=Number(st.petEggs||0)+1;store();
        if(typeof renderPetPanel==='function')renderPetPanel();renderHud();
        if($('statusText'))$('statusText').innerHTML+=' <b class="v416BonusDrop">🥚 越級挑戰額外掉蛋！</b>';
        toast('🥚 越級獎勵：額外寵物蛋！');
      }
    }
    return r;
  };

  function nextUncleared(after=st.world){return worlds.find(w=>w.id>after&&!st.cleared.includes(w.id))||worlds.find(w=>!st.cleared.includes(w.id));}
  window.v416NextDungeon=function(){
    const n=nextUncleared();
    if(n){openWorld(n.id);setTimeout(()=>$('screen')?.scrollIntoView({behavior:'smooth'}),50);}
    else showV416Victory();
  };
  nextWorld=function(){return v416NextDungeon()};
  window.v416Scroll=function(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})};
  window.showV416Victory=function(){
    const totalDex=Array.isArray(st.monsterDex)?st.monsterDex.length:150,petCount=st.pets?Object.values(st.pets).filter(x=>Number(x)>0).length:0,gearCount=(st.lootGear||[]).length;
    if($('screen'))$('screen').innerHTML=`<div class="v416Victory"><div class="crown">👑🏆🌌</div><h2>30 / 30 COMPLETE！</h2><p>六大章節全部攻略完成。你已成為傳說勇者！</p><div class="v416VictoryStats"><b>📖 怪物圖鑑 ${Math.min(150,totalDex)}/150</b><b>🐾 寵物 ${petCount}/6</b><b>⚔️ 裝備收藏 ${gearCount}</b></div><div class="v416VictoryActions"><button class="btn gold" onclick="v416Scroll('monsterDex')">📖 查看怪物圖鑑</button><button class="btn purple" onclick="v416Scroll('petsPanel')">🐾 查看寵物</button><button class="btn blue" onclick="v416Scroll('progressionPanel')">🏅 查看六大世代</button></div></div>`;
    toast('👑 30 大地下城全部完成！');
  };

  const oldClearWorld416=clearWorld;
  clearWorld=function(id){
    const r=oldClearWorld416.apply(this,arguments);syncMilestones();renderMap();
    const n=nextUncleared(id);
    if(!n){showV416Victory();return r;}
    if($('statusText'))$('statusText').innerHTML=`🏆 Dungeon ${id} 完成！下一個未完成地下城是 <b>Dungeon ${n.id}｜${n.name}</b>。`;
    if($('actions'))$('actions').innerHTML='<button class="btn gold" onclick="v416NextDungeon()">➡️ 前往下一個未完成地下城</button>';
    return r;
  };

  // Re-render current UI with V4.16 guidance.
  renderMap();
  if(battle&&$('actions'))$('actions').innerHTML=skillButtons();
  window.v416={currentGeneration,recommendedGeneration,dangerFor,affinity};
})();