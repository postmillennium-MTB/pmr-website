
/* ---------- the Glimmer Grotto: behind the waterfall ---------- */
function wishAcorn(){
  if(!S.f.wished){S.f.wished=1;pts(1,'wish');
    return "You toss the acorn in. Plink. The pool glows from underneath, considers you for a long, humming moment, and lifts the acorn back up on a small, polite wave. It is now extremely shiny. A voice, your own but nicer, says: “Wishes are free. Advice is free. Acorns stay yours.” The pool, you gather, does not accept payment so much as hope.";}
  return "You offer the acorn again. The pool nudges it back to you, kindly, like a waiter who has already seen your card.";
}
function poolAdvice(){
  var h=plainHint();
  return "You lean over the pool and ask what you ought to do next. The water settles, and your own reflection answers, a little more patiently than you would: “"+h.a+" "+h.b+"”";
}
ROOMS.grotto={
  name:"The Glimmer Grotto",short:"Glimmer Grotto",mx:2,my:-1,walk:WALK,
  arrive:function(first){return first?"You push through the waterfall, and the roar drops away behind you like a door closing. The Glimmer Grotto: a cave lit from the inside by crystals, drifting lights and a round window of daylight a long way off. Everything glows a little. So, you notice, do you.":"The Glimmer Grotto. Still glowing, still faintly humming, still unbothered by the roar behind you."},
  exits:[{side:'S',a:110,b:210,to:'falls',land:[262,146]}],
  hot:[
    {id:'cave',n:'Stalactites',r:[0,0,320,44],at:[160,150],v:{
      look:"Stalactites hang from the ceiling and stalagmites stand on the floor. Nobody has ever been sure which is which, and the cave is not telling.",
      hand:"They are far too high to reach, and you would only get them confused with the other ones.",
      talk:"You greet the stalactites. A single drop falls, and lands exactly on your nose. You take it as a reply.",
      boot:"You kick the air toward the ceiling. The ceiling does not mind."}},
    {id:'wisps',n:'Floating lights',r:[40,24,240,100],at:[160,150],v:{
      look:"Little lights drift through the cave like a very small, very slow audience. They are not interested in you, which is restful.",
      hand:"You reach for a light. It moves exactly one hand's width away. This continues until you stop.",
      talk:"You greet the lights. They brighten a little, politely, and go on drifting.",
      boot:"You kick at a light. It is a light. You kick nothing, with great energy."}},
    {id:'window',n:'Window of light',r:[124,44,72,84],at:[160,150],v:{
      look:"A round window of daylight at the back of the cave, bright as morning, with the shapes of leaves moving in it. It is a long way off, and there is a pool in the way.",
      hand:"You cannot reach it. The pool is in the way, and the pool has not been consulted.",
      talk:"You call toward the light. A voice that might be a bird says: “Not yet.” Nothing further is offered.",
      boot:"You kick the floor in the direction of the light. The floor does not take your side."}},
    {id:'crystalsl',n:'Crystals',r:[0,70,80,100],at:[88,176],v:{
      look:"Crystals the colour of a very good mood, magenta at the edges and blue in the middle. They hum faintly, in a key you cannot name.",
      hand:"You touch a crystal. It chimes, and so does the one next to it, and the one next to that. By the end, the whole cave has agreed on a note.",
      talk:"You whisper to the crystals. They whisper back, half a second late, and rather prettier.",
      boot:"You kick a crystal. It rings like a bell and forgives you at once. You feel worse about it than it does."}},
    {id:'crystalsr',n:'Crystals',r:[240,66,80,104],at:[236,176],v:{
      look:"More crystals, pointing in every direction as though they were all offering advice at once. A few of them are slightly pink with the effort.",
      hand:"You touch a crystal. The note it makes is a bit sharper than the others'. A crystal on the far side answers, a bit flatter. They go back and forth for a while.",
      talk:"You tell the crystals your plans. They glow, in a manner that could mean encouragement or merely light.",
      boot:"You consider kicking a crystal. They are all pointing at you, in a way that says no."}},
    {id:'pool',n:'Wishing pool',r:[66,130,188,42],at:[160,180],v:{
      look:"A still round pool, blue as a secret, glowing faintly from the bottom. A tiny brass plaque on the rim: WISHING POOL. WISHES RETURNED UNOPENED. (ACORNS ACCEPTED, THEN RETURNED.)",
      hand:"You trail a hand in the water. It is cool, and for a moment the water seems to hold your hand back, gently.",
      talk:function(){return poolAdvice()},
      boot:"You consider kicking a wishing pool. The pool considers the consequences. You decide to wish for better judgement instead."},
      u:{acorn:function(){return wishAcorn()}}},
    {id:'paths',n:'Way out',r:[100,176,120,24],at:[160,178],v:{
      look:"The waterfall, from behind: a bright, roaring curtain of white and silver. The way out is back through it. You will get wet again, and so will your dignity.",
      hand:"You step toward the curtain. Walk on through; the cave will wait."}}
  ]
};
ROOMS.grotto.mx=2;ROOMS.grotto.my=-1;
ROOM_IDS.push('grotto');

/* the waterfall is now a doorway (soft: Look still just looks) */
(function(){
  var f=ROOMS.falls;
  f.exits.push({side:'N',a:244,b:278,to:'grotto',soft:true,land:[262,146]});
  f.hot.forEach(function(h){
    if(h.id==='falls'){
      h.v.look="A tall, perfectly vertical waterfall. It has never once been quiet about it. Behind the white curtain there is, unmistakably, a faint glow, and a place where the spray does not quite close. A person could walk straight through. People, presumably, do.";
      h.v.hand="You step into the spray, and then through it, with the confidence of someone who has decided to be wet anyway.";
    }
  });
  /* the pond's scenery, with a clearer verdict */
  ROOMS.pond.hot.forEach(function(h){
    if(h.id==='mill'){h.v.hand="You knock. Nobody answers. The door is locked, and a faded sign says CLOSED FOR THE SEASON (ANY SEASON). The mill is, for now, scenery, and appears to prefer it that way."}
    if(h.id==='duck'){
      h.v.talk="You say hello. The duck says nothing, loudly. As far as you can tell, he is only a duck. He has no job, no quest and no opinion about your acorn.";
      h.u={acorn:"You hold out the acorn. The duck inspects it, then you, and settles on contempt. “Wrong nut,” his eyes say, and he returns to judging the pond."};
    }
  });
})();
