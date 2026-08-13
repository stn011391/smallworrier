// V4.15 long-term progression: six gear generations, chapter quests and milestone rewards.
(()=>{
  const generations=[
    {id:1,name:'青銅世代',e:'🟤',unlockAt:0,theme:'冒險起步',reward:'bronze_guard_blade'},
    {id:2,name:'白銀世代',e:'⚪',unlockAt:5,theme:'守護與穩定',reward:'silver_moon_blade'},
    {id:3,name:'黃金世代',e:'🟡',unlockAt:10,theme:'高輸出成長',reward:'golden_lion_blade'},
    {id:4,name:'魔法世代',e:'🔮',unlockAt:15,theme:'魔力與續戰',reward:'arcane_star_blade'},
    {id:5,name:'龍魂世代',e:'🐲',unlockAt:20,theme:'龍魂強化',reward:'dragon_soul_blade_v415'},
    {id:6,name:'神話世代',e:'🌌',unlockAt:25,theme:'終局傳說裝備',reward:'mythic_cosmos_blade'}
  ];

  const progressionGear=[
    {id:'bronze_guard_blade',slot:'weapon',e:'🗡️',n:'青銅守護劍',rarity:'普通',price:14,atk:2,minGeneration:1},
    {id:'bronze_adventure_armor',slot:'armor',e:'🥋',n:'青銅冒險甲',rarity:'普通',price:15,hp:3,minGeneration:1},
    {id:'bronze_compass',slot:'charm',e:'🧭',n:'青銅勇氣羅盤',rarity:'普通',price:13,mp:1,atk:1,minGeneration:1},
    {id:'silver_moon_blade',slot:'weapon',e:'🌙',n:'白銀月刃',rarity:'稀有',price:28,atk:4,minGeneration:2},
    {id:'silver_guard_armor',slot:'armor',e:'🛡️',n:'白銀守護甲',rarity:'稀有',price:30,hp:5,def:1,minGeneration:2},
    {id:'silver_wolf_badge',slot:'charm',e:'🐺',n:'白銀狼徽',rarity:'稀有',price:27,mp:2,atk:1,minGeneration:2},
    {id:'golden_lion_blade',slot:'weapon',e:'🦁',n:'黃金獅王劍',rarity:'史詩',price:45,atk:6,minGeneration:3},
    {id:'golden_sun_armor',slot:'armor',e:'☀️',n:'黃金日耀甲',rarity:'史詩',price:48,hp:7,def:1,minGeneration:3},
    {id:'golden_hourglass',slot:'charm',e:'⌛',n:'黃金時砂',rarity:'史詩',price:43,mp:3,atk:2,minGeneration:3},
    {id:'arcane_star_blade',slot:'weapon',e:'✨',n:'奧術星芒劍',rarity:'史詩',price:62,atk:8,minGeneration:4},
    {id:'arcane_robe_armor',slot:'armor',e:'🪄',n:'奧術魔導甲',rarity:'史詩',price:65,hp:9,def:2,minGeneration:4},
    {id:'arcane_orb_v415',slot:'charm',e:'🔮',n:'奧術核心寶珠',rarity:'傳說',price:60,mp:4,atk:2,minGeneration:4},
    {id:'dragon_soul_blade_v415',slot:'weapon',e:'🐉',n:'龍魂破界劍',rarity:'傳說',price:82,atk:10,minGeneration:5},
    {id:'dragon_soul_armor_v415',slot:'armor',e:'🛡️🐲',n:'龍魂戰鎧',rarity:'傳說',price:86,hp:12,def:2,minGeneration:5},
    {id:'dragon_heart_charm',slot:'charm',e:'❤️‍🔥',n:'龍心護符',rarity:'傳說',price:78,mp:5,atk:3,minGeneration:5},
    {id:'mythic_cosmos_blade',slot:'weapon',e:'🌌⚔️',n:'神話星宇聖劍',rarity:'傳說',price:110,atk:12,minGeneration:6},
    {id:'mythic_hero_armor',slot:'armor',e:'👑🛡️',n:'神話勇者神鎧',rarity:'傳說',price:115,hp:15,def:3,minGeneration:6},
    {id:'mythic_crown_charm',slot:'charm',e:'👑',n:'神話王者冠冕',rarity:'傳說',price:105,mp:6,atk:4,minGeneration:6}
  ];

  progressionGear.forEach(g=>{if(!lootCatalog.some(x=>x.id===g.id))lootCatalog.push(g)});
  // Old gear is also progression-gated by its original power tier so legendary gear cannot appear at the start.
  lootCatalog.forEach(g=>{
    if(g.minGeneration)return;
    g.minGeneration=g.rarity==='傳說'?4:g.rarity==='史詩'?3:g.rarity==='稀有'?2:1;
  });

  st.chapterRewards=st.chapterRewards&&typeof st.chapterRewards==='object'?st.chapterRewards:{};
  st.chapterQuestClaimed=st.chapterQuestClaimed&&typeof st.chapterQuestClaimed==='object'?st.chapterQuestClaimed:{};

  function unlockedGeneration(){
    let g=1;
    for(let i=2;i<=6;i++)if(st.cleared.includes(generations[i-1].unlockAt))g=i;else break;
    return g;
  }
  function generationForChapter(c){return generations[Math.max(0,Math.min(5,c-1))]}
  function selectedChapter(){return Math.max(1,Math.min(6,Math.ceil((st.world||1)/5)))}
  function chapterWorlds(c){return worlds.filter(w=>Math.ceil(w.id/5)===c)}
  function chapterStats(c){
    const ws=chapterWorlds(c);let monsters=0,bosses=0,clears=0;
    ws.forEach(w=>{
      const d=st.defeated[w.id]||[];monsters+=d.length;
      if(d.includes(4))bosses++;
      if(st.cleared.includes(w.id))clears++;
    });
    const genGear=lootCatalog.filter(g=>(g.minGeneration||1)===c).map(g=>g.id);
    const gearOwned=(st.lootGear||[]).filter(id=>genGear.includes(id)).length;
    return {monsters,bosses,clears,gearOwned};
  }
  function grantGear(id,quiet=false){
    const g=lootCatalog.find(x=>x.id===id);if(!g)return false;
    if(st.lootGear.includes(id))return false;
    st.lootGear.push(id);
    if(!st.equipped[g.slot])st.equipped[g.slot]=id;
    if(!quiet)toast(`${g.e} 獲得「${g.n}」！`);
    return true;
  }
  function grantMilestone(genId,quiet=false){
    const gen=generations[genId-1];if(!gen||st.chapterRewards[genId])return false;
    if(gen.unlockAt>0&&!st.cleared.includes(gen.unlockAt))return false;
    const newGear=grantGear(gen.reward,true);
    st.chapterRewards[genId]=1;
    st.coins+=12+genId*6;
    if(typeof st.petEggs==='number')st.petEggs++;
    store();
    if(!quiet){
      const g=lootCatalog.find(x=>x.id===gen.reward);
      toast(`${gen.e} ${gen.name}解鎖！${newGear&&g?`獲得 ${g.n}＋`:''}金幣與寵物蛋！`);
    }
    return true;
  }
  // Existing saves receive already-earned generation rewards automatically.
  grantMilestone(1,true);
  for(let g=2;g<=6;g++)grantMilestone(g,true);

  randomGear=function(){
    const unlocked=unlockedGeneration();
    const eligible=lootCatalog.filter(g=>(g.minGeneration||1)<=unlocked);
    const newest=eligible.filter(g=>(g.minGeneration||1)===unlocked);
    let pool=(newest.length&&Math.random()<.72)?newest:eligible;
    const target=weightedRarity();
    const byRarity=pool.filter(g=>g.rarity===target);
    if(byRarity.length)pool=byRarity;
    return pool[Math.floor(Math.random()*pool.length)]||eligible[0]||lootCatalog[0];
  };

  function claimChapterQuests(c){
    const s=chapterStats(c),checks=[s.monsters>=12,s.bosses>=2,s.clears>=3,s.gearOwned>=1];
    checks.forEach((done,i)=>{
      const key=`${c}-${i}`;if(!done||st.chapterQuestClaimed[key])return;
      st.chapterQuestClaimed[key]=1;
      if(i===0)st.coins+=8+c*3;
      if(i===1)st.items.potion=(st.items.potion||0)+1;
      if(i===2)st.items.key=(st.items.key||0)+1;
      if(i===3&&typeof st.petEggs==='number')st.petEggs++;
    });
    store();
  }

  function renderProgression(){
    const root=$('progressionPanel');if(!root)return;
    const unlocked=unlockedGeneration();
    const cards=generations.map((g,i)=>{
      const open=g.id<=unlocked,done=!!st.chapterRewards[g.id];
      const set=lootCatalog.filter(x=>(x.minGeneration||1)===g.id&&progressionGear.some(p=>p.id===x.id));
      const owned=set.filter(x=>st.lootGear.includes(x.id)).length;
      return `<div class="genCard ${open?'open':'locked'} ${g.id===unlocked?'current':''}">
        <div class="genIcon">${open?g.e:'🔒'}</div><b>${open?g.name:'??? 世代'}</b>
        <small>${open?g.theme:`完成 Dungeon ${g.unlockAt} 解鎖`}</small>
        <div class="genSet">${open?`專屬裝備 ${owned}/${set.length}`:'尚未解鎖'}</div>
        <div>${done?'✅ 里程碑獎勵已領取':g.unlockAt===0?'🎁 起始世代':'🎁 通關前章解鎖'}</div>
      </div>`;
    }).join('');
    root.innerHTML=`<div class="genTop"><b>目前裝備世代：${generations[unlocked-1].e} ${generations[unlocked-1].name}</b><span>高階裝備只會在解鎖後進入商店／寶箱池</span></div><div class="genGrid">${cards}</div>`;
  }

  renderQuests=function(){
    const c=selectedChapter(),s=chapterStats(c);claimChapterQuests(c);
    const items=[
      ['⚔️',`第 ${c} 章擊倒 12 隻怪`,s.monsters,12,`🪙 ${8+c*3}`],
      ['🐲',`第 ${c} 章擊倒 2 隻 Boss`,s.bosses,2,'🍎 生命藥水'],
      ['🏰',`第 ${c} 章完成 3 個地下城`,s.clears,3,'🔑 寶箱鑰匙'],
      ['✨',`收集第 ${c} 世代裝備 1 件`,s.gearOwned,1,'🥚 寵物蛋']
    ];
    const root=$('quests');if(!root)return;
    root.innerHTML=`<div class="chapterQuestTitle">📜 第 ${c} 章任務｜${chapterNames[c-1]}</div>`+items.map((x,i)=>{
      const done=x[2]>=x[3],claimed=!!st.chapterQuestClaimed[`${c}-${i}`];
      return `<div class="quest ${done?'done':''}"><div class="i">${x[0]}</div><b>${x[1]}</b><div>${Math.min(x[2],x[3])}/${x[3]}<br><small>${claimed?'✅ 已獲獎':`獎勵：${x[4]}`}</small></div></div>`;
    }).join('');
  };

  const oldClear=clearWorld;
  clearWorld=function(id){
    const r=oldClear.apply(this,arguments);
    if(id%5===0){
      const next=Math.min(6,id/5+1);
      if(next>=2)grantMilestone(next,false);
      if(id===30){st.coins+=60;if(typeof st.petEggs==='number')st.petEggs+=2;store();toast('🌌 最終試煉完成！獲得 60 金幣＋2 顆寵物蛋！')}
    }
    renderProgression();renderQuests();renderInventory();renderHud();
    if(typeof renderPetPanel==='function')renderPetPanel();
    return r;
  };

  const oldRender=render;
  render=function(){const r=oldRender.apply(this,arguments);renderProgression();renderQuests();return r};
  renderProgression();renderQuests();renderInventory();renderHud();
  window.v415Progression={generations,unlockedGeneration,chapterStats,renderProgression};
})();