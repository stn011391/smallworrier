// V4.29 hotfix: prevent manual-input questions from getting stuck after the first wrong attempt.
(()=>{
  const inputModeActive=()=>document.getElementById('qAnswers')?.dataset.mode428==='input';
  const inputEl=()=>document.getElementById('v428Input');
  const submitEl=()=>document.querySelector('.v428InputWrap .v428Submit');

  // The V4.17 retry flow intentionally keeps a wrong multiple-choice option disabled.
  // In V4.28 input mode, however, the only .ans element is the submit button itself,
  // so keeping that button disabled makes the question impossible to continue.
  const oldRetry429=window.v417Retry;
  if(typeof oldRetry429==='function'){
    window.v417Retry=function(){
      const wasInput=inputModeActive();
      const r=oldRetry429.apply(this,arguments);
      if(wasInput){
        const input=inputEl(),submit=submitEl();
        if(submit){
          submit.disabled=false;
          submit.classList.remove('bad','good');
        }
        if(input){
          input.disabled=false;
          input.value='';
          requestAnimationFrame(()=>{input.focus();input.select?.()});
        }
      }
      return r;
    };
  }

  // Do not treat a blank field as a wrong learning attempt.
  const oldInputSubmit429=window.v428InputSubmit;
  if(typeof oldInputSubmit429==='function'){
    window.v428InputSubmit=function(btn){
      const input=inputEl();
      if(!input)return;
      if(!String(input.value||'').trim()){
        if(typeof toast==='function')toast('⌨️ 請先輸入答案');
        input.focus();
        return;
      }
      if(btn?.disabled)return;
      return oldInputSubmit429.call(this,btn);
    };
  }

  // Desktop and mobile keyboards can submit with Enter instead of requiring a mouse/tap.
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.isComposing||e.target?.id!=='v428Input')return;
    e.preventDefault();
    const btn=submitEl();
    if(btn&&!btn.disabled)window.v428InputSubmit(btn);
  });

  window.v429InputHotfix={active:inputModeActive};
})();
