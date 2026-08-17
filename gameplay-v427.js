// V4.27 RPG feel upgrade: recommended skills, active pet skills, and Daily Adventure Tower.
(()=>{
  const DAY=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
  const addDay=(s,n)=>{const [y,m,d]=s.split('-').map(Number),x=new Date(y,m-1,d);x.setDate(x.getDate()+n);const p=v=>String(v).padStart(2,'0');return `${x.getFullYear()}-${p(x.getMonth()+1)}-${p(x.getDate())}`};
  const petInfo={wolf:['🐺','勇氣小狼'],turtle:['🐢','守護小龜'],fox:['🦊','九尾靈狐'],slime:['👾','魔法史萊姆'],dragon:['🐲','火焰幼龍'],unicorn:['🦄','星光獨角獸']};
  const skillMeta={slash:['⚔️','斬擊','blue',0],fire:['🔥','火焰斬','red',2],heavy:['💫','重擊','purple',3],heal:['💚','治癒術','green',3],thunder:['⚡','雷電術','gold',3],ice:['❄️','冰凍術','iceBtn',2],ultimate:['💥','必殺技','ultimateBtn',4]};
  st.petEnergy427=Math.max(0,Math.min(3,Number(st.petEnergy427||0)));
  st.tower427=st.tower427&&typeof st.tower427==='object'?st.tower427:null;
  st.tower427Streak=Number(st.tower427Streak||0);st.tower427LastComplete=st.tower427LastComplete||'';

  function petLv(){return Math.max(0,Math.min(3,Number(st.pets?.[st.activePet]||0)))}
  function petName(){return petInfo[st.activePet]||['🐾','寵物夥伴']}
  function affinity(){
    const m=currentMonster?.(),w=worlds[(battle?.world||st.world)-1],name=(m?.[1]||'')+' '+(m?.[0]||'')+' '+(w?.name||'');
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
  const usable=s=>!!battle&&battle.mp>=(skillMeta[s]?.[3]||0)&&(s!=='ultimate'||st.combo>=5);
  function recommend(){
    if(!battle)return 'slash';
    if(battle.hp<=Math.ceil(hpMax()*.28)&&usable('heal'))return 'heal';
    const counter=battle.v416Intent?.counter;if(counter&&usable(counter))return counter;
    const a=affinity(),weak=a.weak.find(usable);if(weak)return weak;
    if(st.combo>=5&&usable('ultimate')&&!a.resist.includes('ultimate'))return 'ultimate';
    if(battle.hp<=Math.ceil(hpMax()*.48)&&usable('heal'))return 'heal';
    return 'slash';
  }
  function reason(s){
    if(s==='heal')return 'HP 偏低，先補血比較安全';
    if(battle?.v416Intent?.counter===s)return `可 COUNTER「${battle.v416Intent.name}」`;
    if(affinity().weak.includes(s))return `${affinity().type} 弱點，傷害 ×1.5`;
    if(s==='ultimate')return 'Combo 已滿，適合爆發';
    return '免費、不耗 MP，穩定進攻';
  }
  function skillButton(s,rec=false){
    const m=skillMeta[s],disabled=!usable(s),cost=s==='slash'?'免費':s==='ultimate'?'Combo 5＋4 MP':`${m[3]} MP`;
    return `<button class="btn ${m[2]} ${rec?'v427RecommendBtn':''}" ${disabled?'disabled':''} onclick="chooseSkill('${s}')"><span>${m[0]} ${m[1]}</span><small>${cost}</small>${rec?'<em>⭐ 推薦</em>':''}</button>`;
  }
  window.v427MoreSkills=false;
  window.v427ToggleSkills=function(){window.v427MoreSkills=!window.v427MoreSkills;if($('actions'))$('actions').innerHTML=skillButtons()};
  const oldSkillButtons427=skillButtons;
  skillButtons=function(){
    if(!battle||!battle.active)return oldSkillButtons427();
    const rec=recommend(),a=affinity(),counter=battle.v416Intent;
    const direct=[rec];if(rec!=='slash')direct.push('slash');if(rec!=='heal'&&battle.hp<hpMax())direct.push('heal');
    const uniq=[...new Set(direct)].slice(0,3);
    const more=['slash','fire','heavy','heal','thunder','ice','ultimate'].filter(s=>!uniq.includes(s));
    const top=`<div class="v427Coach"><div><b>⭐ 推薦：${skillMeta[rec][0]} ${skillMeta[rec][1]}</b><span>${reason(rec)}</span></div><div class="v427Affinity">${a.type}${a.weak.length?`｜弱點 ${a.weak.map(x=>skillMeta[x]?.[0]||'').join(' ')}`:''}</div></div>${counter?`<div class="v427BossAlert">👁️ Boss：${counter.icon||'⚠️'} ${counter.name}｜${skillMeta[counter.counter]?.[0]||''} ${skillMeta[counter.counter]?.[1]||counter.counter} 可 COUNTER</div>`:''}`;
    const main=`<div class="v427MainSkills">${uniq.map(s=>skillButton(s,s===rec)).join('')}<button class="btn soft v427MoreBtn" onclick="v427ToggleSkills()">${window.v427MoreSkills?'收起技能 ▲':'更多技能 ▼'}<small>道具也在這裡</small></button></div>`;
    const extra=window.v427MoreSkills?`<div class="v427ExtraSkills">${more.map(s=>skillButton(s,false)).join('')}<button class="btn itemBtn" onclick="useBattleItem('potion')">🍎 HP藥 ×${st.items.potion}</button><button class="btn itemBtn" onclick="useBattleItem('ether')">🔷 MP藥 ×${st.items.ether}</button></div>`:'';
    return top+main+extra;
  };

  function decoratePet(){
    const p=document.querySelector('.petCompanion');if(!p)return;
    const [e]=petName(),bars=[0,1,2].map(i=>`<i class="${i<st.petEnergy427?'on':''}"></i>`).join('');
    p.innerHTML=`<span class="v427PetEmoji">${e}</span><span class="v427PetEnergy">${bars}</span>`;
    p.title=`寵物能量 ${st.petEnergy427}/3｜連續答對可觸發主動技能`;
  }
  const oldRenderScreen427=renderScreen;
  renderScreen=function(){const r=oldRenderScreen427.apply(this,arguments);setTimeout(decoratePet,0);return r};
  function petFx(text){
    const p=document.querySelector('.petCompanion');if(p){p.classList.remove('v427PetCast');void p.offsetWidth;p.classList.add('v427PetCast')}
    if($('statusText'))$('statusText').insertAdjacentHTML('beforeend',`<div class="v427PetMsg">${text}</div>`);toast(text.replace(/<[^>]+>/g,''));
  }
  function castPet(){
    if(!battle||!battle.active||!st.activePet||petLv()<=0)return false;
    const lv=petLv(),[e,n]=petName();st.petEnergy427=0;
    if(st.activePet==='wolf'){
      const dmg=2+lv*2;battle.mhp=Math.max(0,battle.mhp-dmg);updateBattle();petFx(`${e} <b>${n}突擊！-${dmg} HP</b>`);if(battle.mhp<=0)setTimeout(()=>winBattle(),180);
    }else if(st.activePet==='dragon'){
      const dmg=3+lv*2;battle.mhp=Math.max(0,battle.mhp-dmg);updateBattle();petFx(`${e} <b>火焰吐息！-${dmg} HP</b>`);if(battle.mhp<=0)setTimeout(()=>winBattle(),180);
    }else if(st.activePet==='turtle'){
      battle.v427PetShield=1+lv;petFx(`${e} <b>守護盾展開！下一次答錯減傷 ${1+lv}</b>`);
    }else if(st.activePet==='fox'){
      battle.v427PetEvade=true;petFx(`${e} <b>幻影步！下一次答錯必定閃避</b>`);
    }else if(st.activePet==='slime'){
      const mp=Math.min(2,lv);battle.mp=Math.min(mpMax(),battle.mp+mp);updateBattle();petFx(`${e} <b>魔力補給！MP +${mp}</b>`);
    }else if(st.activePet==='unicorn'){
      const heal=1+lv;battle.hp=Math.min(hpMax(),battle.hp+heal);battle.mp=Math.min(mpMax(),battle.mp+1);updateBattle();petFx(`${e} <b>星光祝福！HP +${heal}、MP +1</b>`);
    }
    store();decoratePet();if($('actions')&&battle?.active)$('actions').innerHTML=skillButtons();return true;
  }
  const oldWrong427=wrongAnswerDamage;
  wrongAnswerDamage=function(){
    if(battle?.v427PetEvade){battle.v427PetEvade=false;petFx(`${petName()[0]} <b>寵物帶你閃開了！0 傷害</b>`);return 0}
    let d=oldWrong427.apply(this,arguments);
    if(battle?.v427PetShield){const cut=battle.v427PetShield;battle.v427PetShield=0;d=Math.max(0,d-cut);petFx(`${petName()[0]} <b>守護盾擋下 ${cut} 傷害！</b>`)}
    return d;
  };
  const oldAnswer427=answerQuestion;
  answerQuestion=function(btn,i){
    if(currentQ&&i!==currentQ.a&&st.petEnergy427){st.petEnergy427=0;store();setTimeout(decoratePet,0)}
    return oldAnswer427.apply(this,arguments);
  };
  const oldResolve427=resolveSkill;
  resolveSkill=function(ok){
    const before=battle,wasActive=!!before?.active;
    const r=oldResolve427.apply(this,arguments);
    if(ok&&wasActive&&st.activePet&&petLv()>0){
      st.petEnergy427=Math.min(3,st.petEnergy427+1);store();setTimeout(()=>{decoratePet();if(st.petEnergy427>=3&&battle===before&&battle?.active)castPet()},360);
    }else{
      if(!ok&&st.petEnergy427){st.petEnergy427=0;store()}
      setTimeout(decoratePet,50);
    }
    return r;
  };

  const towerPools={
    normal:[['🐺','星砂狼'],['🦇','夜光蝙蝠'],['👾','果凍史萊姆'],['🤖','迷你機兵'],['🦎','疾風蜥蜴'],['🐧','冰原斥候']],
    elite:[['🦁','黃金獅衛'],['🦅','雷羽戰鷹'],['🗿','水晶守衛'],['👻','月影法師']],
    boss:[['🐲','星塔幼龍'],['👹','混沌塔主'],['🤖','超載泰坦'],['🦄','幻星獸王']]
  };
  function seeded(seed,max){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;return max?h%max:h}
  function freshTower(){
    const d=DAY(),atk=Math.max(2,attack()),pick=(pool,k)=>pool[seeded(d+k,pool.length)],n1=pick(towerPools.normal,'a'),n2=pick(towerPools.normal,'b'),e=pick(towerPools.elite,'c'),b=pick(towerPools.boss,'d');
    return {date:d,index:0,completed:false,rewarded:false,wins:0,monsters:[
      {floor:1,rank:'普通',m:[n1[0],n1[1],Math.max(7,Math.round(atk*2.4))]},
      {floor:1,rank:'普通',m:[n2[0],n2[1],Math.max(8,Math.round(atk*2.6))]},
      {floor:2,rank:'精英',m:[e[0],e[1],Math.max(11,Math.round(atk*3.2))]},
      {floor:3,rank:'Boss',m:[b[0],b[1],Math.max(16,Math.round(atk*4.5)),1]}
    ]};
  }
  function tower(){if(!st.tower427||st.tower427.date!==DAY()){st.tower427=freshTower();store()}return st.tower427}
  function towerProgress(){const t=tower();return Math.min(100,Math.round((t.completed?4:t.index)/4*100))}
  function renderTower(){
    const root=$('dailyTower427');if(!root)return;const t=tower(),next=t.monsters[Math.min(t.index,3)],done=t.completed;
    const streak=st.tower427Streak||0;
    root.innerHTML=`<div class="v427TowerHead"><div><span>🗼 DAILY ADVENTURE</span><h2>${done?'今日冒險塔 CLEAR！':`今日冒險塔｜第 ${next.floor} 層`}</h2><p>${done?'明天會生成新的怪物與 Boss。':`塔內答題會同步計入今天的 10～15 題訓練；目前連勝 ${streak} 天。`}</p></div><div class="v427TowerBadge">${done?'🏆':`${t.index}/4`}<small>${done?'完成':'戰鬥'}</small></div></div><div class="v427TowerBar"><i style="width:${towerProgress()}%"></i></div><div class="v427Floors"><div class="${t.index>=2||done?'done':''}">1F<br><b>普通 ×2</b></div><div class="${t.index>=3||done?'done':''}">2F<br><b>精英 ×1</b></div><div class="${done?'done':''}">3F<br><b>Boss ×1</b></div></div>${done?`<div class="v427TowerReward">✅ 今日獎勵已領取｜🔥 連續完成 ${streak} 天</div>`:`<button class="btn purple v427TowerStart" onclick="v427StartTower()">⚔️ ${t.index?'繼續冒險塔':'開始今日冒險塔'}</button>`}`;
  }
  function towerQuestionWorld(){const g=window.v415Progression?.unlockedGeneration?.()||Math.max(1,Math.ceil((st.world||1)/5));return Math.max(1,Math.min(30,g*5))}
  window.v427StartTower=function(){startTowerEncounter()};
  function startTowerEncounter(){
    const t=tower();if(t.completed){renderTower();return}const x=t.monsters[t.index];
    battle=null;renderScreen();
    const screen=$('screen'),h=screen?.querySelector('h2'),sub=screen?.querySelector('.sub'),grid=$('enemyGrid');
    if(h)h.innerHTML=`🗼 每日冒險塔｜第 ${x.floor} 層`;
    if(sub)sub.innerHTML=`${x.rank}戰｜完成 4 場即可取得今日塔獎勵。塔內題目也會計入每日勇者訓練。`;
    if(grid)grid.innerHTML=`<div class="v427TowerEncounter"><span>${x.rank==='Boss'?'👑':x.rank==='精英'?'🌟':'⚔️'}</span><b>${x.m[0]} ${x.m[1]}</b><small>${t.index+1}/4 戰｜HP ${x.m[2]}</small></div>`;
    battle={world:st.world,index:x.rank==='Boss'?4:x.rank==='精英'?3:0,hp:hpMax(),mp:mpMax(),mhp:x.m[2],skill:'slash',active:true,enemyWeaken:0,monster:x.m,tower427:true,towerIndex:t.index};
    updateBattle();decoratePet();$('statusText').innerHTML=`🗼 <b>${x.rank} ${x.m[1]}</b> 擋住了通往下一層的路！`;$('actions').innerHTML=skillButtons();
    screen?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  window.v427ExitTower=function(){battle=null;render();renderTower()};
  const oldAsk427=askQuestion;
  askQuestion=function(){
    if(!battle?.tower427)return oldAsk427.apply(this,arguments);
    currentQ=getQuestion(towerQuestionWorld());$('qTag').textContent=`每日冒險塔｜第 ${tower().monsters[tower().index].floor} 層｜${currentQ.cat||'綜合'}`;$('qPrompt').innerHTML=currentQ.p;$('qAnswers').innerHTML=currentQ.o.map((x,i)=>`<button class="ans" onclick="answerQuestion(this,${i})">${x}</button>`).join('');$('qModal').classList.add('show');
  };
  function completeTower(){
    const t=tower();if(t.completed)return;t.completed=true;
    if(!t.rewarded){
      t.rewarded=true;const y=addDay(DAY(),-1);st.tower427Streak=st.tower427LastComplete===y?(st.tower427Streak||0)+1:1;st.tower427LastComplete=DAY();
      const coin=25+Math.min(15,st.tower427Streak*2);st.coins+=coin;st.stars+=8;st.items.key=(st.items.key||0)+1;let bonus='';
      if(st.tower427Streak%3===0){st.petEggs=Number(st.petEggs||0)+1;bonus='＋🥚 寵物蛋 ×1'}
      if(st.tower427Streak%7===0){st.coins+=25;bonus+='＋🪙 7日獎勵 25'}
      store();renderHud();toast(`🏆 冒險塔完成！⭐8＋🪙${coin}＋🔑1 ${bonus}`);
    }
    battle=null;render();renderTower();setTimeout(()=>$('dailyTower427')?.scrollIntoView({behavior:'smooth',block:'center'}),100);
  }
  const oldWin427=winBattle;
  winBattle=function(){
    if(!battle?.tower427)return oldWin427.apply(this,arguments);
    const t=tower(),x=t.monsters[t.index];battle.active=false;t.wins++;t.index++;
    st.coins+=x.rank==='Boss'?8:x.rank==='精英'?4:2;st.xp+=x.rank==='Boss'?5:x.rank==='精英'?3:2;store();checkLevel();renderHud();
    if(t.index>=t.monsters.length){completeTower();return}
    $('statusText').innerHTML=`🏆 擊倒 ${x.m[1]}！通往下一層的道路打開了。`;
    $('actions').innerHTML='<button class="btn purple" onclick="v427StartTower()">⬆️ 前往下一場</button><button class="btn soft" onclick="v427ExitTower()">離開冒險塔</button>';
    renderTower();
  };

  const oldRender427=render;
  render=function(){const r=oldRender427.apply(this,arguments);setTimeout(()=>{renderTower();decoratePet()},0);return r};
  renderTower();decoratePet();store();
  window.v427Rpg={recommend,castPet,tower,renderTower};
})();
