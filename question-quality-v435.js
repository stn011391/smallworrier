// V4.35 final question-quality guard.
(()=>{
  const oldGet435=getQuestion;
  getQuestion=function(w){
    const q=oldGet435.apply(this,arguments);
    if(!q)return q;
    // Keep irregular-past prompts grammatically neutral for every verb in the enlarged bank.
    const m=String(q.key||'').match(/^434past:([^:]+):1$/);
    if(m)q.p=`Past tense of “${m[1]}”?`;
    return q;
  };
})();
