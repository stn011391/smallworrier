// V4.11 Chest rules: supply crates are free; treasure chests are always locked and require one key.
function eventChest(){
  const isSupply=Math.random()<0.30;
  if(isSupply)return eventSupplyCrate();
  return eventLockedChest();
}

function eventSupplyCrate(){
  const gold=3+Math.floor(Math.random()*6);
  openEventModal(
    '發現補給木箱',
    '📦',
    `<p>路邊有一個沒有上鎖的冒險者補給木箱。這不是寶箱，所以可以直接打開。</p><p>裡面通常是少量金幣或補給品。</p>`,
    `<button class="btn gold" onclick="openSupplyCrate(${gold})">📦 打開補給木箱</button><button class="btn soft" onclick="continueAfterEvent()">略過 ➡️</button>`
  );
}

function openSupplyCrate(gold){
  st.coins+=gold;
  let extra='';
  if(Math.random()<0.35){
    const id=Math.random()<0.55?'potion':'ether';
    st.items[id]=(st.items[id]||0)+1;
    extra=`，另外找到 ${id==='potion'?'🍎 生命藥水':'🔷 法力藥水'} ×1`;
  }
  store();
  openEventModal(
    '補給木箱打開了！',
    '📦',
    `<p>獲得 🪙 <b>${gold}</b> 金幣${extra}。</p>`,
    `<button class="btn green" onclick="continueAfterEvent()">收下並繼續 ➡️</button>`
  );
  renderHud();
}

function eventLockedChest(){
  const hasKey=(st.items.key||0)>0;
  const openBtn=hasKey
    ? `<button class="btn purple" onclick="openLockedTreasureChest()">🔑 使用 1 把鑰匙開寶箱</button>`
    : `<button class="btn soft" disabled>🔒 沒有寶箱鑰匙，無法開啟</button>`;
  openEventModal(
    '發現上鎖寶箱',
    '🔒',
    `<p>你發現一個真正的寶箱，但鎖孔被魔法封印。</p><p><b>寶箱一定要消耗 1 把 🔑 寶箱鑰匙才能開啟。</b></p><p>目前鑰匙：🔑 <b>${st.items.key||0}</b></p>`,
    `${openBtn}<button class="btn soft" onclick="continueAfterEvent()">離開寶箱 ➡️</button>`
  );
}

function openLockedTreasureChest(){
  if((st.items.key||0)<=0){
    toast('🔒 沒有鑰匙，寶箱打不開！');
    eventLockedChest();
    return;
  }
  st.items.key--;
  const bonusGold=7+Math.floor(Math.random()*10);
  st.coins+=bonusGold;

  let g=randomGear();
  if(g.rarity==='普通'){
    const better=lootCatalog.filter(x=>x.rarity==='稀有'||x.rarity==='史詩'||x.rarity==='傳說');
    if(better.length)g=better[Math.floor(Math.random()*better.length)];
  }
  const alreadyOwned=st.lootGear.includes(g.id);
  if(!alreadyOwned)st.lootGear.push(g.id);
  if(!st.equipped[g.slot])st.equipped[g.slot]=g.id;
  store();

  openEventModal(
    '寶箱解鎖！',
    '✨',
    `<p>🔑 鑰匙消耗 1 把，魔法鎖打開了！</p><p>獲得 🪙 <b>${bonusGold}</b> 金幣，並取得：</p><div class="lootReveal ${rarityClass(g.rarity)}"><div>${g.e}</div><b>${g.rarity}｜${g.n}</b><small>${alreadyOwned?'你已擁有這件裝備，本次仍獲得寶箱金幣獎勵。':''}</small></div><p>剩餘鑰匙：🔑 <b>${st.items.key}</b></p>`,
    `<button class="btn green" onclick="continueAfterEvent()">收下戰利品 ➡️</button>`
  );
  renderHud();
  renderInventory();
}

// Keep legacy calls safe: a legacy "normal chest" is now treated as a locked treasure chest.
function openNormalChest(){
  if((st.items.key||0)<=0){
    toast('🔒 寶箱需要鑰匙！');
    eventLockedChest();
    return;
  }
  openLockedTreasureChest();
}

function openKeyChest(){
  openLockedTreasureChest();
}
