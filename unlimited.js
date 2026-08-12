// V4.8 Free 30-dungeon access with one-clear lock.
// No daily limit and no prerequisite gate, but a dungeon cannot be challenged again after it is cleared.
renderMap=function(){
  const holder=$('map');
  holder.style.display='block';
  holder.innerHTML=chapterNames.map((chapterName,idx)=>{
    const list=worlds.filter(w=>w.chapter===idx+1);
    const range=`Dungeon ${idx*5+1}–${idx*5+5}`;
    return `<section style="margin:10px 0 20px"><div style="display:flex;justify-content:space-between;align-items:end;gap:8px;margin:5px 2px 9px;flex-wrap:wrap"><h3 style="margin:0;font-size:24px">📖 Chapter ${idx+1}｜${chapterName}</h3><b style="color:#69758b">${range}</b></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px">${list.map(w=>{
      const cleared=st.cleared.includes(w.id);
      return `<button class="zone ${st.world===w.id?'active':''} ${cleared?'clear locked':''}" ${cleared?'disabled':`onclick="openWorld(${w.id})"`}><div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small><div>${cleared?'✅ 已完成｜不可再挑戰':'⚔️ 可挑戰'}</div></button>`;
    }).join('')}</div></section>`;
  }).join('');
};
openWorld=function(id){
  const w=worlds.find(x=>x.id===id);
  if(!w)return;
  if(st.cleared.includes(id)){
    toast('✅ 這一關已經挑戰完成，不能再次挑戰！');
    return;
  }
  st.world=id;
  battle=null;
  store();
  render();
};
startAdventure=function(){
  const w=worlds.find(x=>!st.cleared.includes(x.id));
  if(!w){
    toast('👑 30 關全部完成！');
    if($('screen'))$('screen').innerHTML='<div style="text-align:center;padding:32px"><div style="font-size:90px">👑🏆🐉</div><h2>30 大地下城全部完成！</h2><p class="sub">所有關卡都已完成；已完成關卡不能再次挑戰。</p></div>';
    return;
  }
  openWorld(w.id);
  setTimeout(()=>$('screen').scrollIntoView({behavior:'smooth'}),50);
};
