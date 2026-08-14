// V4.25 Daily personalized learning mission + completion report. Does not change question selection logic.
(()=>{
  const SUBJECT={math:'數學',english:'英文',science:'科學',logic:'邏輯'};
  const p2=n=>String(n).padStart(2,'0');
  const dateStr=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
  const today=()=>dateStr(new Date());
  const addDays=(s,n)=>{const [y,m,d]=String(s).split('-').map(Number),x=new Date(y,m-1,d);x.setDate(x.getDate()+n);return dateStr(x)};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const L=()=>st.learning417&&typeof st.learning417==='object'?st.learning417:{concepts:{}};
  const A=()=>st.learning419&&typeof st.learning419==='object'?st.learning419:{dailyReviews:[]};

  function conceptRows(){return Object.values(L().concepts||{}).filter(c=>c&&Number(c.attempts||0)>0)}
  function dueCountNow(){const t=today();return (A().dailyReviews||[]).filter(x=>String(x.dueDate||'9999-12-31')<=t).length}
  function weakNow(){return conceptRows().filter(c=>Number(c.attempts||0)>=2&&Number(c.score||50)<62).sort((a,b)=>Number(a.score||50)-Number(b.score||50))}
  function makeBaseline(){const o={};conceptRows().forEach(c=>o[c.id]=Number(c.score||50));return o}
  function targetToday(){return clamp(10+Math.min(3,dueCountNow())+Math.min(2,weakNow().length),10,15)}

  function freshMission(){
    const weak=weakNow();
    return {
      version:425,date:today(),target:targetToday(),done:0,firstTry:0,recovered:0,wrong:0,
      baseline:makeBaseline(),dueAtStart:dueCountNow(),focusAtStart:weak.slice(0,3).map(c=>({id:c.id,name:c.name,subject:c.subject,score:Number(c.score||50)})),
      completed:false,rewarded:false,completedAt:null,reportShown:false
    };
  }
  function mission(){
    let m=st.dailyMission425;
    if(!m||m.date!==today()){
      m=freshMission();st.dailyMission425=m;store();
    }
    return m;
  }
  const M=mission();

  function pct(){const m=mission();return Math.round(Math.min(1,m.done/Math.max(1,m.target))*100)}
  function accuracy(){const m=mission();return m.done?Math.round(m.firstTry/m.done*100):0}
  function topImproved(){
    const m=mission(),base=m.baseline||{};
    return conceptRows().map(c=>({name:c.name,subject:c.subject,before:Number(base[c.id]??c.score??50),now:Number(c.score||50),delta:Number(c.score||50)-Number(base[c.id]??c.score??50)})).filter(x=>x.delta>0).sort((a,b)=>b.delta-a.delta).slice(0,3);
  }
  function tomorrowReviews(){
    const t=addDays(today(),1);
    return (A().dailyReviews||[]).filter(x=>String(x.dueDate||'')===t).slice(0,4);
  }
  function focusHtml(){
    const m=mission();
    if(m.focusAtStart?.length)return m.focusAtStart.map(x=>`<span class="daily425Chip">${SUBJECT[x.subject]||''}｜${x.name} ${Math.round(x.score)}%</span>`).join('');
    return '<span class="daily425Muted">目前沒有明顯弱項，今天以綜合練習與複習為主。</span>';
  }
  function renderMission(){
    const root=document.getElementById('dailyMission425');if(!root)return;
    const m=mission(),remain=Math.max(0,m.target-m.done),complete=m.completed;
    root.innerHTML=`<div class="daily425Head"><div><span class="daily425Eyebrow">🎯 今日勇者訓練</span><h2>${complete?'今日任務完成！':'今天完成 '+m.target+' 題就過關'}</h2><p>${complete?'今天的學習任務已完成，還可以自由繼續冒險。':`依今天的複習量與近期弱項，自動設定 ${m.target} 題。`}</p></div><div class="daily425Score"><b>${m.done}</b><span>/ ${m.target} 題</span></div></div><div class="daily425Bar"><i style="width:${pct()}%"></i></div><div class="daily425Stats"><div><b>${m.dueAtStart||0}</b><span>今天到期複習</span></div><div><b>${accuracy()}%</b><span>首答正確率</span></div><div><b>${complete?'✅':remain}</b><span>${complete?'任務完成':'還差幾題'}</span></div></div><div class="daily425Focus"><b>🧠 今天優先關注</b><div>${focusHtml()}</div></div>${complete?'<button class="btn gold daily425ReportBtn" onclick="v425ShowReport()">🏆 查看今日完成報告</button>':''}`;
  }

  function ensureReport(){
    if(document.getElementById('daily425Modal'))return;
    const d=document.createElement('div');d.id='daily425Modal';d.className='daily425Modal';
    d.innerHTML='<div class="daily425Report"><div class="daily425Trophy">🏆</div><h2>今日勇者訓練完成！</h2><div id="daily425ReportBody"></div><button class="btn gold" onclick="v425CloseReport()">繼續冒險 ⚔️</button></div>';
    document.body.appendChild(d);
  }
  function reportHtml(){
    const m=mission(),im=topImproved(),tm=tomorrowReviews();
    const improved=im.length?im.map(x=>`<div class="daily425ReportRow"><span>${SUBJECT[x.subject]||''}｜${x.name}</span><b>+${Math.round(x.delta)}%</b></div>`).join(''):'<p class="daily425Muted">今天以複習與維持熟練度為主，還沒有明顯分數上升。</p>';
    const tomorrow=tm.length?tm.map(x=>`<span class="daily425Chip">${SUBJECT[x.subject]||''}｜${x.conceptName||'複習'}</span>`).join(''):'<span class="daily425Muted">目前沒有排定明天的跨天複習。</span>';
    return `<div class="daily425ReportGrid"><div><b>${m.done}</b><span>完成題數</span></div><div><b>${accuracy()}%</b><span>首答正確率</span></div><div><b>${m.recovered||0}</b><span>提示後答對</span></div></div><div class="daily425ReportBox"><h3>📈 今日進步</h3>${improved}</div><div class="daily425ReportBox"><h3>🔁 明日待複習</h3><div class="daily425Tomorrow">${tomorrow}</div></div><div class="daily425Reward">🎁 今日獎勵：⭐ 5 星＋🪙 15 金幣＋🔑 1 把鑰匙</div>`;
  }
  window.v425ShowReport=function(){ensureReport();document.getElementById('daily425ReportBody').innerHTML=reportHtml();document.getElementById('daily425Modal').classList.add('show')};
  window.v425CloseReport=function(){document.getElementById('daily425Modal')?.classList.remove('show')};

  function finishMission(){
    const m=mission();if(m.completed)return;
    m.completed=true;m.completedAt=Date.now();
    if(!m.rewarded){m.rewarded=true;st.stars=Number(st.stars||0)+5;st.coins=Number(st.coins||0)+15;st.items=st.items||{};st.items.key=Number(st.items.key||0)+1;}
    store();renderHud();renderMission();
    setTimeout(()=>{if(!m.reportShown){m.reportShown=true;store();window.v425ShowReport();}},750);
  }

  const oldResolve425=resolveSkill;
  resolveSkill=function(ok){
    const m=mission(),q=currentQ;
    if(!m.completed&&q){
      const mistakes=Number(q._v417Mistakes||0);
      m.done=Math.min(m.target,m.done+1);
      if(ok&&mistakes===0)m.firstTry++;
      else if(ok)m.recovered++;
      else m.wrong++;
      store();renderMission();
    }
    const r=oldResolve425.apply(this,arguments);
    if(!m.completed&&m.done>=m.target)finishMission();
    return r;
  };

  const oldRender425=render;
  render=function(){const r=oldRender425.apply(this,arguments);setTimeout(renderMission,0);return r};
  const oldHud425=renderHud;
  renderHud=function(){const r=oldHud425.apply(this,arguments);setTimeout(renderMission,0);return r};

  renderMission();
  window.v425DailyMission={mission,render:renderMission,showReport:window.v425ShowReport};
})();
