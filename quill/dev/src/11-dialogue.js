
/* ---------- dialogue data: each node has say (text or function), opts (list or function), optional enter ---------- */
var Q_='“',Q2_='”';
function sellItem(id,n){
  del(id);addAcorns(n);pts(2,'firstsale');
  if(id==='trowel'&&S.f.haggled&&n===2)pts(1,'haggle');
  return 'You hand over the '+nm(id)+'. Hazel counts out '+n+' acorn'+(n>1?'s':'')+' with the precision of someone who has done this before and plans to do it again.';
}
function buyCache(){
  spendAcorns(3);S.f.cone=1;add('cone');pts(3,'cone');
  return 'You count three acorns into her paw. Hazel pulls a cone off the pyramid, polishes it on her waistcoat and hands it over like a parent at a wedding. '+Q_+'Pleasure doing business. Refunds are a myth.'+Q2_;
}
function hzRoot(){
  var o=[];
  ['trowel','button','spoon','tea'].forEach(function(id){if(has(id))o.push({t:'Sell the '+nm(id)+'.',go:'offer_'+id})});
  if(!S.f.cone&&S.acorns>=3)o.push({t:'Buy the pinecone cache (3 acorns).',do:buyCache,go:'root'});
  if(!S.f.cone)o.push({t:'Ask about the pinecone cache.',go:'sweet'});
  o.push({t:'What are you counting?',go:'counting'});
  o.push({t:'What do you buy?',go:'buys'});
  o.push({t:'Goodbye.'});
  return o;
}
function offer(id,text,price){
  return {say:text,opts:[{t:'Sell for '+price+' acorn'+(price>1?'s':'')+'.',do:function(){return sellItem(id,price)},go:'root'},{t:'Never mind.',go:'root'}]};
}
function giveTea(){del('tea');S.f.gaveTea=1;pts(2,'gavetea');return 'You hand over the tin. Magnus takes it in his lips, very gently, and breathes in for a long time. '+Q_+'Smoke,'+Q2_+' he whispers. '+Q_+'Tar. Leather. The end of a very good fire.'+Q2_+' A pause. '+Q_+'I shall brew it later. I will be unbearable about it.'+Q2_;}
function fnRoot(){
  var o=[];
  if(!S.f.sparkle)o.push({t:'The map went blank and the compass spins. Can you fix it?',go:'compass'});
  if(S.f.sparkle)o.push({t:'Which way to Misty Peak?',go:'peakdir'});
  o.push({t:'Who are you?',go:'who'});
  if(!S.f.sparkle)o.push({t:'You look tired.',go:'tired'});
  o.push({t:'Goodbye.'});
  return o;
}

var DLG={
  hazel:{name:'Hazel',nodes:{
    start:{
      say:function(){return S.f.hmet?'Hazel does not look up. '+Q_+'Buying, selling or loitering? Loitering is billable.'+Q2_:'Hazel does not look up from the ledger. '+Q_+'Four hundred and twelve. Four hundred and thirteen. Do not stand in my light. Do not stand in my acorns. ...Hm. Customer or loiterer?'+Q2_},
      enter:function(){S.f.hmet=1},
      opts:hzRoot},
    root:{say:'Hazel taps the ledger. '+Q_+'Anything else? Time is acorns.'+Q2_,opts:hzRoot},
    counting:{say:Q_+'Acorns. The only honest currency. They do not inflate, they do not lie, and they only rot if you let them. I do not let them.'+Q2_+' She scribbles. '+Q_+'I lost count when you arrived, by the way. That is a charge.'+Q2_,opts:[{t:'Fair enough.',go:'root'}]},
    buys:{say:Q_+'Tools. Shiny things. Anything with a handle or a gleam. Anything that smells too much to be useful. I pay in acorns, and only acorns. Everything has a price, and the price is acorns.'+Q2_+' She considers you. '+Q_+'People lose spoons by waterfalls all the time. Buttons in ponds. It is a small economy, but it is mine.'+Q2_,opts:[{t:'Fair enough.',go:'root'}]},
    sweet:{
      say:'Hazel looks up for the first time. '+Q_+'The cache. Forty pinecones, sealed in sap since last autumn. Not for sale.'+Q2_+' A pause. '+Q_+'Three acorns. Final. Do not haggle. It is rude in a grove.'+Q2_,
      opts:function(){return [
        {t:'Buy the cache (3 acorns).',if:function(){return S.acorns>=3},do:buyCache,go:'root'},
        {t:'I do not have three acorns.',if:function(){return S.acorns<3},go:'poor'},
        {t:'Maybe later.',go:'root'}
      ].filter(function(o){return !o.if||o.if()})}},
    poor:{say:Q_+'Then you have less than three. Remedy that. I buy tools, shiny things, and anything else I can resell to a moose.'+Q2_,opts:[{t:'Right.',go:'root'}]},
    offer_trowel:{
      say:function(){return S.f.haggled?Q_+'Still the engraved trowel. Two acorns, as discussed. I refuse to renegotiate the price of a word.'+Q2_:'Hazel takes the trowel in both paws and turns it over. '+Q_+'Good steel. Nice weight. And engraved: B. MULCH. HANDS OFF.'+Q2_+' She sniffs. '+Q_+'Stolen, then. One acorn.'+Q2_},
      opts:function(){return [
        {t:'It is engraved. That is provenance.',if:function(){return !S.f.haggled},go:'haggle'},
        {t:'Sell for 1 acorn.',if:function(){return !S.f.haggled},do:function(){return sellItem('trowel',1)},go:'root'},
        {t:'Sell for 2 acorns.',if:function(){return S.f.haggled},do:function(){return sellItem('trowel',2)},go:'root'},
        {t:'Never mind.',go:'root'}
      ].filter(function(o){return !o.if||o.if()})}},
    haggle:{
      say:'Hazel’s pencil stops. '+Q_+'Provenance.'+Q2_+' She says it like she has just tasted it. '+Q_+'Named maker. Documented ownership. ...That does add value. Two acorns. And I resent that you know the word.'+Q2_,
      enter:function(){S.f.haggled=1},
      opts:[{t:'Sell for 2 acorns.',do:function(){return sellItem('trowel',2)},go:'root'},{t:'Never mind.',go:'root'}]},
    offer_button:offer('button',Q_+'Brass. Round. Shiny. It is nearly pretty.'+Q2_+' She flips it. '+Q_+'One acorn.'+Q2_,1),
    offer_spoon:offer('spoon',Q_+'Silver. Born-with-it silver.'+Q2_+' She bites it, very delicately. '+Q_+'Real. One acorn, and I will pretend I did not see where you got it.'+Q2_,1),
    offer_tea:offer('tea',Q_+'Tea. It smells like a campfire that lost an argument. I could not drink it. But I know a moose who would, and he would pay. One acorn.'+Q2_,1)
  }},
  magnus:{name:'Magnus',nodes:{
    start:{
      say:function(){
        if(S.f.sneezed)return Q_+'Ah,'+Q2_+' says Magnus, with the dignity of a moose who has been surprised in public. '+Q_+'It was good for me. I mean, unpleasant. But good.'+Q2_;
        if(S.f.gaveTea)return Q_+'You have my gratitude, apprentice. It is heavy. I still cannot move, though. Something would have to surprise me.'+Q2_;
        return 'A sigh moves the reeds. '+Q_+'Another traveller. Another crossing. Ah, but you cannot cross. I am sitting. It is a whole thing.'+Q2_},
      opts:function(){return [
        {t:'Why are you sitting on the bridge?',go:'why'},
        {t:'Can I get past?',go:'pass'},
        {t:'What is in your antlers?',go:'antlers'},
        {t:'Would you like some tea?',if:function(){return has('tea')&&!S.f.gaveTea},go:'tea'},
        {t:'Goodbye.'}
      ].filter(function(o){return !o.if||o.if()})}},
    why:{say:Q_+'I am in mourning,'+Q2_+' says Magnus. '+Q_+'Eleven days ago the tea ran out. Since then I have not had a proper cup. So I sit, in the middle of the only bridge, and I feel everything.'+Q2_,opts:[{t:'I see.',go:'start'}]},
    pass:{
      say:function(){return S.f.sneezed?Q_+'Pass,'+Q2_+' says Magnus. '+Q_+'Please. Before I think about it.'+Q2_:Q_+'You may cross when I move,'+Q2_+' says Magnus. '+Q_+'I will move when I have the will to rise. The will left with the tea.'+Q2_+' He sighs, and the reeds lie down. '+Q_+'Unless something surprises me. I have not been surprised in years. It is tragic.'+Q2_},
      opts:[{t:'I see.',go:'start'}]},
    antlers:{
      say:function(){return S.f.sneezed?Q_+'Nothing now. The nests went. I miss them. I miss the jay least.'+Q2_:Q_+'Nests,'+Q2_+' says Magnus. '+Q_+'Seven this season. Wrens, sparrows and one extremely rude jay. And a bell that is not mine. A fairy lost it in spring. I would return it, but I cannot reach, and I cannot move, and I cannot, and I cannot.'+Q2_},
      opts:[{t:'I see.',go:'start'}]},
    tea:{say:'Magnus’s nostrils widen. '+Q_+'Is that... Lapsang?'+Q2_,opts:[{t:'Hand over the tea tin.',do:giveTea,go:'start'},{t:'Not yet.',go:'start'}]}
  }},
  fennel:{name:'Fennel',nodes:{
    wake:{
      say:'The bell rings. Fennel’s eyes snap open. '+Q_+'Is it morning? Tell me it is not morning. ...Ugh. Who rang that? It was extremely loud and it knew exactly what it was doing.'+Q2_+' She sits up, wobbling. '+Q_+'What do you want?'+Q2_,
      opts:fnRoot},
    start:{
      say:function(){return S.f.sparkle?'Fennel hovers, glittering, with enormous self-satisfaction. '+Q_+'Anything else?'+Q2_:'Fennel blinks at you through a headache. '+Q_+'Back again? What is it?'+Q2_},
      opts:fnRoot},
    compass:{
      say:'She takes the compass and peers at it. '+Q_+'Oh dear. Dead. Quite dead. It runs on sparkle, and I am the sparkle. I have not had any since... Tuesday? Last Tuesday. Possibly an earlier Tuesday. I have not had a thing to eat that was sweet in ages, and without sugar I am just a small tired person with wings.'+Q2_,
      opts:[{t:'Where would I find something sweet?',go:'sweet'},{t:'I will see what I can do.',go:'start'}]},
    sweet:{say:Q_+'Sweet. Sweet. Sap, honey, jam, the good kind of pinecone. A certain squirrel keeps a cache the size of a cottage. She would charge a fortune. She charges for everything. She once charged me for my own shadow.'+Q2_,opts:[{t:'I see.',go:'start'}]},
    who:{say:Q_+'Fennel. Chief Navigation Fairy of Thistlewick Vale.'+Q2_+' A pause. '+Q_+'Provisional. I am not great at directions. Left. Right. The one in between.'+Q2_,opts:[{t:'I see.',go:'start'}]},
    tired:{say:Q_+'I am a fairy,'+Q2_+' says Fennel. '+Q_+'Sparkle is a sugar thing. Everyone forgets. They think it is magic. It is calories. Nobody ever writes that down.'+Q2_,opts:[{t:'I see.',go:'start'}]},
    fed:{
      say:'You offer the pinecone. Fennel stares at it as if it were a sunrise. Then she demolishes the sap in four enormous and deeply unprofessional bites. Colour floods back into her wings: pink, gold, and a shade that does not occur in nature. She glows. She hovers a full foot higher. '+Q_+'OH,'+Q2_+' she says. '+Q_+'Oh. That is MUCH better.'+Q2_,
      opts:[{t:'Can you fix the compass now?',go:'fed2'}]},
    fed2:{
      enter:function(){S.f.sparkle=1;pts(3,'sparkle')},
      say:'She plucks the compass from your hand and breathes on it. A gold shimmer runs through the needle and settles. The needle steadies, points, and, for the first time in nine days, does not spin. '+Q_+'There,'+Q2_+' says Fennel. '+Q_+'Sparkle restored. It should last a while. You would be amazed what a pinecone can do.'+Q2_,
      opts:[{t:'Which way to Misty Peak?',go:'peakdir'},{t:'Thank you.',go:'start'}]},
    peakdir:{say:Q_+'The Peak? Easy. Go west. Or north. Whichever one has the big hill.'+Q2_+' She winces. '+Q_+'Actually, trust the compass. It is much better at this than I am. I am famous for it.'+Q2_,opts:[{t:'Thank you.',go:'start'}]}
  }}
};
