/* ---------- cottage, garden, crossroads ---------- */
var ROOMS={};
function gardenArrive(){
  S.gEnt++;
  if(S.gEnt===1){S.gIdx=0;return "Barnaby Mulch's garden. Cabbages in rows, roses in a sulk, and a gnome by the birdbath, staring at nothing with great conviction."}
  S.gIdx=(S.gIdx+1)%3;var p=GPOS[S.gIdx],line;
  if(!S.f.clue){S.f.clue=1;pts(2,'clue');line="...left the trowel at the signpost, I did. Where all the paths meet. Where else does a gnome leave a trowel?"}
  else if(!S.f.trowel){line="...signpost. The big one, at the crossroads. Does nobody listen?"}
  else if(!S.f.soldHint){S.f.soldHint=1;line="...and good riddance to the trowel. Squirrels will pay anything for a trowel. Not that I would tell Hazel."}
  else{var L=["...the cabbages know. They always know.","...I will not be moved. Often.","...nine hundred and four roses and not one compliment."];line=L[S.gMut++%L.length]}
  return "You catch a mutter as you arrive: “"+line+"” He sees you. He stops. He is now "+p.n+", pretending to be furniture.";
}

ROOMS.cottage={
  name:"Master Quill's cottage",walk:{x0:3,x1:317,y0:128,y1:186},start:[300,160],
  arrive:function(first){return first?"Thistlewick Vale, morning. The Great Map is blank, the compass is spinning, and Master Quill has been gone nine days. You are Wren, apprentice. This is, technically, your problem.":"Home. The cottage looks exactly as helpful as you left it."},
  exits:[{side:'W',a:128,b:190,to:'garden'},{side:'N',a:50,b:100,to:'grove'}],
  hot:[
    {id:'cottage',n:'Cottage',r:[198,36,122,98],at:[232,152],v:{
      look:"Master Quill's cottage: home, workshop and, lately, a source of stress.",
      hand:"You pat the wall. Solid, reliable and completely uninterested in cartography.",
      boot:"You kick the wall. It has survived worse apprentices."}},
    {id:'trail',n:'Trail north',r:[60,100,40,30],at:[78,134],v:{
      look:"The trail north runs into the trees. Somewhere past them a small voice is counting acorns, and losing track.",
      hand:"You cannot pick up a trail. People have tried."}},
    {id:'sign',n:'Sign',r:[120,96,35,17],at:[138,152],v:{
      look:"CARTOGRAPHY. ENQUIRIES WELCOME. Beneath, in smaller letters: NO REFUNDS ON UNCHARTED TERRITORY.",
      hand:"You straighten the sign. It tilts back. It knows what it did.",
      boot:"You kick the post. The sign swings and now says the same thing at a slightly worse angle.",
      talk:"'Enquiries welcome,' it says. You enquire. Nothing. False advertising."}},
    {id:'barrel',n:'Rain barrel',r:[92,130,28,28],at:[106,164],v:{
      look:"A rain barrel. It is mostly rain.",
      hand:"You dip a hand in. It is wet. That is the whole report.",
      boot:"You kick the barrel. It sloshes at you smugly.",
      talk:"You say hello. The barrel burbles. That is just the rain being rain."},
      u:{tea:"You consider brewing tea with the rain. The rain would take it personally.",jar:"You scoop some rain into the jar, then pour it back. You cannot think of a reason."}},
    {id:'tea',n:'Tea tin',r:[99,122,13,11],at:[106,164],show:function(){return !S.f.tea},v:{
      look:ITEMLOOK.tea,
      hand:function(){return take('tea','tea',1,"You take the tea. Master Quill will never know. And if he does, he will understand. Probably.")}}},
    {id:'table',n:'Drafting table',r:[148,132,56,26],at:[176,164],v:{
      look:"Master Quill's drafting table. Ink stains, pencil shavings and a teacup ring that is no longer allowed to be discussed.",
      hand:"It is a table. You are neither strong enough nor interested enough.",
      boot:"You kick the table. A pencil rolls off and you feel unfairly judged by it.",
      talk:"You ask the table what it has seen. A lot of mistakes, mostly yours."}},
    {id:'map',n:'Map',r:[155,132,30,11],at:[168,162],show:function(){return !S.f.map},v:{
      look:"A large map of Thistlewick Vale, pinned flat to the table. It is blank. Not unfinished: blank, as if the Vale had been politely removed.",
      hand:function(){return take('map','map',1,"You roll up the map and tuck it under your arm. It weighs nothing, which is exactly the problem.")},
      talk:"You ask the map where everything went. It says nothing. It has nothing to say. Literally."}},
    {id:'compass',n:'Compass',r:[186,132,12,10],at:[192,162],show:function(){return !S.f.compass},v:{
      look:"A brass compass. The needle spins like it has somewhere to be and no idea where.",
      hand:function(){return take('compass','compass',1,"You pocket the compass. The needle keeps spinning in your pocket, which feels like a personal criticism.")}}},
    {id:'door',n:'Front door',r:[235,96,24,40],at:[247,140],v:{
      look:"Your front door. Behind it: a bed, a kettle and a stack of unfinished sketches. Nothing that fixes this.",
      hand:"You open the door, remember that nothing inside fixes this, and close it again.",
      talk:"You say hello to the door. It is polite enough not to answer.",
      boot:"Do not kick the door. It is the only one you have."}},
    {id:'note',n:'Note',r:[242,104,9,11],at:[247,140],v:{
      look:"“Wren. Back by first frost. Do NOT let the Map fade. Do NOT touch the good teapot. P. Quill.” Beneath, in your own handwriting: “Teapot is fine.” It is not fine.",
      hand:"You take the note down, read it again and put it back. It has not improved."}},
    {id:'window',n:'Window',r:[211,89,20,18],at:[221,140],v:{
      look:"The window. Through it: a bed, a kettle, and your own reflection looking exactly as responsible as you feel."}},
    {id:'jar',n:'Jam jar',r:[216,95,12,13],at:[221,140],show:function(){return !S.f.jar},v:{
      look:ITEMLOOK.jar,
      hand:function(){return take('jar','jar',1,"You take the jar. It clinks hopefully.")}}}
  ]
};

ROOMS.garden={
  name:"Barnaby's garden",walk:{x0:3,x1:317,y0:128,y1:186},start:[300,162],
  arrive:function(){return gardenArrive()},
  exits:[{side:'E',a:128,b:190,to:'cottage'},{side:'N',a:140,b:180,to:'cross'},{side:'W',a:128,b:190,to:'pond'}],
  hot:[
    {id:'fence',n:'Fence',r:[0,108,320,22],at:[70,134],v:{
      look:"A white picket fence, freshly painted and visibly proud of it.",
      hand:"You straighten a picket. It was never crooked. You feel judged by it.",
      boot:"You kick the fence. A picket falls over, looks at you, and stands itself back up."}},
    {id:'pathn',n:'Path north',r:[136,104,48,24],at:[160,134],v:{
      look:"A path through a gap in the fence. Somewhere up there a crossroads is waiting for you to choose wrongly.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathw',n:'Path west',r:[0,168,11,22],at:[10,176],v:{
      look:"The lawn turns to mud to the west, and the mud turns to a pond. There is a duck. There is always a duck.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'roses',n:'Roses',r:[14,112,50,36],at:[40,152],v:{
      look:"Rose bushes: red, thorny and sulking in the shade of the fence. Probably the gnome's fault.",
      hand:"Ow. You have met the thorns. They did not enjoy it either.",
      boot:"Kicking roses is a good way to lose a boot.",
      talk:"You compliment the roses. They are not impressed. They have heard it before, from roses."}},
    {id:'birdbath',n:'Birdbath',r:[90,128,32,30],at:[106,166],v:{
      look:"A stone birdbath. No birds. A single leaf floats in it, doing its best.",
      hand:"You splash the water. A bird, offended, watches from a tree.",
      talk:"You ask the birdbath how it is doing. It is a birdbath. It is doing birdbath."}},
    {id:'cabbages',n:'Cabbages',r:[204,138,108,42],at:[256,184],v:{
      look:"Cabbages in perfect rows. Whoever planted them was either meticulous or afraid of the cabbages.",
      hand:"You pat a cabbage. It is firm and judgmental.",
      talk:"The cabbages say nothing. You suspect them of plotting.",
      boot:"You kick a cabbage. It rolls a few inches and glares."},
      u:{trowel:"You consider digging up a cabbage. Barnaby would notice. Gnomes always do."}},
    {id:'can',n:'Watering can',r:[192,162,18,14],at:[200,182],v:{
      look:"A watering can. Dented, patient and slightly smug. It has watered cabbages that never thanked it.",
      hand:"You pick it up. It is empty. You put it back. A small win for nobody."}},
    {id:'log',n:'Log',r:[12,150,50,32],at:[40,188],v:{
      look:function(){return S.f.ink?"A rotting log, and the stumps of some inkcaps that now look drained and a little bitter about it.":"A rotting log covered in shaggy white mushrooms that melt into black drips at the edges. Inkcaps. As in: ink. Nature is occasionally helpful."},
      hand:function(){return S.f.ink?"You have all the ink you need. A cartographer's apprentice knows when to stop.":"You touch a cap. It collapses into black goo and your finger is now a pen. You would need something to catch it in."},
      boot:"Kick the mushrooms, wear the ink. You decide against it.",
      talk:"You say hello to the mushrooms. They continue dripping, which is how they say it."},
      u:{
        jar:function(){if(S.f.ink)return "You already have the ink.";del('jar');S.f.ink=1;add('inkjar');pts(3,'ink');return "You hold the jar under the dripping caps. It fills slowly with ink as black as a cartographer's conscience."},
        feather:function(){return S.f.ink?"The caps are spent. Your feather will have to find its ink elsewhere.":"You dab the feather in a drip. Black ink beads on the tip. Without a jar it is just a mess on a feather you are fond of. You wipe it off. Mostly."},
        inkjar:"You have ink. Nobody needs a second jar of it."}},
    {id:'gnome',n:'Gnome',r:function(){var p=GPOS[S.gIdx];return [p.x-9,p.y-30,18,32]},at:function(){var p=GPOS[S.gIdx];return [p.x+20,p.y+6]},v:{
      look:function(){return ['A garden gnome by the birdbath. The plaque at his feet says BARNABY MULCH. He is ceramic, or committed to the bit.','Barnaby again, now among the cabbages. He was not here a moment ago. You never saw him move, which is how gnomes prefer it.','Barnaby has relocated beside the roses. His expression has not changed. It cannot.'][S.gIdx]},
      talk:"“Hello,” you say. Barnaby says nothing, with great dedication. Perhaps he would talk if you were not watching. Gnomes are shy that way.",
      hand:"You poke Barnaby. He is cold, firm and unimpressed.",
      boot:"You kick the gnome. Gnomes are not designed to be kicked. Your toe files a formal complaint."},
      u:{
        feather:function(){if(S.f.quill)return "Not with ink on it. He is a gnome, not a canvas.";pts(1,'tickle');return "You tickle Barnaby under the chin with your feather. He does not move. His smile may have changed. You did not check it beforehand, so you will never know."},
        trowel:"You hold out the trowel. Barnaby does not take it, at least not while you are watching.",
        tea:"Gnomes do not drink tea. They have people for that.",
        jar:"He has no use for a jar. He is already full of whatever he is full of."}}
  ]
};

ROOMS.cross={
  name:'The Crossroads',walk:{x0:3,x1:317,y0:128,y1:186},start:[160,180],
  arrive:function(first){return first?"The Crossroads. Four ways to get lost, and a signpost that points at all of them, which is what signposts do once they have given up.":"The Crossroads again. Still four ways to get lost."},
  exits:[{side:'S',a:130,b:190,to:'garden'},{side:'N',a:140,b:180,to:'fairy'},{side:'W',a:128,b:190,to:'bridge'},{side:'E',a:128,b:190,to:'grove'}],
  hot:[
    {id:'oak',n:'Oak',r:[0,8,88,126],at:[66,140],v:{
      look:"An old oak, heavy with acorns. Something in the upper branches chitters “five hundred and six” and vanishes. You have probably imagined it.",
      hand:"You pat the oak. It endures. That is what oaks do.",
      talk:"You compliment the oak. It does not blush, but you suspect it is trying.",
      boot:"Ow. The oak is unhurt. Oaks always are."}},
    {id:'pathn',n:'Path north',r:[140,100,40,30],at:[160,134],v:{
      look:"The path north rises into a thin dusk that glitters faintly, like something up there is trying very hard and failing.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathw',n:'Path west',r:[0,146,36,26],at:[22,160],v:{
      look:"The path west dips toward a river. A deep voice out there sighs about tea, and then sighs about sighing.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathe',n:'Path east',r:[284,146,36,26],at:[298,160],v:{
      look:"The path east runs off into autumn trees. Someone out there is counting, badly, and with a lot of confidence.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'milestone',n:'Milestone',r:[90,156,22,22],at:[100,184],v:{
      look:"A stone marker: SOMEWHERE, 1 MILE. It is not specific about which way Somewhere is.",
      hand:"You lean on it. Somewhere remains one mile away.",
      boot:"Ow. It is called a milestone for a reason, and the reason is not 'kickable'.",
      talk:"You ask the milestone for directions. It says Somewhere. One mile."}},
    {id:'signpost',n:'Signpost',r:[142,90,38,68],at:[150,164],v:{
      look:function(){return S.f.clue&&!S.f.trowel?"A signpost with arms pointing every way at once. At its foot, something wooden sticks out of the dirt. Barnaby was not lying.":"A signpost with arms pointing every way at once. The paint has long since given up on the names."},
      hand:"You push the signpost. It is firmly planted, as are its opinions.",
      boot:"You kick the signpost. All four arms point at your toe.",
      talk:"You ask the signpost which way. It points. Every way. Thank you."}},
    {id:'base',n:'Signpost base',r:[160,148,14,12],at:[152,164],show:function(){return !S.f.trowel},v:{
      look:function(){return S.f.clue?"A small trowel is buried to the handle. The handle says: B. MULCH. HANDS OFF.":"The foot of the signpost: dirt, pebbles and an unreasonable amount of nothing."},
      hand:function(){
        if(!S.f.clue)return "You poke around the base of the post. Dirt, pebbles and the beginnings of a headache. You are not even sure what you are looking for.";
        return take('trowel','trowel',3,"You pry out a small trowel. The handle is carved: B. MULCH. HANDS OFF. In your defence, it was left outside.")}}}
  ]
};
