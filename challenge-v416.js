// V4.16 Challenge guidance + over-level rewards.
(()=>{
  const genNames=['青銅','白銀','黃金','魔法','龍魂','神話'];
  const genIcons=['🟤','⚪','🟡','🔮','🐲','🌌'];
  const milestoneRewards=[null,'bronze_guard_blade','silver_moon_blade','golden_lion_blade','arcane_star_blade','dragon_soul_blade_v415','mythic_cosmos_blade'];

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
  function syncMilestones(){
    st.chapterRewards=st.chapterRewards&&typeof st.chapterRewards==='object'?st.chapterRewards:{};
    const cur=currentGeneration();let changed=false;
    for(let g=1;g<=cur;g++){
      if(st.chapterRewards[g])continue;
      const id=milestoneRewards[g],item=lootCatalog.find(x=>x.id===id);
      if(item&&!st.lootGear.includes(id)){st.lootGear.push(id);if(!st.equipped[item.slot])st.equipped[item.slot]=id;}
      st.chapterRewards[g]=1;st.coins+=12+g*6;if(typeof st.petEggs==='number')st.petEggs++;changed=true;
    }
    if(changed)store();
  }
  syncMilestones();

  renderMap=function(){
    const holder=$('map');if(!holder)return;
    const cur=currentGeneration();holder.style.display='block';
    holder.innerHTML=chapterNames.map((chapterName,idx)=>{
      const list=worlds.filter(w=>w.chapter===idx+1),range=`Dungeon ${idx*5+1}–${idx*5+5}`;
      return `<section class="v416Chapter"><div class="v416ChapterHead"><h3>📖 Chapter ${idx+1}｜${chapterName}</h3><b>${range}</b></div><div class="v416MapGrid">${list.map(w=>{
        const cleared=st.cleared.includes(w.id),d=dangerFor(w.id),rec=recommendedGeneration(w.id);
        return `<button class="zone v416Zone ${st.world===w.id?'active':''} ${cleared?'clear locked':''} danger-${d.key}" ${cleared?'disabled':`onclick="openWorld(${w.id})"`}>
          <div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small>
          <div class="v416Danger">${cleared?'✅ 已完成':`${d.icon} ${d.label}`}</div>
          <small>建議：${genIcons[rec-1]} ${genNames[rec-1]}｜目前：${genIcons[cur-1]} ${genNames[cur-1]}</small>
          ${!cleared&&d.gap>0?'<div class="v416Bonus">🎁 越級勝利：金幣 / XP ×1.5＋額外蛋率</div>':''}
        </button>`;
      }).join('')}</div></section>`;
    }).join('');
  };

  const oldOpenWorld416=openWorld;
  openWorld=function(id){
    const d=dangerFor(id),r=oldOpenWorld416.apply(this,arguments);
    if(!st.cleared.includes(id)&&d.gap>0){
      toast(`${d.icon} ${d.label}！打贏可獲金幣 / XP ×1.5`);
      if($('statusText'))$('statusText').innerHTML=`${d.icon} <b>${d.label}</b>｜建議 ${genIcons[recommendedGeneration(id)-1]} ${genNames[recommendedGeneration(id)-1]}世代。仍可自由挑戰，越級勝利有額外獎勵！`;
    }
    return r;
  };

  const oldSelectEnemy416=selectEnemy;
  selectEnemy=function(i){
    const d=dangerFor(st.world),r=oldSelectEnemy416.apply(this,arguments);
    if(battle){battle.v416Overlevel=d.gap;battle.v416RewardMult=d.gap>0?1.5:1;if(d.gap>0&&$('statusText'))$('statusText').innerHTML+=`<br><span class="v416BattleHint">🎁 越級勝利：金幣 / XP ×1.5，並提高額外寵物蛋機率</span>`;}
    return r;
  };

  const oldBattleReward416=battleReward;
  battleReward=function(i,boss){
    const r=oldBattleReward416.apply(this,arguments),mult=battle?.v416RewardMult||1;
    if(mult>1){r.coin=Math.round(r.coin*mult);r.xp=Math.round(r.xp*mult);r.label=`越級${r.label}`;}
    return r;
  };

  const oldWinBattle416=winBattle;
  winBattle=function(){
    const over=battle?.v416Overlevel||0,b=battle,r=oldWinBattle416.apply(this,arguments);
    if(over>0&&b&&!b.rare){
      const chance=Math.min(.30,.10+over*.07);
      if(Math.random()<chance){st.petEggs=Number(st.petEggs||0)+1;store();if(typeof renderPetPanel==='function')renderPetPanel();renderHud();if($('statusText'))$('statusText').innerHTML+=' <b class="v416BonusDrop">🥚 越級挑戰額外掉蛋！</b>';toast('🥚 越級獎勵：額外寵物蛋！');}
    }
    return r;
  };

  renderMap();
  window.v416Challenge={currentGeneration,recommendedGeneration,dangerFor,syncMilestones};
})();