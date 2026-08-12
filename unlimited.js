// V4.7 Unlimited 30-dungeon access. No daily limit and no prerequisite gate.
renderMap=function(){
  const holder=$('map');
  holder.style.display='block';
  holder.innerHTML=chapterNames.map((chapterName,idx)=>{
    const list=worlds.filter(w=>w.chapter===idx+1);
    const range=`Dungeon ${idx*5+1}–${idx*5+5}`;
    return `<section style="margin:10px 0 20px"><div style="display:flex;justify-content:space-between;align-items:end;gap:8px;margin:5px 2px 9px;flex-wrap:wrap"><h3 style="margin:0;font-size:24px">📖 Chapter ${idx+1}｜${chapterName}</h3><b style="color:#69758b">${range}</b></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px">${list.map(w=>`<button class="zone ${st.world===w.id?'active':''} ${st.cleared.includes(w.id)?'clear':''}" onclick="openWorld(${w.id})"><div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small><div>${st.cleared.includes(w.id)?'✅ 已攻略':'♾️ 隨時挑戰'}</div></button>`).join('')}</div></section>`;
  }).join('');
};
openWorld=function(id){
  const w=worlds.find(x=>x.id===id);
  if(!w)return;
  st.world=id;
  battle=null;
  store();
  render();
};
startAdventure=function(){
  const w=worlds.find(x=>!st.cleared.includes(x.id))||worlds.find(x=>x.id===st.world)||worlds[0];
  openWorld(w.id);
  setTimeout(()=>$('screen').scrollIntoView({behavior:'smooth'}),50);
};
