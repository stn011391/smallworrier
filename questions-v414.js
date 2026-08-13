// V4.14 large diversified question engine.
// Goals: exactly 1/3 English, 120-question anti-repeat memory, and type-level anti-repeat.
(()=>{
  const pick=a=>a[rand(0,a.length-1)];
  const diff=w=>Math.min(6,Math.max(1,Math.ceil(w/5)));
  const keyOf=q=>q.key||q.p;

  st.q414History=Array.isArray(st.q414History)?st.q414History:[];
  if(!st.q414History.length&&Array.isArray(st.history))st.q414History=st.history.slice(-120);
  st.q414Types=Array.isArray(st.q414Types)?st.q414Types:[];
  st.q414Count=Number(st.q414Count||0);
  st.q414NonEng=Number(st.q414NonEng||0);

  function finish(q,type){
    q._v414type=type;
    st.q414History.push(keyOf(q));
    if(st.q414History.length>120)st.q414History=st.q414History.slice(-120);
    st.q414Types.push(type);
    if(st.q414Types.length>10)st.q414Types=st.q414Types.slice(-10);
    return q;
  }
  function fresh(entries,d){
    let q,entry;
    const recentTypes=st.q414Types.slice(-3);
    for(let tries=0;tries<120;tries++){
      const usable=entries.filter(x=>(x.min||1)<=d&&(x.max||6)>=d&&(!recentTypes.includes(x.t)||tries>35));
      entry=pick(usable.length?usable:entries);
      q=entry.fn(d);
      if(!st.q414History.includes(keyOf(q)))return finish(q,entry.t);
    }
    return finish(q,entry?.t||'綜合');
  }

  const mathEntries=[
    {t:'加減混合',fn:d=>{const a=rand(30,120*d),b=rand(10,50*d),c=rand(5,30*d),ans=a+b-c;return makeMC(`${a} + ${b} − ${c} = ?`,ans,[a+b,ans+c,ans+10],'數學｜加減混合',`414mix:${a}:${b}:${c}`)}},
    {t:'乘法',fn:d=>{const a=rand(3,9+d),b=rand(3,9+d),ans=a*b;return makeMC(`${a} × ${b} = ?`,ans,[ans+a,ans-b,ans+rand(2,9)],'數學｜乘法',`414mul:${a}:${b}`)}},
    {t:'除法',fn:d=>{const b=rand(2,10+d),ans=rand(3,10+d),a=b*ans;return makeMC(`${a} ÷ ${b} = ?`,ans,[ans+1,Math.max(1,ans-1),ans+2],'數學｜除法',`414div:${a}:${b}`)}},
    {t:'缺項乘法',fn:d=>{const a=rand(2,8+d),x=rand(3,9+d),p=a*x;return makeMC(`${a} × □ = ${p}，□ 是多少？`,x,[x+1,Math.max(1,x-1),a],'數學｜未知數',`414mx:${a}:${p}`)}},
    {t:'除法餘數',min:2,fn:d=>{const b=rand(3,8+d),q=rand(3,8+d),r=rand(1,b-1),a=b*q+r;return makeMC(`${a} 顆糖果平均分給 ${b} 人，每人 ${q} 顆後還剩幾顆？`,r,[q,b-r,r+1],'數學｜餘數',`414rem:${a}:${b}`)}},
    {t:'金錢找零',fn:d=>{const price=rand(12,45+d*12),qty=rand(1,Math.min(5,d+1)),total=price*qty,pay=Math.ceil((total+rand(15,80))/50)*50,ans=pay-total;return makeMC(`一個道具 ${price} 元，買 ${qty} 個，付 ${pay} 元，找回多少元？`,ans,[total,pay-price,ans+10],'數學｜金錢',`414money:${price}:${qty}:${pay}`)}},
    {t:'單價應用',min:2,fn:d=>{const qty=rand(2,5),unit=rand(8,20+d*4),total=qty*unit;return makeMC(`${qty} 瓶果汁共 ${total} 元，每瓶多少元？`,unit,[qty,total-qty,unit+qty],'數學｜單價',`414unit:${qty}:${total}`)}},
    {t:'兩步驟應用',fn:d=>{const groups=rand(3,7+d),each=rand(3,8+d),used=rand(2,Math.min(12,groups*each-1)),ans=groups*each-used;return makeMC(`有 ${groups} 袋寶石，每袋 ${each} 顆，用掉 ${used} 顆後剩多少顆？`,ans,[groups*each,ans+used,Math.max(0,ans-each)],'數學｜兩步驟',`414word:${groups}:${each}:${used}`)}},
    {t:'平均分配',min:2,fn:d=>{const people=rand(3,8),each=rand(3,8+d),total=people*each;return makeMC(`${total} 張卡片平均分給 ${people} 人，每人幾張？`,each,[people,total-people,each+people],'數學｜平均分配',`414share:${total}:${people}`)}},
    {t:'分數部分量',min:2,fn:d=>{const den=pick([2,3,4,5,6,8]),num=rand(1,den-1),unit=rand(2,5+d),whole=den*unit,ans=num*unit;return makeMC(`${whole} 顆星星的 ${num}/${den} 是幾顆？`,ans,[unit,whole-num,ans+unit],'數學｜分數應用',`414fracof:${whole}:${num}:${den}`)}},
    {t:'等值分數',min:2,fn:d=>{const den=pick([2,3,4,5,6]),num=rand(1,den-1),k=rand(2,4),correct=`${num*k}/${den*k}`;return makeMC(`哪個分數和 ${num}/${den} 相等？`,correct,[`${num+k}/${den+k}`,`${num}/${den*k}`,`${num*k}/${den}`],'數學｜等值分數',`414feq:${num}:${den}:${k}`)}},
    {t:'異分母比較',min:3,fn:d=>{let a=rand(1,4),b=rand(a+1,7),c=rand(1,4),e=rand(c+1,7);while(a/b===c/e){c=rand(1,4);e=rand(c+1,7)}const A=`${a}/${b}`,B=`${c}/${e}`,correct=a/b>c/e?A:B;const opts=shuffle([A,B,'一樣大','無法比較']);return {p:`哪個分數比較大？ <b>${A}</b> 或 <b>${B}</b>`,o:opts,a:opts.indexOf(correct),cat:'數學｜分數比較',key:`414fcompare:${a}:${b}:${c}:${e}`}}},
    {t:'小數加減',min:2,fn:d=>{const scale=d<4?10:100,a=rand(10,90)/scale,b=rand(5,50)/scale,plus=Math.random()<.55;const ans=plus?a+b:Math.max(a,b)-Math.min(a,b);const p=plus?`${a.toFixed(scale===10?1:2)} + ${b.toFixed(scale===10?1:2)}`:`${Math.max(a,b).toFixed(scale===10?1:2)} − ${Math.min(a,b).toFixed(scale===10?1:2)}`;const s=ans.toFixed(scale===10?1:2);return makeMC(`${p} = ?`,s,[(ans+.1).toFixed(scale===10?1:2),(ans+1).toFixed(scale===10?1:2),Math.max(0,ans-.1).toFixed(scale===10?1:2)],'數學｜小數',`414dec:${p}`)}},
    {t:'周長',fn:d=>{const l=rand(4,10+d*2),w=rand(2,8+d),ans=2*(l+w);return makeMC(`長方形長 ${l} cm、寬 ${w} cm，周長是多少？`,ans,[l*w,l+w,ans+2],'數學｜周長',`414peri:${l}:${w}`)}},
    {t:'面積',min:2,fn:d=>{const l=rand(3,8+d),w=rand(2,7+d),ans=l*w;return makeMC(`長方形長 ${l} cm、寬 ${w} cm，面積是多少平方公分？`,ans,[2*(l+w),l+w,ans+l],'數學｜面積',`414area:${l}:${w}`)}},
    {t:'反推邊長',min:3,fn:d=>{const l=rand(5,12+d),w=rand(3,9+d),p=2*(l+w);return makeMC(`長方形周長 ${p} cm，長 ${l} cm，寬是多少？`,w,[p-l,l+w,Math.max(1,w-1)],'數學｜反推邊長',`414side:${p}:${l}`)}},
    {t:'角度',min:2,fn:d=>{const rows=[['直角是多少度？','90°',['45°','180°','360°']],['平角是多少度？','180°',['90°','270°','360°']],['一整圈是多少度？','360°',['90°','180°','270°']],['小於 90° 的角叫什麼？','銳角',['鈍角','平角','周角']],['大於 90°、小於 180° 的角叫什麼？','鈍角',['銳角','直角','周角']]];const q=pick(rows);return makeMC(q[0],q[1],q[2],'數學｜角度',`414angle:${q[0]}`)}},
    {t:'長度換算',fn:d=>{const m=rand(1,8+d),cm=pick([10,20,25,40,50,75,90]),ans=m*100+cm;return makeMC(`${m} 公尺 ${cm} 公分 = 幾公分？`,ans,[m*100,cm,ans+100],'數學｜長度換算',`414len:${m}:${cm}`)}},
    {t:'重量換算',min:2,fn:d=>{const kg=rand(1,8),g=pick([100,200,250,500,750]),ans=kg*1000+g;return makeMC(`${kg} 公斤 ${g} 公克 = 幾公克？`,ans,[kg*1000,g,ans+1000],'數學｜重量換算',`414wt:${kg}:${g}`)}},
    {t:'容量換算',min:2,fn:d=>{const l=rand(1,5),ml=pick([100,200,250,500,750]),ans=l*1000+ml;return makeMC(`${l} 公升 ${ml} 毫升 = 幾毫升？`,ans,[l*1000,ml,ans+500],'數學｜容量換算',`414vol:${l}:${ml}`)}},
    {t:'時間換算',fn:d=>{const h=rand(1,5),m=pick([10,15,20,30,45]),ans=h*60+m;return makeMC(`${h} 小時 ${m} 分鐘共有幾分鐘？`,ans,[h*60,m,ans-10],'數學｜時間',`414time:${h}:${m}`)}},
    {t:'經過時間',min:2,fn:d=>{const h=rand(7,17),sm=pick([0,10,15,20,30,40,45]),dur=pick([20,30,40,45,50,60,75,90]);const total=h*60+sm+dur,eh=Math.floor(total/60)%24,em=total%60,fmt=n=>String(n).padStart(2,'0'),correct=`${fmt(eh)}:${fmt(em)}`;return makeMC(`勇者 ${fmt(h)}:${fmt(sm)} 出發，${dur} 分鐘後是幾點？`,correct,[`${fmt((eh+1)%24)}:${fmt(em)}`,`${fmt(eh)}:${fmt((em+10)%60)}`,`${fmt(Math.max(0,eh-1))}:${fmt(em)}`],'數學｜經過時間',`414elapsed:${h}:${sm}:${dur}`)}},
    {t:'星期推理',fn:d=>{const days=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],start=rand(0,6),add=rand(2,6+d),ans=days[(start+add)%7];return makeMC(`今天是${days[start]}，${add} 天後是星期幾？`,ans,days.filter(x=>x!==ans).slice(0,3),'數學｜日期',`414day:${start}:${add}`)}},
    {t:'等差數列',fn:d=>{const start=rand(1,20),step=rand(2,5+d*2),seq=[0,1,2,3].map(i=>start+i*step),ans=start+4*step;return makeMC(`找規律：${seq.join('、')}、？`,ans,[ans-step,ans+step,ans+2],'數學｜數列',`414seq:${start}:${step}`)}},
    {t:'交錯規律',min:3,fn:d=>{const a=rand(2,9),up=rand(3,8),down=rand(1,3),seq=[a,a+up,a+up-down,a+up-down+up],ans=a+2*up-2*down;return makeMC(`找交錯規律：${seq.join('、')}、？（依序 +${up}、−${down}）`,ans,[seq[3]+up,seq[3]-down,ans+down],'數學｜交錯規律',`414alt:${a}:${up}:${down}`)}},
    {t:'資料判讀',min:2,fn:d=>{let a=rand(5,20+d*2),b=rand(5,20+d*2),c=rand(5,20+d*2);const vals=[a,b,c],labels=['紅隊','藍隊','綠隊'],mx=Math.max(...vals),idx=vals.indexOf(mx);return makeMC(`得分：紅隊 ${a}、藍隊 ${b}、綠隊 ${c}。最高是哪隊？`,labels[idx],labels.filter((_,i)=>i!==idx).concat(['三隊一樣']),'數學｜資料判讀',`414data:${a}:${b}:${c}`)}},
    {t:'差多少',min:2,fn:d=>{const a=rand(20,80+d*10),b=rand(10,a-1),ans=a-b;return makeMC(`勇者有 ${a} 顆星，隊友有 ${b} 顆，勇者多幾顆？`,ans,[a+b,b,ans+10],'數學｜比較量',`414diff:${a}:${b}`)}}
  ];

  const scienceRows=[
    ['冰塊融化屬於哪種變化？','固態變液態',['液態變氣態','氣態變固態','產生新物質']],['水蒸氣遇冷變成小水滴叫什麼？','凝結',['蒸發','融化','燃燒']],['衣服曬在太陽下變乾，主要是因為水發生？','蒸發',['凝固','凝結','結冰']],['水在一般大氣壓下約幾度沸騰？','100°C',['0°C','50°C','200°C']],['植物製造養分最需要哪種能量？','陽光',['聲音','磁力','摩擦力']],['植物的根最重要的功能之一是？','吸收水分和礦物質',['製造聲音','吸收月光','產生磁力']],['植物進行光合作用主要在哪個部位？','葉',['根','花盆','種子外殼']],['種子發芽通常需要水、適合溫度，還需要什麼基本條件？','空氣',['強磁鐵','鹽水','黑暗一定必要']],['哪一種動物是哺乳類？','海豚',['鯊魚','章魚','企鵝']],['哪一種動物用鰓呼吸？','魚',['貓','麻雀','蝴蝶']],['青蛙的幼體叫什麼？','蝌蚪',['毛毛蟲','幼鳥','魚苗']],['毛毛蟲長大後可能變成？','蝴蝶',['青蛙','鯊魚','麻雀']],['食物鏈中植物通常是？','生產者',['消費者','掠食者','寄生者']],['老鷹吃老鼠，在這個關係中老鷹較像？','掠食者',['生產者','植物','分解者']],['影子的方向通常和光源方向？','相反',['相同','永遠向北','完全無關']],['物體越靠近手電筒，影子通常會？','變大',['一定消失','變成彩色','完全不變']],['透明玻璃最容易讓光？','穿過',['完全吸收','變成聲音','停止']],['鏡子能看見影像主要因為光的？','反射',['蒸發','凝結','磁化']],['聲音是由物體什麼產生？','振動',['顏色','重量','影子']],['聲音在真空中能正常傳播嗎？','不能',['能，而且更快','只有晚上能','只要夠大聲就能']],['拉緊的橡皮筋彈動會發聲，主要因為它在？','振動',['融化','蒸發','發光']],['讓物體掉向地面的力是？','重力',['磁力','浮力','摩擦力']],['推購物車時，你主要對車施加？','推力',['浮力','磁力','光能']],['鞋底做花紋主要是為了增加？','摩擦力',['磁力','浮力','光線']],['磁鐵最容易吸引哪個物品？','鐵釘',['塑膠尺','玻璃杯','橡皮擦']],['磁鐵同極互相靠近時通常會？','排斥',['吸引','融化','發光']],['簡單電路要讓燈泡亮，電路必須？','形成完整回路',['一定斷開','只放一條線','不用電池']],['哪一種材料通常是良好導體？','銅',['塑膠','橡膠','乾木頭']],['電池在簡單電路中主要提供？','電能',['食物','水分','氧氣']],['白天和黑夜交替主要因為？','地球自轉',['地球公轉','月球公轉','太陽自轉造成']],['一年四季主要和什麼有關？','地球公轉與地軸傾斜',['月球顏色','海浪大小','雲的高度']],['地球繞著哪個天體公轉？','太陽',['月球','火星','北極星']],['月球本身會發光嗎？','不會，它反射太陽光',['會，自己發光','只有滿月會','只有白天會']],['太陽是一顆？','恆星',['行星','衛星','彗星']],['月球是地球的天然？','衛星',['恆星','行星','星系']],['雨形成前，空氣中的水蒸氣常先？','凝結成小水滴',['變成石頭','燃燒','變成磁鐵']],['看到閃電後才聽到雷聲，主要因為？','光比聲音傳得快',['聲音不會傳播','雷沒有聲音','眼睛比耳朵大']],['風是空氣的？','流動',['凝固','燃燒','結冰']],['氣溫計主要測量？','溫度',['風向','雨量','重量']],['雨量筒主要測量？','降雨量',['風速','光線','地震']],['人體吸入氧氣最主要使用哪個器官？','肺',['胃','骨頭','皮膚']],['心臟主要功能是？','推動血液循環',['消化食物','製造骨頭','看見顏色']],['牙齒主要幫助我們？','咀嚼食物',['呼吸','聽聲音','製造血液']],['骨骼的重要功能之一是？','支撐身體',['消化食物','產生陽光','製造空氣']],['運動後呼吸和心跳通常會？','加快',['完全停止','一定變慢','不會改變']],['均衡飲食通常應該？','攝取多種類食物',['只吃糖果','完全不喝水','只吃一種食物']],['輪軸、槓桿、滑輪都屬於？','簡單機械',['天氣現象','生物器官','光源']],['用斜坡把重物推上車，比直接抬高通常可以？','減少所需施力',['讓重物消失','增加重力','停止摩擦']],['浮在水面的木頭受到向上的力稱為？','浮力',['重力','磁力','電力']],['同樣大小的鐵球和保麗龍球，通常哪個較重？','鐵球',['保麗龍球','一定一樣','無法比較任何情況']],['回收紙張最直接有助於？','減少資源浪費',['增加垃圾量','讓水變鹹','讓天空變暗']],['關掉不用的電燈可以？','節省能源',['增加耗電','製造更多垃圾','讓電池變重']],['垃圾分類的主要目的之一是？','方便回收與處理',['讓垃圾更亂','增加浪費','讓所有東西混在一起']],['下列哪個屬於可再生能源？','太陽能',['煤','石油','天然氣']],['熱通常會從較熱的物體傳向？','較冷的物體',['較熱的物體','只有天空','永遠不傳遞']],['金屬湯匙放在熱湯裡會變熱，這是熱的？','傳導',['蒸發','磁化','反射']],['冰箱主要利用較低溫來？','減慢食物變質',['讓食物燃燒','增加細菌生長','讓水永遠不結冰']],['鹽溶在水中後，鹽通常？','仍存在於溶液中',['完全消失不存在','變成氧氣','變成磁鐵']],['砂糖加入水中攪拌後看不見，最合理的說法是？','砂糖溶解了',['砂糖不存在了','砂糖燃燒了','砂糖變成玻璃']],['哪個最可能是絕緣體？','橡膠',['銅線','鐵釘','鋁箔']],['指南針主要利用地球的？','磁場',['雨量','聲音','溫度']],['北極星常被用來大致判斷哪個方向？','北方',['南方','東方','西方']],['雲很多而且氣壓下降，可能代表？','天氣可能轉壞',['一定不會下雨','地球停止轉動','月球消失']]
  ];
  const scienceEntries=[
    {t:'科學概念',fn:d=>{const q=pick(scienceRows);return makeMC(q[0],q[1],q[2],'科學｜自然',`414sci:${q[0]}`)}},
    {t:'科學分類',fn:d=>{const sets=[['哪個是固體？','冰塊',['水蒸氣','空氣','水']],['哪個是液體？','果汁',['石頭','空氣','鐵釘']],['哪個是氣體？','空氣',['牛奶','木塊','玻璃']],['哪個會被磁鐵吸引？','迴紋針',['紙張','塑膠袋','橡皮擦']],['哪個比較容易導電？','金屬湯匙',['木筷','塑膠尺','橡皮筋']]];const q=pick(sets);return makeMC(q[0],q[1],q[2],'科學｜分類',`414sciclass:${q[0]}`)}},
    {t:'科學因果',min:2,fn:d=>{const rows=[['夏天把冰棒放在桌上，最可能發生什麼？','逐漸融化',['變得更硬','變成磁鐵','自己結冰']],['濕衣服放在通風處，通常會？','比較快乾',['永遠不乾','立刻結冰','變成金屬']],['用棉被包住冰塊，冰塊融化可能會？','比較慢',['立刻沸騰','一定更快','變成火']],['植物長期沒有光，通常會？','生長受到影響',['一定長更快','變成動物','產生電池']]];const q=pick(rows);return makeMC(q[0],q[1],q[2],'科學｜因果',`414cause:${q[0]}`)}}
  ];

  const logicRows=[['A 比 B 高，B 比 C 高，誰最高？','A',['B','C','一樣高']],['小美比小華晚到，小華比小明晚到，誰最早到？','小明',['小華','小美','無法知道']],['所有藍色鑰匙都能開藍門。這把是藍色鑰匙，最合理的是？','能開藍門',['一定能飛','不能開藍門','一定會發光']],['盒子裡只有紅球和黃球。拿到的不是紅球，那一定是？','黃球',['綠球','藍球','白球']],['如果每隻貓都有尾巴，小白是一隻貓，最合理的是？','小白有尾巴',['小白會飛','小白是魚','小白沒有身體']],['甲在乙左邊，乙在丙左邊，誰最右邊？','丙',['甲','乙','三者一樣']],['紅書比藍書厚，藍書比綠書厚，最薄的是？','綠書',['紅書','藍書','無法知道']],['如果今天不是星期一，而且昨天是星期二，今天是？','星期三',['星期一','星期二','星期四']],['2、4、8、16、？','32',['18','24','30']],['1、4、7、10、？','13',['11','12','14']],['20、18、15、11、？（依序減2、減3、減4）','6',['7','8','9']],['鳥：天空 = 魚：？','水中',['沙漠','樹上','書本']],['鞋子：腳 = 手套：？','手',['頭','眼睛','耳朵']],['鉛筆：寫字 = 剪刀：？','剪東西',['喝水','聽音樂','睡覺']],['醫生：醫院 = 老師：？','學校',['車站','農場','機場']],['哪一個和其他三個不同類？','香蕉',['老虎','獅子','大象']],['哪一個和其他三個不同類？','桌子',['紅色','藍色','綠色']],['如果「★=2、▲=3」，那 ★+▲ 是多少？','5',['4','6','23']],['有三個箱子：紅、藍、綠。寶物不在紅箱，也不在藍箱，在哪？','綠箱',['紅箱','藍箱','無法存在']]];
  const logicEntries=[
    {t:'邏輯推理',fn:d=>{const q=pick(logicRows);return makeMC(q[0],q[1],q[2],'邏輯｜推理',`414logic:${q[0]}`)}},
    {t:'方向推理',fn:d=>{const dirs=['北','東','南','西'],start=rand(0,3),turns=pick([['右轉90°',1],['左轉90°',-1],['轉身180°',2]]),ans=dirs[(start+turns[1]+4)%4];return makeMC(`面向${dirs[start]}方，${turns[0]}後面向哪裡？`,`${ans}方`,dirs.filter(x=>x!==ans).map(x=>`${x}方`).slice(0,3),'邏輯｜方向',`414dir:${start}:${turns[0]}`)}},
    {t:'位置推理',min:2,fn:d=>{const east=rand(1,5),north=rand(1,5);return makeMC(`從起點往東走 ${east} 格，再往北走 ${north} 格，最後在起點的哪個方向？`,'東北方',['西北方','東南方','西南方'],'邏輯｜位置',`414pos:${east}:${north}`)}},
    {t:'規則推理',min:2,fn:d=>{const n=rand(4,12),ans=n%2===0?'偶數':'奇數';return makeMC(`數字 ${n} 屬於奇數還是偶數？`,ans,[ans==='偶數'?'奇數':'偶數','質數一定','無法判斷'],'邏輯｜分類',`414evenodd:${n}`)}}
  ];

  const vocab=[['adventure','冒險'],['treasure','寶藏'],['forest','森林'],['mountain','山'],['river','河流'],['bridge','橋'],['village','村莊'],['castle','城堡'],['magic','魔法'],['shield','盾牌'],['enemy','敵人'],['victory','勝利'],['secret','秘密'],['careful','小心的'],['dangerous','危險的'],['important','重要的'],['difficult','困難的'],['protect','保護'],['arrive','到達'],['leave','離開'],['carry','攜帶'],['decide','決定'],['remember','記得'],['forget','忘記'],['believe','相信'],['borrow','借入'],['return','歸還'],['repair','修理'],['follow','跟隨'],['choose','選擇'],['journey','旅程'],['weather','天氣'],['season','季節'],['cloud','雲'],['thunder','雷'],['lightning','閃電'],['island','島嶼'],['ocean','海洋'],['desert','沙漠'],['valley','山谷'],['library','圖書館'],['museum','博物館'],['hospital','醫院'],['station','車站'],['kitchen','廚房'],['bedroom','臥室'],['breakfast','早餐'],['lunch','午餐'],['dinner','晚餐'],['healthy','健康的'],['hungry','飢餓的'],['thirsty','口渴的'],['excited','興奮的'],['surprised','驚訝的'],['friendly','友善的'],['clever','聰明的'],['quiet','安靜的'],['noisy','吵鬧的'],['strong','強壯的'],['weak','虛弱的'],['heavy','重的'],['light','輕的'],['early','早的'],['late','晚的'],['inside','裡面'],['outside','外面'],['above','上方'],['below','下方'],['between','在兩者之間'],['straight','直直地'],['quickly','快速地'],['slowly','慢慢地'],['carefully','小心地'],['suddenly','突然地'],['usually','通常'],['sometimes','有時'],['always','總是'],['never','從不'],['practice','練習'],['question','問題'],['answer','答案'],['subject','科目'],['science','科學'],['history','歷史'],['language','語言'],['future','未來'],['different','不同的'],['possible','可能的'],['favorite','最喜歡的'],['enough','足夠的'],['together','一起'],['before','之前'],['after','之後'],['during','在…期間'],['because','因為'],['although','雖然'],['without','沒有'],['through','穿過']];
  const opposites=[['fast','slow'],['hot','cold'],['dark','bright'],['heavy','light'],['near','far'],['inside','outside'],['open','closed'],['happy','sad'],['easy','difficult'],['same','different'],['early','late'],['strong','weak'],['empty','full'],['noisy','quiet'],['above','below'],['before','after'],['clean','dirty'],['young','old'],['tall','short'],['wet','dry'],['rich','poor'],['safe','dangerous'],['kind','mean'],['soft','hard'],['push','pull'],['begin','finish']];
  const past=[['go','went'],['eat','ate'],['see','saw'],['come','came'],['have','had'],['make','made'],['take','took'],['buy','bought'],['run','ran'],['write','wrote'],['read','read'],['drink','drank'],['give','gave'],['find','found'],['bring','brought'],['think','thought'],['teach','taught'],['sleep','slept'],['get','got'],['sit','sat'],['stand','stood'],['say','said'],['tell','told'],['meet','met'],['leave','left'],['feel','felt'],['keep','kept'],['hear','heard'],['build','built'],['send','sent']];
  const plurals=[['child','children'],['mouse','mice'],['tooth','teeth'],['foot','feet'],['man','men'],['woman','women'],['leaf','leaves'],['knife','knives'],['baby','babies'],['city','cities'],['box','boxes'],['bus','buses'],['watch','watches'],['class','classes'],['story','stories'],['wolf','wolves'],['tomato','tomatoes'],['sheep','sheep'],['fish','fish'],['person','people']];
  const readingNew=[['Amy takes an umbrella because dark clouds are coming. Why does she take it?','It may rain.',['It is very hot.','She wants to sleep.','She is cooking.']],['Ben has 12 stickers. He gives 4 to Leo. How many stickers does Ben have now?','8.',['4.','12.','16.']],['Cindy gets up at 7:00 and leaves home at 7:40. How long is she at home after getting up?','40 minutes.',['20 minutes.','30 minutes.','60 minutes.']],['David puts milk in the refrigerator after breakfast. Why?','To keep it cold.',['To make it hot.','To dry it.','To make it louder.']],['Eva is reading quietly because her baby brother is sleeping. Why is she quiet?','Her brother is sleeping.',['She is at a stadium.','She lost her book.','It is raining.']],['Frank wants to see many old objects, so he visits a museum. What does he want to see?','Old objects.',['Only new cars.','A soccer game.','A doctor.']],['Gina has PE on Tuesday and Thursday. How many PE days does she have each week?','Two.',['One.','Three.','Five.']],['Henry is shorter than Jack but taller than Sam. Who is the shortest?','Sam.',['Henry.','Jack.','They are the same.']],['Ivy finishes homework before she plays games. What does she do first?','Homework.',['Games.','Sleep.','Breakfast.']],['Jake sees a sign that says “Wet Floor.” What should he do?','Walk carefully.',['Run fast.','Jump high.','Close his eyes.']],['Kelly buys three apples for $4 each. How much does she pay?','$12.',['$7.','$8.','$16.']],['Leo missed breakfast, so he feels hungry before lunch. Why is he hungry?','He missed breakfast.',['He ate too much.','He is swimming.','He bought a book.']],['Mia’s bus arrives at 8:10. It is 8:00 now. How long must she wait?','10 minutes.',['5 minutes.','15 minutes.','20 minutes.']],['Noah wears a helmet when he rides a bike. Why?','For safety.',['To cook food.','To read faster.','To make rain.']],['Olivia puts a plant near the window. What can the plant get there?','Sunlight.',['More homework.','A louder sound.','A new shoe.']],['Peter has a red key and a blue key. The door has a blue lock. Which key should he try?','The blue key.',['The red key.','No key ever.','Both at once only.']],['Ruby reads 18 pages on Saturday and 22 on Sunday. Which day does she read more?','Sunday.',['Saturday.','The same.','Monday.']],['Sam’s soccer practice starts at 4:00 and ends at 5:30. How long is practice?','1 hour 30 minutes.',['30 minutes.','1 hour.','2 hours.']],['Tina puts her library book in her bag so she will not forget it. What is in her bag?','A library book.',['A basketball.','A pan.','A bicycle.']],['Will hears thunder after seeing lightning. What weather is likely nearby?','A storm.',['A clear dry day only.','Snow inside the house.','No weather at all.']]];

  const englishEntries=[
    {t:'英文單字',fn:d=>{const [en,zh]=pick(vocab);const distract=shuffle(vocab.filter(x=>x[0]!==en)).slice(0,3).map(x=>x[0]);return makeMC(`Which word means「${zh}」?`,en,distract,'英文｜單字',`414vocab:${en}`)}},
    {t:'英文反義字',fn:d=>{const [a,b]=pick(opposites);const distract=shuffle(opposites.flat()).filter(x=>x!==a&&x!==b).slice(0,3);return makeMC(`What is the opposite of “${a}”?`,b,distract,'英文｜反義字',`414opp:${a}`)}},
    {t:'英文過去式',min:2,fn:d=>{const [a,b]=pick(past);return makeMC(`Past tense of “${a}”?`,b,[`${a}ed`,`${a}ing`,a],'英文｜過去式',`414past:${a}`)}},
    {t:'英文複數',min:2,fn:d=>{const [a,b]=pick(plurals);return makeMC(`What is the plural of “${a}”?`,b,[`${a}s`,`${a}es`,`${a}ies`],'英文｜複數',`414plural:${a}`)}},
    {t:'英文be動詞',fn:d=>{const rows=[['I','am'],['You','are'],['He','is'],['She','is'],['We','are'],['They','are'],['The monster','is'],['My friends','are'],['Tom and Amy','are'],['This book','is']];const [s,a]=pick(rows);return makeMC(`Complete: ${s} ___ ready.`,a,['am','is','are','be'].filter(x=>x!==a).slice(0,3),'英文｜be動詞',`414be:${s}`)}},
    {t:'英文主動詞一致',min:2,fn:d=>{const rows=[['My sister','likes','like'],['The dog','runs','run'],['Tom','plays','play'],['My parents','work','works'],['The boys','study','studies'],['Amy','watches','watch'],['We','eat','eats'],['He','goes','go']];const [s,a,w]=pick(rows);return makeMC(`Complete: ${s} ___ every day.`,a,[w,`${a}ing`,`${a}ed`],'英文｜文法',`414sv:${s}:${a}`)}},
    {t:'英文介系詞',fn:d=>{const rows=[['The book is ___ the table.','on',['at','to','from']],['The cat is ___ the box.','in',['at','to','by']],['The ball is ___ the chair.','under',['during','because','with']],['School starts ___ eight o’clock.','at',['in','on','from']],['My birthday is ___ May.','in',['at','on','to']],['We have PE ___ Monday.','on',['at','in','from']],['I go to school ___ bus.','by',['at','on','with']],['The bank is ___ the library and the park.','between',['through','during','without']]];const q=pick(rows);return makeMC(q[0],q[1],q[2],'英文｜介系詞',`414prep:${q[0]}`)}},
    {t:'英文疑問詞',fn:d=>{const rows=[['___ is your teacher?','Who',['Where','When','Why']],['___ do you live?','Where',['Who','When','Why']],['___ is your birthday?','When',['Who','Where','Why']],['___ are you happy?','Why',['Who','Where','When']],['___ books do you have?','How many',['How old','Where','Who']]];const q=pick(rows);return makeMC(q[0],q[1],q[2],'英文｜疑問詞',`414wh:${q[0]}`)}},
    {t:'英文句型',fn:d=>{const rows=[['Choose the correct sentence.','She has a new bike.',['She have a new bike.','She having a new bike.','She are a new bike.']],['Choose the correct sentence.','They are playing outside.',['They is playing outside.','They am playing outside.','They playing is outside.']],['Choose the correct sentence.','He can swim well.',['He can swims well.','He cans swim well.','He can swimming well.']],['Choose the correct sentence.','We went to the park yesterday.',['We go to the park yesterday.','We goed to the park yesterday.','We going park yesterday.']],['Choose the correct sentence.','There are three cats in the room.',['There is three cats in the room.','There are three cat in the room.','There three cats is room.']]];const q=pick(rows);return makeMC(q[0],q[1],q[2],'英文｜句型',`414sentence:${q[1]}`)}},
    {t:'英文閱讀',min:2,fn:d=>{const q=pick(readingNew);return makeMC(q[0],q[1],q[2],'英文｜閱讀理解',`414read:${q[0]}`)}},
    {t:'英文既有大題庫',fn:d=>typeof englishExtraQ==='function'?englishExtraQ():makeMC('Which word means「勇敢」?','brave',['weak','quiet','tiny'],'英文｜單字','414fallback1')},
    {t:'英文既有閱讀',min:2,fn:d=>typeof readingExtraQ==='function'?readingExtraQ():makeMC('Tom is hungry, so he eats lunch. Why does Tom eat?','He is hungry.',['He is cold.','He is late.','He is sleeping.'],'英文｜閱讀','414fallback2')},
    {t:'英文冠詞',fn:d=>typeof articleDynamicQ==='function'?articleDynamicQ():makeMC('Choose: ___ apple','an',['a','are','two'],'英文｜冠詞','414article')},
    {t:'英文動態文法',fn:d=>typeof beVerbDynamicQ==='function'?beVerbDynamicQ():makeMC('Complete: I ___ ready.','am',['is','are','be'],'英文｜文法','414befallback')}
  ];

  function getNonEnglish(w){
    const d=diff(w);
    const cycle=['math','science','math','logic','science','math','logic','math'];
    const domain=cycle[st.q414NonEng%cycle.length];
    st.q414NonEng++;
    if(domain==='science')return fresh(scienceEntries,d);
    if(domain==='logic')return fresh(logicEntries,d);
    return fresh(mathEntries,d);
  }
  function getEnglish(w){return fresh(englishEntries,diff(w))}

  getQuestion=function(w){
    const count=st.q414Count;
    const pos=count%3;
    if(pos===0)st.q414EnglishSlot=rand(0,2);
    const useEnglish=pos===Number(st.q414EnglishSlot||0);
    const q=useEnglish?getEnglish(w):getNonEnglish(w);
    st.q414Count++;
    store();
    return q;
  };

  window.v414QuestionStats={mathTypes:mathEntries.length,scienceBase:scienceRows.length,logicBase:logicRows.length,englishVocab:vocab.length,englishReadingNew:readingNew.length,antiRepeat:120};
})();
