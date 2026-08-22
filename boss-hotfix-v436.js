// V4.36 Boss shield hotfix: cumulative shield-break progress + 1 HP anti-stall guard.
(()=>{
  const bossState=()=>{
    if(!battle||battle.rare)return null;
    let m=null;
    try{m=typeof currentMonster==='function'?currentMonster():null}catch(_){m=null}
    if(!m||!m[3])return null;
    return battle;
  };

  // V4.28 resets FINAL PHASE shield progress to 0 whenever the player misses.
  // Preserve the pre-miss progress instead: correct answers accumulate until 2/2.
  const oldWrong436=wrongAnswerDamage;
  wrongAnswerDamage=function(){
    const b=bossState();
    const keep=b&&Number(b.v428Phase)===3&&Number(b.v428Shield)>0
      ? {shield:Number(b.v428Shield),streak:Number(b.v428ShieldStreak||0)}
      : null;
    const d=oldWrong436.apply(this,arguments);
    if(keep&&battle===b&&b.active&&Number(b.v428Phase)===3&&!b.v436ShieldBroken){
      b.v428Shield=keep.shield;
      b.v428ShieldStreak=keep.streak;
    }
    return d;
  };

  const oldResolve436=resolveSkill;
  resolveSkill=function(ok){
    const b=bossState();
    const shieldBefore=b&&Number(b.v428Phase)===3?Number(b.v428Shield||0):0;
    const r=oldResolve436.apply(this,arguments);

    if(b&&battle===b&&Number(b.v428Phase)===3){
      if(Number(b.v428Shield||0)<=0){
        b.v436ShieldBroken=true;
        b.v428Shield=0;
        b.v428ShieldStreak=Math.max(2,Number(b.v428ShieldStreak||0));
      }

      // On the exact hit that breaks the shield, V4.28 can have already intercepted a lethal
      // winBattle call and forced the Boss back to 1 HP. Finish that edge case immediately.
      if(ok&&shieldBefore>0&&b.v436ShieldBroken&&b.active&&Number(b.mhp)<=1){
        setTimeout(()=>{
          if(battle===b&&b.active&&Number(b.v428Shield||0)<=0&&Number(b.mhp)<=1){
            b.mhp=0;
            updateBattle();
            winBattle();
          }
        },280);
      }
    }
    return r;
  };

  // Once the shield is broken, never allow an older wrapper to resurrect it during the kill check.
  const oldWin436=winBattle;
  winBattle=function(){
    const b=bossState();
    if(b&&Number(b.v428Phase)===3&&(b.v436ShieldBroken||Number(b.v428Shield||0)<=0)){
      b.v436ShieldBroken=true;
      b.v428Shield=0;
      b.v428ShieldStreak=Math.max(2,Number(b.v428ShieldStreak||0));
    }
    return oldWin436.apply(this,arguments);
  };

  // Update the visible Boss instructions to match the friendlier rule.
  const oldSkills436=skillButtons;
  skillButtons=function(){
    let html=oldSkills436.apply(this,arguments);
    if(typeof html==='string'){
      html=html
        .replace('連續答對 2 題 BREAK！','累積答對 2 題 BREAK！')
        .replace('連續答對 2 題才能 BREAK！','累積答對 2 題即可 BREAK！答錯不歸零');
    }
    return html;
  };

  window.v436BossHotfix={active:true};
})();
