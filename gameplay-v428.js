// V4.28 interactive question modes + three-phase Boss fights + manual pet skill/bond growth.
(()=>{
  const norm=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/[。.!?？]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const petMeta={wolf:['🐺','勇氣小狼','🌙 銀月戰狼'],turtle:['🐢','守護小龜','🛡️ 聖盾玄龜'],fox:['🦊','九尾靈狐','✨ 幻月九尾'],slime:['👾','魔法史萊姆','🔮 奧術史萊姆'],dragon:['🐲','火焰幼龍','🔥 炎翼龍'],unicorn:['🦄','星光獨角獸','🌈 星耀獨角獸']};
  st.petReady428=!!st.petReady428;
  st.petBond428=st.petBond428&&typeof st.petBond428==='object'?st.petBond428:{};
  st.qMode428=Number(st.qMode428||0);

  // ---------- 1) Five question interaction modes ----------
  function correctText(){return currentQ?.o?.[currentQ.a]}
  function canInput(){const x=String(correctText()??'');return x.length>0&&x.length<=24&&!/[\n<>]/.test(x)}
  function canOrder(){const x=String(correctText()??'').trim();return /[A-Za-z]/.test(x)&&x.split(/\s+/).length>=3&&x.split(/\s+/).length<=9}
  function modeFor(){
    const cycle=['choice','input','match','order','judge'];
    for(let k=0;k<cycle.length;k++){
      const m=cycle[(st.qMode428+k)%cycle.length];
      if(m==='input'&&!canInput())continue;
      if(m==='order'&&!canOrder())continue;
      st.qMode428=(cycle.indexOf(m)+1)%cycle.length;store();return m;
    }
    return 'choice';
  }
  function submitIndex(btn,ok){
    const wrong=currentQ.a===0?1:0;
    answerQuestion(btn,ok?currentQ.a:wrong);
  }
  window.v428InputSubmit=function(btn){
    const v=document.getElementById('v428Input')?.value||'';
    submitIndex(btn,norm(v)===norm(correctText()));
  };
  window.v428Judge=function(btn,answer){
    const truth=btn.closest('.v428JudgeWrap')?.dataset.truth==='1';
    submitIndex(btn,answer===truth);
  };
  window.v428OrderPick=function(btn){
    const out=document.getElementById('v428OrderOut');if(!out)return;
    if(btn.classList.contains('used'))return;
    btn.classList.add('used');
    const chip=document.createElement('button');chip.type='button';chip.className='v428Placed';chip.textContent=btn.textContent;chip.dataset.source=btn.dataset.idx;
    chip.onclick=()=>{document.querySelector(`.v428Word[data-idx="${chip.dataset.source}"]`)?.classList.remove('used');chip.remove()};
    out.appendChild(chip);
  };
  window.v428OrderSubmit=function(btn){
    const got=[...document.querySelectorAll('#v428OrderOut .v428Placed')].map(x=>x.textContent).join(' ');
    submitIndex(btn,norm(got)===norm(correctText()));
  };
  window.v428MatchPick=function(btn){
    document.querySelectorAll('.v428Drag').forEach(x=>x.classList.remove('picked'));btn.classList.add('picked');
  };
  window.v428MatchDrop=function(e){e.preventDefault();const idx=Number(e.dataTransfer?.getData('text/plain'));const btn=document.querySelector(`.v428Drag[data-i="${idx}"]`);if(btn)submitIndex(btn,idx===currentQ.a)};
  window.v428MatchTapDrop=function(){const btn=document.querySelector('.v428Drag.picked');if(!btn){toast('先選一張答案卡！');return}submitIndex(btn,Number(btn.dataset.i)===currentQ.a)};
  window.v428DragStart=function(e,i){e.dataTransfer?.setData('text/plain',String(i))};

  function renderMode(mode){
    if(!currentQ)return;
    const box=$('qAnswers'),title=$('qTitle');if(!box)return;
    if(mode==='choice'){
      if(title)title.textContent='🎯 四選一｜答對才能出招';
      box.innerHTML=currentQ.o.map((x,i)=>`<button class="ans" onclick="answerQuestion(this,${i})">${x}</button>`).join('');
    }else if(mode==='input'){
      if(title)title.textContent='⌨️ 自己輸入答案';
      box.innerHTML=`<div class="v428InputWrap"><input id="v428Input" autocomplete="off" inputmode="text" placeholder="輸入你的答案"><button class="ans v428Submit" onclick="v428InputSubmit(this)">送出答案 ⚔️</button></div>`;
      setTimeout(()=>$('v428Input')?.focus(),80);
    }else if(mode==='match'){
      if(title)title.textContent='🔀 配對挑戰｜把正確卡片送進答案區';
      box.innerHTML=`<div class="v428MatchGrid">${currentQ.o.map((x,i)=>`<button class="ans v428Drag" draggable="true" data-i="${i}" ondragstart="v428DragStart(event,${i})" onclick="v428MatchPick(this)">${x}</button>`).join('')}</div><button class="v428Drop" ondragover="event.preventDefault()" ondrop="v428MatchDrop(event)" onclick="v428MatchTapDrop()">📥 把正確答案拖／點到這裡</button>`;
    }else if(mode==='order'){
      if(title)title.textContent='🧩 句子排序｜依序點選單字';
      const words=shuffle(String(correctText()).trim().split(/\s+/).map((w,i)=>({w,i})));
      box.innerHTML=`<div id="v428OrderOut" class="v428OrderOut"><span>你的句子：</span></div><div class="v428Words">${words.map(x=>`<button type="button" class="v428Word" data-idx="${x.i}" onclick="v428OrderPick(this)">${esc(x.w)}</button>`).join('')}</div><button class="ans v428Submit" onclick="v428OrderSubmit(this)">完成排序 ✅</button>`;
    }else{
      if(title)title.textContent='⚡ YES / NO 快速判斷';
      const useCorrect=Math.random()<.5,candidate=useCorrect?correctText():currentQ.o.find((_,i)=>i!==currentQ.a);
      box.innerHTML=`<div class="v428JudgeWrap" data-truth="${useCorrect?'1':'0'}"><div class="v428Claim">💡 「${esc(String(candidate))}」是這題的正確答案嗎？</div><div class="v428JudgeBtns"><button class="ans" onclick="v428Judge(this,true)">✅ YES</button><button class="ans" onclick="v428Judge(this,false)">❌ NO</button></div></div>`;
    }
    box.dataset.mode428=mode;
  }
  const oldAsk428=askQuestion;
  askQuestion=function(){
    oldAsk428.apply(this,arguments);
    if(!currentQ)return;
    // Phase 2/3 bosses pull a slightly harder fresh question while keeping the same learning engine.
    if(battle?.v428Phase>=2&&!currentQ._v428Boosted){
      const harder=Math.min(30,Math.max(1,Number(battle.world||st.world)+5));
      const q=getQuestion(harder);if(q){currentQ=q;currentQ._v428Boosted=true;$('qPrompt').innerHTML=currentQ.p;$('qTag').textContent=($('qTag').textContent||'')+'｜🔥 狂暴難度';}
    }
    renderMode(modeFor());
  };

  // ---------- 2) Boss three-phase battles ----------
  function isBoss(){const m=typeof currentMonster==='function'&&battle?currentMonster():null;return !!(battle&&m&&(m[3]||battle.tower427&&battle.index===4))}
  function bossMax(){const m=currentMonster();return Number(m?.[2]||battle?.v428MaxHp||battle?.mhp||1)}
  function phaseNow(){if(!isBoss())return 0;const r=battle.mhp/Math.max(1,bossMax());return r>.70?1:r>.30?2:3}
  const phaseWeak={1:'ice',2:'thunder',3:'heavy'};
  function phasePanel(){
    if(!isBoss())return '';
    const p=battle.v428Phase||phaseNow(),names=['','PHASE 1｜試探','PHASE 2｜狂暴','FINAL PHASE｜破盾'];
    const weak=phaseWeak[p],icons={ice:'❄️',thunder:'⚡',heavy:'💫'};
    const shield=p===3?`｜護盾 ${Math.max(0,Number(battle.v428Shield||0))}/2`:'';
    return `<div class="v428BossPhase phase${p}"><b>👑 ${names[p]}</b><span>${p===1?'觀察 Boss 行動':p===2?`弱點改變：${icons[weak]}，答錯傷害 +1`:`連續答對 2 題 BREAK！${shield}`}</span></div>`;
  }
  function announcePhase(p){
    const msg=p===2?'🔥 PHASE 2！Boss 進入狂暴，弱點改變、題目升級！':'☠️ FINAL PHASE！護盾啟動，連續答對 2 題才能 BREAK！';
    toast(msg);const arena=document.querySelector('.arena');if(arena){const d=document.createElement('div');d.className='v428PhaseFlash';d.textContent=msg;arena.appendChild(d);setTimeout(()=>d.remove(),1500)}
  }
  function syncPhase(){
    if(!isBoss())return;
    const p=phaseNow(),old=Number(battle.v428Phase||1);battle.v428MaxHp=bossMax();
    if(!battle.v428Phase)battle.v428Phase=p;
    if(p>old){battle.v428Phase=p;if(p===3){battle.v428Shield=2;battle.v428ShieldStreak=0}announcePhase(p)}
  }
  const oldUpdate428=updateBattle;
  updateBattle=function(){const r=oldUpdate428.apply(this,arguments);syncPhase();return r};
  const oldSkills428=skillButtons;
  skillButtons=function(){const html=oldSkills428.apply(this,arguments);return isBoss()?phasePanel()+html:html};
  const oldWrong428=wrongAnswerDamage;
  wrongAnswerDamage=function(){
    let d=oldWrong428.apply(this,arguments);if(!isBoss())return d;
    syncPhase();if(battle.v428Phase>=2)d+=1;
    if(battle.v428Phase===3&&battle.v428Shield>0){battle.v428Shield=2;battle.v428ShieldStreak=0}
    return d;
  };
  const oldResolve428=resolveSkill;
  resolveSkill=function(ok){
    const b=battle,boss=isBoss(),before=b?.mhp,offensive=b&&b.skill!=='heal';
    if(boss)syncPhase();
    // Cancel V4.27 auto-cast: keep a separate READY flag and leave legacy energy at 2 until manually used.
    const wasEnergy=Number(st.petEnergy427||0);
    const r=oldResolve428.apply(this,arguments);
    if(ok&&st.activePet&&b===battle&&wasEnergy>=2&&Number(st.petEnergy427)>=3){st.petReady428=true;st.petEnergy427=2;store();}
    if(boss&&b?.v428Phase===3&&b.v428Shield>0){
      if(ok){b.v428ShieldStreak=Number(b.v428ShieldStreak||0)+1;b.v428Shield=Math.max(0,2-b.v428ShieldStreak);if(b.v428Shield<=0){toast('💥 BREAK！Boss 護盾粉碎！')}}
      else{b.v428ShieldStreak=0;b.v428Shield=2}
      if(ok&&offensive&&b.v428Shield>0){setTimeout(()=>{if(battle===b&&b.active){b.mhp=Math.max(Number(before||1),b.mhp);updateBattle();toast(`🛡️ 護盾還有 ${b.v428Shield}/2，攻擊被擋下！`) }},240)}
    }
    if(ok&&boss&&offensive&&b?.active&&b.v428Shield<=0){
      const weak=phaseWeak[b.v428Phase||1];if(b.skill===weak)setTimeout(()=>{if(battle===b&&b.active){const extra=Math.max(1,Math.round(attack()*.5));b.mhp=Math.max(0,b.mhp-extra);updateBattle();toast(`💥 階段弱點！追加 ${extra} 傷害`);if(b.mhp<=0)winBattle()}},250);
    }
    setTimeout(()=>{decoratePet428();if($('actions')&&battle?.active)$('actions').innerHTML=skillButtons()},390);
    return r;
  };
  const oldWinGuard428=winBattle;
  winBattle=function(){
    if(isBoss()&&battle?.v428Phase===3&&battle.v428Shield>0){battle.mhp=1;battle.active=true;updateBattle();$('statusText').innerHTML='🛡️ Boss 還有護盾！先連續答對 2 題 BREAK 才能擊倒。';$('actions').innerHTML=skillButtons();return}
    const pet=st.activePet,wasBoss=isBoss();const r=oldWinGuard428.apply(this,arguments);if(pet){addBond(pet,wasBoss?2:1);setTimeout(renderBond,0)}return r;
  };

  // ---------- 3) Manual pet skill + bond/evolution ----------
  function bond(id){const x=st.petBond428[id]||{xp:0,level:1};x.xp=Number(x.xp||0);const cuts=[0,5,12,22,35];x.level=Math.min(5,1+cuts.slice(1).filter(v=>x.xp>=v).length);st.petBond428[id]=x;return x}
  function addBond(id,n){if(!id)return;const b=bond(id),old=b.level;b.xp+=n;bond(id);store();if(b.level>old)toast(`❤️ 寵物羈絆提升到 Lv.${b.level}！${b.level>=3?'進化外觀解鎖！':''}`)}
  function bondNext(b){return [5,12,22,35,35][Math.max(0,b.level-1)]}
  function decoratePet428(){
    const p=document.querySelector('.petCompanion');if(!p||!st.activePet)return;
    const meta=petMeta[st.activePet]||['🐾','寵物','寵物'],b=bond(st.activePet),ready=st.petReady428;
    const bars=[0,1,2].map(i=>`<i class="${ready||i<Number(st.petEnergy427||0)?'on':''}"></i>`).join('');
    p.innerHTML=`<span class="v427PetEmoji">${meta[0]}</span><span class="v427PetEnergy ${ready?'ready':''}">${bars}</span>${ready?'<button class="v428PetReady" onclick="event.stopPropagation();v428CastPet()">SKILL!</button>':''}`;
    p.title=`${b.level>=3?meta[2]:meta[1]}｜羈絆 Lv.${b.level}｜${ready?'技能 READY':'連續答對累積能量'}`;
  }
  window.v428CastPet=function(){
    if(!battle?.active||!st.activePet){toast('目前不能使用寵物技能');return}
    if(!st.petReady428){toast('🐾 寵物能量還沒滿！');return}
    st.petReady428=false;st.petEnergy427=3;store();
    const ok=window.v427Rpg?.castPet?.();if(ok!==false){addBond(st.activePet,1);setTimeout(()=>{decoratePet428();if($('actions')&&battle?.active)$('actions').innerHTML=skillButtons()},80)}
  };
  const oldAnswer428=answerQuestion;
  answerQuestion=function(btn,i){
    const wrong=!!currentQ&&i!==currentQ.a;if(wrong){st.petReady428=false;store()}
    return oldAnswer428.apply(this,arguments);
  };
  function renderBond(){
    const root=$('petsPanel');if(!root)return;root.querySelector('.v428BondPanel')?.remove();
    if(!st.activePet)return;const meta=petMeta[st.activePet]||['🐾','寵物','寵物'],b=bond(st.activePet),next=bondNext(b),evolved=b.level>=3;
    const d=document.createElement('div');d.className='v428BondPanel';d.innerHTML=`<div class="v428BondIcon">${meta[0]}</div><div><b>❤️ 羈絆 Lv.${b.level}｜${evolved?meta[2]:meta[1]}</b><p>${b.level>=5?'MAX！這是你最可靠的冒險夥伴。':`一起戰鬥可提升羈絆；${evolved?'已解鎖進化稱號':'Lv.3 解鎖進化稱號'}。`}</p><div class="v428BondBar"><i style="width:${b.level>=5?100:Math.min(100,b.xp/next*100)}%"></i></div><small>${b.level>=5?`${b.xp} XP｜MAX`:`${b.xp}/${next} 羈絆 XP`}</small></div></div>`;root.prepend(d);
  }
  const oldPetPanel428=window.renderPetPanel;
  if(typeof oldPetPanel428==='function')window.renderPetPanel=function(){const r=oldPetPanel428.apply(this,arguments);setTimeout(renderBond,0);return r};
  const oldRender428=render;
  render=function(){const r=oldRender428.apply(this,arguments);setTimeout(()=>{decoratePet428();renderBond()},0);return r};

  store();setTimeout(()=>{decoratePet428();renderBond()},60);
  window.v428={modeFor,phaseNow,bond,castPet:window.v428CastPet};
})();
