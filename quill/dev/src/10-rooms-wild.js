
/* ---------- the six new screens ---------- */
var WALK={x0:3,x1:317,y0:128,y1:186};
function hzNo(id){return function(){return ({
  jar:"Hazel eyes the jar. “A container. Tempting. But I can see you need it, and I never trade with people who need things. They overpay in the wrong direction.”",
  inkjar:"Hazel sniffs the ink. “No. Anything that stains is a liability, and I only deal in assets.”",
  feather:"Hazel regards the feather with open appetite. “No,” she says, mostly to herself. “No. It's attached to your hat. There are rules.”",
  map:"“A map?” Hazel squints. “There's nothing on it. I do not buy nothing. I sell it.”",
  compass:"“The compass is yours,” Hazel says, a little too fast. “I can see how much you need it. Never come to a trader holding what you need.”",
  bell:"“That bell has someone's name on it,” Hazel says. “I do not trade in names. Names have lawyers.”",
  cone:"Hazel stares at the pinecone you are holding, her own pinecone, and her eye twitches. “No returns,” she says. “No refunds. No questions. Go away.”"
}[id])}}
function tickleMagnus(){
  if(S.f.sneezed)return "Magnus raises a hoof. “Once was a mercy,” he says. “Twice is an assault.”";
  S.f.sneezed=1;pts(3,'sneeze');S.f.stache=S.f.quill?1:0;
  take('bell','bell',2,'');
  return "You rise on tiptoe and tickle the tip of his enormous nose with the feather. Magnus holds perfectly still. His eyes open. “Ah,” he says. “Ah. AH...” CHOO! Seven nests launch skyward in a cloud of outraged sparrows, and a small brass bell bounces off the rail and rolls to your boots. “Well,” says Magnus. “That was something.” He shuffles aside with the dignity of a moose who has been surprised in public."+(S.f.quill?" The feather leaves a thin black line on his lip. He will not find out until much later.":"");
}
function wakeFennel(){
  if(S.f.wokeF)return "She is already awake. Ringing it again would be rude, and she has a headache.";
  S.f.wokeF=1;pts(2,'woke');startDialog('fennel','wake');return null;
}
function feedFennel(){
  if(!S.f.wokeF)return "She is fast asleep. Feeding a sticky pinecone to a sleeping fairy is how lawsuits start.";
  if(S.f.sparkle)return "She is already glowing. More sap would be showing off.";
  S.f.fed=1;del('cone');pts(2,'fed');startDialog('fennel','fed');return null;
}

ROOMS.grove={
  name:"Squirrel Grove",short:"Squirrel Grove",mx:2,my:1,walk:WALK,
  arrive:function(first){return first?"Squirrel Grove, in full autumn. Leaves fall in a pattern that looks suspiciously organised. On a stump, a squirrel is counting acorns out loud and has clearly lost her place.":"Squirrel Grove again. Hazel does not look up. She never does."},
  exits:[{side:'W',a:128,b:190,to:'cross'},{side:'S',a:50,b:110,to:'cottage'},{side:'N',a:256,b:300,to:'falls'},{side:'E',a:140,b:186,to:'birch'}],
  hot:[
    {id:'oak',n:'Oak',r:[56,0,160,140],at:[130,150],v:{
      look:"An enormous oak, the source of most of the Vale's acorns and therefore most of Hazel's power.",
      hand:"You pat the oak. A dozen acorns thud down around you. Hazel's head turns so fast it should be illegal. “Those are MINE.” You stop.",
      talk:"You compliment the oak. A branch rustles, which might be thanks, or might be a squirrel auditing it.",
      boot:"You kick the oak. Acorns fall. So does Hazel's opinion of you."}},
    {id:'hollow',n:'Hollow',r:[124,102,20,26],at:[132,150],v:{
      look:"A hollow in the oak. Something inside is counting. You decide not to find out what.",
      hand:"You reach toward the hollow. A tiny voice says “FOUR HUNDRED AND TWELVE” with menace. You withdraw.",
      talk:"You say hello into the hollow. “FOUR HUNDRED AND THIRTEEN,” it says. You were not invited to join.",
      boot:"You consider kicking a tree with something inside it. You consider your toes. You consider your life."}},
    {id:'sign',n:'Sign',r:[6,100,52,56],at:[40,156],v:{
      look:"NO LOITERING. Below, in smaller letters: (UNLESS PURCHASING). Below that, smaller still: (PURCHASING IS DEFINED BY THE MANAGEMENT).",
      hand:"You straighten the sign. It tilts back, which feels like a rule.",
      talk:"You read the sign aloud. A faint rustle from the stump suggests you have been billed.",
      boot:"You kick the post. The sign swings once and settles, a little more crooked and a little more correct."}},
    {id:'cones',n:'Pinecones',r:[66,110,84,50],at:[110,164],v:{
      look:function(){return S.f.cone?"The pyramid has a gap where one cone used to be. Hazel has already noted it in the ledger, and it is not a friendly entry.":"A tidy pyramid of pinecones, each one glazed with sap and arranged by size. A card reads: THE CACHE. 3 ACORNS. NO HAGGLING. (Hazel's handwriting, underlined twice.)"},
      hand:function(){return S.f.cone?"Hazel's glare reminds you that the account is closed.":"You reach for a cone. Hazel's tail is already across your wrist. “Three acorns,” she says, without looking. You did not know a squirrel could move that fast. Or that frightening."},
      talk:"You compliment the pinecones. Hazel's head tilts. You can hear her pricing the compliment.",
      boot:"You consider kicking the pyramid. Hazel considers you. Both of you decide against it."},
      u:{acorn:function(){startDialog('hazel','sweet');return null}}},
    {id:'sacks',n:'Acorn sacks',r:[150,126,38,32],at:[170,166],v:{
      look:"Sacks of acorns, labelled: ACORNS, ACORNS (PREMIUM), ACORNS (FOR EMERGENCIES), and ACORNS (DO NOT).",
      hand:"You lift a corner of a sack. Hazel is suddenly beside you, then suddenly back on her stump. You never see her cross the distance. “Hands off the money.”",
      talk:"The sacks do not say anything. A sack that talks is a sack that has been audited.",
      boot:"You consider kicking the acorns. The stump shifts slightly. You reconsider."}},
    {id:'ledger',n:'Ledger',r:[224,138,26,22],at:[236,168],v:{
      look:"A ledger with columns for acorns, debts and grudges. The grudges column is longer.",
      hand:"You open the ledger. Your own name is already in it, under CUSTOMERS (POTENTIAL). You close it very gently.",
      talk:"You read a few entries aloud. “PUT THAT BACK,” says Hazel, from twenty feet away, without turning.",
      boot:"You kick the ledger stump. Hazel enters your name in a different column."}},
    {id:'hazel',n:'Hazel',r:[190,106,32,36],at:[182,168],v:{
      look:function(){return S.f.hmet?"Hazel, a red squirrel in a waistcoat of her own invention, perched on a stump like a bank manager. She is aware of exactly where you are.":"A red squirrel in a small waistcoat sits upright on a stump with a ledger, a pencil and the posture of a bank manager. She has not looked at you once. She knows exactly where you are."},
      hand:"You offer a handshake. Hazel counts your fingers afterwards.",
      talk:function(){startDialog('hazel','start');return null},
      boot:"You consider kicking a squirrel. Her tail is the size of your regrets. You decide no."},
      u:{trowel:function(){startDialog('hazel','offer_trowel');return null},button:function(){startDialog('hazel','offer_button');return null},spoon:function(){startDialog('hazel','offer_spoon');return null},tea:function(){startDialog('hazel','offer_tea');return null},
         acorn:function(){startDialog('hazel','start');return null},jar:hzNo('jar'),inkjar:hzNo('inkjar'),feather:hzNo('feather'),map:hzNo('map'),compass:hzNo('compass'),bell:hzNo('bell'),cone:hzNo('cone')}},
    {id:'pathw',n:'Path west',r:[0,148,24,40],at:[10,170],v:{
      look:"The path west drops back toward the Crossroads. It looks like it already misses you.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'paths',n:'Path south',r:[44,172,70,18],at:[80,184],v:{
      look:"The path south leads back to the cottage and, with it, the guilt of unfinished work.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathe',n:'Path east',r:[298,144,22,44],at:[308,170],v:{
      look:"The path east slips off between white birches, going somewhere yellow.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathn',n:'Path north',r:[256,104,46,24],at:[278,134],v:{
      look:"The path north climbs toward a distant roar and the possibility of a rainbow.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

ROOMS.bridge={
  name:"Moose Bridge",short:"Moose Bridge",mx:0,my:1,walk:{x0:3,x1:317,y0:142,y1:186},
  arrive:function(first){return S.f.sneezed?"Moose Bridge. Magnus has moved to the side, with the air of a moose who has been publicly surprised and is still deciding how he feels about it.":(first?"Moose Bridge. A broad wooden bridge over a slow river, completely occupied by a moose. He is looking at the horizon as though it owes him money.":"Moose Bridge. Magnus sighs at your arrival, a sound with plenty of weather in it.")},
  exits:[
    {side:'E',a:142,b:190,to:'cross'},
    {side:'S',a:90,b:150,to:'pond'},
    {side:'N',a:134,b:186,to:'peak',lock:function(){return S.f.sneezed?null:"Magnus fills the bridge from rail to rail. He is not moving for an apprentice with no tea and no excuse. Someone would have to surprise him first."}}
  ],
  hot:[
    {id:'mount',n:'Mountains',r:[0,38,150,76],at:[70,150],v:{
      look:"Far-off peaks, one with a snowcap that seems to be staring back. Misty Peak, you think, from the way Master Quill once drew it on a napkin.",
      hand:"You reach toward the mountains. They stay exactly where they were, which is the thing mountains do.",
      talk:"You greet the mountains. They do not reply, but they do seem to be listening in a menacing, geological way.",
      boot:"You kick the air toward the mountains. They remain unimpressed."}},
    {id:'river',n:'River',r:[0,114,320,28],at:[200,150],v:{
      look:"A slow green river that has clearly never been in a hurry.",
      hand:"You dip a hand in. It is cold. The river notes this and does nothing about it.",
      talk:"You greet the river. It replies in a long, slow gurgle. Possibly a no.",
      boot:"You kick at the water. It does not respond. It has had worse."}},
    {id:'bridge',n:'Bridge',r:[70,98,180,44],at:[96,150],v:{
      look:"A sturdy wooden bridge, mossy, damp, and presently load-bearing in an emotional sense.",
      hand:"You pat the rail. It is damp and faintly moose-scented.",
      talk:"You compliment the bridge. It creaks, which might be modesty.",
      boot:"You kick a plank. It does not mind. It is currently supporting a moose."}},
    {id:'pathn',n:'Path north',r:[142,70,40,42],at:[160,146],v:{
      look:"The path continues north across the bridge, into the thin air toward something peak-shaped. All of it is behind a moose.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'moose',n:'Magnus',r:function(){return S.f.sneezed?[62,8,96,114]:[100,8,100,114]},at:function(){return S.f.sneezed?[110,150]:[168,150]},v:{
      look:function(){return S.f.sneezed?("Magnus, now to one side, wearing the expression of a moose who has been publicly surprised and is still deciding how he feels about it."+(S.f.stache?" A thin black stripe sits on his upper lip. He has not noticed, and nobody is going to tell him.":"")):"Magnus: a moose of heroic proportions, seated across the whole bridge. His antlers hold seven nests, several of them occupied, and a few of those are arguing."},
      hand:"You pat his flank. The sigh that follows ruffles your hair. “Do not,” he says, “unless you mean it.”",
      talk:function(){startDialog('magnus','start');return null},
      boot:"You kick the moose. He does not notice. The kick, however, notices you."},
      u:{feather:tickleMagnus,tea:function(){if(S.f.gaveTea)return "He has the tea already. He is composing a speech about it.";startDialog('magnus','tea');return null},
         bell:"“That's the fairy's,” says Magnus. “You should take it back. I had it in my antlers since spring.”",
         acorn:"“I do not do money,” says Magnus. “I do mourning.”"}},
    {id:'pathe',n:'Path east',r:[296,148,24,34],at:[306,162],v:{
      look:"The path east leads back to the Crossroads. It has not lost its place.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'paths',n:'Path south',r:[88,176,74,14],at:[120,184],v:{
      look:"The path south drops toward Mill Pond, with the faint smell of duck.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

ROOMS.pond={
  name:"Mill Pond",short:"Mill Pond",mx:0,my:2,walk:{x0:3,x1:317,y0:140,y1:186},
  arrive:function(first){return first?"Mill Pond. A stone mill, a lazy wheel, a pond with lily pads, and the distinct impression that the duck has seen you. The duck has seen you.":"Mill Pond again. The duck has not moved on, in any sense."},
  exits:[{side:'E',a:128,b:190,to:'garden'},{side:'N',a:80,b:120,to:'bridge'}],
  hot:[
    {id:'mill',n:'Mill',r:[2,34,58,84],at:[34,142],v:{
      look:"A little stone mill, long retired. The wheel still turns out of habit. Grain is optional.",
      hand:"You knock. Nobody answers. The mill has been on a break for twenty years.",
      talk:"You ask the mill if anyone is in. The mill, wisely, does not engage.",
      boot:"You kick the mill wall. It was built to last longer than you."}},
    {id:'wheel',n:'Water wheel',r:[40,88,36,34],at:[68,144],v:{
      look:"The wheel lifts water, drops it, and lifts it again, with the weary air of a job nobody negotiated.",
      hand:"You put a hand on the wheel. It lifts you slightly, then thinks better of it.",
      talk:"You ask the wheel how it is doing. It repeats itself, which is its whole reply.",
      boot:"You kick the wheel. It keeps turning, in the way of things that have heard worse."}},
    {id:'pond',n:'Pond',r:[124,104,160,34],at:[200,144],v:{
      look:"A broad, still pond. It reflects the sky, a stone mill, and your general sense of being watched by a duck.",
      hand:"You trail a finger in the water. The duck watches. Of course the duck watches.",
      talk:"You greet the pond. It ripples. The duck takes this personally.",
      boot:"You kick the pond. Water goes everywhere and none of it is satisfying."}},
    {id:'lily',n:'Lily pads',r:[150,110,112,18],at:[210,144],v:{
      look:"Lily pads. One has a flower, pink and entirely aware of itself.",
      hand:"You reach for the flower. The duck leans in. You withdraw. A flower is not worth a duck.",
      talk:"You compliment the flower. It does not blush. That is not what flowers do.",
      boot:"You consider kicking a lily pad, and decide on dignity."}},
    {id:'duck',n:'Duck',r:[212,100,50,26],at:[240,146],v:{
      look:"A duck. White, round and extremely judgmental. It looks at you as if you owe it bread and an apology.",
      hand:"You approach the duck. The duck approaches back. You retreat. The duck wins, as ducks do.",
      talk:"You say hello. The duck says nothing, loudly.",
      boot:"You do not kick the duck. Not because of morals. Because of ducks."}},
    {id:'reeds',n:'Reeds',r:[0,140,60,52],at:[40,162],v:{
      look:function(){return S.f.button?"Reeds, rustling. Nothing else in them now.":"Reeds, rustling, and certainly not hiding anything. Possibly a button, though."},
      hand:"You part the reeds. Mud. You close the reeds. The mud remains.",
      talk:"You say hello to the reeds. They nod in the breeze, in the way of those who never say what they know.",
      boot:"You kick the reeds. They sway back, as if nothing happened."}},
    {id:'button',n:'Button',r:[34,140,16,16],at:[42,160],show:function(){return !S.f.button},v:{
      look:"Something shiny winks from the reeds: a brass button, sitting alone in the mud.",
      hand:function(){return take('button','button',1,"You pluck the brass button from the mud. It has the look of something that was once part of an important coat.")}}},
    {id:'pathn',n:'Path north',r:[80,118,42,22],at:[100,144],v:{
      look:"The path north follows the bank toward a bridge, a river and the sound of sighing.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathe',n:'Path east',r:[296,150,24,36],at:[306,166],v:{
      look:"The path east leads back to the Gnome Garden and its unusually punctual fence.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

ROOMS.fairy={
  name:"The Fairy Ring",short:"Fairy Ring",mx:1,my:0,walk:WALK,
  arrive:function(first){return S.f.sparkle?"The Fairy Ring, glittering as if it means it.":(first?"The Fairy Ring, at dusk, which seems to be the only time it ever is. A circle of toadstools, a quiet hum, and a fairy asleep on the biggest mushroom. Everything glitters, but only half-heartedly.":"The Fairy Ring. The dusk is exactly where you left it.")},
  exits:[{side:'S',a:130,b:190,to:'cross'},{side:'W',a:128,b:190,to:'peak'},{side:'E',a:128,b:190,to:'falls'}],
  hot:[
    {id:'moon',n:'Moon',r:[246,16,26,26],at:[250,150],v:{
      look:"A moon, doing its job. It is always dusk here, and the moon has stopped asking why.",
      hand:"You reach for the moon. You are, in the end, a person standing in a clearing.",
      talk:"You greet the moon. It sails on, serene and unpaid.",
      boot:"You kick at the moon. Gravity, as usual, wins."}},
    {id:'ring',n:'Toadstools',r:[56,124,208,56],at:[100,176],v:{
      look:"A ring of toadstools: red caps, white spots, a faint hum. Stepping into one is traditionally a bad idea. You are standing at the rim, as tradition recommends.",
      hand:"You touch a cap. It is firm, faintly warm, and hums slightly, like a refrigerator that believes in magic.",
      talk:"You greet the toadstools. The hum rises a note, then politely falls again.",
      boot:"Kicking a fairy ring is the sort of thing that happens in the first line of a cautionary tale."}},
    {id:'fennel',n:'Fennel',r:function(){return S.f.wokeF?[158,92,42,36]:[142,102,38,34]},at:function(){return S.f.wokeF?[170,152]:[150,156]},v:{
      look:function(){return !S.f.wokeF?"A fairy, asleep on the biggest toadstool, mouth open, hair standing in several directions. Her wings are the colour of dishwater, and she looks like a battery that has been left in a drawer.":(S.f.sparkle?"Fennel, bright as a struck match, glittering from wingtip to toe. She looks like a very small firework that has decided to behave.":"Fennel: small, tired, grey, hovering like she is holding up a very low ceiling.")},
      hand:function(){return !S.f.wokeF?"You tap her shoulder. “Five more minutes,” she mumbles, and rolls over. In fairy terms, that is a firm no. Something louder is needed.":"You wave. Fennel waves back, slowly, in the way of someone being brave about it."},
      talk:function(){if(!S.f.wokeF)return "“Zzzz,” says the fairy, with total conviction. She is very deeply asleep. Something loud would help.";startDialog('fennel','start');return null},
      boot:"You do not kick a fairy. There are rules, and a long tradition of consequences."},
      u:{bell:wakeFennel,cone:feedFennel,
         compass:function(){return S.f.wokeF?(S.f.sparkle?"Fennel pats the compass. “Already done. Do not ask twice, or I'll want a tip.”":"“Later,” Fennel says. “Sparkle first. Always sparkle first.”"):"She sleeps through it. The compass needle spins, ashamed."},
         feather:"You tickle her with the feather. Fennel swats at it in her sleep and mutters, “Not the wings.” You move on."}},
    {id:'pathw',n:'Path west',r:[0,150,22,36],at:[10,170],v:{
      look:"The path west climbs into a bank of thick fog that looks at least as old as the mountain.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathe',n:'Path east',r:[298,150,22,36],at:[308,170],v:{
      look:"The path east follows the sound of rushing water, and a promise of rainbows.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'paths',n:'Path south',r:[130,176,60,14],at:[160,184],v:{
      look:"The path south drops back down to the Crossroads and its excessively opinionated signpost.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

ROOMS.falls={
  name:"The Waterfall",short:"Waterfall",mx:2,my:0,walk:WALK,
  arrive:function(first){return first?"The Waterfall. A thin silver ribbon drops off a tall cliff into a small, furious pool, with a rainbow behind it, as if someone ordered the full set. It is as loud as you hoped.":"The Waterfall. Still roaring, still dramatic, still unbothered."},
  exits:[{side:'S',a:190,b:270,to:'grove'},{side:'W',a:128,b:190,to:'fairy'},{side:'E',a:150,b:186,to:'owl'}],
  hot:[
    {id:'rainbow',n:'Rainbow',r:[110,36,100,90],at:[160,150],v:{
      look:"A rainbow with all seven colours and no pot of gold at the end of it. Hazel would be devastated.",
      hand:"You cannot touch a rainbow. People have tried.",
      talk:"You greet the rainbow. It arches, politely, over absolutely everything.",
      boot:"You kick at the rainbow. It is not there. You almost fall over."}},
    {id:'cliff',n:'Cliff',r:[216,0,104,34],at:[250,150],v:{
      look:"A tall, striped cliff, wearing a thin waterfall like a very expensive scarf.",
      hand:"It is a cliff. You are not going to climb it. You are an apprentice cartographer, not a goat.",
      talk:"You shout up at the cliff. It returns your words, slightly worse.",
      boot:"You kick the base of the cliff. The cliff makes no comment. The cliff is a cliff."}},
    {id:'falls',n:'Waterfall',r:[244,34,34,90],at:[262,150],v:{
      look:"A tall, perfectly vertical waterfall. It has never once been quiet about it.",
      hand:"You approach. The spray gives you a free shower and mild humility.",
      talk:"You shout hello. The waterfall shouts back, in a language that is entirely vowels.",
      boot:"You kick the spray. Your boot gets wet and your dignity gets wetter."}},
    {id:'pool',n:'Pool',r:[236,114,84,24],at:[270,150],v:{
      look:"A small, deep pool, bubbling like it has opinions. The edges are the colour of jewels and the middle is the colour of “do not”.",
      hand:"You dip a hand in. It is exactly as cold as “no”.",
      talk:"You greet the pool. It gurgles, which could be a hello or a complaint.",
      boot:"You kick the pool. It kicks back, in the form of spray."}},
    {id:'spoon',n:'Spoon',r:[214,124,18,14],at:[224,148],show:function(){return !S.f.spoon},v:{
      look:"Something silver glints between two rocks by the pool: a spoon, wedged and patient.",
      hand:function(){return take('spoon','spoon',1,"You work the silver spoon free of the rocks. Somewhere, someone is missing a teaspoon and does not yet know it.")}}},
    {id:'pathe',n:'Path east',r:[298,150,22,36],at:[308,170],v:{
      look:"The path east curls round the pool and into the woods, toward a lantern and a very large tree.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'pathw',n:'Path west',r:[0,150,22,36],at:[10,170],v:{
      look:"The path west leads back toward the Fairy Ring and its permanent dusk.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'paths',n:'Path south',r:[186,176,90,14],at:[230,184],v:{
      look:"The path south drops back toward the Grove, where an acorn is always counting.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

ROOMS.peak={
  name:"Misty Peak",short:"Misty Peak",mx:0,my:0,walk:WALK,
  arrive:function(first){return S.f.sparkle?"Misty Peak, with the fog politely stepping aside. Far below, the whole Vale lies in the sun, waiting to be drawn.":(first?"Misty Peak. A bare stone summit wrapped in fog thick enough to need a permit. Somewhere below is the whole Vale, and at present you can see none of it.":"Misty Peak. The fog has not improved. It has, if anything, doubled down.")},
  exits:[{side:'E',a:128,b:190,to:'fairy'},{side:'S',a:134,b:186,to:'bridge'}],
  hot:[
    {id:'fog',n:'Fog',r:[0,0,320,128],at:[160,150],v:{
      look:function(){return S.f.sparkle?"A thin fog, politely parted. Beyond it, the whole Vale lies gold and green and, for once, in view.":"Fog, dense and cold, with a faint tang of cartographer's frustration. You can see the end of your arm. Possibly."},
      hand:function(){return S.f.sparkle?"You wave a hand through the thin fog. It parts and closes again, like a very small curtain.":"You wave a hand through the fog. It closes behind you as if you had never been."},
      talk:"You shout into the fog. It returns nothing, but kindly, in the manner of fog.",
      boot:"You kick the fog. The fog accepts this, and so, regrettably, does your foot."}},
    {id:'cairn',n:'Cairn',r:[176,100,40,48],at:[196,154],v:{
      look:"A survey cairn, built by someone who really liked stacking things. A faded pennant flaps from the top. The flag is cartographer's red.",
      hand:"You add a stone to the cairn. It does not need it, but it takes the gesture well.",
      talk:"You greet the cairn. It is a pile of stones. It is a good pile of stones.",
      boot:"You consider kicking the cairn. You consider the long way down. You pat it instead."}},
    {id:'plaque',n:'Plaque',r:[110,128,38,22],at:[128,158],v:{
      look:"Chiselled into the stone: P. QUILL SURVEYED THIS VALE FROM HERE. Below, in a newer and much more hurried hand: DESCENT NOT RECORDED. You read that twice.",
      hand:"You rub the plaque. The letters are cold, and slightly smug.",
      talk:"You read the plaque aloud. The fog takes it, and gives nothing back.",
      boot:"You do not kick Master Quill's plaque. It might still be listening."}},
    {id:'pathe',n:'Path east',r:[298,150,22,36],at:[308,170],v:{
      look:"The path east drops back toward the Fairy Ring, in a manner one could call downhill.",
      hand:"You cannot pick up a path. People have tried."}},
    {id:'paths',n:'Path south',r:[134,178,52,12],at:[160,184],v:{
      look:"The path south drops down toward the bridge and a very large moose.",
      hand:"You cannot pick up a path. People have tried."}}
  ]
};

/* registry: map coordinates and short names for the first three */
ROOMS.cottage.mx=2;ROOMS.cottage.my=2;ROOMS.cottage.short='Cottage';
ROOMS.garden.mx=1;ROOMS.garden.my=2;ROOMS.garden.short='Gnome Garden';
ROOMS.cross.mx=1;ROOMS.cross.my=1;ROOMS.cross.short='Crossroads';
var ROOM_IDS=['cottage','garden','cross','grove','bridge','pond','fairy','falls','peak'];
