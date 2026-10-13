
/* ---------- the woods: Birch Trail, Tall Pines, Fox Hollow, Owl Tree, the Camp ---------- */
/* a loop: Squirrel Grove > Birch Trail > Owl Tree > Waterfall, with the Pines, Fox Hollow and the Camp off to the east */
var NOPICK="You cannot pick up a path. People have tried.";
ROOMS.birch={
  name:"Birch Trail",short:"Birch Trail",mx:3,my:1,walk:WALK,
  arrive:function(first){return first?"Birch Trail. A pale avenue of birches, all of them in yellow, all of them dropping leaves with the unhurried air of a profession. The path runs east and west, and a narrower one climbs north.":"Birch Trail. The leaves are falling in the same pattern as before, which is either choreography or a lack of imagination."},
  exits:[{side:'W',a:140,b:186,to:'grove'},{side:'E',a:140,b:186,to:'pines'},{side:'N',a:184,b:222,to:'owl'}],
  hot:[
    {id:'birches',n:'Birch trees',r:[0,0,320,134],at:[160,150],v:{
      look:"Tall white birches with black marks, like a forest of very patient bar codes. The crowns are gold, and the ground is going to be an enormous job for someone.",
      hand:"You pat a birch. A shower of leaves lands on your hat, which is exactly as helpful as it sounds.",
      talk:"You compliment the birches. They rustle, in unison, which is a little unsettling.",
      boot:"You kick a birch. Leaves fall. The tree remains calm, in the way of a tree that has been kicked before."}},
    {id:'marker',n:'Trail marker',r:[206,102,48,52],at:[226,162],v:{
      look:"A trail marker, hand-lettered: OWL TREE (NORTH). GROVE (WEST). PINES (EAST). Underneath, in smaller letters: DISTANCES APPROXIMATE. FEELINGS NOT INCLUDED.",
      hand:"You straighten the marker. It looks proud of itself for about two seconds.",
      talk:"You read the marker aloud. The marker has no opinion on your pronunciation.",
      boot:"You kick the marker. It rattles, then glares, in the way of signs."}},
    {id:'bench',n:'Log bench',r:[96,146,44,20],at:[118,174],v:{
      look:"A log bench, thoroughly upholstered in moss. Someone has carved a heart into it, then thought better of it and carved a smaller heart inside the first.",
      hand:"You sit for a moment. The bench is damp, and you are now damp. This is a form of rest.",
      talk:"You talk to the bench. It keeps your secrets, mainly because it is a log.",
      boot:"You kick the bench. It does not move, because it is a log, and a committed one."}},
    {id:'shrooms',n:'Mushrooms',r:[256,148,28,22],at:[270,178],v:{
      look:"A small cluster of toadstools in red and pink. They look edible and are probably very much not.",
      hand:"You reach for a mushroom and think of every warning anyone has ever given you. You take your hand back.",
      talk:"You greet the mushrooms. They are not a talking kind of mushroom.",
      boot:"You consider kicking the toadstools. They look back at you, in a way that feels like a dare."}},
    {id:'pathw',n:'Path west',r:[0,146,20,40],at:[10,170],v:{
      look:"The path west leads back to Squirrel Grove, where somebody is always counting.",
      hand:NOPICK}},
    {id:'pathe',n:'Path east',r:[298,146,22,40],at:[308,170],v:{
      look:"The path east slides into a darker, taller, pinier part of the woods.",
      hand:NOPICK}},
    {id:'pathn',n:'Path north',r:[184,104,36,46],at:[200,150],v:{
      look:"A narrower path climbs north, toward something marked OWL on a very confident arrow.",
      hand:NOPICK}}
  ]
};

ROOMS.pines={
  name:"Tall Pines",short:"Tall Pines",mx:4,my:1,walk:WALK,
  arrive:function(first){return first?"Tall Pines. The birches give up and the pines take over, close and dark and smelling like a very expensive candle. Light comes down in patches, as though it were being rationed.":"Tall Pines. The light is still rationed. The needles underfoot are still soft, and there are still a lot of them."},
  exits:[{side:'W',a:140,b:186,to:'birch'},{side:'N',a:250,b:282,to:'fox'},{side:'S',a:128,b:194,to:'camp'}],
  hot:[
    {id:'pinesall',n:'Pine trees',r:[0,30,320,100],at:[160,150],v:{
      look:"Tall, dark, extremely vertical pines. They have been growing in a straight line for a very long time and are not about to start asking questions.",
      hand:"You pat a pine. You get sap on your hand. It will be on your hand for the rest of the week.",
      talk:"You greet the pines. They sigh in the wind, which is quite a lot of sigh for such tall trees.",
      boot:"You kick a pine. The pine does not move. You will be feeling this for a while."}},
    {id:'bigpinel',n:'Big pine',r:[0,30,48,140],at:[56,176],v:{
      look:"An old, wide pine, with a trunk a family could picnic behind. Several families already have.",
      hand:"You lay a hand on the bark. It is warm, rough, and about three hundred years older than you.",
      talk:"You tell the pine your problems. It says nothing. It is, honestly, the best listener you have met.",
      boot:"You consider kicking a tree that has seen three centuries. You thank it for its service instead."}},
    {id:'bigpiner',n:'Big pine',r:[282,24,38,150],at:[290,180],v:{
      look:"A second big pine, on the east edge, standing guard over a bend in the path that ends in more pines.",
      hand:"You pat the pine. It does not mind, and does not say so either.",
      talk:"You greet the big pine. A cone drops onto your hat. You take it as a reply.",
      boot:"You kick the pine. A shower of needles falls on you, a small, polite punishment."}},
    {id:'register',n:'Trail register',r:[138,98,32,58],at:[152,164],v:{
      look:"A weatherproof box on a post, with a pencil on a string: TRAIL REGISTER. SIGN IN, SIGN OUT. Most entries are dull. One, in a careful, slanted hand: M. QUILL. DESTINATION: THE PEAK. EXPECTED BACK: BEFORE THE KETTLE. The date has been rubbed out by a thumb.",
      hand:"You sign in: W. (APPRENTICE). Under REASON FOR VISIT you write CARTOGRAPHY. Under EXPECTED BACK you write: EVENTUALLY.",
      talk:"You read the register aloud. The pines listen, like a very tall audience.",
      boot:"You do not kick the register. It contains names. It is practically a legal document."}},
    {id:'log',n:'Fallen log',r:[58,148,40,18],at:[78,176],v:{
      look:"A fallen pine, comfortably rotting, with a small, hopeful mushroom growing from it. It makes a good seat for someone who is not in a hurry.",
      hand:"You pat the log. It is damp and permanent, like an opinion.",
      talk:"You greet the log. It has fallen, and, as a result, has no comment.",
      boot:"You kick the log. A small beetle emerges to complain."}},
    {id:'pathw',n:'Path west',r:[0,148,22,40],at:[10,172],v:{
      look:"The path west leads back to the bright birches, and, eventually, to Squirrel Grove.",
      hand:NOPICK}},
    {id:'pathn',n:'Path north',r:[248,104,36,46],at:[266,152],v:{
      look:"The path north climbs toward a patch of light and a faint smell of fox. Possibly fox.",
      hand:NOPICK}},
    {id:'paths',n:'Path south',r:[124,176,76,24],at:[160,184],v:{
      look:"The path south drops toward a clearing where someone left their things.",
      hand:NOPICK}}
  ]
};

ROOMS.fox={
  name:"Fox Hollow",short:"Fox Hollow",mx:4,my:0,walk:WALK,
  arrive:function(first){return first?"Fox Hollow. A grassy hill with a door-shaped hole in it, and, in front of the door, a fox. The fox is asleep in a patch of sun, in the pose of someone who has had a very long and very successful morning.":"Fox Hollow. The fox is still asleep. If anything, more so."},
  exits:[{side:'W',a:148,b:182,to:'owl'},{side:'S',a:130,b:200,to:'pines'}],
  hot:[
    {id:'hill',n:'Hill',r:[150,48,170,86],at:[200,150],v:{
      look:"A round green hill, with a den in it. It has the lived-in look of a place that has been lived in by someone who does not tidy.",
      hand:"You pat the hill. It is warm in the sun, and slightly alive with ants.",
      talk:"You greet the hill. The hill has a resident and the resident is asleep.",
      boot:"You kick the hill. It remains a hill. The ants take notes."}},
    {id:'den',n:'Den',r:[236,96,52,36],at:[250,150],v:{
      look:"A neat round door in the hillside, framed with roots. Inside it is dark, tidy, and slightly warm. A very small mat reads: WIPE YOUR PAWS.",
      hand:"You peer into the den. Two rows of acorn caps are lined up inside, in what you can only describe as an exhibit.",
      talk:"You call into the den. It echoes, warmly, with a faint smell of fox and apples.",
      boot:"You consider kicking in a stranger's front door. You consider the stranger. You consider the stranger's teeth."}},
    {id:'fox',n:'Fox',r:[208,124,50,26],at:[210,162],v:{
      look:"A red fox curled in the sun, one ear flicking, nose tucked under a very large tail. He is dreaming of something, and from the twitching, he is winning.",
      hand:"You reach toward the fox. One ear turns, one eye opens a crack, and shuts. It is the nearest thing to a warning that a fox can give you while asleep.",
      talk:"You say hello to the fox. “Mm,” says the fox, without waking, “not now. Chasing. Important.” His paws twitch.",
      boot:"You consider kicking a sleeping fox. The fox's tail twitches. Not a threat, merely an observation."}},
    {id:'log',n:'Fallen log',r:[24,148,66,20],at:[58,174],v:{
      look:"A long mossy log with a small fern growing out of it. A very small, very green bench for a very small, very green meeting.",
      hand:"You pat the log. The fern bobs politely.",
      talk:"You greet the log. The fern waves.",
      boot:"You kick the log. A grumpy beetle stomps out, glares at you, and goes back in."}},
    {id:'ferns',n:'Ferns',r:[272,160,46,30],at:[290,190],v:{
      look:"A cluster of lush green ferns. They look like they are getting ready to unfurl something.",
      hand:"You brush the ferns. They tickle, and then they tickle back.",
      talk:"You greet the ferns. They bow, slightly.",
      boot:"You kick the ferns. They sway in a way that suggests quiet judgement."}},
    {id:'paths',n:'Path south',r:[124,176,80,24],at:[160,184],v:{
      look:"The path south returns to the Pines and their rationed light.",
      hand:NOPICK}},
    {id:'pathw',n:'Path west',r:[0,148,22,34],at:[10,166],v:{
      look:"The path west winds back toward a large hollow tree with a lantern. Someone is probably sleeping there.",
      hand:NOPICK}}
  ]
};

ROOMS.owl={
  name:"Owl Tree",short:"Owl Tree",mx:3,my:0,walk:WALK,
  arrive:function(first){return first?"Owl Tree. A huge hollow oak with a lantern hanging from one branch, a ladder with no real ambitions, and a sign. In the hollow, an owl sleeps, with a very particular expression of someone who has been asked a question at the wrong time of day.":"Owl Tree. The owl is asleep. The lantern is lit. Neither of them has moved."},
  exits:[{side:'W',a:148,b:184,to:'falls'},{side:'E',a:148,b:184,to:'fox'},{side:'S',a:166,b:228,to:'birch'}],
  hot:[
    {id:'tree',n:'Hollow oak',r:[140,16,96,126],at:[190,152],v:{
      look:"A huge, hollow, ancient oak. The kind of tree people name, and then regret naming, and then name again.",
      hand:"You press a hand to the bark. It is warm, and breathing is not impossible.",
      talk:"You compliment the oak. A large leaf drops, apparently in thanks.",
      boot:"You consider kicking the oak. You consider the owl. You pat the oak."}},
    {id:'owl',n:'Owl',r:[170,58,36,38],at:[186,152],v:{
      look:"A big grey-brown owl asleep in the hollow, with an expression of eternal disappointment. A small label reads: DO NOT DISTURB. ENQUIRIES AFTER DARK.",
      hand:"You reach toward the owl. One eye opens, regards you with great weariness, and closes. You withdraw your hand.",
      talk:"“Who,” says the owl, one eye barely open. “Wren,” you say. “Not what I asked,” says the owl. The eye closes. The conversation is over, and so, apparently, were you.",
      boot:"You consider kicking an owl. The owl considers you. The owl considers pellets. You decide against it."}},
    {id:'ladder',n:'Ladder',r:[156,84,26,62],at:[168,154],v:{
      look:"A ladder leaning against the tree. Each rung has been labelled in tiny letters: NO. NO. NO. MAYBE. NO.",
      hand:"You test the ladder. It wobbles in a way that has already made its decision.",
      talk:"You greet the ladder. It creaks, politely, but not in a way that suggests agreement.",
      boot:"You kick the ladder. It rattles, and the owl's eye twitches. You stop."}},
    {id:'lantern',n:'Lantern',r:[248,38,18,32],at:[240,152],v:{
      look:"A brass lantern hanging from a bough, lit, even in the daytime. It flickers at intervals, as if embarrassed.",
      hand:"You cannot reach the lantern. It is far too high and, you suspect, far too proud.",
      talk:"You speak to the lantern. It flickers once. Possibly a no.",
      boot:"You do not kick a lantern. A burning thing hung from a tree is not a good thing to kick."}},
    {id:'sign',n:'Sign',r:[28,98,66,26],at:[62,164],v:{
      look:"OFFICE HOURS: NIGHT. Beneath, in smaller letters: NO WALK-INS. Beneath that, smaller still: ESPECIALLY NOT ONES WHO ASK “WHO”.",
      hand:"You straighten the sign. It tilts back to precisely where it was, and, you suspect, to precisely where the owl wants it.",
      talk:"You read the sign aloud. The owl's eyelid twitches, once. You stop.",
      boot:"You kick the post. The sign swings once, and a very small voice from the hollow says: “Hours.”"}},
    {id:'pellets',n:'Pellets',r:[110,156,52,14],at:[134,176],v:{
      look:"A tidy row of owl pellets, each labelled with a tiny tag: MOUSE, VOLE, BEETLE, UNKNOWN (REGRETTABLE).",
      hand:"You decline to touch the pellets. They are for research, and the owl does not seem to have invited you to join.",
      talk:"You greet the pellets. They are, thankfully, not talkative.",
      boot:"You kick at the pellets. They roll a little, and a label drops off. Someone is going to be very annoyed."}},
    {id:'pathw',n:'Path west',r:[0,148,22,38],at:[10,168],v:{
      look:"The path west follows the sound of falling water, round to the Waterfall.",
      hand:NOPICK}},
    {id:'pathe',n:'Path east',r:[298,148,22,38],at:[308,168],v:{
      look:"The path east leads toward a sunny hill, where, from the smell of it, someone is sleeping off a morning.",
      hand:NOPICK}},
    {id:'paths',n:'Path south',r:[160,176,70,24],at:[196,184],v:{
      look:"The path south drops back into the Birch Trail, in a shower of yellow leaves.",
      hand:NOPICK}}
  ]
};

ROOMS.camp={
  name:"The Camp",short:"The Camp",mx:4,my:2,walk:WALK,
  arrive:function(first){return first?"The Camp. A clearing with a tent, a fire ring, a clothesline, and no campers. The fire is cold, mostly. The sign says OCCUPIED. Nobody has been seen. It all has the look of an afternoon that has been put on hold.":"The Camp. Still empty. Still occupied, according to the sign."},
  exits:[{side:'N',a:140,b:194,to:'pines'}],
  hot:[
    {id:'tent',n:'Tent',r:[22,94,90,60],at:[66,164],v:{
      look:"A grey canvas tent, patched with red and yellow patches of different cloths, and an overall look of stubbornness. A tag on the flap reads: OCCUPIED (BY SPIDERS).",
      hand:"You lift the flap an inch. Eight eyes, times several, look back. You lower the flap with great respect.",
      talk:"You call into the tent. A small, many-legged committee falls silent.",
      boot:"You kick the tent. It billows. A voice from inside says: “Not now.” You do not ask whose voice."}},
    {id:'fire',n:'Fire ring',r:[140,128,40,30],at:[160,170],v:{
      look:"A ring of stones around a mostly cold fire, with a small iron pot on a tripod. A thin thread of smoke says that someone was here very recently, or that the fire is an optimist.",
      hand:"You hold a hand near the embers. Warm, but not warm enough to be anyone's fault.",
      talk:"You greet the fire. It crackles. It is not a conversation, but it is a start.",
      boot:"You kick at the stones. One rolls. You put it back, before it becomes a lesson."}},
    {id:'logl',n:'Log seat',r:[98,156,40,16],at:[118,180],v:{
      look:"A log, arranged for sitting, with a cushion of moss that has been sat on so long it has learned the shape of the sitter.",
      hand:"You sit on the log. It is surprisingly comfortable. You stand up before it gets ideas.",
      talk:"You greet the log. A leaf falls from it, which is the best a log can do.",
      boot:"You kick the log. It is firmer than it looks."}},
    {id:'logr',n:'Log seat',r:[188,158,40,16],at:[208,180],v:{
      look:"A second log, facing the fire, with a single teacup resting on it. The cup is cold. A small label says: PLEASE LEAVE FOR MASTER.",
      hand:"You leave the cup. You are fairly sure that is what the label wanted.",
      talk:"You greet the log. It is not the one who left the cup.",
      boot:"You kick the log. The cup rattles. You stop, apologetic."}},
    {id:'line',n:'Clothesline',r:[228,98,76,58],at:[262,166],v:{
      look:"A clothesline stretched between two poles, with exactly one sock on it. The sock is red, and has been there long enough to feel at home.",
      hand:"You touch the sock. It is dry, stiff and quite resigned. You leave it where it hangs.",
      talk:"You greet the sock. The sock does not say a thing. It is a sock.",
      boot:"You kick the pole. The sock swings, once, with grim composure."}},
    {id:'sign',n:'Sign',r:[178,116,56,24],at:[200,162],v:{
      look:"CAMPSITE. OCCUPIED. Underneath, in smaller letters: PLEASE DO NOT FEED THE OCCUPANTS. Beneath that, smaller still, in red: THEY KNOW.",
      hand:"You straighten the sign. Something in the tent shifts, as if unwilling to be seen.",
      talk:"You read the sign aloud. The tent flap trembles, just slightly.",
      boot:"You kick the sign post. A small voice from the tent says: “Rude.”"}},
    {id:'pathn',n:'Path north',r:[132,98,70,50],at:[165,140],v:{
      look:"The path north climbs back toward the Pines and their rationed light.",
      hand:NOPICK}}
  ]
};

ROOMS.birch.mx=3;ROOMS.birch.my=1;
ROOM_IDS.push('birch','pines','fox','owl','camp');
