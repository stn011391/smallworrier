// V4.10 Wrong-answer HP penalty: visible HP loss and manual revive at 0 HP.
function wrongAnswerDamage(){
  if(!battle)return 0;
  const m=currentMonster();
  const raw=battle.rare?4:(m&&m[3])?5:battle.index===3?4:battle.index===2?3:2;
  return Math.max(1,raw-defense()-(battle.enemyWeaken||0));
}

answerQuestion=function(btn,i){
  document.querySelectorAll('.ans').forEach(x=>x.disabled=true);
  if(i===currentQ.a){
    btn.classList.add('good');
    st.stars++;
    st.combo++;
    st.quest.correct++;
    if(st.combo>=5)st.quest.combo5=1;
    store();
    setTimeout(()=>{$('qModal').classList.remove('show');resolveSkill(true)},450);
  }else{
    btn.classList.add('bad');
    st.combo=0;
    store();
    setTimeout(()=>{$('qModal').classList.remove('show');enemyAttack()},550);
  }
};

enemyAttack=function(){
  if(!battle)return;
  animate('monsterChar','enemyAttack');
  setTimeout(()=>{
    animate('heroChar','hit');
    const dmg=wrongAnswerDamage();
    battle.enemyWeaken=0;
    battle.hp=Math.max(0,battle.hp-dmg);
    battle.mp=Math.min(mpMax(),battle.mp+1);
    updateBattle();
    toast(`💔 答錯！-${dmg} HP`);

    if(battle.hp<=0){
      battle.active=false;
      $('statusText').innerHTML=`💀 <b>HP 歸零！</b> 答錯受到 <b>${dmg}</b> 傷害。勇者倒下了，按「檢查點復活」才能繼續。`;
      $('actions').innerHTML='<button class="btn red" onclick="reviveBattle()">❤️ 檢查點復活</button>';
      return;
    }

    $('statusText').innerHTML=`💔 <b>答錯！-${dmg} HP</b>　目前 HP：<b>${battle.hp}/${hpMax()}</b>；MP +1。`;
    $('actions').innerHTML=skillButtons();
  },170);
};

function reviveBattle(){
  if(!battle)return;
  battle.hp=hpMax();
  battle.mp=mpMax();
  battle.enemyWeaken=0;
  battle.active=true;
  updateBattle();
  $('statusText').innerHTML=`❤️ 勇者在檢查點復活！HP <b>${battle.hp}/${hpMax()}</b>、MP <b>${battle.mp}/${mpMax()}</b>，怪獸 HP 不恢復。`;
  $('actions').innerHTML=skillButtons();
  toast('❤️ 復活成功！');
}
