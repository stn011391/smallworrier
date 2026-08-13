// V4.15 death rules: one free revive, then paid revives with monster recovery.
(()=>{
  function chapter(){return Math.max(1,Math.min(6,Math.ceil((battle?.world||st.world||1)/5)))}
  function maxMonsterHp(){const m=currentMonster();return m?m[2]:1}
  function isBoss(){const m=currentMonster();return !!(m&&m[3]&&!battle?.rare)}
  function isElite(){return !!(battle&&!battle.rare&&battle.index===3)}
  function reviveCoinCost(){return 8+chapter()*5+Math.max(0,(battle?.deaths||1)-2)*5}
  function recoveryRate(){if(isBoss())return .18;if(battle?.rare)return .14;if(isElite())return .10;return .08}

  function deathActions(){
    const deaths=battle?.deaths||1;
    if(deaths===1){
      return '<button class="btn green" onclick="v415Revive(\'free\')">✨ 免費救援 1 次</button><button class="btn soft" onclick="v415Retreat()">🏃 撤退</button>';
    }
    const cost=reviveCoinCost();
    const potion=(st.items.potion||0)>0?'<button class="btn green" onclick="v415Revive(\'potion\')">🍎 消耗 1 瓶生命藥水復活</button>':'';
    const coin=st.coins>=cost?`<button class="btn gold" onclick="v415Revive('coin')">🪙 ${cost} 金幣復活</button>`:`<button class="btn soft" disabled>🪙 需要 ${cost} 金幣</button>`;
    return `${potion}${coin}<button class="btn soft" onclick="v415Retreat()">🏃 撤退並重打</button>`;
  }

  function showDeath(dmg){
    battle.active=false;
    battle.deaths=(battle.deaths||0)+1;
    const first=battle.deaths===1;
    const warning=first
      ?'這場戰鬥還有 <b>1 次免費救援</b>，怪物 HP 不回復。'
      :`再次倒下後需要消耗資源；復活時${isBoss()?' Boss':'怪物'}會回復約 <b>${Math.round(recoveryRate()*100)}%</b> HP。`;
    $('statusText').innerHTML=`💀 <b>勇者倒下！</b> 這次受到 ${dmg} 傷害。<br>${warning}`;
    $('actions').innerHTML=deathActions();
    toast(first?'✨ 還有一次免費救援！':'💀 再次倒下，需要付出復活代價！');
  }

  enemyAttack=function(){
    if(!battle)return;
    battle.petDodged=false;
    animate('monsterChar','enemyAttack');
    if(window.heroSfx)heroSfx.play('enemy');
    setTimeout(()=>{
      const dmg=wrongAnswerDamage();
      battle.enemyWeaken=0;
      if(dmg>0){
        animate('heroChar','hit');
        battle.hp=Math.max(0,battle.hp-dmg);
        if(window.heroSfx)setTimeout(()=>heroSfx.play('hurt'),80);
      }
      battle.mp=Math.min(mpMax(),battle.mp+1);
      updateBattle();

      if(battle.petDodged||dmg===0){
        $('statusText').innerHTML='🦊 <b>寵物幫你閃掉傷害！</b> 這次答錯沒有扣 HP；MP +1。';
        $('actions').innerHTML=skillButtons();
        toast('✨ 寵物閃避成功！');
        return;
      }
      toast(`💔 答錯！-${dmg} HP`);
      if(battle.hp<=0){showDeath(dmg);return}
      $('statusText').innerHTML=`💔 <b>答錯！-${dmg} HP</b>　目前 HP：<b>${battle.hp}/${hpMax()}</b>；MP +1。`;
      $('actions').innerHTML=skillButtons();
    },170);
  };

  window.v415Revive=function(mode){
    if(!battle||battle.active)return;
    const deaths=battle.deaths||1;
    if(mode==='free'){
      if(deaths!==1){toast('免費救援已經用過了！');return}
      battle.hp=hpMax();battle.mp=mpMax();battle.enemyWeaken=0;battle.active=true;
      updateBattle();$('statusText').innerHTML='✨ <b>救援成功！</b> 第一次倒下免費復活，HP / MP 全滿，怪物 HP 不恢復。';$('actions').innerHTML=skillButtons();toast('❤️ 免費救援成功！');return;
    }
    if(deaths<2){toast('目前可以使用免費救援！');return}
    if(mode==='potion'){
      if((st.items.potion||0)<=0){toast('🍎 沒有生命藥水！');return}
      st.items.potion--;
    }else if(mode==='coin'){
      const cost=reviveCoinCost();if(st.coins<cost){toast('🪙 金幣不足！');return}st.coins-=cost;
    }else return;

    const m=currentMonster(),maxHp=maxMonsterHp(),heal=Math.max(1,Math.round(maxHp*recoveryRate()));
    battle.mhp=Math.min(maxHp,battle.mhp+heal);
    battle.hp=Math.max(1,Math.ceil(hpMax()*.75));
    battle.mp=Math.max(1,Math.ceil(mpMax()*.60));
    battle.enemyWeaken=0;battle.active=true;
    store();updateBattle();renderHud();
    $('statusText').innerHTML=`❤️ <b>付費復活！</b> HP 回復至 ${battle.hp}/${hpMax()}、MP ${battle.mp}/${mpMax()}；${m?m[1]:'怪物'} 回復 <b>${heal} HP</b>。`;
    $('actions').innerHTML=skillButtons();toast(`❤️ 復活成功，敵人 +${heal} HP`);
  };

  window.v415Retreat=function(){
    if(!battle)return;
    const name=currentMonster()?.[1]||'怪物';battle=null;renderScreen();
    if($('statusText'))$('statusText').innerHTML=`🏃 已撤退。再次挑戰 <b>${name}</b> 時，牠會以完整 HP 重新開始。`;
    toast('🏃 撤退成功');
  };

  // Keep the old revive button safe if an older UI/state still invokes it.
  window.reviveBattle=function(){if(!battle)return;v415Revive((battle.deaths||1)===1?'free':'coin')};
})();