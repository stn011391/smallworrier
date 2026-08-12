// V4.9 English expansion: exactly one English question in every three generated questions.
// The English slot is randomized inside each 3-question block, so the cadence is not predictable.
const englishExtraPool=[
['Which word means「冒險」?','adventure',['answer','afternoon','address']],
['Which word means「寶藏」?','treasure',['weather','picture','teacher']],
['Which word means「森林」?','forest',['future','floor','flower']],
['Which word means「山」?','mountain',['market','minute','morning']],
['Which word means「河流」?','river',['ruler','rabbit','robot']],
['Which word means「橋」?','bridge',['bread','brush','branch']],
['Which word means「村莊」?','village',['visitor','vegetable','vacation']],
['Which word means「城堡」?','castle',['candle','camera','circle']],
['Which word means「魔法」?','magic',['music','machine','message']],
['Which word means「盾牌」?','shield',['shirt','sheep','shelf']],
['Which word means「敵人」?','enemy',['energy','empty','enjoy']],
['Which word means「隊伍」?','team',['time','term','tree']],
['Which word means「勝利」?','victory',['visitor','village','voice']],
['Which word means「失敗」?','failure',['family','future','farmer']],
['Which word means「秘密」?','secret',['season','second','subject']],
['Which word means「安全的」?','safe',['same','soft','slow']],
['Which word means「困難的」?','difficult',['different','delicious','dangerous']],
['Which word means「重要的」?','important',['impossible','inside','interesting']],
['Which word means「小心的」?','careful',['careless','colorful','helpful']],
['Which word means「快速地」?','quickly',['quietly','quick','quiet']],
['Which word means「突然地」?','suddenly',['usually','slowly','softly']],
['Which word means「到達」?','arrive',['answer','ask','around']],
['Which word means「離開」?','leave',['learn','live','love']],
['Which word means「攜帶」?','carry',['catch','clean','climb']],
['Which word means「找到」?','find',['finish','fight','fly']],
['Which word means「建立」?','build',['bring','buy','break']],
['Which word means「決定」?','decide',['describe','dance','draw']],
['Which word means「記得」?','remember',['repeat','return','repair']],
['Which word means「忘記」?','forget',['follow','finish','fight']],
['Which word means「相信」?','believe',['borrow','begin','become']],
['Opposite of “fast”?','slow',['short','small','soft']],
['Opposite of “hot”?','cold',['cooler','warm','dry']],
['Opposite of “dark”?','bright',['black','deep','quiet']],
['Opposite of “heavy”?','light',['high','large','long']],
['Opposite of “near”?','far',['fast','few','full']],
['Opposite of “inside”?','outside',['under','above','behind']],
['Opposite of “open”?','closed',['empty','quiet','clean']],
['Opposite of “happy”?','sad',['angry','tired','hungry']],
['Opposite of “easy”?','difficult',['simple','early','empty']],
['Opposite of “same”?','different',['difficult','dangerous','delicious']],
['Past tense of “run”?','ran',['runned','runed','running']],
['Past tense of “write”?','wrote',['writed','written','writing']],
['Past tense of “read”?','read',['readed','rode','reading']],
['Past tense of “drink”?','drank',['drinked','drunk','drinking']],
['Past tense of “give”?','gave',['gived','given','giving']],
['Past tense of “find”?','found',['finded','founded','finding']],
['Past tense of “bring”?','brought',['bringed','bought','bringing']],
['Past tense of “think”?','thought',['thinked','thanked','thinking']],
['Past tense of “teach”?','taught',['teached','thought','teaching']],
['Past tense of “sleep”?','slept',['sleeped','sleeping','slipped']],
['What is the plural of “man”?','men',['mans','manes','mens']],
['What is the plural of “woman”?','women',['womans','womens','womanes']],
['What is the plural of “leaf”?','leaves',['leafs','leafes','leavs']],
['What is the plural of “knife”?','knives',['knifes','knifees','knivs']],
['What is the plural of “baby”?','babies',['babys','babyes','babyes']],
['What is the plural of “bus”?','buses',['buss','busies','busen']],
['What is the plural of “watch”?','watches',['watchs','watchies','watchen']],
['Complete: He ___ a bike.','has',['have','having','are']],
['Complete: You ___ my friend.','are',['is','am','be']],
['Complete: The dog ___ under the chair.','is',['are','am','have']],
['Complete: My parents ___ at home.','are',['is','am','has']],
['Complete: Amy ___ English every day.','studies',['study','studys','studying always']],
['Complete: The boys ___ soccer after school.','play',['plays','is playing every day','playes']],
['Complete: Dad ___ coffee every morning.','drinks',['drink','drinking','drank every morning']],
['Complete: I ___ my homework yesterday.','did',['do','does','doing']],
['Complete: We ___ to the zoo last Sunday.','went',['go','goed','going']],
['Complete: She ___ a cake last night.','made',['make','maked','making']],
['Choose the correct sentence.','There are two books on the desk.',['There is two books on the desk.','There are two book on the desk.','There two books are desk.']],
['Choose the correct sentence.','My sister likes music.',['My sister like music.','My sister liking music.','My sister are music.']],
['Choose the correct sentence.','We were tired yesterday.',['We was tired yesterday.','We are tired yesterday.','We be tired yesterday.']],
['Choose the correct sentence.','He can swim very well.',['He can swims very well.','He cans swim very well.','He can swimming very well.']],
['Choose the correct sentence.','Please open the window.',['Please opens the window.','Please opening the window.','Please opened window now.']],
['Which spelling is correct?','adventure',['adventur','advenchure','adventuer']],
['Which spelling is correct?','important',['importent','improtant','importannt']],
['Which spelling is correct?','remember',['remmember','remeber','remembar']],
['Which spelling is correct?','different',['diferent','diffrent','differint']],
['Which spelling is correct?','February',['Febuary','Febrary','Februery']],
['Which spelling is correct?','Wednesday',['Wensday','Wednsday','Wednesdey']],
['Which word is a noun?','mountain',['quickly','brave','climb']],
['Which word is a verb?','protect',['careful','castle','slowly']],
['Which word is an adjective?','dangerous',['danger','dangerously','run']],
['Which word is an adverb?','carefully',['careful','care','castle']],
['Which word is a place?','library',['hungry','jump','quietly']],
['Which word is an animal?','dolphin',['forest','silver','travel']],
['Which word is a feeling?','excited',['pencil','river','climb']],
['Which word is a person?','doctor',['hospital','careful','quickly']],
['Complete: The book is ___ the table.','on',['at','to','from']],
['Complete: The cat is ___ the box.','in',['on','at','from']],
['Complete: The ball is ___ the chair.','under',['during','because','with']],
['Complete: School starts ___ eight o’clock.','at',['in','on','from']],
['Complete: My birthday is ___ May.','in',['at','on','to']],
['Complete: We have PE ___ Monday.','on',['at','in','from']],
['Complete: I go to school ___ bus.','by',['at','on','with']],
['Complete: This gift is ___ you.','for',['from','under','between']],
['Complete: I went there ___ my brother.','with',['at','of','by']],
['Complete: The bank is ___ the library and the park.','between',['through','during','without']],
['Choose the correct article: ___ apple','an',['a','the always','no word']],
['Choose the correct article: ___ dog','a',['an','two','are']],
['Choose the correct pronoun for “Mary”.','she',['he','it','they']],
['Choose the correct pronoun for “Tom and Ben”.','they',['he','she','it']],
['Choose the correct pronoun for “a book”.','it',['he','she','they']],
['Which question word asks about a place?','Where',['When','Who','Why']],
['Which question word asks about time?','When',['Where','Who','Which color']],
['Which question word asks about a person?','Who',['Where','When','How many']],
['Which question word asks for a reason?','Why',['Who','Where','What color']],
['Which word means almost the same as “big”?','large',['tiny','slow','empty']],
['Which word means almost the same as “smart”?','clever',['weak','dark','late']],
['Which word means almost the same as “begin”?','start',['finish','leave','forget']],
['Which word means almost the same as “finish”?','end',['begin','open','carry']]
];

const readingExtraPool=[
['Emma puts on her raincoat and boots before she goes outside. What is the weather probably like?','Rainy.',['Sunny.','Snowy and hot.','Very dry.']],
['Noah feeds his rabbit every morning before school. What does Noah do before school?','He feeds his rabbit.',['He goes swimming.','He cooks dinner.','He reads at midnight.']],
['Olivia has a test tomorrow, so she studies after dinner. Why does Olivia study?','She has a test tomorrow.',['She is hungry.','She lost her shoes.','She wants to sleep.']],
['Ethan missed the bus, so his dad drove him to school. How did Ethan get to school?','His dad drove him.',['He took the bus.','He walked with a dog.','He rode a train.']],
['Ava bought two notebooks and one pencil at the store. How many kinds of school items did she buy?','Two kinds.',['One kind.','Three kinds.','Four kinds.']],
['Lucas waters the plants every Tuesday and Friday. How many days a week does he water them?','Two days.',['One day.','Three days.','Seven days.']],
['Sophia is taller than Mia, and Mia is taller than Zoe. Who is the tallest?','Sophia.',['Mia.','Zoe.','They are the same height.']],
['Jack left home at 7:30 and arrived at school at 8:00. How long did the trip take?','30 minutes.',['15 minutes.','45 minutes.','60 minutes.']],
['The museum opens at 9:00 and closes at 5:00. Ben arrives at 4:30. Can he enter before it closes?','Yes.',['No.','Only at night.','Only on Monday.']],
['Lucy has a blue bag. Her sister has a green bag. Whose bag is green?','Lucy’s sister’s.',['Lucy’s.','Their teacher’s.','No one’s.']],
['Daniel was thirsty after running, so he drank a bottle of water. Why did he drink water?','He was thirsty.',['He was sleepy.','He was cold.','He was bored.']],
['Grace put the ice cream in the freezer because she did not want it to melt. Where did she put it?','In the freezer.',['On the desk.','Under the bed.','In the oven.']],
['Henry usually rides his bike, but today it is broken, so he walks. How does Henry travel today?','He walks.',['He rides his bike.','He flies.','He takes a boat.']],
['Chloe read 20 pages on Monday and 15 pages on Tuesday. On which day did she read more?','Monday.',['Tuesday.','The same amount.','Sunday.']],
['Ryan has soccer practice after school on Wednesday. When is his practice?','Wednesday after school.',['Wednesday morning.','Friday night.','Sunday morning.']],
['The puppy is sleeping beside the sofa while the cat sits on the window. Where is the puppy?','Beside the sofa.',['On the window.','Under the table.','Outside the house.']],
['Mason packed a sandwich, an apple, and water for his trip. Which item is a drink?','Water.',['Sandwich.','Apple.','Trip.']],
['Ella wants to borrow a book, so she goes to the library. Why does she go there?','To borrow a book.',['To buy shoes.','To see a doctor.','To catch a train.']],
['The red team scored 12 points and the blue team scored 9. Which team won?','The red team.',['The blue team.','Both teams.','No team.']],
['Sam cleans his room before his friends visit. What does Sam do first?','He cleans his room.',['His friends visit.','He goes to sleep.','He eats breakfast tomorrow.']],
['The sign says “Do not run.” What should you do?','Walk.',['Run faster.','Jump on tables.','Shout loudly.']],
['Anna is wearing gloves, a scarf, and a thick coat. Which season is most likely?','Winter.',['Summer.','Spring only.','A very hot day.']],
['Peter needs six eggs for a recipe, but he has only four. How many more eggs does he need?','Two.',['One.','Four.','Ten.']],
['The train leaves at 10:15. It is 10:05 now. How many minutes are left?','10 minutes.',['5 minutes.','15 minutes.','20 minutes.']],
['Mia turns off the light when she leaves the room. What is she saving?','Electricity.',['Water.','Paper.','Food.']],
['Leo sees dark clouds and hears thunder. What may happen soon?','It may rain.',['It may snow indoors.','The sun will disappear forever.','The river will freeze at once.']],
['Kate puts a bookmark on page 36 before closing her book. Why does she use a bookmark?','To remember her page.',['To make the book heavier.','To erase the words.','To change the cover.']],
['Max finished first in the race, and Ben finished second. Who was faster in the race?','Max.',['Ben.','They tied.','We cannot know.']],
['Lily’s classroom is on the third floor. She is on the first floor now. Which direction must she go?','Up.',['Down.','Outside.','Backward only.']],
['The shop sells pencils for $5 each. Amy buys two pencils. How much does she pay?','$10.',['$5.','$7.','$15.']]
];

function englishExtraQ(){const q=qPick(englishExtraPool);return makeMC(q[0],q[1],q[2],'英文加強',`engx:${q[0]}:${q[1]}`)}
function readingExtraQ(){const q=qPick(readingExtraPool);return makeMC(q[0],q[1],q[2],'英文閱讀',`readx:${q[0]}`)}
function articleDynamicQ(){const vowel=qPick(['apple','orange','umbrella','egg','elephant']),consonant=qPick(['book','dog','hero','teacher','castle']);if(Math.random()<.5)return makeMC(`Choose the correct article: ___ ${vowel}`,'an',['a','are','the two'],'英文冠詞',`art:an:${vowel}`);return makeMC(`Choose the correct article: ___ ${consonant}`,'a',['an','are','some two'],'英文冠詞',`art:a:${consonant}`)}
function beVerbDynamicQ(){const rows=[['I','am'],['You','are'],['He','is'],['She','is'],['We','are'],['They','are'],['The dragon','is'],['My friends','are']];const r=qPick(rows);return makeMC(`Complete: ${r[0]} ___ ready.`,r[1],['am','is','are'].filter(x=>x!==r[1]).concat(['be']),'英文文法',`be:${r[0]}`)}
function haveHasDynamicQ(){const rows=[['I','have'],['You','have'],['He','has'],['She','has'],['We','have'],['They','have'],['The knight','has'],['My friends','have']];const r=qPick(rows);return makeMC(`Complete: ${r[0]} ___ a map.`,r[1],r[1]==='has'?['have','having','is']:['has','having','is'],'英文文法',`hh:${r[0]}`)}
function prepDynamicQ(){const rows=[['The key is ___ the box.','in',['on','at','from']],['The book is ___ the desk.','on',['in','from','to']],['The cat is ___ the chair.','under',['during','because','after']],['We meet ___ 3:00.','at',['in','on','by']],['School starts ___ Monday.','on',['at','in','from']],['My birthday is ___ July.','in',['on','at','to']]];const r=qPick(rows);return makeMC(r[0],r[1],r[2],'英文介系詞',`prep:${r[0]}`)}
function questionWordDynamicQ(){const rows=[['___ is your teacher?','Who',['Where','When','Why']],['___ do you live?','Where',['Who','When','How many']],['___ is your birthday?','When',['Where','Who','Why']],['___ are you late?','Why',['Who','Where','What color']],['___ books do you have?','How many',['Where','Who','When']]];const r=qPick(rows);return makeMC(r[0],r[1],r[2],'英文疑問詞',`qw:${r[0]}`)}
function expandedEnglishQ(d=1){const choices=d<=2?[englishBigQ,englishExtraQ,articleDynamicQ,beVerbDynamicQ,prepDynamicQ]:d<=4?[englishBigQ,englishExtraQ,readingQ,readingExtraQ,beVerbDynamicQ,haveHasDynamicQ,prepDynamicQ,questionWordDynamicQ]:[englishExtraQ,readingQ,readingExtraQ,haveHasDynamicQ,prepDynamicQ,questionWordDynamicQ,englishBigQ];return qPick(choices)()}

function nonEnglishQ(w,d){
  const band=Math.min(6,Math.ceil(w/5));
  const pools={
    1:[addSubQ,multiplyQ,divisionQ,moneyQ,scienceBigQ,logicBigQ],
    2:[divisionQ,multiStepQ,fractionCompareQ,timeQ,scienceBigQ,logicBigQ],
    3:[fractionOfQ,equivalentFractionQ,decimalCompareQ,perimeterQ,areaQ,logicBigQ],
    4:[multiStepQ,decimalAddQ,areaQ,()=>normalizeCorrect(elapsedTimeQ()),scienceBigQ,logicBigQ,directionQ],
    5:[mathMixed,scienceBigQ,logicBigQ,directionQ,angleQ,dataQ],
    6:[mathMixed,scienceBigQ,logicBigQ,directionQ,angleQ,dataQ,()=>normalizeCorrect(elapsedTimeQ())]
  };
  const fn=qPick(pools[band]);
  const q=fn(d);
  return q&&q._correct?normalizeCorrect(q):q;
}

getQuestion=function(w){
  const d=diffForWorld(w);
  const count=Number(st.engQuotaCount||0);
  if(count%3===0)st.engQuotaSlot=rand(0,2);
  const slot=Number.isInteger(st.engQuotaSlot)?st.engQuotaSlot:rand(0,2);
  const useEnglish=(count%3)===slot;
  st.engQuotaCount=count+1;
  store();
  return uniqueQuestion(()=>useEnglish?expandedEnglishQ(d):nonEnglishQ(w,d));
};
