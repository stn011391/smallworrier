const $=id=>document.getElementById(id);
const worlds=[
{id:1,e:'🌲',name:'古樹森林',theme:'乘法＋英文',m:[['🐺','灰牙狼',8],['🕷️','毒刺蜘蛛',9],['🐗','狂衝野豬',11],['🦂','影尾蠍王',14],['🦖','古樹暴龍',19,1]]},
{id:2,e:'🏜️',name:'沙漠遺跡',theme:'除法＋應用題',m:[['🐍','流沙毒蛇',10],['🦂','沙蠍兵',11],['🦎','沙丘蜥蜴',13],['🗿','石像守衛',16],['👹','遺跡魔將',22,1]]},
{id:3,e:'🌊',name:'深海神殿',theme:'分數＋比較',m:[['🦀','巨鉗蟹',11],['🐡','尖刺河豚',12],['🦑','深海魷怪',15],['🦈','銀牙鯊王',18],['🐙','海神巨獸',25,1]]},
{id:4,e:'⚙️',name:'機械城',theme:'邏輯＋數列',m:[['🤖','巡邏機兵',12],['🛞','暴走輪獸',14],['🦾','重裝機甲',17],['🛰️','雷射哨兵',20],['🧠','鋼鐵泰坦核心',28,1]]},
{id:5,e:'🏰',name:'魔法學院',theme:'英文＋文法',m:[['🦇','魔法蝙蝠',13],['👻','單字幽靈',15],['🧙‍♀️','迷霧女巫',18],['🧙','文法巫師',22],['🐲','魔法飛龍',31,1]]},
{id:6,e:'🌋',name:'科學火山',theme:'自然科學＋推理',m:[['🪨','熔岩石怪',14],['🦎','火焰蜥蜴',16],['🌪️','風暴元素',19],['🌋','熔岩巨靈',24],['🔥','火山魔王',34,1]]},
{id:7,e:'🌌',name:'終焉之塔',theme:'綜合挑戰',m:[['💀','骷髏守衛',16],['👺','赤面鬼',19],['👹','暗影將軍',23],['🦹','黑暗騎士',29],['🐉','終焉魔龍',42,1]]}
];
const gear=[{lv:2,e:'🗡️',n:'鐵劍',atk:1},{lv:3,e:'🛡️',n:'鋼盾',hp:3},{lv:4,e:'🔮',n:'法力石',mp:2},{lv:5,e:'⚔️',n:'炎之劍',atk:2},{lv:6,e:'🪖',n:'勇者頭盔',hp:3},{lv:7,e:'👑',n:'龍王冠',atk:1,mp:2}];
const encounterTexts={
normal:['🌿 草叢突然劇烈晃動！{name} 衝了出來！','👣 你發現新鮮腳印，轉過身時 {name} 已經逼近！','⚠️ 前方傳來怪聲，野生的 {name} 出現了！','🌫️ 迷霧散開，{name} 擋住了勇者的道路！','💥 一聲巨響！{name} 從暗處跳出來發動奇襲！'],
advanced:['⚡ 危險氣息正在靠近！進階怪 {name} 現身！','🧭 你走進岔路，竟然闖入 {name} 的領地！','💢 地面開始震動，強敵 {name} 向你挑戰！','🔔 警戒！{name} 察覺勇者並主動迎戰！'],
elite:['🚨 精英警報！{name} 帶著強大的氣場登場！','💎 寶箱旁站著守護者 {name}，想拿獎勵就得先過這關！','🌟 稀有精英 {name} 出現！這場戰鬥將更困難！','⚔️ {name} 是這區最強的守門者之一，準備迎戰！'],
boss:['🐲 BOSS 戰！整個地下城開始震動，{name} 終於現身！','👑 最終守門者 {name} 降臨！前四隻怪都已倒下，決戰開始！','🔥 強大的壓迫感籠罩四周——BOSS {name} 登場！']
};
let st=JSON.parse(localStorage.getItem('hero9_v41')||'{"level":1,"xp":0,"stars":0,"coins":0,"combo":0,"world":1,"cleared":[],"defeated":{},"gear":[],"quest":{"correct":0,"wins":0,"boss":0,"combo5":0}}');
let battle=null,currentQ=null;
const hpMax=()=>8+gear.filter(g=>st.gear.includes(g.n)).reduce((s,g)=>s+(g.hp||0),0);
const mpMax=()=>4+gear.filter(g=>st.gear.includes(g.n)).reduce((s,g)=>s+(g.mp||0),0);
const attack=()=>2+gear.filter(g=>st.gear.includes(g.n)).reduce((s,g)=>s+(g.atk||0),0);
const xpNeed=()=>8+(st.level-1)*4;
const defeated=w=>st.defeated[w]||[];
const unlocked=w=>w===1||st.cleared.includes(w-1);
function store(){localStorage.setItem('hero9_v41',JSON.stringify(st))}
function render(){renderHud();renderMap();renderScreen();renderInventory();renderQuests()}
function renderHud(){$('lv').textContent=st.level;$('stars').textContent=st.stars;$('coins').textContent=st.coins;$('combo').textContent=st.combo}
function renderMap(){$('map').innerHTML=worlds.map(w=>`<button class="zone ${!unlocked(w.id)?'locked':''} ${st.world===w.id?'active':''} ${st.cleared.includes(w.id)?'clear':''}" ${unlocked(w.id)?`onclick="openWorld(${w.id})"`:'disabled'}><div class="e">${w.e}</div><b>Dungeon ${w.id}</b><small>${w.name}</small><small>${w.theme}</small><div>${st.cleared.includes(w.id)?'✅':'⚔️ 5 怪'}</div></button>`).join('')}
function renderScreen(){const w=worlds[st.world-1];$('screen').innerHTML=`<h2>${w.e} ${w.name}</h2><p class="sub">本區共有 5 隻怪獸。前四隻可自由選擇挑戰；全部擊倒後，Boss 才會現身。</p><div class="enemyGrid" id="enemyGrid"></div><div class="arena"><div class="battleHud"><div class="fighter"><b>🧑‍🚀 勇者 Lv.${st.level}</b><div>HP <span id="heroHpText">${hpMax()}/${hpMax()}</span></div><div class="bar"><div class="hp1" id="heroHpBar" style="width:100%"></div></div><div>MP <span id="heroMpText">${mpMax()}/${mpMax()}</span></div><div class="bar"><div class="mp" id="heroMpBar" style="width:100%"></div></div></div><div class="fighter"><b id="monsterName">等待遭遇...</b><div>HP <span id="monsterHpText">-</span></div><div class="bar"><div class="hp2" id="monsterHpBar" style="width:0%"></div></div><div>XP ${st.xp}/${xpNeed()}</div><div class="bar"><div class="xp" style="width:${Math.min(100,st.xp/xpNeed()*100)}%"></div></div></div></div><div class="heroChar" id="heroChar">🧑‍🚀⚔️</div><div class="monsterChar" id="monsterChar">❓</div><div class="command"><div class="status" id="statusText">🧭 選擇探索路線，看看會遇到哪隻怪獸！</div><div class="actions" id="actions"></div></div></div>`;renderEnemies();}
function rankLabel(i,m){if(m[3])return '🐲 Boss';if(i===3)return '🌟 精英怪';if(i===2)return '⚡ 進階怪';return '👣 普通怪'}
function renderEnemies(){const w=worlds[st.world-1],done=defeated(w.id);$('enemyGrid').innerHTML=w.m.map((m,i)=>{const isDone=done.includes(i),boss=!!m[3],locked=boss&&![0,1,2,3].every(x=>done.includes(x));return `<button class="enemyCard ${isDone?'clear':''} ${locked?'locked':'selectable'} ${boss?'bossCard':''}" ${(isDone||locked||st.cleared.includes(w.id))?'disabled':''} onclick="selectEnemy(${i})"><div class="rank">${rankLabel(i,m)}</div><div class="e">${m[0]}</div><b>${m[1]}</b><small>HP ${m[2]}</small><div>${isDone?'✅ 已擊敗':locked?'🔒 擊倒前四隻':boss?'🔥 最終決戰':'🧭 探索遭遇'}</div></button>`}).join('');if(st.cleared.includes(w.id)){$('statusText').textContent='這個地下城已攻略完成！';$('actions').innerHTML=w.id<7?'<button class="btn gold" onclick="nextWorld()">前往下一區 ➡️</button>':'<button class="btn gold">👑 七大地下城完成</button>'}}
function openWorld(id){if(!unlocked(id))return;st.world=id;battle=null;store();render()}
function startAdventure(){const w=worlds.find(x=>unlocked(x.id)&&!st.cleared.includes(x.id));openWorld(w?w.id:1);setTimeout(()=>$('screen').scrollIntoView({behavior:'smooth'}),50)}
function encounterMessage(i,m){const type=m[3]?'boss':i===3?'elite':i===2?'advanced':'normal';const list=encounterTexts[type];return list[Math.floor(Math.random()*list.length)].replace('{name}',m[1])}
function selectEnemy(i){const w=worlds[st.world-1],done=defeated(w.id),m=w.m[i];if(done.includes(i))return;if(m[3]&&![0,1,2,3].every(x=>done.includes(x))){toast('Boss 尚未現身！先打倒前四隻怪獸。');return}battle={world:w.id,index:i,hp:hpMax(),mp:mpMax(),mhp:m[2],skill:'slash',active:true};updateBattle();const msg=encounterMessage(i,m);$('statusText').textContent=msg;$('actions').innerHTML=skillButtons();toast(msg)}
function skillButtons(){return `<button class="btn blue" onclick="chooseSkill('slash')">⚔️ 斬擊<br><small>免費</small></button><button class="btn red" onclick="chooseSkill('fire')">🔥 火焰斬<br><small>2 MP</small></button><button class="btn purple" onclick="chooseSkill('heavy')">💫 重擊<br><small>3 MP</small></button><button class="btn green" onclick="chooseSkill('heal')">💚 治癒術<br><small>3 MP</small></button>`}
function chooseSkill(s){if(!battle||!battle.active){toast('請先選擇敵人開始戰鬥');return}const cost={slash:0,fire:2,heavy:3,heal:3}[s];const names={slash:'⚔️ 斬擊',fire:'🔥 火焰斬',heavy:'💫 重擊',heal:'💚 治癒術'};if(battle.mp<cost){toast(`${names[s]}需要 ${cost} MP，目前只有 ${battle.mp} MP`);return}battle.skill=s;$('statusText').textContent=`已選擇 ${names[s]}！答對題目就能施放。`;toast(`選擇 ${names[s]}`);setTimeout(askQuestion,180)}
function askQuestion(){currentQ=getQuestion(st.world);$('qTag').textContent=`Dungeon ${st.world}｜${{slash:'斬擊',fire:'火焰斬',heavy:'重擊',heal:'治癒術'}[battle.skill]}｜${currentQ.cat||'綜合'}`;$('qPrompt').innerHTML=currentQ.p;$('qAnswers').innerHTML=currentQ.o.map((x,i)=>`<button class="ans" onclick="answerQuestion(this,${i})">${x}</button>`).join('');$('qModal').classList.add('show')}