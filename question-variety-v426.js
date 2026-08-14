// V4.26 Question variety guard: longer anti-repeat memory + same-subject regeneration.
(()=>{
  const B=window.V419Bank||null;
  st.questionHistory426=Array.isArray(st.questionHistory426)?st.questionHistory426:[];
  st.questionTypeHistory426=Array.isArray(st.questionTypeHistory426)?st.questionTypeHistory426:[];

  const clean=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  if(!st.questionHistory426.length&&Array.isArray(st.history))st.questionHistory426=st.history.slice(-100).map(clean);
  const subjectOf=q=>B?.subjectOf?B.subjectOf(q):(/英文/.test(String(q?.cat||''))?'english':/科學/.test(String(q?.cat||''))?'science':/邏輯|推理|方向/.test(String(q?.cat||''))?'logic':'math');
  const signature=q=>clean(q?.key||q?.p);
  const typeOf=q=>`${subjectOf(q)}:${clean(q?._v414type||q?.cat||'綜合')}`;
  const seen=q=>!!q&&st.questionHistory426.includes(signature(q));
  const crowded=q=>{
    const t=typeOf(q),recent=st.questionTypeHistory426.slice(-5);
    return recent.filter(x=>x===t).length>=2;
  };
  function copyReviewMeta(src,dst){
    if(!src||!dst)return dst;
    ['_v417Review','_v417ReviewId','_v419DailyReview','_v419DailyId','_v419DailyStage'].forEach(k=>{
      if(src[k]!==undefined)dst[k]=src[k];
    });
    return dst;
  }
  function stampFromSelf(q,d,mode='variety'){
    if(!q)return q;
    const m=B?.qMeta?B.qMeta(q):{id:`${subjectOf(q)}:${q._v414type||q.cat||'綜合'}`,name:q._v414type||q.cat||'綜合',subject:subjectOf(q)};
    q._v417ConceptId=m.id;q._v417ConceptName=m.name;q._v417Subject=m.subject;
    q._v417Started=Date.now();q._v417Mistakes=0;q._v419Mode=mode;q._v419Difficulty=d;
    return q;
  }
  function sameConcept(base,d){
    if(!B?.qMeta||!B?.make)return null;
    const m=B.qMeta(base),q=B.make(m,d,null);if(!q)return null;
    q._v417ConceptId=m.id;q._v417ConceptName=m.name;q._v417Subject=m.subject;
    q._v417Started=Date.now();q._v417Mistakes=0;
    q._v419Mode=base._v419Mode||'variety';q._v419Difficulty=d;
    return copyReviewMeta(base,q);
  }
  function broadSameSubject(base,w,d){
    const wanted=subjectOf(base);
    for(let i=0;i<36;i++){
      let q=null;
      if(wanted==='english'&&typeof expandedEnglishQ==='function')q=expandedEnglishQ(d);
      else if(wanted!=='english'&&typeof nonEnglishQuestion==='function')q=nonEnglishQuestion(w,d);
      if(!q||subjectOf(q)!==wanted)continue;
      stampFromSelf(q,d,'variety');
      if(!seen(q)&&typeOf(q)!==typeOf(base))return q;
    }
    return null;
  }

  const oldGet426=getQuestion;
  getQuestion=function(w){
    const base=oldGet426.apply(this,arguments);if(!base)return base;
    const d=Number(base._v419Difficulty||Math.min(5,Math.max(1,Math.ceil(Number(w||1)/6))));
    const reviewLocked=!!(base._v417Review||base._v419DailyReview);
    const duplicate=seen(base),sameTypeTooOften=crowded(base);
    let q=base;

    if(duplicate||sameTypeTooOften){
      for(let i=0;i<60;i++){
        const c=sameConcept(base,d);
        if(c&&!seen(c)){q=c;break}
      }
      if((seen(q)||sameTypeTooOften)&&!reviewLocked){
        const c=broadSameSubject(base,w,d);
        if(c)q=c;
      }
    }

    const s=signature(q);
    if(s){st.questionHistory426.push(s);if(st.questionHistory426.length>180)st.questionHistory426=st.questionHistory426.slice(-180)}
    st.questionTypeHistory426.push(typeOf(q));
    if(st.questionTypeHistory426.length>24)st.questionTypeHistory426=st.questionTypeHistory426.slice(-24);

    // Keep the older anti-repeat system useful too, but extend its memory from 40 to 100 actual questions.
    st.history=Array.isArray(st.history)?st.history:[];
    const legacy=q.key||q.p;
    if(legacy&&!st.history.includes(legacy))st.history.push(legacy);
    if(st.history.length>100)st.history=st.history.slice(-100);
    store();
    return q;
  };

  window.v426Variety={history:()=>st.questionHistory426,signature,subjectOf};
})();
