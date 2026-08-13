// V4.17 Personal learning engine: mastery map, two-step mistake teaching, and spaced review.
(()=>{
  const SUBJECTS={
    math:{name:'數學',icon:'🔢'},
    english:{name:'英文',icon:'🔤'},
    science:{name:'科學',icon:'🔬'},
    logic:{name:'邏輯',icon:'🧩'}
  };
  const L=st.learning417&&typeof st.learning417==='object'?st.learning417:{};
  L.concepts=L.concepts&&typeof L.concepts==='object'?L.concepts:{};
  L.reviews=Array.isArray(L.reviews)?L.reviews:[];
  L.qCount=Number(L.qCount||0);
  L.reviewHistory=Array.isArray(L.reviewHistory)?L.reviewHistory:[];
  L.sessions=Number(L.sessions||0);
  st.learning417=L;
  let pendingWrong=null;

  const clean=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
  const correctText=q=>q&&Array.isArray(q.o)?String(q.o[q.a]??''):'';
  const subjectOf=q=>{
    const c=String(q?.cat||'');
    if(/英文/.test(c))return 'english';
    if(/科學/.test(c))return 'science';
    if(/邏輯|推理|方向/.test(c))return 'logic';
    return 'math';
  };
  function conceptOf(q){
    const subject=subjectOf(q),raw=String(q?._v414type||q?.cat||'綜合').replace(/^(數學|英文|科學|邏輯)[｜|]/,'');
    let id=raw,name=raw||'綜合';
    if(subject==='math'){
      const maps=[
        [/加減|比較量/,'加減與比較'],[/乘法|缺項乘法/,'乘法'],[/除法|平均分配|餘數/,'除法與餘數'],
        [/金錢|單價|找零/,'金錢應用'],[/兩步驟/,'多步驟應用'],[/分數/,'分數'],[/小數/,'小數'],
        [/周長|面積|邊長|角度/,'幾何'],[/長度|重量|容量/,'單位換算'],[/時間|日期|星期/,'時間與日期'],
        [/數列|規律/,'規律與數列'],[/資料/,'資料判讀']
      ];
      for(const [re,n] of maps)if(re.test(raw)){name=n;break;}
    }else if(subject==='english'){
      const maps=[
        [/單字|字彙|反義|同義/,'字彙'],[/拼字/,'拼字'],[/過去式|時態/,'動詞時態'],[/複數/,'名詞複數'],
        [/介系詞/,'介系詞'],[/冠詞/,'冠詞'],[/代名詞/,'代名詞'],[/疑問詞/,'疑問詞'],[/閱讀/,'閱讀理解'],
        [/文法|句型|be動詞|主詞|動詞一致|正確句子/,'基礎文法']
      ];
      for(const [re,n] of maps)if(re.test(raw)){name=n;break;}
    }else if(subject==='science'){
      name=raw&&raw!=='科學'?raw:'自然科學';
    }else if(subject==='logic'){
      name=raw&&raw!=='邏輯'?raw:'邏輯推理';
    }
    id=`${subject}:${name}`;
    return {id,name,subject};
  }

  function conceptState(meta){
    if(!L.concepts[meta.id])L.concepts[meta.id]={id:meta.id,name:meta.name,subject:meta.subject,score:50,attempts:0,correct:0,wrong:0,recovered:0,reviews:0,streak:0,lastSeen:0,lastResult:'new',avgSec:0};
    return L.concepts[meta.id];
  }
  function updateTime(c,q){
    const sec=q?Math.max(1,Math.min(120,Math.round((Date.now()-(q._v417Started||Date.now()))/1000))):0;
    if(!sec)return;
    c.avgSec=c.avgSec?Math.round((c.avgSec*.7+sec*.3)*10)/10:sec;
  }
  function recordFirstTry(q){
    const m=conceptOf(q),c=conceptState(m);c.attempts++;c.correct++;c.streak++;c.lastSeen=L.qCount;c.lastResult=q._v417Review?'review-correct':'correct';c.score=Math.min(100,c.score+10+Math.min(4,c.streak));if(q._v417Review)c.reviews++;updateTime(c,q);maybeScheduleWeak(q,m,c);store();renderLearningMap();
  }
  function recordWrong(q){
    const m=conceptOf(q),c=conceptState(m);c.attempts++;c.wrong++;c.streak=0;c.lastSeen=L.qCount;c.lastResult='wrong';c.score=Math.max(5,c.score-16);updateTime(c,q);scheduleReview(q,m,q._v417Review?Math.max(0,Number(q._v417ReviewStage||0)-1):0,true);store();renderLearningMap();
  }
  function recordRecovered(q){
    const m=conceptOf(q),c=conceptState(m);c.recovered++;c.lastSeen=L.qCount;c.lastResult='recovered';c.score=Math.min(100,c.score+4);scheduleReview(q,m,Number(q._v417ReviewStage||0),false,6,9);store();renderLearningMap();
  }
  function maybeScheduleWeak(q,m,c){
    if(q._v417Review){scheduleReview(q,m,Number(q._v417ReviewStage||0)+1,false);return;}
    if(c.attempts>=3&&c.score<62)scheduleReview(q,m,0,false,10,14);
  }

  function scheduleReview(q,m,stage=0,urgent=false,minOverride,maxOverride){
    const intervals=stage<=0?[5,8]:stage===1?[16,24]:[40,60];
    const lo=minOverride??(urgent?4:intervals[0]),hi=maxOverride??(urgent?6:intervals[1]);
    const due=L.qCount+rand(lo,hi),snapshot={p:q.p,o:[...q.o],a:q.a,cat:q.cat,key:q.key||q.p,_v414type:q._v414type};
    const old=L.reviews.find(x=>x.conceptId===m.id);
    const item={id:`${m.id}:${Date.now()}:${Math.random()}`,conceptId:m.id,conceptName:m.name,subject:m.subject,stage,due,snapshot};
    if(old){if(due<old.due||urgent){Object.assign(old,item,{id:old.id});}else if(stage>old.stage)old.stage=stage;}
    else L.reviews.push(item);
  }

  function makeMC417(p,correct,wrongs,cat,key,type){
    const q=makeMC(p,correct,wrongs,cat,key);q._v414type=type;return q;
  }
  const englishReview={
    '字彙':()=>{const rows=[['Which word means「仔細的」?','careful',['dangerous','empty','noisy']],['Which word means「安靜」?','quiet',['loud','heavy','early']],['Opposite of “strong”?','weak',['brave','fast','wide']],['Which word means「選擇」?','choose',['sleep','carry','close']],['Opposite of “inside”?','outside',['behind','under','near']],['Which word means「重要的」?','important',['tiny','hungry','slow']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜字彙',`417ev:${r[0]}`,'字彙')},
    '拼字':()=>{const rows=[['Which spelling is correct?','beautiful',['beautifull','beutiful','beautyful']],['Which spelling is correct?','different',['diferent','diffirent','differant']],['Which spelling is correct?','because',['becouse','becaus','beacause']],['Which spelling is correct?','friend',['freind','frend','friand']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜拼字',`417spell:${r[1]}`,'拼字')},
    '動詞時態':()=>{const rows=[['Past tense of “take”?','took',['taked','taken','taking']],['Past tense of “make”?','made',['maked','make','making']],['Past tense of “come”?','came',['comed','come','coming']],['Past tense of “write”?','wrote',['writed','written','writing']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜過去式',`417past:${r[0]}`,'過去式')},
    '名詞複數':()=>{const rows=[['Plural of “tooth”?','teeth',['tooths','toothes','teeths']],['Plural of “foot”?','feet',['foots','feets','footes']],['Plural of “woman”?','women',['womans','womanses','womens']],['Plural of “box”?','boxes',['boxs','boxies','boxen']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜複數',`417plural:${r[0]}`,'複數')},
    '介系詞':()=>{const rows=[['The book is ___ the table.','on',['at','from','with']],['We go to school ___ Monday.','on',['in','at','from']],['The cat is ___ the box.','in',['to','for','of']],['I get up ___ seven o’clock.','at',['on','in','by']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜介系詞',`417prep:${r[0]}`,'介系詞')},
    '冠詞':()=>{const rows=[['I see ___ apple.','an',['a','thee','some a']],['She has ___ dog.','a',['an','am','are']],['___ sun is bright.','The',['A','An','Some']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜冠詞',`417art:${r[0]}`,'冠詞')},
    '代名詞':()=>{const rows=[['Amy is my sister. ___ is kind.','She',['He','It','They']],['Tom and I are friends. ___ play together.','We',['They','He','She']],['The dogs are hungry. ___ need food.','They',['It','He','We']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜代名詞',`417pro:${r[0]}`,'代名詞')},
    '疑問詞':()=>{const rows=[['___ is your name?','What',['Where','When','Why']],['___ do you live?','Where',['What','Who','How many']],['___ is your birthday?','When',['Where','Which','Who']],['___ are you late?','Why',['When','What','How many']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜疑問詞',`417wh:${r[0]}`,'疑問詞')},
    '閱讀理解':()=>{const rows=[['Mia has two cats. They sleep near her desk. Where do the cats sleep?','Near her desk',['In the garden','On the bus','At school']],['Leo gets up at seven and walks to school. How does Leo go to school?','He walks',['By train','By boat','By plane']],['Anna likes apples but does not like bananas. What fruit does Anna like?','Apples',['Bananas','Oranges','Grapes']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜閱讀',`417read:${r[0]}`,'閱讀')},
    '基礎文法':()=>{const rows=[['Choose the correct sentence.','He is my friend.',['He are my friend.','He am my friend.','He be my friend.']],['Complete: They ___ playing.','are',['is','am','be']],['Complete: She ___ to school every day.','goes',['go','going','gone']],['Choose the correct sentence.','We have two books.',['We has two books.','We having two books.','We is two books.']]];const r=rows[rand(0,rows.length-1)];return makeMC417(r[0],r[1],r[2],'英文｜文法',`417gram:${r[0]}`,'文法')}
  };
  function mathReview(name){
    if(name==='乘法'){const a=rand(3,12),b=rand(3,12),z=a*b;return makeMC417(`${a} × ${b} = ?`,z,[z+a,z-b,z+2],'數學｜乘法',`417mul:${a}:${b}`,'乘法')}
    if(name==='除法與餘數'){const b=rand(3,10),q=rand(3,10),useRem=Math.random()<.4;if(useRem){const r=rand(1,b-1),a=b*q+r;return makeMC417(`${a} 顆糖平均分給 ${b} 人，每人先分 ${q} 顆，還剩幾顆？`,r,[q,b-r,r+1],'數學｜餘數',`417rem:${a}:${b}`,'除法餘數')}const a=b*q;return makeMC417(`${a} ÷ ${b} = ?`,q,[q+1,q-1,q+2],'數學｜除法',`417div:${a}:${b}`,'除法')}
    if(name==='加減與比較'){const a=rand(30,180),b=rand(10,90),c=rand(5,40),z=a+b-c;return makeMC417(`${a} + ${b} − ${c} = ?`,z,[a+b,z+c,z+10],'數學｜加減混合',`417mix:${a}:${b}:${c}`,'加減混合')}
    if(name==='金錢應用'){const p=rand(15,65),qty=rand(1,4),total=p*qty,pay=Math.ceil((total+rand(10,70))/50)*50,z=pay-total;return makeMC417(`每個鉛筆盒 ${p} 元，買 ${qty} 個，付 ${pay} 元，要找回多少？`,z,[total,pay-p,z+10],'數學｜金錢',`417money:${p}:${qty}:${pay}`,'金錢找零')}
    if(name==='多步驟應用'){const n=rand(3,8),each=rand(4,10),used=rand(3,15),z=n*each-used;return makeMC417(`${n} 盒貼紙，每盒 ${each} 張，用掉 ${used} 張，剩幾張？`,z,[n*each,z+used,z+each],'數學｜兩步驟',`417word:${n}:${each}:${used}`,'兩步驟應用')}
    if(name==='分數'){const den=[3,4,5,6,8][rand(0,4)],a=rand(1,den-1),b=rand(1,den-1);if(a===b)b=b===den-1?1:b+1;const A=`${a}/${den}`,B=`${b}/${den}`,z=a>b?A:B;return makeMC417(`哪個分數比較大？ ${A} 或 ${B}`,z,[z===A?B:A,'一樣大','無法比較'],'數學｜分數比較',`417frac:${a}:${b}:${den}`,'分數比較')}
    if(name==='小數'){let a=rand(10,95)/100,b=rand(10,95)/100;while(a===b)b=rand(10,95)/100;const A=a.toFixed(2),B=b.toFixed(2),z=a>b?A:B;return makeMC417(`哪個小數比較大？ ${A} 或 ${B}`,z,[z===A?B:A,'一樣大','無法比較'],'數學｜小數',`417dec:${A}:${B}`,'小數比較')}
    if(name==='幾何'){if(Math.random()<.55){const l=rand(4,14),w=rand(3,10),z=2*(l+w);return makeMC417(`長方形長 ${l} cm、寬 ${w} cm，周長是多少？`,z,[l*w,l+w,z+2],'數學｜周長',`417peri:${l}:${w}`,'周長')}const l=rand(4,12),w=rand(3,9),z=l*w;return makeMC417(`長方形長 ${l} cm、寬 ${w} cm，面積是多少？`,z,[2*(l+w),l+w,z+l],'數學｜面積',`417area:${l}:${w}`,'面積')}
    if(name==='單位換算'){const k=rand(1,7),g=[100,250,500,750][rand(0,3)],z=k*1000+g;return makeMC417(`${k} 公斤 ${g} 公克 = 幾公克？`,z,[k*1000,g,z+1000],'數學｜重量換算',`417unit:${k}:${g}`,'重量換算')}
    if(name==='時間與日期'){const h=rand(1,4),m=[10,15,20,30,45][rand(0,4)],z=h*60+m;return makeMC417(`${h} 小時 ${m} 分鐘共有幾分鐘？`,z,[h*60,m,z-10],'數學｜時間',`417time:${h}:${m}`,'時間換算')}
    if(name==='規律與數列'){const s=rand(2,20),step=rand(2,9),seq=[s,s+step,s+2*step,s+3*step],z=s+4*step;return makeMC417(`找規律：${seq.join('、')}、？`,z,[z-step,z+step,z+2],'數學｜數列',`417seq:${s}:${step}`,'等差數列')}
    if(name==='資料判讀'){const a=rand(5,30),b=rand(5,30),c=rand(5,30),vals=[a,b,c],names=['甲','乙','丙'],idx=vals.indexOf(Math.max(...vals));return makeMC417(`閱讀資料：甲 ${a} 分、乙 ${b} 分、丙 ${c} 分。最高分是誰？`,names[idx],names.filter((_,i)=>i!==idx).concat(['一樣高']),'數學｜資料判讀',`417data:${a}:${b}:${c}`,'資料判讀')}
    return null;
  }
  function reviewQuestion(item){
    let q=null;
    if(item.subject==='math')q=mathReview(item.conceptName);
    else if(item.subject==='english'&&englishReview[item.conceptName])q=englishReview[item.conceptName]();
    if(!q&&item.snapshot)q={...item.snapshot,o:[...item.snapshot.o],key:`417review:${item.id}:${item.stage}`};
    if(!q)return null;
    q._v417Review=true;q._v417ReviewStage=Number(item.stage||0);q._v417ConceptId=item.conceptId;q._v417ConceptName=item.conceptName;q._v417Subject=item.subject;
    return q;
  }
  function freshReview(item){
    let q;
    for(let i=0;i<20;i++){
      q=reviewQuestion(item);if(!q)return null;
      const k=q.key||q.p;if(!L.reviewHistory.includes(k)){L.reviewHistory.push(k);if(L.reviewHistory.length>30)L.reviewHistory=L.reviewHistory.slice(-30);return q;}
    }
    return q;
  }

  const oldGetQuestion417=getQuestion;
  getQuestion=function(w){
    const base=oldGetQuestion417.apply(this,arguments);L.qCount++;
    const baseSubject=subjectOf(base),wantEnglish=baseSubject==='english';
    const due=L.reviews.filter(x=>x.due<=L.qCount&&((x.subject==='english')===wantEnglish)).sort((a,b)=>a.due-b.due)[0];
    let q=base;
    if(due){const made=freshReview(due);if(made){q=made;L.reviews=L.reviews.filter(x=>x.id!==due.id);}}
    const m=conceptOf(q);q._v417ConceptId=m.id;q._v417ConceptName=m.name;q._v417Subject=m.subject;q._v417Started=Date.now();q._v417Mistakes=0;
    store();renderLearningMap();return q;
  };

  function hintFor(q){
    const m=conceptOf(q),n=m.name;
    const hints={
      '乘法':'把乘法想成「相同數量重複幾次」，也可以用九九乘法表回想。',
      '除法與餘數':'先想「除數 × 幾 = 最接近被除數」，多出來的就是餘數。',
      '加減與比較':'先依照算式順序一步一步算，避免一次在腦中做太多步。',
      '金錢應用':'先算總價，再用付的錢減掉總價。',
      '多步驟應用':'把題目拆成兩步：先算「原本共有多少」，再處理增加或減少。',
      '分數':'比較分數時，先看分母是否相同；不同分母可以通分或交叉比較。',
      '小數':'比較小數時把小數點對齊，從十分位、百分位依序比較。',
      '幾何':'先判斷題目問的是「周長」還是「面積」，兩個公式不要混在一起。',
      '單位換算':'先記住基本換算關係，再全部換成同一個單位。',
      '時間與日期':'1 小時 = 60 分鐘；跨過 60 分鐘時要向小時進 1。',
      '規律與數列':'觀察相鄰兩個數字「增加或減少多少」，看看這個變化是否重複。',
      '資料判讀':'先找題目真正問的是最大、最小、差值還是總和，再讀資料。',
      '字彙':'先看句子或中文意思的關鍵字，再排除明顯不同意思的選項。',
      '拼字':'把單字分成小段或音節來看，不要只靠字母外形猜。',
      '動詞時態':'先找時間線索；過去發生的事情通常要使用過去式。',
      '名詞複數':'先判斷是規則複數還是不規則複數，不規則要特別記憶。',
      '介系詞':'先判斷是在說「時間」還是「位置」，再想 on / in / at 的使用情境。',
      '冠詞':'看到母音發音開頭的單數名詞常用 an，其他單數可數名詞常用 a。',
      '代名詞':'先找代名詞代替的是誰，再判斷單數、複數與性別。',
      '疑問詞':'What 問事物、Where 問地點、When 問時間、Why 問原因。',
      '閱讀理解':'先讀問題，再回短文找對應資訊，不用每個單字都翻譯。',
      '基礎文法':'先找主詞是 I / he / she / they 哪一類，再決定 be 動詞或一般動詞形式。'
    };
    if(m.subject==='science')return '先想這個自然現象的「原因 → 結果」，不要只靠熟悉的字眼猜答案。';
    if(m.subject==='logic')return '把題目給的條件一條一條排好，只使用題目確定告訴你的資訊。';
    return hints[n]||'把題目的關鍵資訊圈出來，再逐步排除不合理的選項。';
  }
  function explainFor(q){
    const m=conceptOf(q),ans=correctText(q),p=clean(q.p);
    let detail=hintFor(q);
    let z=p.match(/(\d+)\s*[×x]\s*(\d+)/);if(z)detail=`${z[1]} × ${z[2]} 表示 ${z[1]} 重複 ${z[2]} 次，算得 ${ans}。`;
    z=p.match(/(\d+)\s*÷\s*(\d+)/);if(z)detail=`可以反過來想：${z[2]} × ? = ${z[1]}，所以答案是 ${ans}。`;
    if(m.name==='時間與日期'&&/小時/.test(p))detail=`先把小時換成分鐘：1 小時是 60 分鐘，再加上剩下的分鐘，就得到 ${ans}。`;
    if(m.name==='分數')detail=`比較分數時先讓它們有共同基準；同分母看分子，不同分母可通分或交叉比較。這題正確是 ${ans}。`;
    if(m.name==='小數')detail=`把小數點對齊，從左到右比較每一位數字；這題較大的答案是 ${ans}。`;
    if(m.name==='幾何'&&/周長/.test(p))detail=`周長是四條邊的總長；長方形可算「(長＋寬) × 2」，所以答案是 ${ans}。`;
    if(m.name==='幾何'&&/面積/.test(p))detail=`面積是平面有多大；長方形用「長 × 寬」，所以答案是 ${ans}。`;
    if(m.subject==='english')detail=`正確答案是「${ans}」。${hintFor(q)}`;
    if(m.subject==='science')detail=`正確答案是「${ans}」。把「${p}」和這個原因／結果關係一起記住，之後會用相近問題再確認。`;
    if(m.subject==='logic')detail=`正確答案是「${ans}」。只按照題目已知條件逐步推，不加入沒有說明的假設。`;
    return detail;
  }

  function ensureLearningUI(){
    if(!$('learningMap')){
      const screen=$('screen');const card=screen?.closest('.card');if(card){const sec=document.createElement('section');sec.className='card learning417Card';sec.innerHTML='<h2>🧠 學習能力地圖</h2><p class="sub">系統會記錄每個知識點的熟練度、錯題與複習時機。答錯不是結束，而是進入「提示 → 再試 → 間隔複習」。</p><div id="learningMap"></div>';card.insertAdjacentElement('afterend',sec);}
    }
    if(!$('learnModal')){const div=document.createElement('div');div.className='learnModal';div.id='learnModal';div.innerHTML='<div class="learnBox"><div class="learnIcon" id="learnIcon">💡</div><h2 id="learnTitle">學習提示</h2><div id="learnBody"></div><div id="learnActions" class="learnActions"></div></div>';document.body.appendChild(div);}
  }
  function showLearn(title,icon,body,actions){ensureLearningUI();$('learnTitle').textContent=title;$('learnIcon').textContent=icon;$('learnBody').innerHTML=body;$('learnActions').innerHTML=actions;$('learnModal').classList.add('show');}
  function hideLearn(){$('learnModal')?.classList.remove('show');}
  window.v417Retry=function(){hideLearn();document.querySelectorAll('.ans').forEach(x=>{if(!x.classList.contains('bad'))x.disabled=false;});};
  window.v417ContinueWrong=function(){hideLearn();if(!pendingWrong)return;const p=pendingWrong;pendingWrong=null;oldAnswer417(p.btn,p.i);};

  const oldAnswer417=answerQuestion;
  answerQuestion=function(btn,i){
    if(!currentQ)return oldAnswer417.apply(this,arguments);
    const ok=i===currentQ.a;
    if(ok){
      if(currentQ._v417Mistakes>0)recordRecovered(currentQ);else recordFirstTry(currentQ);
      return oldAnswer417.apply(this,arguments);
    }
    if(!currentQ._v417Mistakes){
      currentQ._v417Mistakes=1;recordWrong(currentQ);btn.disabled=true;btn.classList.add('bad');
      const m=conceptOf(currentQ);showLearn('先別急著看答案','💡',`<div class="learnConcept">${SUBJECTS[m.subject].icon} ${SUBJECTS[m.subject].name}｜<b>${m.name}</b></div><p>這個選項不對，但先自己再想一次。</p><div class="hintCard"><b>提示</b><p>${hintFor(currentQ)}</p></div><p class="learnSmall">這個知識點已加入稍後複習，系統會在幾題後用不同題目再確認。</p>`,`<button class="btn purple" onclick="v417Retry()">🧠 我再想一次</button>`);return;
    }
    if(currentQ._v417Mistakes===1){
      currentQ._v417Mistakes=2;pendingWrong={btn,i};const m=conceptOf(currentQ),ans=correctText(currentQ);
      showLearn('把這題真的學會','📘',`<div class="learnConcept">${SUBJECTS[m.subject].icon} ${SUBJECTS[m.subject].name}｜<b>${m.name}</b></div><div class="answerReveal">正確答案：<b>${ans}</b></div><div class="explainCard"><b>怎麼想？</b><p>${explainFor(currentQ)}</p></div><div class="reviewNotice">🔁 約 4～8 題後會安排同概念變形題；答對後，下次複習間隔會拉長。</div>`,`<button class="btn blue" onclick="v417ContinueWrong()">我懂了，繼續冒險 ➡️</button>`);return;
    }
    return oldAnswer417.apply(this,arguments);
  };

  function scoreClass(s){return s>=82?'strong':s>=65?'good':s>=48?'developing':'weak'}
  function subjectStats(key){const arr=Object.values(L.concepts).filter(c=>c.subject===key&&c.attempts>0);if(!arr.length)return {score:null,count:0};return {score:Math.round(arr.reduce((s,c)=>s+c.score,0)/arr.length),count:arr.length};}
  function renderLearningMap(){
    ensureLearningUI();const root=$('learningMap');if(!root)return;
    const cards=Object.keys(SUBJECTS).map(k=>{const s=subjectStats(k),pct=s.score??0;return `<div class="subject417 ${s.score==null?'untested':scoreClass(pct)}"><div class="subjectIcon">${SUBJECTS[k].icon}</div><b>${SUBJECTS[k].name}</b><strong>${s.score==null?'待診斷':pct+'%'}</strong><div class="masteryBar"><i style="width:${pct}%"></i></div><small>${s.count?`已診斷 ${s.count} 個知識點`:'答題後開始建立能力'}</small></div>`}).join('');
    const all=Object.values(L.concepts).filter(c=>c.attempts>0).sort((a,b)=>a.score-b.score||b.attempts-a.attempts);
    const focus=all.slice(0,6).map(c=>`<div class="concept417 ${scoreClass(c.score)}"><span>${SUBJECTS[c.subject]?.icon||'📘'}</span><div><b>${c.name}</b><small>${c.attempts} 次｜答對 ${c.correct}｜提示後答對 ${c.recovered}</small></div><strong>${Math.round(c.score)}%</strong></div>`).join('')||'<p class="sub">還沒有學習紀錄，先開始答幾題吧！</p>';
    const dueNow=L.reviews.filter(x=>x.due<=L.qCount).length,next=L.reviews.length?Math.max(0,Math.min(...L.reviews.map(x=>x.due))-L.qCount):null;
    root.innerHTML=`<div class="learningSummary"><div><b>🎯 最需要加強</b><span>${all[0]?all[0].name:'等待診斷'}</span></div><div><b>🔁 複習佇列</b><span>${L.reviews.length} 個知識點${dueNow?`｜${dueNow} 個已到期`:next!=null?`｜約 ${next} 題後開始`:' '}</span></div><div><b>🧠 已診斷</b><span>${all.length} 個知識點</span></div></div><div class="subjectGrid417">${cards}</div><h3>📌 個人加強重點</h3><div class="conceptGrid417">${focus}</div>`;
  }

  const oldRender417=render;
  render=function(){const r=oldRender417.apply(this,arguments);renderLearningMap();return r;};
  ensureLearningUI();renderLearningMap();store();
  window.v417Learning={conceptOf,subjectOf,renderLearningMap,state:L};
})();
