// V4.14 combat balance: chapter-scaled wrong-answer damage, stronger rare monsters, and 3-stage Boss fights.
(()=>{
  function chapter(){return Math.min(6,Math.max(1,Math.ceil((battle?.world||st.world||1)/5)))}
  function bossPhase(){
    if(!battle||battle.rare)return 1;
    const m=currentMonster();
    if(!m||!m[3])return 1;
    const pct=battle.mhp/Math.max(1,m[2]);
    return pct<=.30?3:pct<=.65?2:1;
  }
  function phaseName(p){return p===3?'🔥 終極階段':p===2?'💢 暴走階段':'⚔️ 第一階段'}

  wrongAnswerDamage=function(){
    if(!battle)return 0;
    const m=currentMonster(),ch=chapter();
    let raw=2+Math.floor((ch-1)/2);
    if(battle.rare)raw+=3;
    else if(m&&m[3])raw+=3;
    else if(battle.index===3)raw+=2;
    else if(battle.index===2)raw+=1;
    const phase=bossPhase();
    if(m&&m[3]&&!battle.rare)raw+=phase===2?1:phase===3?2:0;
    if((battle.world||0)===30&&m&&m[3])raw+=1;
    return Math.max(1,raw-defense()-(battle.enemyWeaken||0));
  };

  const oldStartRare=window.startRareBattle;
  if(typeof oldStartRare==='function')window.startRareBattle=function(e,n,hp){
    const w=worlds[st.world-1];
    const elite=w&&w.m&&w.m[3]?w.m[3][2]:Math.max(20,hp||20);
    const tuned=Math.round(elite*1.18);
    return oldStartRare.call(this,e,n,tuned);
  };

  const oldUpdate=window.updateBattle;
  if(typeof oldUpdate==='function')window.updateBattle=function(){
    const before=battle?.bossPhase||1;
    const r=oldUpdate.apply(this,arguments);
    if(!battle)return r;
    const m=currentMonster(),p=bossPhase();
    if(m&&m[3]&&!battle.rare){
      battle.bossPhase=p;
      const name=$('monsterName');
      if(name)name.textContent=`${m[0]} ${m[1]}｜${phaseName(p)}`;
      const arena=document.querySelector('.arena');
      if(arena){arena.classList.toggle('bossPhase2',p===2);arena.classList.toggle('bossPhase3',p===3);}
      if(p>before&&battle.mhp>0){
        setTimeout(()=>{
          if(!battle||battle.mhp<=0)return;
          const text=p===2?'💢 Boss 進入暴走階段！答錯時攻擊力提高。':'🔥 FINAL PHASE！Boss 使出最後的力量，答錯會更痛！';
          if($('statusText'))$('statusText').innerHTML=`<b>${text}</b>`;
          toast(text);
          if(window.heroSfx)heroSfx.play('boss');
        },0);
      }
    }
    return r;
  };

  const style=document.createElement('style');
  style.textContent=`
    .arena.bossPhase2{box-shadow:inset 0 0 0 4px #8b3f28,0 0 24px #ff7b3344}
    .arena.bossPhase3{box-shadow:inset 0 0 0 5px #8b2338,0 0 34px #ff365b66}
    .arena.bossPhase3 .monsterChar{filter:drop-shadow(0 0 18px #ff526f) drop-shadow(0 8px 5px #0006)}
  `;
  document.head.appendChild(style);

  if(typeof renderMap==='function')renderMap();
  if(typeof renderScreen==='function')renderScreen();
})();
