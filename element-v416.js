// V4.16 elemental weaknesses + Boss telegraph/counter system.
(()=>{
  const skillMeta={slash:{icon:'⚔️',short:'斬擊'},fire:{icon:'🔥',short:'火焰斬'},heavy:{icon:'💫',short:'重擊'},heal:{icon:'💚',short:'治癒術'},thunder:{icon:'⚡',short:'雷電術'},ice:{icon:'❄️',short:'冰凍術'},ultimate:{icon:'💥',short:'勇者必殺'}};
  const skillText=s=>`${skillMeta[s]?.icon||''} ${skillMeta[s]?.short||s}`;

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
  function affinityForBattle(){return battle?affinity(currentMonster(),worlds[(battle.world||st.world)-1]):{type:'⚪ 一般',weak:[],resist:[]};}
  const bossIntents=[
    {icon:'🔥',name:'灼熱吐息',counter:'ice',bonus:2,text:'高溫能量正在聚集'},
    {icon:'⚡',name:'雷霆蓄能',counter:'heavy',bonus:2,text:'核心正在高速充能'},
    {icon:'🌑',name:'暗影猛攻',counter:'slash',bonus:1,text:'Boss 正準備高速突進'},
    {icon:'💢',name:'毀滅衝擊',counter:'thunder',bonus:2,text:'地面開始劇烈震動'}
  ];
  function isBossBattle(){const m=battle&&currentMonster();return !!(battle&&m&&m[3]&&!battle.rare)}
  function rollBossIntent(){if(!isBossBattle())return null;battle.v416Intent=bossIntents[Math.floor(Math.random()*bossIntents.length)];battle.v416CounterChosen=false;return battle.v416Intent;}
  function intentHtml(){if(!isBossBattle()||!battle.v416Intent)return '';const i=battle.v416Intent;return `<div class="v416Intent"><b>👁️ Boss 招式預告：${i.icon} ${i.name}</b><span>${i.text}｜用 ${skillText(i.counter)} 答對可 COUNTER 並提高傷害</span></div>`;}

  const oldSkillButtons416=skillButtons;
  skillButtons=function(){
    if(!battle)return oldSkillButtons416();
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

  const oldSelectEnemyElement=selectEnemy;
  selectEnemy=function(i){const r=oldSelectEnemyElement.apply(this,arguments);if(battle){if(isBossBattle())rollBossIntent();const a=affinityForBattle();if($('statusText'))$('statusText').innerHTML+=`<br><span class="v416BattleHint">${a.type}｜弱點 ${a.weak.length?a.weak.map(skillText).join('、'):'未知'}</span>`;if($('actions'))$('actions').innerHTML=skillButtons();}return r;};

  const oldChooseSkill416=chooseSkill;
  chooseSkill=function(s){if(battle&&isBossBattle())battle.v416CounterChosen=!!(battle.v416Intent&&battle.v416Intent.counter===s);return oldChooseSkill416.apply(this,arguments);};

  function petDamageBonus(skill){const id=st.activePet,lv=Math.max(0,Math.min(3,Number(st.pets?.[id]||0)));if(id==='wolf'&&skill!=='heal')return lv;if(id==='dragon'&&skill==='fire')return lv;return 0;}
  function predictedDamage(skill){const extra={slash:0,fire:2,heavy:4,thunder:3,ice:1,ultimate:7}[skill]||0;return Math.max(1,Math.round((attack()+extra+petDamageBonus(skill))*(1+Math.min(st.combo,5)*.12)));}

  const oldResolveSkill416=resolveSkill;
  resolveSkill=function(ok){
    if(!battle||!ok||battle.skill==='heal')return oldResolveSkill416.apply(this,arguments);
    const b=battle,a=affinityForBattle(),skill=b.skill,normal=predictedDamage(skill);
    let mult=a.weak.includes(skill)?1.5:(a.resist.includes(skill)?.6:1);
    const counter=isBossBattle()&&b.v416CounterChosen;if(counter)mult*=1.25;mult=Math.min(1.75,mult);
    const target=Math.max(1,Math.round(normal*mult)),delta=target-normal;
    if(delta>0)b.mhp=Math.max(0,b.mhp-delta);else if(delta<0)b.mhp+=(-delta);
    const effect=a.weak.includes(skill)?'weak':a.resist.includes(skill)?'resist':'';
    const r=oldResolveSkill416.apply(this,arguments);
    setTimeout(()=>{
      if(battle!==b)return;
      if(effect==='weak')toast(`💥 WEAK ×1.5！${target} 傷害`);else if(effect==='resist')toast(`🛡️ RESIST ×0.6｜${target} 傷害`);
      if(counter&&b.active)toast(`⚔️ COUNTER 成功！${skillText(skill)} 打斷 Boss 招式！`);
      if(b.active&&isBossBattle()){rollBossIntent();if($('actions'))$('actions').innerHTML=skillButtons();}
    },270);
    return r;
  };

  const oldWrongDamageElement=wrongAnswerDamage;
  wrongAnswerDamage=function(){const base=oldWrongDamageElement.apply(this,arguments);if(base===0)return 0;return base+(isBossBattle()?(battle.v416Intent?.bonus||0):0);};

  const oldEnemyAttackElement=enemyAttack;
  enemyAttack=function(){const b=battle,r=oldEnemyAttackElement.apply(this,arguments);setTimeout(()=>{if(battle===b&&b?.active&&isBossBattle()){rollBossIntent();if($('actions'))$('actions').innerHTML=skillButtons();}},520);return r;};

  if(battle&&$('actions'))$('actions').innerHTML=skillButtons();
  window.v416Element={affinity,affinityForBattle,rollBossIntent};
})();