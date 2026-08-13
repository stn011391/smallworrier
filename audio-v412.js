// V4.12 RPG-style synthesized sound effects. No external audio files required.
(()=>{
  let ctx=null, master=null;
  let enabled=localStorage.getItem('hero_sfx_v412')!=='off';

  function ensureAudio(){
    if(!ctx){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      ctx=new AC();
      master=ctx.createGain();
      master.gain.value=.20;
      master.connect(ctx.destination);
    }
    if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    return true;
  }

  function tone(freq,dur=.12,type='square',vol=.16,delay=0,endFreq=null){
    if(!enabled||!ensureAudio())return;
    const t=ctx.currentTime+delay;
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;
    o.frequency.setValueAtTime(Math.max(40,freq),t);
    if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(40,endFreq),t+dur);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);
  }

  function noise(dur=.12,vol=.12,delay=0,cutoff=1400){
    if(!enabled||!ensureAudio())return;
    const len=Math.max(1,Math.floor(ctx.sampleRate*dur));
    const buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();
    src.buffer=buffer;filter.type='lowpass';filter.frequency.value=cutoff;g.gain.value=vol;
    src.connect(filter);filter.connect(g);g.connect(master);src.start(ctx.currentTime+delay);
  }

  function vibrate(pattern){if(enabled&&navigator.vibrate)navigator.vibrate(pattern)}

  function play(name){
    if(!enabled)return;
    switch(name){
      case 'encounter': tone(220,.09,'square',.11);tone(330,.12,'square',.10,.08);break;
      case 'boss': noise(.42,.18,0,600);tone(120,.38,'sawtooth',.20,0,58);tone(85,.32,'square',.15,.18,48);vibrate([60,40,90]);break;
      case 'correct': tone(523,.09,'sine',.11);tone(659,.09,'sine',.11,.08);tone(784,.14,'sine',.12,.16);break;
      case 'wrong': tone(190,.14,'square',.12,0,120);tone(115,.18,'sawtooth',.09,.10,75);vibrate(45);break;
      case 'slash': noise(.09,.14,0,2300);tone(520,.09,'sawtooth',.10,0,190);break;
      case 'fire': noise(.20,.15,0,900);tone(160,.22,'sawtooth',.14,0,420);tone(520,.11,'square',.08,.10,260);break;
      case 'heavy': noise(.15,.18,0,700);tone(115,.22,'square',.19,0,55);vibrate(35);break;
      case 'heal': tone(440,.12,'sine',.10);tone(554,.12,'sine',.10,.10);tone(659,.20,'sine',.12,.20);break;
      case 'thunder': noise(.28,.22,0,500);tone(75,.25,'square',.20,0,45);tone(680,.07,'square',.09,.03,260);vibrate([25,25,45]);break;
      case 'ice': tone(1200,.12,'sine',.08,0,760);tone(900,.15,'sine',.08,.08,520);noise(.09,.06,.05,3500);break;
      case 'ultimate': noise(.38,.20,0,1000);tone(100,.34,'sawtooth',.20,0,48);tone(330,.18,'square',.11,.12,760);tone(880,.20,'sine',.12,.27);vibrate([40,25,40,25,80]);break;
      case 'enemy': noise(.10,.12,0,1500);tone(260,.11,'sawtooth',.10,0,120);break;
      case 'hurt': tone(105,.18,'square',.18,0,60);noise(.10,.12,0,650);vibrate(55);break;
      case 'level': [523,659,784,1047].forEach((f,i)=>tone(f,.18,'sine',.11,i*.11));break;
      case 'chest': tone(392,.10,'sine',.10);tone(523,.10,'sine',.11,.09);tone(659,.12,'sine',.11,.18);tone(1047,.24,'sine',.13,.28);break;
      case 'crate': tone(260,.08,'square',.08);tone(390,.11,'square',.08,.07);break;
      case 'coin': tone(1100,.06,'sine',.08);tone(1500,.10,'sine',.08,.055);break;
    }
  }

  function updateToggle(){
    let b=document.getElementById('sfxToggle');
    if(!b){
      const hud=document.querySelector('.hud');
      if(!hud)return;
      b=document.createElement('button');
      b.id='sfxToggle';b.type='button';
      b.onclick=()=>{
        enabled=!enabled;
        localStorage.setItem('hero_sfx_v412',enabled?'on':'off');
        if(enabled){ensureAudio();setTimeout(()=>play('correct'),30)}
        updateToggle();
      };
      hud.appendChild(b);
    }
    b.className=enabled?'on':'off';
    b.textContent=enabled?'🔊 音效 ON':'🔇 音效 OFF';
    b.setAttribute('aria-pressed',enabled?'true':'false');
    b.title='開啟／關閉戰鬥音效';
  }

  // Browsers require a user gesture before Web Audio can start.
  document.addEventListener('pointerdown',()=>ensureAudio(),{once:true,capture:true});
  document.addEventListener('keydown',()=>ensureAudio(),{once:true,capture:true});
  updateToggle();

  const oldSelect=window.selectEnemy;
  if(typeof oldSelect==='function')window.selectEnemy=function(i){
    const w=worlds[st.world-1],m=w&&w.m[i];
    const result=oldSelect.apply(this,arguments);
    if(battle&&battle.active&&battle.index===i)play(m&&m[3]?'boss':'encounter');
    return result;
  };

  const oldRare=window.startRareBattle;
  if(typeof oldRare==='function')window.startRareBattle=function(){const r=oldRare.apply(this,arguments);play('encounter');return r};

  const oldAnswer=window.answerQuestion;
  if(typeof oldAnswer==='function')window.answerQuestion=function(btn,i){
    const ok=!!currentQ&&i===currentQ.a;
    play(ok?'correct':'wrong');
    return oldAnswer.apply(this,arguments);
  };

  const oldResolve=window.resolveSkill;
  if(typeof oldResolve==='function')window.resolveSkill=function(ok){
    if(ok&&battle)play({slash:'slash',fire:'fire',heavy:'heavy',heal:'heal',thunder:'thunder',ice:'ice',ultimate:'ultimate'}[battle.skill]||'slash');
    return oldResolve.apply(this,arguments);
  };

  const oldEnemy=window.enemyAttack;
  if(typeof oldEnemy==='function')window.enemyAttack=function(){
    play('enemy');setTimeout(()=>play('hurt'),180);
    return oldEnemy.apply(this,arguments);
  };

  const oldLevel=window.checkLevel;
  if(typeof oldLevel==='function')window.checkLevel=function(){
    const before=st.level,r=oldLevel.apply(this,arguments);
    if(st.level>before)setTimeout(()=>play('level'),60);
    return r;
  };

  const oldLocked=window.openLockedTreasureChest;
  if(typeof oldLocked==='function')window.openLockedTreasureChest=function(){
    const hadKey=(st.items.key||0)>0,r=oldLocked.apply(this,arguments);
    if(hadKey)play('chest');
    return r;
  };

  const oldCrate=window.openSupplyCrate;
  if(typeof oldCrate==='function')window.openSupplyCrate=function(){const r=oldCrate.apply(this,arguments);play('crate');return r};

  const oldBuy=window.buyShopItem;
  if(typeof oldBuy==='function')window.buyShopItem=function(i){
    const before=st.coins,r=oldBuy.apply(this,arguments);
    if(st.coins<before)play('coin');
    return r;
  };

  window.heroSfx={play,ensureAudio,isEnabled:()=>enabled};
})();
