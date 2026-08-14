// V4.19 question bank + misconception rules
(()=>{
const pick=a=>a[Math.floor(Math.random()*a.length)], mc=(p,c,w,cat,key,type)=>{const q=makeMC(p,c,w,cat,key);q._v414type=type;return q};
const subjectOf=q=>{const c=String(q?.cat||'');return /英文/.test(c)?'english':/科學/.test(c)?'science':/邏輯|推理|方向/.test(c)?'logic':'math'};
const qMeta=q=>({id:q?._v417ConceptId||`${subjectOf(q)}:${String(q?._v414type||q?.cat||'綜合').replace(/^(數學|英文|科學|邏輯)[｜|]/,'')}`,name:q?._v417ConceptName||String(q?._v414type||q?.cat||'綜合').replace(/^(數學|英文|科學|邏輯)[｜|]/,''),subject:q?._v417Subject||subjectOf(q)});
const difficulty=(c,challenge=false)=>{let d=c.score<45?1:c.score<65?2:c.score<82?3:4;if(c.avgSec>28&&c.attempts>=3)d--;if(c.avgSec<9&&c.score>=78&&c.attempts>=4)d++;if(challenge)d++;return Math.max(1,Math.min(5,d))};
const vocab=[['brave','勇敢的'],['careful','仔細的'],['choose','選擇'],['important','重要的'],['quiet','安靜的'],['dangerous','危險的'],['different','不同的'],['future','未來'],['between','在兩者之間'],['remember','記得'],['healthy','健康的'],['journey','旅程']];
const past=[['go','went'],['eat','ate'],['see','saw'],['take','took'],['make','made'],['come','came'],['write','wrote'],['buy','bought']], plurals=[['child','children'],['mouse','mice'],['tooth','teeth'],['foot','feet'],['woman','women'],['box','boxes']];
function math(name,d,code){
 if(code==='geo.perimeter_area')return mc('長方形長 8 cm、寬 5 cm。哪個算式是在求周長？','(8+5)×2',['8×5','8+5','8×2+5'],'數學｜幾何','419geo:pa','幾何');
 if(code==='time.forgot_minutes')return mc('2 小時 35 分鐘共有幾分鐘？',155,[120,35,135],'數學｜時間','419time:fm','時間換算');
 if(code==='fraction.numerator_only')return mc('比較 3/4 和 5/8，哪個比較大？','3/4',['5/8','一樣大','只看分子無法判斷'],'數學｜分數比較','419frac:no','異分母比較');
 if(name==='乘法'){let a=rand(3,7+d),b=rand(3,8+d),z=a*b;return d>=4?mc(`一排 ${a} 顆，共 ${b} 排。哪個算式求總數？`,`${a}×${b}`,[`${a}+${b}`,`${a}×${b-1}`,`${a}+${a}`],'數學｜乘法',`419mulc:${a}:${b}`,'乘法'):mc(`${a} × ${b} = ?`,z,[z+a,z-b,a+b],'數學｜乘法',`419mul:${a}:${b}`,'乘法')}
 if(name==='除法與餘數'){let b=rand(3,6+d),q=rand(3,7+d);if(d>=3){let r=rand(1,b-1),a=b*q+r;return mc(`${a} 顆糖平均分給 ${b} 人，每人 ${q} 顆後剩幾顆？`,r,[q,b,r+1],'數學｜餘數',`419rem:${a}:${b}`,'除法餘數')}let a=b*q;return mc(`${a} ÷ ${b} = ?`,q,[q+1,Math.max(1,q-1),b],'數學｜除法',`419div:${a}:${b}`,'除法')}
 if(name==='加減與比較'){let a=rand(30,80+d*25),b=rand(10,30+d*12),c=rand(5,20+d*8),z=a+b-c;return mc(`${a} + ${b} − ${c} = ?`,z,[a+b,z+c,z+10],'數學｜加減混合',`419mix:${a}:${b}:${c}`,'加減混合')}
 if(name==='金錢應用'){let p=rand(12,25+d*10),n=rand(1,Math.min(5,1+d)),t=p*n,pay=Math.ceil((t+rand(10,60))/50)*50,z=pay-t;return mc(`每個文具 ${p} 元，買 ${n} 個，付 ${pay} 元，找回多少？`,z,[t,pay-p,z+10],'數學｜金錢',`419money:${p}:${n}:${pay}`,'金錢找零')}
 if(name==='多步驟應用'){let g=rand(3,5+d),e=rand(4,7+d),u=rand(2,Math.min(15,g*e-1)),z=g*e-u;return mc(`有 ${g} 盒卡片，每盒 ${e} 張，用掉 ${u} 張，剩多少？`,z,[g*e,z+u,z+e],'數學｜兩步驟',`419word:${g}:${e}:${u}`,'兩步驟應用')}
 if(name==='分數'){if(d<=1){let den=pick([4,5,6,8]),a=rand(1,den-2),b=rand(a+1,den-1);return mc(`哪個分數比較大？ ${a}/${den} 或 ${b}/${den}`,`${b}/${den}`,[`${a}/${den}`,'一樣大','無法比較'],'數學｜分數比較',`419fs:${a}:${b}:${den}`,'分數比較')}if(d===2){let den=pick([2,3,4,5]),n=rand(1,den-1),k=rand(2,4);return mc(`哪個分數和 ${n}/${den} 相等？`,`${n*k}/${den*k}`,[`${n+k}/${den+k}`,`${n}/${den*k}`,`${n*k}/${den}`],'數學｜等值分數',`419feq:${n}:${den}:${k}`,'等值分數')}if(d===3){let den=pick([2,3,4,5,6]),u=rand(2,6),whole=den*u,n=rand(1,den-1),z=n*u;return mc(`${whole} 顆星星的 ${n}/${den} 是幾顆？`,z,[u,whole-n,z+u],'數學｜分數應用',`419fof:${whole}:${n}:${den}`,'分數部分量')}let a=rand(1,4),b=rand(5,9),c=rand(1,4),e=rand(5,9);while(a/b===c/e)c=rand(1,4);let A=`${a}/${b}`,B=`${c}/${e}`,z=a/b>c/e?A:B;return mc(`哪個分數比較大？ ${A} 或 ${B}`,z,[z===A?B:A,'一樣大','無法比較'],'數學｜分數比較',`419fu:${A}:${B}`,'異分母比較')}
 if(name==='小數'){let s=d>=4?100:10,a=rand(10,90)/s,b=rand(5,50)/s,plus=Math.random()<.6,z=plus?a+b:Math.max(a,b)-Math.min(a,b),n=s===10?1:2,p=plus?`${a.toFixed(n)} + ${b.toFixed(n)}`:`${Math.max(a,b).toFixed(n)} − ${Math.min(a,b).toFixed(n)}`;return mc(`${p} = ?`,z.toFixed(n),[(z+.1).toFixed(n),(z+1).toFixed(n),Math.max(0,z-.1).toFixed(n)],'數學｜小數',`419dec:${p}`,'小數')}
 if(name==='幾何'){let l=rand(4,9+d*2),w=rand(2,7+d);if(d<=2){let z=2*(l+w);return mc(`長方形長 ${l} cm、寬 ${w} cm，周長？`,z,[l*w,l+w,z+2],'數學｜周長',`419peri:${l}:${w}`,'周長')}if(d===3){let z=l*w;return mc(`長方形長 ${l} cm、寬 ${w} cm，面積？`,z,[2*(l+w),l+w,z+l],'數學｜面積',`419area:${l}:${w}`,'面積')}let p=2*(l+w);return mc(`長方形周長 ${p} cm，長 ${l} cm，寬？`,w,[p-l,l+w,Math.max(1,w-1)],'數學｜反推邊長',`419side:${p}:${l}`,'反推邊長')}
 if(name==='單位換算'){let k=pick(['長度','重量','容量']);if(k==='長度'){let m=rand(1,8),cm=pick([10,20,25,40,50,75]),z=m*100+cm;return mc(`${m} 公尺 ${cm} 公分 = 幾公分？`,z,[m*100,cm,z+100],'數學｜長度換算',`419len:${m}:${cm}`,'長度換算')}if(k==='重量'){let kg=rand(1,7),g=pick([100,250,500,750]),z=kg*1000+g;return mc(`${kg} 公斤 ${g} 公克 = 幾公克？`,z,[kg*1000,g,z+1000],'數學｜重量換算',`419wt:${kg}:${g}`,'重量換算')}let l=rand(1,5),ml=pick([100,250,500,750]),z=l*1000+ml;return mc(`${l} 公升 ${ml} 毫升 = 幾毫升？`,z,[l*1000,ml,z+500],'數學｜容量換算',`419vol:${l}:${ml}`,'容量換算')}
 if(name==='時間與日期'){if(d<=2){let h=rand(1,4),m=pick([10,15,20,30,45]),z=h*60+m;return mc(`${h} 小時 ${m} 分鐘共有幾分鐘？`,z,[h*60,m,z-10],'數學｜時間',`419time:${h}:${m}`,'時間換算')}if(d===3){let h=rand(7,16),sm=pick([0,10,20,30,40]),du=pick([20,30,40,50,60,90]),t=h*60+sm+du,eh=Math.floor(t/60)%24,em=t%60,f=n=>String(n).padStart(2,'0'),z=`${f(eh)}:${f(em)}`;return mc(`勇者 ${f(h)}:${f(sm)} 出發，${du} 分鐘後幾點？`,z,[`${f((eh+1)%24)}:${f(em)}`,`${f(eh)}:${f((em+10)%60)}`,`${f(Math.max(0,eh-1))}:${f(em)}`],'數學｜經過時間',`419el:${h}:${sm}:${du}`,'經過時間')}let ds=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],s=rand(0,6),a=rand(3,12),z=ds[(s+a)%7];return mc(`今天是${ds[s]}，${a} 天後星期幾？`,z,ds.filter(x=>x!==z).slice(0,3),'數學｜日期',`419day:${s}:${a}`,'星期推理')}
 if(name==='規律與數列'){let s=rand(1,20),step=rand(2,4+d*2),seq=[0,1,2,3].map(i=>s+i*step),z=s+4*step;return mc(`找規律：${seq.join('、')}、？`,z,[z-step,z+step,z+2],'數學｜數列',`419seq:${s}:${step}`,'等差數列')}
 if(name==='資料判讀'){let a=rand(5,20+d*3),b=rand(5,20+d*3),c=rand(5,20+d*3),v=[a,b,c],lab=['紅隊','藍隊','綠隊'],z=lab[v.indexOf(Math.max(...v))];return mc(`得分：紅 ${a}、藍 ${b}、綠 ${c}。最高？`,z,lab.filter(x=>x!==z).concat(['一樣高']),'數學｜資料判讀',`419data:${a}:${b}:${c}`,'資料判讀')}
 return null;
}
function english(name,d,code){
 if(code==='eng.third_person_s')return mc('Complete: She ___ to school every day.','goes',['go','going','gone'],'英文｜文法','419e:3s','主詞動詞一致');
 if(code==='eng.article_aan')return mc('I see ___ orange on the table.','an',['a','thee','some a'],'英文｜冠詞','419e:aan','冠詞');
 if(code==='eng.preposition_day')return mc('We have English class ___ Monday.','on',['in','at','from'],'英文｜介系詞','419e:onday','介系詞');
 if(code==='eng.preposition_time')return mc('I get up ___ seven o’clock.','at',['on','in','from'],'英文｜介系詞','419e:at','介系詞');
 if(name==='字彙'){let [e,z]=pick(vocab);return d>=3?mc(`What is the closest meaning of “${e}”?`,z,vocab.filter(x=>x[0]!==e).slice(0,3).map(x=>x[1]),'英文｜字彙',`419vm:${e}`,'字彙'):mc(`Which word means「${z}」?`,e,vocab.filter(x=>x[0]!==e).slice(0,3).map(x=>x[0]),'英文｜字彙',`419v:${e}`,'字彙')}
 if(name==='拼字'){let words=['because','friend','beautiful','different','important','remember'],w=pick(words),bad=[w.slice(0,-1),w.replace(/ie/,'ei'),w.replace(/a/,'e')].filter(x=>x!==w);return mc('Which spelling is correct?',w,bad,'英文｜拼字',`419spell:${w}`,'拼字')}
 if(name==='動詞時態'){let [v,p]=pick(past);return mc(`Past tense of “${v}”?`,p,[`${v}ed`,v,`${v}ing`],'英文｜過去式',`419past:${v}`,'過去式')}
 if(name==='名詞複數'){let [s,p]=pick(plurals);return mc(`Plural of “${s}”?`,p,[`${s}s`,`${s}es`,`${p}s`],'英文｜複數',`419pl:${s}`,'複數')}
 const pools={
  '介系詞':[['The book is ___ the table.','on',['at','from','with']],['We go to school ___ Monday.','on',['in','at','from']],['The cat is ___ the box.','in',['to','for','of']],['I get up ___ seven o’clock.','at',['on','in','by']]],
  '冠詞':[['I see ___ apple.','an',['a','thee','some a']],['She has ___ dog.','a',['an','am','are']],['___ sun is bright.','The',['A','An','Some']]],
  '代名詞':[['Amy is my sister. ___ is kind.','She',['He','It','They']],['Tom and I are friends. ___ play together.','We',['They','He','She']],['The dogs are hungry. ___ need food.','They',['It','He','We']]],
  '疑問詞':[['___ is your name?','What',['Where','When','Why']],['___ do you live?','Where',['What','Who','How many']],['___ is your birthday?','When',['Where','Which','Who']]],
  '基礎文法':[['Complete: She ___ to school every day.','goes',['go','going','gone']],['Choose the correct sentence.','He is my friend.',['He are my friend.','He am my friend.','He be my friend.']],['Complete: They ___ playing.','are',['is','am','be']]]};
 if(name==='閱讀理解'){let rows=d>=3?[['Lily wanted to play outside, but rain began. Why did she stay inside?','Because it started to rain.',['Because she was hungry.','Because it was midnight.','Because a bus came.']],['Ben saved ten dollars each week for four weeks. How much did he save?','Forty dollars.',['Ten dollars.','Four dollars.','Fifty dollars.']]]:[['Leo walks to school every morning. How does Leo go to school?','He walks.',['By plane.','By boat.','By train.']],['Anna likes apples but not bananas. What fruit does Anna like?','Apples.',['Bananas.','Grapes.','Pears.']]],r=pick(rows);return mc(r[0],r[1],r[2],'英文｜閱讀',`419read:${r[0]}`,'閱讀')}
 let rows=pools[name]||pools['基礎文法'],r=pick(rows);return mc(r[0],r[1],r[2],`英文｜${name==='基礎文法'?'文法':name}`,`419eng:${r[0]}`,name==='基礎文法'?'文法':name);
}
function science(name){let rows=[['冰塊融化屬於哪種變化？','固態變液態',['液態變氣態','氣態變固態','產生新物質']],['植物製造養分最需要哪種能量？','陽光',['聲音','磁力','摩擦力']],['鞋底做花紋主要為了增加？','摩擦力',['磁力','浮力','光線']],['簡單電路要讓燈泡亮，電路必須？','形成完整回路',['一定斷開','只放一條線','不用電池']],['白天黑夜交替主要因為？','地球自轉',['地球公轉','月球公轉','太陽繞地球']],['看到閃電後才聽到雷聲，主要因為？','光比聲音傳得快',['聲音不會傳播','雷沒有聲音','眼睛比耳朵大']],['人體吸入氧氣最主要使用哪個器官？','肺',['胃','骨頭','皮膚']],['哪個屬於可再生能源？','太陽能',['煤','石油','天然氣']]],r=pick(rows);return mc(r[0],r[1],r[2],'科學｜自然',`419sci:${r[0]}`,name||'科學概念')}
function logic(name){let rows=[['A 比 B 高，B 比 C 高，誰最高？','A',['B','C','一樣高']],['小明比小華早到，小華比小美早到，誰最後到？','小美',['小明','小華','無法知道']],['所有藍色門都需要鑰匙。這扇門是藍色，最合理的是？','需要鑰匙',['一定沒鎖','可以飛過去','一定是假的']],['面向北方，右轉再右轉，現在面向？','南方',['東方','西方','北方']],['盒子裡只有紅球與藍球。拿到的不是紅球，那一定是？','藍球',['綠球','黃球','白球']]],r=pick(rows);return mc(r[0],r[1],r[2],'邏輯｜推理',`419logic:${r[0]}`,name||'邏輯推理')}
function make(meta,d,code){return meta.subject==='math'?math(meta.name,d,code):meta.subject==='english'?english(meta.name,d,code):meta.subject==='science'?science(meta.name):logic(meta.name)}
function diagnose(q,idx){
  const chosen=String(q?.o?.[idx]??''),correct=String(q?.o?.[q?.a]??''),p=String(q?.p||''),m=qMeta(q);
  let r={code:`${m.subject}.general`,label:`${m.name}概念需要再確認`,detail:'系統會換一種問法，確認是概念不熟還是單次失誤。'};
  const n=s=>{const v=Number(String(s).replace(/[^0-9.-]/g,''));return Number.isFinite(v)?v:null};
  let z=p.match(/長方形.*?長\s*(\d+).*?寬\s*(\d+)/);
  if(z){const l=+z[1],w=+z[2],v=n(chosen);if(v===l*w&&/周長/.test(p))r={code:'geo.perimeter_area',label:'把周長和面積混在一起',detail:'周長是外框一圈，面積是裡面的大小。'};else if(v===l+w&&/周長/.test(p))r={code:'geo.forgot_double',label:'周長只算一組長＋寬',detail:'長方形有兩個長、兩個寬，還要乘 2。'};}
  z=p.match(/(\d+)\s*[×x]\s*(\d+)/);if(z&&n(chosen)===(+z[1])+(+z[2]))r={code:'math.multiply_as_add',label:'把乘法當成一次加法',detail:'乘法表示相同數量重複多次。'};
  z=p.match(/(\d+)\s*小時\s*(\d+)\s*分鐘/);if(z&&n(chosen)===(+z[1])*60)r={code:'time.forgot_minutes',label:'換算小時後忘了加分鐘',detail:'小時乘 60 後，還要加回原本的分鐘。'};
  if(/比較.*\//.test(p)&&/^\d+\/\d+$/.test(chosen)){const fs=q.o.filter(x=>/^\d+\/\d+$/.test(String(x))).map(String);if(fs.length>=2){const f=s=>s.split('/').map(Number),o=chosen===fs[0]?fs[1]:fs[0],cv=f(chosen),ov=f(o);if(cv[0]>ov[0]&&cv[0]/cv[1]<ov[0]/ov[1])r={code:'fraction.numerator_only',label:'比較分數時只看分子',detail:'分母不同時要通分或比較實際大小。'};}}
  if(/every day|every morning|every week/i.test(p)&&/^(go|play|walk|eat|have)$/i.test(chosen)&&/s$/i.test(correct))r={code:'eng.third_person_s',label:'第三人稱單數忘記動詞變化',detail:'he / she / it 在現在式常要讓動詞加 -s 或 -es。'};
  if(/Past tense/i.test(p)&&/ed$/i.test(chosen)&&chosen.toLowerCase()!==correct.toLowerCase())r={code:'eng.irregular_past',label:'不規則過去式套用了 -ed',detail:'例如 go→went、take→took。'};
  if(/Plural of/i.test(p)&&/(child|mouse|tooth|foot|woman)/i.test(p)&&/s$/i.test(chosen))r={code:'eng.irregular_plural',label:'不規則複數直接加 s',detail:'例如 child→children、tooth→teeth。'};
  if(/___\s+(apple|orange|egg|umbrella)/i.test(p)&&chosen.toLowerCase()==='a')r={code:'eng.article_aan',label:'a / an 使用時機混淆',detail:'母音音開頭通常使用 an。'};
  if(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i.test(p)&&chosen.toLowerCase()!=='on')r={code:'eng.preposition_day',label:'星期前介系詞混淆',detail:'星期幾前通常使用 on。'};
  if(/o’clock/i.test(p)&&/___/.test(p)&&chosen.toLowerCase()!=='at')r={code:'eng.preposition_time',label:'具體時間前介系詞混淆',detail:'具體鐘點前通常使用 at。'};
  if(m.subject==='science')r={code:'science.cause_effect',label:'自然科學因果關係需要確認',detail:'下次會換生活情境，避免靠關鍵字猜答案。'};
  if(m.subject==='logic')r={code:'logic.condition_order',label:'推理時可能漏看條件順序',detail:'把已知條件排成一條鏈再判斷。'};
  return r;
}
window.V419Bank={subjectOf,qMeta,difficulty,make,diagnose};
})();