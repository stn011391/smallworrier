// V4.30 public, no-login access helpers.
(()=>{
  const PUBLIC_URL='https://stn011391.github.io/smallworrier/';
  window.V430_PUBLIC_URL=PUBLIC_URL;

  async function copyPublicUrl(){
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(PUBLIC_URL);
      }else{
        const ta=document.createElement('textarea');
        ta.value=PUBLIC_URL;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';
        document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
      }
      if(typeof toast==='function')toast('🔗 公開網址已複製，不用登入就能玩！');
      return true;
    }catch(e){
      window.prompt('複製這個公開網址分享給朋友：',PUBLIC_URL);
      return false;
    }
  }

  window.v430CopyPublicUrl=copyPublicUrl;
  window.v430SharePublicSite=async function(){
    if(navigator.share){
      try{
        await navigator.share({title:'勇者學院',text:'公開免登入，打開就能玩！',url:PUBLIC_URL});
        return;
      }catch(e){
        if(e&&e.name==='AbortError')return;
      }
    }
    await copyPublicUrl();
  };

  function markPublicAccess(){
    const brand=document.querySelector('.brand');
    if(brand&&!document.getElementById('public430Badge')){
      const badge=document.createElement('span');
      badge.id='public430Badge';
      badge.textContent=' 🔓 公開免登入';
      badge.style.whiteSpace='nowrap';
      brand.appendChild(badge);
    }
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',markPublicAccess):markPublicAccess();
})();
