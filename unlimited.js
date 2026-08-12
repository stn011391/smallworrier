// V4.6 Unlimited dungeon access
// No date/day gate and no prerequisite dungeon gate: all seven dungeons are always playable.
renderMap=function(){
  $('map').innerHTML=worlds.map(w=>`<button class="zone ${st.world===w.id?'active':''} ${st.cleared.includes(w.id)?'clear':''}" onclick="openWorld(${w.id})"><div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small><div>${st.cleared.includes(w.id)?'✅ 已攻略':'♾️ 隨時挑戰'}</div></button>`).join('');
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
  const w=worlds.find(x=>!st.cleared.includes(x.id))||worlds[st.world-1]||worlds[0];
  openWorld(w.id);
  setTimeout(()=>$('screen').scrollIntoView({behavior:'smooth'}),50);
};
