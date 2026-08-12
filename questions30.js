// V4.7 expanded question system: larger pools + dynamic generation + 40-question anti-repeat memory.
remember=function(q){
  st.history=st.history||[];
  st.history.push(q.key||q.p);
  if(st.history.length>40)st.history=st.history.slice(-40);
  store();
  return q;
};
uniqueQuestion=function(factory){
  st.history=st.history||[];
  let q;
  for(let i=0;i<60;i++){
    q=factory();
    if(!st.history.includes(q.key||q.p))return remember(q);
  }
  return remember(q);
};
const qPick=a=>a[rand(0,a.length-1)];
const diffForWorld=w=>Math.min(6,Math.ceil(w/5));
function addSubQ(d=1){
  const max=[100,200,500,1000,1500,3000][d-1];
  const a=rand(Math.floor(max*.25),max),b=rand(10,Math.floor(max*.45));
  if(Math.random()<.5){const ans=a+b;return makeMC(`${a} + ${b} = ?`,ans,[ans+10,ans-10,a+b+1],'加法',`add:${a}:${b}`)}
  const hi=Math.max(a,b),lo=Math.min(a,b),ans=hi-lo;return makeMC(`${hi} − ${lo} = ?`,ans,[ans+10,Math.max(0,ans-10),ans+1],'減法',`sub:${hi}:${lo}`)
}
function multiplyQ(d=1){
  const a=rand(3,12),b=d<3?rand(3,12):rand(4,15),ans=a*b;
  return makeMC(`${a} × ${b} = ?`,ans,[ans+a,Math.max(1,ans-b),ans+rand(2,9)],'乘法',`mul30:${a}:${b}`)
}
function divisionQ(d=1){
  const b=rand(3,d<4?12:15),q=rand(3,d<3?12:18),a=b*q;
  return makeMC(`${a} ÷ ${b} = ?`,q,[q+1,Math.max(1,q-1),q+2],'除法',`div30:${a}:${b}`)
}
function multiStepQ(d=1){
  const boxes=rand(3,8+d),each=rand(4,9+d),give=rand(2,8+d),ans=boxes*each-give;
  return makeMC(`${boxes} 箱藥水，每箱 ${each} 瓶，送出 ${give} 瓶後還剩多少瓶？`,ans,[boxes*each,ans+give,Math.max(0,ans-each)],'多步驟應用',`multi:${boxes}:${each}:${give}`)
}
function moneyQ(d=1){
  const price=rand(15,50+d*15),qty=rand(1,Math.min(5,2+d)),total=price*qty,pay=Math.ceil((total+rand(10,80))/50)*50,ans=pay-total;
  return makeMC(`每件裝備 ${price} 元，買 ${qty} 件，付 ${pay} 元，找回多少元？`,ans,[pay-price,total,ans+10],'金錢應用',`money30:${price}:${qty}:${pay}`)
}
function fractionCompareQ(){
  const den=qPick([4,5,6,8,10,12]),a=rand(1,den-1),b=rand(1,den-1);if(a===b)return fractionCompareQ();
  const ca=`${a}/${den}`,cb=`${b}/${den}`,correct=a>b?ca:cb,opts=shuffle([ca,cb,'一樣大','無法比較']);
  return {p:`哪個分數比較大？ <b>${ca}</b> 或 <b>${cb}</b>`,o:opts,a:opts.indexOf(correct),cat:'分數比較',key:`fcomp:${a}:${b}:${den}`};
}
function fractionOfQ(d=1){
  const den=qPick([2,3,4,5,6,8]),num=rand(1,den-1),unit=rand(2,6+d),whole=den*unit,ans=num*unit;
  return makeMC(`${whole} 顆寶石的 ${num}/${den} 是幾顆？`,ans,[unit,whole-num,ans+unit],'分數應用',`fof:${whole}:${num}:${den}`)
}
function equivalentFractionQ(){
  const den=qPick([2,3,4,5,6]),num=rand(1,den-1),k=qPick([2,3,4]),correct=`${num*k}/${den*k}`;
  const wrong=[`${num+k}/${den+k}`,`${num}/${den*k}`,`${num*k}/${den}`];
  return makeMC(`哪一個和 ${num}/${den} 相等？`,correct,wrong,'等值分數',`feq:${num}:${den}:${k}`)
}
function decimalCompareQ(d=1){
  const scale=d<3?10:100,a=(rand(1,scale-1)/scale).toFixed(scale===10?1:2),b=(rand(1,scale-1)/scale).toFixed(scale===10?1:2);if(a===b)return decimalCompareQ(d);
  const correct=Number(a)>Number(b)?a:b,opts=shuffle([a,b,'一樣大','無法比較']);
  return {p:`哪個小數比較大？ <b>${a}</b> 或 <b>${b}</b>`,o:opts,a:opts.indexOf(correct),cat:'小數比較',key:`dcomp:${a}:${b}`};
}
function decimalAddQ(d=1){
  const a=rand(10,90)/10,b=rand(10,90)/10,ans=(a+b).toFixed(1);
  return makeMC(`${a.toFixed(1)} + ${b.toFixed(1)} = ?`,ans,[(a+b+.1).toFixed(1),(a+b-1).toFixed(1),(a+b+1).toFixed(1)],'小數加法',`dadd:${a}:${b}`)
}
function perimeterQ(d=1){const l=rand(3,10+d*2),w=rand(2,8+d),ans=2*(l+w);return makeMC(`長方形長 ${l} cm、寬 ${w} cm，周長是多少？`,ans,[l*w,l+w,ans+2],'周長',`peri30:${l}:${w}`)}
function areaQ(d=1){const l=rand(3,9+d),w=rand(2,7+d),ans=l*w;return makeMC(`長方形長 ${l} cm、寬 ${w} cm，面積是多少平方公分？`,ans,[2*(l+w),l+w,ans+l],'面積',`area:${l}:${w}`)}
function angleQ(){const pool=[['直角是多少度？','90°',['45°','180°','360°']],['平角是多少度？','180°',['90°','120°','360°']],['一圈完整旋轉是多少度？','360°',['90°','180°','270°']],['比 90° 小的角通常叫什麼？','銳角',['鈍角','平角','周角']],['比 90° 大、比 180° 小的角叫什麼？','鈍角',['銳角','直角','周角']]];const q=qPick(pool);return makeMC(q[0],q[1],q[2],'角度',`angle:${q[0]}`)}
function lengthUnitQ(d=1){
  if(Math.random()<.5){const m=rand(1,9+d),cm=rand(1,9)*10,ans=m*100+cm;return makeMC(`${m} 公尺 ${cm} 公分 = 幾公分？`,ans,[m*100,cm,ans+100],'長度換算',`len:${m}:${cm}`)}
  const cm=rand(2,15)*100,ans=cm/100;return makeMC(`${cm} 公分 = 幾公尺？`,ans,[cm/10,cm,ans+1],'長度換算',`len2:${cm}`)
}
function weightUnitQ(){const kg=rand(1,8),g=qPick([100,200,250,500,750]),ans=kg*1000+g;return makeMC(`${kg} 公斤 ${g} 公克 = 幾公克？`,ans,[kg*1000,g,ans+1000],'重量換算',`wt:${kg}:${g}`)}
function timeQ(){const h=rand(1,4),m=qPick([10,15,20,30,45]),ans=h*60+m;return makeMC(`${h} 小時 ${m} 分鐘共有幾分鐘？`,ans,[h*60,m,ans-10],'時間換算',`time30:${h}:${m}`)}
function elapsedTimeQ(){
  const h=rand(7,17),startM=qPick([0,10,15,20,30,40,45]),dur=qPick([20,30,40,45,50,60,75,90]);
  const total=h*60+startM+dur,eh=Math.floor(total/60)%24,em=total%60,fmt=n=>String(n).padStart(2,'0'),correct=`${fmt(eh)}:${fmt(em)}`;
  const opts=[correct,`${fmt((eh+1)%24)}:${fmt(em)}`,`${fmt(eh)}:${fmt((em+10)%60)}`,`${fmt(Math.max(0,eh-1))}:${fmt(em)}`];
  return {p:`冒險在 ${fmt(h)}:${fmt(startM)} 出發，經過 ${dur} 分鐘後是幾點？`,o:shuffle(opts),a:0,cat:'經過時間',key:`elapsed:${h}:${startM}:${dur}`,_correct:correct};
}
function normalizeCorrect(q){if(q._correct){q.a=q.o.indexOf(q._correct);delete q._correct}return q}
function patternQ(d=1){const start=rand(1,15),step=rand(2,5+d*2),seq=[0,1,2,3].map(i=>start+i*step),ans=start+4*step;return makeMC(`找規律：${seq.join('、')}、？`,ans,[ans-step,ans+step,ans+2],'數列',`pat30:${start}:${step}`)}
function growPatternQ(d=1){const start=rand(1,4),mult=d<4?2:qPick([2,3]),seq=[start,start*mult,start*mult**2,start*mult**3],ans=start*mult**4;return makeMC(`找規律：${seq.join('、')}、？`,ans,[seq[3],ans+start,ans*mult],'倍數規律',`grow:${start}:${mult}`)}
function dataQ(){
  const a=rand(3,12),b=rand(3,12),c=rand(3,12),max=Math.max(a,b,c),labels=['紅隊','藍隊','綠隊'],vals=[a,b,c],idx=vals.indexOf(max);
  return makeMC(`勇者競賽得分：紅隊 ${a} 分、藍隊 ${b} 分、綠隊 ${c} 分。哪一隊最高？`,labels[idx],labels.filter((_,i)=>i!==idx).concat(['三隊一樣']),'資料判讀',`data:${a}:${b}:${c}`)
}
function directionQ(){const pool=[['面向北方右轉 90°，會面向？','東方',['西方','南方','北方']],['面向東方左轉 90°，會面向？','北方',['南方','西方','東方']],['面向南方轉身 180°，會面向？','北方',['東方','西方','南方']],['往東走 3 格，再往北走 2 格，最後在起點哪個方向？','東北方',['西北方','東南方','西南方']],['往西走 4 格，再往南走 1 格，最後在起點哪個方向？','西南方',['東南方','西北方','東北方']]];const q=qPick(pool);return makeMC(q[0],q[1],q[2],'方向邏輯',`dir30:${q[0]}`)}
const englishBigPool=[['Which word means「勇敢」?','brave',['weak','quiet','tiny']],['Which word means「安靜的」?','quiet',['loud','fast','dangerous']],['Which word means「危險的」?','dangerous',['safe','delicious','simple']],['Which word means「聰明的」?','clever',['hungry','slow','empty']],['Which word means「巨大的」?','huge',['tiny','thin','short']],['Which word means「選擇」?','choose',['close','clean','climb']],['Which word means「保護」?','protect',['forget','borrow','invite']],['Which word means「旅程」?','journey',['kitchen','weather','pencil']],['Opposite of “early”?','late',['near','fast','short']],['Opposite of “strong”?','weak',['heavy','bright','brave']],['Opposite of “empty”?','full',['clean','small','open']],['Opposite of “noisy”?','quiet',['angry','quick','dark']],['Opposite of “above”?','below',['behind','inside','across']],['Opposite of “before”?','after',['under','again','always']],['Past tense of “go”?','went',['goed','gone','going']],['Past tense of “eat”?','ate',['eated','eaten','eating']],['Past tense of “see”?','saw',['seed','seen','seeing']],['Past tense of “come”?','came',['comed','comeed','coming']],['Past tense of “have”?','had',['haved','has','having']],['Past tense of “make”?','made',['maked','makeed','making']],['Past tense of “take”?','took',['taked','taken','taking']],['Past tense of “buy”?','bought',['buyed','brought','buying']],['What is the plural of “child”?','children',['childs','childes','childrens']],['What is the plural of “mouse”?','mice',['mouses','mousees','mices']],['What is the plural of “tooth”?','teeth',['tooths','toothes','teeths']],['What is the plural of “foot”?','feet',['foots','feets','footes']],['What is the plural of “city”?','cities',['citys','cityes','citis']],['What is the plural of “box”?','boxes',['boxs','boxies','boxen']],['Choose the correct sentence.','She has a book.',['She have a book.','She having a book.','She are a book.']],['Choose the correct sentence.','They are ready.',['They is ready.','They am ready.','They be ready.']],['Choose the correct sentence.','He goes to school.',['He go to school.','He going to school.','He gone school.']],['Choose the correct sentence.','I am hungry.',['I is hungry.','I are hungry.','I be hungry.']],['Choose the correct sentence.','We play soccer after school.',['We plays soccer after school.','We playing soccer after school.','We is play soccer after school.']],['Choose the correct sentence.','Tom does his homework every day.',['Tom do his homework every day.','Tom doing his homework every day.','Tom does homework yesterday every day.']],['Complete: I ___ a student.','am',['is','are','be']],['Complete: We ___ friends.','are',['is','am','be']],['Complete: She ___ two cats.','has',['have','having','hadly']],['Complete: They ___ in the park now.','are',['is','am','be']],['Complete: My brother ___ basketball on Sundays.','plays',['play','playing','played always']],['Complete: There ___ a book on the desk.','is',['are','am','be']],['Which spelling is correct?','because',['becaus','becouse','beacause']],['Which spelling is correct?','friend',['freind','frend','friand']],['Which spelling is correct?','beautiful',['beautifull','beutiful','beautyful']],['Which spelling is correct?','different',['diffrent','diferent','differant']],['Which spelling is correct?','favorite',['favarite','favrite','favorit']],['Which spelling is correct?','library',['libary','librery','liberry']],['Which word is a verb?','run',['blue','happy','table']],['Which word is an adjective?','strong',['jump','book','slowly']],['Which word is a noun?','teacher',['quickly','bright','swim']],['Which word is an adverb?','slowly',['slow','turtle','walk']],['Which means「昨天」?','yesterday',['tomorrow','today','tonight']],['Which means「明天」?','tomorrow',['yesterday','before','last']],['Which means「通常」?','usually',['never','yesterday','outside']],['Which means「有時候」?','sometimes',['always','inside','again']]];
function englishBigQ(){const q=qPick(englishBigPool);return makeMC(q[0],q[1],q[2],'英文',`engbig:${q[0]}:${q[1]}`)}
const readingPool=[['Amy has a red umbrella because it is raining. Why does Amy have an umbrella?','Because it is raining.',['Because it is sunny.','Because she is swimming.','Because it is snowing.']],['Ben gets up at seven and goes to school at eight. What does Ben do first?','He gets up.',['He goes to school.','He eats dinner.','He goes to bed.']],['Lily has three apples and gives one to Tom. How many apples does Lily have now?','Two.',['One.','Three.','Four.']],['Kevin is hungry, so he makes a sandwich. Why does Kevin make a sandwich?','He is hungry.',['He is tired.','He is late.','He is cold.']],['The cat is under the table. Where is the cat?','Under the table.',['On the table.','Behind the door.','In the box.']],['Mia likes science, but her brother likes music. What does Mia like?','Science.',['Music.','Sports.','Art.']],['The library closes at five. It is four thirty now. Is the library still open?','Yes.',['No.','Only on Sunday.','We cannot know.']],['Jack wears a coat because the weather is cold. What is the weather like?','Cold.',['Hot.','Windless.','Dry.']],['Sara walks to the park with her dog every Saturday. Who goes with Sara?','Her dog.',['Her teacher.','Her brother.','Her cat.']],['There are twelve students on the bus. Four get off. How many remain?','Eight.',['Six.','Twelve.','Sixteen.']],['Leo finished his homework before dinner. When did he finish it?','Before dinner.',['After dinner.','At midnight.','Tomorrow.']],['Nina cannot find her pencil, so she borrows one from May. What does Nina borrow?','A pencil.',['A book.','A ruler.','A bag.']]];
function readingQ(){const q=qPick(readingPool);return makeMC(q[0],q[1],q[2],'英文閱讀',`read:${q[0]}`)}
const scienceBigPool=[['水在標準大氣壓下加熱到約 100°C 通常會？','沸騰',['結冰','凝固','變成石頭']],['冰塊融化屬於哪種變化？','固態變液態',['液態變氣態','氣態變固態','液態變固態']],['水蒸氣遇冷形成小水滴叫做？','凝結',['蒸發','融化','燃燒']],['濕衣服曬乾主要是因為水發生？','蒸發',['凝固','結冰','燃燒']],['下列哪一個通常是氣體？','空氣',['冰塊','鐵尺','玻璃珠']],['植物製造養分主要需要哪種能量？','陽光',['聲音','磁力','摩擦']],['植物的根主要功能之一是？','吸收水分',['製造聲音','發出月光','產生磁力']],['植物的葉主要在哪裡進行光合作用？','葉片',['根部','種子外殼','花盆']],['種子發芽通常需要水、適當溫度，還需要什麼基本條件？','空氣',['強磁鐵','鹽水','黑暗一定必要']],['食物鏈中植物通常是？','生產者',['消費者','分解者','掠食者']],['哪一個是哺乳類？','海豚',['鯊魚','章魚','企鵝']],['哪一個動物屬於兩棲類？','青蛙',['老鷹','鯨魚','蜥蜴']],['鳥類身體最具代表性的特徵之一是？','有羽毛',['有鱗片','有六隻腳','生活在水中']],['昆蟲通常有幾隻腳？','6 隻',['4 隻','8 隻','10 隻']],['魚類主要用什麼呼吸？','鰓',['肺','皮膚一定是唯一方式','翅膀']],['影子的方向通常和光源方向？','相反',['相同','永遠向北','完全無關']],['鏡子主要利用光的哪種現象？','反射',['蒸發','磁化','燃燒']],['聲音需要什麼才能傳播？','介質',['只有真空','只有光','只有磁場']],['聲音越大，通常代表振動的什麼較大？','振幅',['顏色','重量','溫度']],['光通常沿什麼路徑前進？','直線',['一定繞圈','只往上','完全隨機']],['磁鐵最容易吸引哪一種物品？','鐵釘',['玻璃珠','塑膠片','橡皮筋']],['下列哪一個通常是導體？','銅線',['橡皮擦','塑膠尺','乾木筷']],['哪種力會讓物體落向地面？','重力',['浮力','磁力','彈力']],['推門時主要對門施加的是？','力',['光','聲音','顏色']],['橡皮筋被拉長後放開會恢復，主要和哪種力有關？','彈力',['重力','磁力','浮力']],['地球繞著哪個天體公轉？','太陽',['月球','火星','北極星']],['白天與黑夜主要是因為？','地球自轉',['地球公轉','月球自轉','太陽繞地球']],['一年四季主要與什麼有關？','地球公轉與地軸傾斜',['月球大小','海水顏色','風向固定']],['月球本身會發光嗎？','不會，它主要反射太陽光',['會，自己一直發光','只有白天會','只有滿月會']],['太陽系中我們居住的行星是？','地球',['火星','木星','金星']],['月球繞著哪個天體運行？','地球',['太陽是唯一答案','火星','木星']],['太陽是一顆什麼？','恆星',['行星','衛星','彗星']],['地球表面大部分被什麼覆蓋？','水',['沙漠','冰','森林']],['人體呼吸最主要使用哪個器官？','肺',['胃','骨頭','腎臟']],['心臟最主要的工作之一是？','推動血液循環',['消化食物','製造骨頭','控制頭髮生長']],['牙齒主要幫助我們？','咀嚼食物',['聽聲音','呼吸','看東西']],['運動後心跳通常會？','加快',['完全停止','一定變慢','沒有任何變化']],['保持身體健康通常應該？','均衡飲食並適量運動',['只吃糖果','完全不睡覺','每天不喝水']],['下雨主要和水循環中的哪個過程有關？','水滴凝結後降落',['岩石燃燒','磁鐵吸水','地球停止轉動']],['雲主要由什麼組成？','小水滴或冰晶',['棉花','煙灰一定是全部','沙子']],['風是什麼的流動？','空氣',['岩石','光線','磁鐵']],['溫度計主要用來測量？','溫度',['重量','長度','聲音']],['雨量筒主要用來測量？','降雨量',['風速','溫度','日照角度']],['物體浮在水面上可能和什麼有關？','浮力',['只有磁力','只有聲音','只有光']],['金屬湯匙放進熱湯後變熱，主要是熱的？','傳導',['反射','折射','蒸發']],['太陽能板主要把太陽能轉換成？','電能',['食物','磁鐵','雨水']],['電池在電路中主要提供？','電能',['聲音','空氣','影子']],['開關在簡單電路中的作用是？','控制電路通斷',['增加水量','改變物體顏色','製造磁鐵一定永久化']]];
function scienceBigQ(){const q=qPick(scienceBigPool);return makeMC(q[0],q[1],q[2],'科學',`scibig:${q[0]}`)}
const logicBigPool=[['A 比 B 高，B 比 C 高，誰最高？','A',['B','C','一樣高']],['小明比小華早到，小華比小美早到，誰最後到？','小美',['小明','小華','無法知道']],['若今天星期三，3 天後是星期幾？','星期六',['星期五','星期日','星期一']],['盒子裡只有紅球與藍球，拿到的不是紅球，那一定是？','藍球',['綠球','黃球','白球']],['所有紅鑰匙都能開紅門。這把是紅鑰匙，最合理的是？','它能開紅門',['它一定會飛','它不能開紅門','它會變色']],['甲比乙重，乙比丙重，哪一個最輕？','丙',['甲','乙','一樣重']],['四個人排隊，小安在小美前面，小美在小強前面，誰不可能排在最前？','小強',['小安','可能是其他人','資訊不足']],['如果每隻龍都有翅膀，小火是一隻龍，可以推論？','小火有翅膀',['小火一定會游泳','小火沒有翅膀','小火是魚']],['今天星期五，昨天是？','星期四',['星期三','星期六','星期日']],['後天是星期日，今天是？','星期五',['星期四','星期六','星期一']],['1、3、5、7、？','9',['8','10','11']],['2、5、8、11、？','14',['13','15','16']],['20、18、16、14、？','12',['10','13','16']],['1、2、4、8、？','16',['10','12','18']],['3、6、12、24、？','48',['30','36','42']],['紅、藍、紅、藍、紅、？','藍',['紅','綠','黃']],['○△□○△□○，下一個是？','△',['○','□','☆']],['如果門牌只使用偶數，哪一個可能出現？','28',['17','35','41']],['哪個數和其他三個不同類？','9',['2','4','8']],['若 A=1、B=2、C=3，那 CAB = ?','312',['123','321','213']],['三個箱子標 A、B、C，寶物不在 A，也不在 C，在哪裡？','B',['A','C','無法知道']],['小華向北走，再向東走，他在起點的哪個方向？','東北方',['西北方','東南方','西南方']],['一個正方形有幾條邊？','4',['3','5','6']],['兩個完全一樣的三角形至少共有幾個角？','6',['3','4','8']],['如果所有魔法師都會讀書，小雨不會讀書，最合理的推論是？','不能確定小雨是魔法師',['小雨一定是魔法師','小雨一定會飛','所有人都不會讀書']],['爸爸比哥哥年長，哥哥比妹妹年長，誰最年輕？','妹妹',['爸爸','哥哥','一樣年輕']],['一場比賽第一名不是甲，第二名是乙，若只有甲乙丙三人，第一名可能是？','丙',['乙','甲','沒有人']],['如果密碼規則是每個數加 2，3 變 5，那 8 變？','10',['6','9','12']],['一本書從第 10 頁看到第 15 頁，共看了幾頁？','6',['5','15','25']],['電梯從 2 樓上升 5 層，會到幾樓？','7 樓',['5 樓','6 樓','8 樓']]];
function logicBigQ(){const q=qPick(logicBigPool);return makeMC(q[0],q[1],q[2],'邏輯',`logicbig:${q[0]}`)}
const mathMixed=d=>qPick([addSubQ,multiplyQ,divisionQ,multiStepQ,moneyQ,fractionCompareQ,fractionOfQ,equivalentFractionQ,decimalCompareQ,decimalAddQ,perimeterQ,areaQ,lengthUnitQ,weightUnitQ,timeQ,()=>normalizeCorrect(elapsedTimeQ()),patternQ,growPatternQ,dataQ])(d);
const anyMixed=d=>qPick([()=>mathMixed(d),englishBigQ,readingQ,scienceBigQ,logicBigQ,directionQ,angleQ])();
const profiles={1:[multiplyQ,addSubQ,englishBigQ],2:[divisionQ,moneyQ,multiStepQ],3:[fractionCompareQ,equivalentFractionQ,decimalCompareQ],4:[patternQ,growPatternQ,logicBigQ,directionQ],5:[englishBigQ,readingQ],6:[scienceBigQ,logicBigQ],7:[timeQ,()=>normalizeCorrect(elapsedTimeQ()),lengthUnitQ,weightUnitQ],8:[perimeterQ,areaQ,angleQ],9:[scienceBigQ,logicBigQ],10:[mathMixed,englishBigQ,scienceBigQ,logicBigQ],11:[multiplyQ,divisionQ,patternQ,multiStepQ],12:[moneyQ,multiStepQ,addSubQ,dataQ],13:[fractionOfQ,equivalentFractionQ,decimalCompareQ,decimalAddQ],14:[areaQ,perimeterQ,lengthUnitQ,weightUnitQ],15:[englishBigQ,readingQ],16:[patternQ,growPatternQ,logicBigQ,dataQ,directionQ],17:[scienceBigQ,logicBigQ],18:[timeQ,()=>normalizeCorrect(elapsedTimeQ()),lengthUnitQ,multiStepQ],19:[scienceBigQ,logicBigQ],20:[scienceBigQ,mathMixed,logicBigQ],21:[multiStepQ,moneyQ,()=>normalizeCorrect(elapsedTimeQ()),dataQ],22:[perimeterQ,areaQ,angleQ,directionQ,logicBigQ],23:[englishBigQ,readingQ,logicBigQ],24:[mathMixed,multiStepQ,dataQ],25:[scienceBigQ,logicBigQ,mathMixed],26:[mathMixed,scienceBigQ,dataQ],27:[englishBigQ,readingQ,logicBigQ,directionQ],28:[anyMixed,mathMixed,englishBigQ,scienceBigQ,logicBigQ],29:[anyMixed,mathMixed,scienceBigQ,readingQ,logicBigQ],30:[anyMixed,mathMixed,englishBigQ,readingQ,scienceBigQ,logicBigQ]};
getQuestion=function(w){const d=diffForWorld(w),profile=profiles[w]||profiles[30];return uniqueQuestion(()=>{const fn=qPick(profile),q=fn(d);return q&&q._correct?normalizeCorrect(q):q})};
