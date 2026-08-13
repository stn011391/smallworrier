// V4.14 monster HP rebalance. HP now scales by chapter and monster rank instead of a shallow linear curve.
(()=>{
  const bands=[
    {normal:[10,18],advanced:[15,23],elite:[22,32],boss:[35,50]},
    {normal:[18,28],advanced:[25,38],elite:[35,50],boss:[55,75]},
    {normal:[28,42],advanced:[38,55],elite:[50,70],boss:[75,100]},
    {normal:[40,58],advanced:[55,75],elite:[70,95],boss:[100,130]},
    {normal:[55,75],advanced:[70,95],elite:[90,120],boss:[130,165]},
    {normal:[70,95],advanced:[90,120],elite:[115,150],boss:[165,210]}
  ];
  const lerp=(a,b,t)=>Math.round(a+(b-a)*t);
  worlds.forEach(w=>{
    const ch=Math.min(6,Math.max(1,Math.ceil(w.id/5)));
    const pos=(w.id-1)%5;
    const t=pos/4;
    const b=bands[ch-1];
    let n1=lerp(b.normal[0],b.normal[1],t);
    let adv=lerp(b.advanced[0],b.advanced[1],t);
    let elite=lerp(b.elite[0],b.elite[1],t);
    let boss=lerp(b.boss[0],b.boss[1],t);
    let n2=Math.round(n1+(adv-n1)*0.38);

    // The final dungeon is intentionally a true end-game encounter.
    if(w.id===30){n1=100;n2=115;adv=130;elite=170;boss=280;}
    const hp=[n1,n2,adv,elite,boss];
    w.m.forEach((m,i)=>{m[2]=hp[i];});
  });
  window.v414HpBands=bands;
})();
