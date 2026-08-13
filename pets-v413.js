// V4.13 Pet collection + monster dex system
(()=>{
  const pets=[
    {id:'wolf',e:'🐺',name:'勇氣小狼',rarity:'普通',desc:['攻擊傷害 +1','攻擊傷害 +2','攻擊傷害 +3']},
    {id:'turtle',e:'🐢',name:'守護小龜',rarity:'普通',desc:['答錯傷害 -1','答錯傷害 -2','答錯傷害 -3']},
    {id:'fox',e:'🦊',name:'九尾靈狐',rarity:'稀有',desc:['10% 機率閃避答錯傷害','20% 機率閃避答錯傷害','30% 機率閃避答錯傷害']},
    {id:'slime',e:'👾',name:'魔法史萊姆',rarity:'稀有',desc:['答對時 25% 機率回 1 MP','答對時 40% 機率回 1 MP','答對時 55% 機率回 1 MP']},
    {id:'dragon',e:'🐲',name:'火焰幼龍',rarity:'史詩',desc:['火焰斬傷害 +1','火焰斬傷害 +2','火焰斬傷害 +3']},
    {id:'unicorn',e:'🦄',name:'星光獨角獸',rarity:'傳說',desc:['寵物蛋掉落率 +5%','寵物蛋掉落率 +10%','寵物蛋掉落率 +15%']}
  ];
  const rareMonsters=[
    {e:'🦄',name:'幻光寶獸'},
    {e:'🦅',name:'黃金獅鷲'},
    {e:'🐲',name:'幼年星龍'},
    {e:'🦊',name:'九尾靈狐'},
    {e:'👾',name:'異界史萊姆'}
  ];

  st.petEggs=Number(st.petEggs||0);
  st.pets=st.pets&&typeof st.pets==='object'?st.pets:{};
  st.activePet=st.activePet||null;
  st.monsterDex=Array.isArray(st.monsterDex)?st.monsterDex:[];
  st.rareDex=Array.isArray(st.rareDex)?st.rareDex:[];

  function petById(id){return pets.find(p=>p.id===id)}
  function petLevel(id){return Math.max(0,Math.min(3,Number(st.pets[id]||0)))}
  function activePet(){return petById(st.activePet)}
  function activePetLevel(){return activePet()?petLevel(st.activePet):0}
  function petAbilityText(p){const lv=petLevel(p.id);return lv?p.desc[lv-1]:'尚未獲得'}

  function migrateDex(){
    const seen=new Set(st.monsterDex);
    worlds.forEach(w=>{
      const done=st.defeated[w.id]||[];
      if(st.cleared.includes(w.id)){
        for(let i=0;i<w.m.length;i++)seen.add(`${w.id}-${i}`);
      }else{
        done.forEach(i=>seen.add(`${w.id}-${i}`));
      }
    });
    st.monsterDex=[...seen];
  }
  migrateDex();
  store();

  function recordMainMonster(worldId,index){
    if(index<0)return;
    const key=`${worldId}-${index}`;
    if(!st.monsterDex.includes(key))st.monsterDex.push(key);
  }
  function recordRareMonster(name){
    if(name&&!st.rareDex.includes(name))st.rareDex.push(name);
  }

  function rarityClassPet(r){return {'普通':'common','稀有':'rare','史詩':'epic','傳說':'legendary'}[r]||'common'}
  function rollPet(){
    const n=Math.random()*100;
    const r=n<50?'普通':n<80?'稀有':n<95?'史詩':'傳說';
    const pool=pets.filter(p=>p.rarity===r);
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function hatchEgg(){
    if(st.petEggs<=0){toast('🥚 目前沒有寵物蛋！');return}
    st.petEggs--;
    const p=rollPet();
    const old=petLevel(p.id);
    let msg='';
    if(old===0){
      st.pets[p.id]=1;
      if(!st.activePet)st.activePet=p.id;
      msg=`孵化成功！獲得 ${p.e} ${p.name} Lv.1！`;
    }else if(old<3){
      st.pets[p.id]=old+1;
      msg=`又孵到 ${p.e} ${p.name}！升級為 Lv.${old+1}！`;
    }else{
      st.coins+=20;
      msg=`${p.e} ${p.name} 已經 Lv.3，重複孵化轉換成 🪙20！`;
    }
    store();renderHud();renderPetPanel();renderMonsterDex();
    if(window.heroSfx)heroSfx.play(old===0?'level':'chest');
    openEventModal('寵物蛋孵化！','🥚',`<div style="font-size:92px">${p.e}</div><h3>${msg}</h3><p><b>${p.rarity}</b>｜${petAbilityText(p)}</p>`,`<button class="btn gold" onclick="closeEventModal()">太棒了！</button>`);
  }

  function setActivePet(id){
    if(!petLevel(id)){toast('這隻寵物還沒獲得！');return}
    st.activePet=id;store();renderPetPanel();
    if(typeof renderScreen==='function')renderScreen();
    const p=petById(id);toast(`${p.e} ${p.name} 跟你出戰！`);
  }

  function renderPetPanel(){
    const root=$('petsPanel');if(!root)return;
    const ap=activePet(),al=activePetLevel();
    const cards=pets.map(p=>{
      const lv=petLevel(p.id),owned=lv>0,on=st.activePet===p.id;
      return `<div class="petCard ${owned?'':'locked'} ${on?'active':''} ${owned?rarityClassPet(p.rarity):''}">
        <div class="petEmoji">${owned?p.e:'❔'}</div>
        <div class="petRarity">${owned?p.rarity:'未發現'}</div>
        <b>${owned?p.name:'神秘寵物'}</b>
        <div class="petLv">${owned?`Lv.${lv}/3`:'???'}</div>
        <small>${owned?petAbilityText(p):'孵化寵物蛋才會揭曉能力'}</small>
        <button class="btn ${on?'green':owned?'gold':'soft'}" ${owned&&!on?'': 'disabled'} onclick="setActivePet('${p.id}')">${on?'✅ 出戰中':owned?'帶出戰':'🔒 未獲得'}</button>
      </div>`;
    }).join('');
    root.innerHTML=`<div class="petHub"><div class="petSummary"><div class="egg">🥚</div><h3>神秘寵物蛋 × <span>${st.petEggs}</span></h3><p>打倒怪物有機率掉蛋；Boss、精英與稀有怪機率更高。重複寵物會升級到 Lv.3。</p><button class="btn purple" onclick="hatchEgg()" ${st.petEggs>0?'':'disabled'}>✨ 孵化 1 顆寵物蛋</button><hr>${ap?`<div class="activePetBig">${ap.e}</div><b>${ap.name} Lv.${al}</b><p>${petAbilityText(ap)}</p>`:'<p>還沒有出戰寵物，先去打怪找蛋吧！</p>'}</div><div class="petGrid">${cards}</div></div>`;
  }

  function renderMonsterDex(){
    const root=$('monsterDex');if(!root)return;
    const seen=new Set(st.monsterDex),total=worlds.reduce((s,w)=>s+w.m.length,0),count=Math.min(total,seen.size);
    const chapters=[];
    for(let c=1;c<=6;c++){
      const ws=worlds.filter(w=>(w.chapter||Math.ceil(w.id/5))===c);
      const chapterTotal=ws.reduce((s,w)=>s+w.m.length,0);
      let chapterSeen=0;
      const cards=[];
      ws.forEach(w=>w.m.forEach((m,i)=>{
        const known=seen.has(`${w.id}-${i}`);if(known)chapterSeen++;
        cards.push(`<div class="dexMonster ${known?'':'unknown'}"><div class="e">${known?m[0]:'❔'}</div><b>${known?m[1]:'???'}</b><small>Dungeon ${w.id}${m[3]?'｜Boss':''}</small></div>`);
      }));
      chapters.push(`<details class="dexChapter" ${c===1?'open':''}><summary>第 ${c} 章｜${typeof chapterNames!=='undefined'?chapterNames[c-1]:`Chapter ${c}`}　${chapterSeen}/${chapterTotal}</summary><div class="dexGrid">${cards.join('')}</div></details>`);
    }
    const rareCards=rareMonsters.map(r=>{const known=st.rareDex.includes(r.name);return `<div class="dexMonster ${known?'':'unknown'}"><div class="e">${known?r.e:'❔'}</div><b>${known?r.name:'???'}</b><small>稀有亂入</small></div>`}).join('');
    root.innerHTML=`<div class="dexTop"><div class="dexCount">📖 主線圖鑑 ${count}/${total}</div><div class="dexProgress"><div style="width:${total?count/total*100:0}%"></div></div><b>${Math.round(total?count/total*100:0)}%</b></div>${chapters.join('')}<h3>🌟 稀有怪圖鑑 ${st.rareDex.length}/${rareMonsters.length}</h3><div class="rareDex">${rareCards}</div>`;
  }

  function maybeDropEgg(type){
    const base={normal:.10,advanced:.16,elite:.25,boss:.42,rare:.62}[type]||.10;
    const ap=activePet(),lv=activePetLevel();
    const bonus=ap&&ap.id==='unicorn'?[0,.05,.10,.15][lv]:0;
    if(Math.random()<base+bonus){st.petEggs++;return true}
    return false;
  }

  function petTempAtkBonus(){
    const p=activePet(),lv=activePetLevel();if(!p||!lv||!battle)return 0;
    if(p.id==='wolf'&&battle.skill!=='heal')return lv;
    if(p.id==='dragon'&&battle.skill==='fire')return lv;
    return 0;
  }

  const oldResolve=resolveSkill;
  resolveSkill=function(ok){
    if(!ok)return oldResolve.apply(this,arguments);
    const bonus=petTempAtkBonus();
    if(!bonus)return oldResolve.apply(this,arguments);
    const token='__pet_power_v413__';
    gear.push({lv:999,e:'',n:token,atk:bonus});st.gear.push(token);
    try{return oldResolve.apply(this,arguments)}finally{
      const gi=gear.findIndex(g=>g.n===token);if(gi>=0)gear.splice(gi,1);
      const si=st.gear.indexOf(token);if(si>=0)st.gear.splice(si,1);
    }
  };

  const oldWrongDamage=wrongAnswerDamage;
  wrongAnswerDamage=function(){
    let dmg=oldWrongDamage.apply(this,arguments);
    const p=activePet(),lv=activePetLevel();
    if(!p||!lv)return dmg;
    if(p.id==='turtle')return Math.max(1,dmg-lv);
    if(p.id==='fox'){
      const chance=[0,.10,.20,.30][lv];
      if(Math.random()<chance){if(battle)battle.petDodged=true;return 0}
    }
    return dmg;
  };

  const oldEnemyAttack=enemyAttack;
  enemyAttack=function(){
    if(battle)battle.petDodged=false;
    const r=oldEnemyAttack.apply(this,arguments);
    setTimeout(()=>{
      if(battle&&battle.petDodged){
        const p=activePet();
        $('statusText').innerHTML=`${p?p.e:'🦊'} <b>寵物閃避成功！</b> 這次答錯沒有扣 HP。`;
        toast('✨ 寵物幫你閃掉傷害！');
      }
    },420);
    return r;
  };

  const oldAnswer=answerQuestion;
  answerQuestion=function(btn,i){
    const ok=!!currentQ&&i===currentQ.a,p=activePet(),lv=activePetLevel();
    if(ok&&p&&p.id==='slime'&&battle&&battle.active&&battle.mp<mpMax()){
      const chance=[0,.25,.40,.55][lv];
      if(Math.random()<chance){battle.mp=Math.min(mpMax(),battle.mp+1);updateBattle();toast('👾 史萊姆幫你回復 1 MP！')}
    }
    return oldAnswer.apply(this,arguments);
  };

  const oldWinBattle=winBattle;
  winBattle=function(){
    if(!battle)return oldWinBattle.apply(this,arguments);
    if(battle.rare)return oldWinBattle.apply(this,arguments);
    const w=worlds[battle.world-1],idx=battle.index,m=w.m[idx],type=m[3]?'boss':idx===3?'elite':idx===2?'advanced':'normal';
    recordMainMonster(w.id,idx);
    const egg=maybeDropEgg(type);
    const r=oldWinBattle.apply(this,arguments);
    store();renderPetPanel();renderMonsterDex();renderHud();
    if(egg){$('statusText').innerHTML+=` <span class="petToastLine">🥚 掉落神秘寵物蛋 ×1！</span>`;toast('🥚 掉落神秘寵物蛋！');if(window.heroSfx)heroSfx.play('chest')}
    return r;
  };

  const oldRareWin=winRareBattle;
  winRareBattle=function(){
    const m=currentMonster();recordRareMonster(m&&m[1]);
    const egg=maybeDropEgg('rare');
    const r=oldRareWin.apply(this,arguments);
    store();renderPetPanel();renderMonsterDex();renderHud();
    if(egg){$('statusText').innerHTML+=` <span class="petToastLine">🥚 稀有怪掉落神秘寵物蛋 ×1！</span>`;toast('🥚 稀有怪掉蛋了！');if(window.heroSfx)heroSfx.play('chest')}
    return r;
  };

  const oldRenderScreen=renderScreen;
  renderScreen=function(){
    const r=oldRenderScreen.apply(this,arguments),p=activePet();
    const arena=document.querySelector('.arena');
    if(arena&&p){
      const pet=document.createElement('div');pet.className='petCompanion';pet.textContent=p.e;pet.title=`${p.name} Lv.${activePetLevel()}｜${petAbilityText(p)}`;arena.appendChild(pet);
    }
    return r;
  };

  const oldRenderHud=renderHud;
  renderHud=function(){const r=oldRenderHud.apply(this,arguments);if($('eggCount'))$('eggCount').textContent=st.petEggs;return r};

  const oldRender=render;
  render=function(){const r=oldRender.apply(this,arguments);renderPetPanel();renderMonsterDex();return r};

  resetGame=function(){if(confirm('確定要清除 V4.13 的全部進度、寵物與圖鑑嗎？')){localStorage.removeItem('hero9_v41');location.reload()}};

  window.hatchEgg=hatchEgg;
  window.setActivePet=setActivePet;
  window.renderPetPanel=renderPetPanel;
  window.renderMonsterDex=renderMonsterDex;
  render();
})();
