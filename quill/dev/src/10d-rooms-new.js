
/* ---------- 0.6 rooms: the Apple Orchard, the Reed Marsh, and the caves under Fox Hollow ---------- */
/* hsp = hotspot: id, name, rect, stand-at, then the four verb replies (look, hand, talk, boot), then optional item uses */
function hsp(id,n,r,at,look,hand,talk,boot,u){var h={id:id,n:n,r:r,at:at,v:{look:look,hand:hand,talk:talk,boot:boot}};if(u)h.u=u;return h}

ROOMS.orchard={
  name:"The Apple Orchard",short:"Apple Orchard",mx:3,my:2,walk:WALK,
  arrive:function(first){return first?"The Apple Orchard. Rows of dwarf apple trees, pruned to a height where nobody needs a ladder, and one tree with a ladder anyway. A scarecrow stands guard. Nobody asked it to.":"The Apple Orchard. Somewhere an apple lets go of its branch, and thinks about it all the way down.";},
  exits:[{side:'W',a:128,b:190,to:'cottage'},{side:'N',a:156,b:196,to:'birch'},{side:'E',a:128,b:190,to:'camp'}],
  hot:[
    hsp('rows','Apple trees',[0,70,320,50],[160,150],
      "Rows of dwarf apple trees, all of them the size of a sensible adult, all of them heavy with fruit. Somebody has been very patient here, and the apples know it.",
      "You reach for an apple. It is hard, red, and just out of reach, exactly as apples are.",
      "You tell the trees they are doing well. Several apples fall, which could be applause.",
      "You consider kicking a tree to shake down an apple. The tree, a dwarf, looks at you with the patience of someone who has been dismissed for their height before."),
    hsp('treeL','Big apple tree',[8,70,54,76],[60,156],
      "The big apple tree has a ladder leaning on it, which is, somehow, not helping. The ladder is about nine rungs shy of the good apples.",
      "You test the ladder. It wobbles in a way that suggests a long history of near misses. You decide that apples are not worth it.",
      "You greet the tree. It rustles, and a small apple lands at your feet, with the air of a polite refusal.",
      "You kick the ladder. It kicks back, in the way of ladders, with its rungs."),
    hsp('treeR','Big apple tree',[268,70,56,76],[276,154],
      "A big old apple tree, bent a little to the east, as though it has been listening to something over there for years.",
      "You pat the trunk. A single leaf drifts down and lands on your hat, which accepts it.",
      "You ask the tree about the camp to the east. It leans a little further east.",
      "You kick the trunk. An apple drops directly on your toe, a small and fair reply."),
    hsp('scarecrow','Scarecrow',[216,84,40,52],[236,148],
      "A scarecrow in a purple shirt, wearing a green hat with a red feather. It is a very good hat. It is, in fact, remarkably like yours. You feel seen, and not entirely comfortably.",
      "You straighten its hat. It does not thank you, but it does look more confident, which is probably worse.",
      "You say hello. The scarecrow says nothing, with an air of someone who has been told to guard something and has decided to take that seriously.",
      "You consider kicking the scarecrow. It has your hat, and this feels like a conflict of interest."),
    hsp('hives','Beehives',[96,114,40,26],[112,150],
      "Two small wooden beehives, painted a hopeful yellow. The bees go in and out with the brisk air of people who have a deadline.",
      "You reach for the hive. A single bee hovers in front of your hand, and looks at it, and looks at you. You take your hand back.",
      "You say hello to the bees. They ignore you politely, in the manner of the very busy.",
      "You consider kicking a beehive. This is the single most reliable way to be shown the bees' complete vocabulary."),
    hsp('sign','Signpost',[156,100,46,32],[176,146],
      "The signpost reads: BIRCH TRAIL (NORTH). COTTAGE (WEST). CAMP (EAST). Underneath, in smaller letters: THE APPLES ARE NOT A DIRECTION.",
      "You straighten the signpost. It points exactly where it did before, now with more conviction.",
      "You read the sign out loud. The apples, it must be said, remain undirectional.",
      "You kick the post. It stays put, in the manner of signposts, and points exactly where it did before."),
    hsp('barrow','Wheelbarrow',[112,168,56,26],[140,184],
      "A wheelbarrow loaded with apples and a very small, very dented trowel. Not your trowel. Another trowel. This is a gardening neighbourhood.",
      "You tip the barrow a little. Apples roll. You put it right, with the care of someone who has seen what happens next.",
      "You ask the wheelbarrow if it needs a hand. It does not, but it has the good manners not to say so.",
      "You kick the wheelbarrow. It rolls a metre and stops, in a way that feels like forgiveness."),
    hsp('bench','Bench',[212,166,46,30],[232,186],
      "A bench with a basket of apples beside it. Whoever sat here last left an apple core on the arm, with the satisfied look of an apple core that has seen it all.",
      "You sit on the bench. It is comfortable, and it is warm, and a small bee lands on your knee, completes its business, and leaves.",
      "You talk to the bench. It is a bench, and it has heard worse.",
      "You kick the bench. It does not move, and your foot has opinions about that."),
    hsp('basket','Basket of apples',[260,184,20,12],[268,186],
      "A basket of apples, picked and sorted. The ones on top are red and the ones underneath, you suspect, are a different story.",
      "You take an apple, consider it, and put it back. Someone has counted these, and you can tell.",
      "You ask the apples how they are. They are very well, and a little round about it.",
      "You decide against kicking a basket of apples. You are not a monster.")
  ]
};

ROOMS.marsh={
  name:"The Reed Marsh",short:"Reed Marsh",mx:0,my:3,walk:WALK,
  arrive:function(first){return first?"The Reed Marsh. A boardwalk wanders across still water, past cattails taller than a gnome, and the entire place is, very softly, rehearsing. The frogs are doing scales. A heron supervises.":"The Reed Marsh. The frogs are on the same line of the same song as before. They are, as ever, almost there.";},
  exits:[{side:'N',a:140,b:196,to:'pond'}],
  hot:[
    hsp('water','Marsh water',[0,78,320,68],[160,150],
      "Still, shallow, and the colour of tea that has been thinking. Lily pads dot it like small green coasters.",
      "You trail a hand in the water. A fish, offended, leaves. You promise to be more thoughtful.",
      "You ask the water if it needs anything. It reflects on this.",
      "You consider kicking the marsh. This is a very good way to meet the marsh."),
    hsp('frog1','Frog',[40,98,28,20],[60,148],
      "A small green frog on a lily pad, breathing in a way that suggests it is preparing to say something important.",
      "You reach for the frog. It hops to the next pad, with the dignity of a soloist who has been interrupted.",
      "You say hello. The frog considers you, then inflates its throat and delivers a single, enormous, completely unnecessary note.",
      "You consider kicking a frog. A frog would only choir about it later."),
    hsp('frog2','Frog',[248,106,28,20],[260,148],
      "Another frog, on another pad, singing a harmony nobody else is singing. This is the alto. The alto is always out of step, and it knows.",
      "You reach for the frog. It stares, unblinking, at your hand, until you remove it.",
      "You compliment the frog. It puffs up, and sings the same note, only prouder.",
      "You decline to kick the alto. Someone has to hold the harmony together."),
    hsp('frog3','Frog',[100,122,28,18],[112,148],
      "A frog on the boardwalk, in the pose of someone who has missed rehearsal and has a very good reason.",
      "You nudge the frog. It hops once and settles an inch to the left, in the manner of someone who would have moved anyway.",
      "You ask the frog where it was. “Ribbit,” it says, in a tone suggesting a long and complicated story.",
      "You step carefully around the frog. Boot discipline."),
    hsp('heron','Heron',[266,88,40,66],[270,150],
      "A grey heron on one leg, absolutely still, with the expression of an inspector. It is not fishing. It is auditing.",
      "You reach toward the heron. It turns one eye on you, and the eye says: not now, and possibly not ever.",
      "You say hello. The heron looks at the water. It is the loudest possible rebuff in heron.",
      "You think about kicking the heron. The heron, which has seen you think about it, begins to think about it too."),
    hsp('sign','Marsh sign',[20,136,56,24],[48,172],
      "A hand-painted sign: FROG CHOIR REHEARSAL IN PROGRESS. PLEASE HOLD APPLAUSE. Underneath, smaller: (ALSO THE ALTO.)",
      "You straighten the sign. A frog, somewhere, croaks approval, or something similar.",
      "You read the sign out loud, quietly, out of respect for the choir.",
      "You do not kick a sign asking for quiet. The frogs are watching."),
    hsp('cattails','Cattails',[0,160,44,40],[22,186],
      "Cattails, tall and brown and extremely sure of themselves, nodding along with the frogs, a beat late.",
      "You stroke a cattail. A cloud of fluff erupts, and you spend a while being quietly, thoroughly fluffy.",
      "You greet the cattails. They bow, together, in a way that looks rehearsed.",
      "You kick a cattail. It bends, and returns, and releases more fluff in your direction, as a reply.")
  ]
};

ROOMS.burrow={
  name:"The Fox's Burrow",short:"Fox's Burrow",mx:4,my:-1,walk:WALK,
  arrive:function(first){return first?"You step carefully past the fox's tail and through the round door. Behind you, he mutters “chasing,” and does not wake. Inside: a burrow so tidy that you wipe your boots on principle. Shelves, a lamp, an armchair with the shape of one particular fox worn into it, and two tunnels leading off into the dark.":"The Fox's Burrow. Still tidy, still warm, still smelling of fox and apples. The lamp flickers, as though it is trying to remember where it put something.";},
  exits:[{side:'S',a:130,b:200,to:'fox'},{side:'W',a:136,b:186,to:'cavern',soft:true},{side:'N',a:262,b:300,to:'mine',soft:true}],
  hot:[
    hsp('shelves','Shelves',[22,54,76,70],[60,160],
      "Shelves of acorn caps, arranged by size, then by colour, then by what appears to be regret. A tiny label on the middle shelf: EXHIBIT B. EXHIBIT A IS ELSEWHERE.",
      "You straighten a cap. The whole shelf shudders in alarm. You step back with your hands in the air.",
      "You ask the caps who collected them. They are caps. They are not talking, and they are very neatly arranged about it.",
      "You do not kick a fox's exhibit. You are a guest, uninvited, in a very tidy home."),
    hsp('cert','Certificate',[110,34,42,30],[130,160],
      "A framed certificate: CERTIFICATE OF EXCELLENCE IN CHASING (THINGS). AWARDED TO: FOX. SIGNED: ALSO FOX. A small gold seal has been pressed in, with great care and some self-regard.",
      "You straighten the frame. It was already straight. The certificate gives you a look that suggests it has done this before.",
      "You congratulate the certificate. You feel, for some reason, that you have been outranked.",
      "You consider kicking a certificate. You would have to climb something, and the certificate has the better argument."),
    hsp('lamp','Lamp',[164,60,20,70],[160,150],
      "A tall, warm lamp, burning something small and golden. It gives the room a cosy, late-afternoon look, and the impression that it is always, about, four.",
      "You warm your hands on the lamp. It does not burn you. It does, however, seem to know what you are thinking.",
      "You ask the lamp if the fox is a good tenant. It flickers in a way that could mean yes.",
      "You consider kicking a lit lamp. You consider the room, and the fox, and the carpet. You do not."),
    hsp('chair','Armchair',[188,92,64,44],[220,162],
      "A big red armchair, worn smooth in the exact shape of a fox with a book. On the arm, a small mug and a very small pair of reading glasses. You feel like you should apologise just by looking.",
      "You sit in the armchair. It fits you very badly, and you leave with the odd feeling of having tried on someone else's life.",
      "You say hello to the chair. It has been waiting all day for someone worthy of it, and it is not you.",
      "You do not kick a fox's armchair. The fox does not need this on his conscience."),
    hsp('tunnelN','Back tunnel',[258,88,46,46],[282,142],
      "A smaller tunnel at the back of the burrow, with a bit of old rail running into the dark. Someone has hung a sign: STAFF ONLY. (THE STAFF IS ALSO THE FOX.)",
      "You step toward the tunnel. It smells of cold stone and old tin. Walk on in, if you dare.",
      "You call into the tunnel. A very long time later, the tunnel replies, in your own voice, slightly improved.",
      "You kick the tunnel entrance. The tunnel absorbs it without comment, in the manner of a tunnel."),
    hsp('tunnelW','West tunnel',[0,118,30,72],[24,160],
      "A round tunnel leading west into the dark. A hand-lettered sign: TO THE GLOW. MIND YOUR HEAD. (GUESTS: YOUR HEAD IS NOT OUR PROBLEM.) A faint blue light comes from far down.",
      "You step toward the tunnel. The air is cool and a little damp. Walk on in; the glow is waiting.",
      "You call into the tunnel. Something far off, bluish, hums back, so faintly that it might just be you.",
      "You kick the tunnel wall. A little dirt falls. The tunnel, which was already tidy, asks you to be tidier.")
  ]
};

ROOMS.cavern={
  name:"Glowcap Cavern",short:"Glowcap Cavern",mx:3,my:-1,walk:WALK,
  arrive:function(first){return first?"Glowcap Cavern. The tunnel opens into a cave full of giant mushrooms, each of them glowing a different colour, like a very small, very odd city after dark. Spores drift upward in the light, politely. A thin stream runs along the back wall. It says nothing, which seems to be the local custom.":"Glowcap Cavern. Every mushroom is lit. None of them has a switch.";},
  exits:[{side:'E',a:136,b:186,to:'burrow'},{side:'N',a:142,b:176,to:'lake',soft:true}],
  hot:[
    hsp('shaft','Light shaft',[120,0,90,118],[160,150],
      "A thin pale shaft of daylight from a crack far above. It lands on the floor in a perfect, unlikely circle, and the nearest mushrooms lean toward it like a very small congregation.",
      "You put a hand in the light. It is warm, which is something you did not expect to be pleased about.",
      "You call up the shaft. A bird, somewhere, replies. You choose to believe it was a reply.",
      "You kick the light. Light, it must be said, is not very kickable."),
    hsp('capsL','Giant glowcaps',[8,84,76,80],[96,166],
      "A pair of enormous mushrooms, one pink and one blue, glowing in alternation. They seem to be having a quiet disagreement about which of them is the brighter. The pink one is winning, but only just.",
      "You touch a cap. It is cool and faintly springy, and a small sigh of spores floats out. You decide, firmly, not to breathe in.",
      "You say hello. The mushrooms brighten, in turn, as though each wants you to think it is the one you meant.",
      "You consider kicking a giant mushroom. It would be a very soft kick, and a very long afternoon."),
    hsp('capsR','Giant glowcaps',[226,80,84,88],[236,166],
      "Two more big mushrooms, one cyan, one magenta, standing by the cave's eastern tunnel. The cyan one is large and calm. The magenta one is smaller, and keeping pace.",
      "You pat the big cyan cap. It lights a little brighter, in the way of someone who likes being patted and would prefer you did not mention it.",
      "You tell the mushrooms about your day. They listen with great attention, the way mushrooms do, which is to say, silently and with a faint glow.",
      "You do not kick the cyan mushroom. It is larger than you, and you can see it thinking."),
    hsp('smallcaps','Small glowcaps',[176,164,40,28],[196,186],
      "A little cluster of small glowcaps, pink and green, at the foot of the big ones. They look like children who have been told to wait quietly.",
      "You stroke a tiny cap. It brightens, startled, and then it brightens further, as though you had told it a secret.",
      "You greet the small mushrooms. One of them glows twice, which may be a wave.",
      "You step carefully around the little ones. Some things are not for kicking."),
    hsp('stream','Stream',[0,112,320,22],[160,142],
      "A thin, dark stream along the back wall. It runs from somewhere to somewhere else, with the efficient air of someone who has been told there is a meeting.",
      "You dip a hand in. It is very cold and very clear. A small bright fish looks at you, then at your hand, and leaves.",
      "You greet the stream. It says “shh”, not unkindly.",
      "You do not kick a stream. It would only end up in your boot."),
    hsp('archN','Passage north',[134,104,48,32],[158,144],
      "A dark, rounded passage leading north, with the cool air of somewhere large and wet. A faint, slow ripple of light moves along the far wall, like a very distant, very calm sea.",
      "You step toward the passage. The air smells of still water and coin. Walk on in.",
      "You call into the passage. A long time later, a faint “plink” returns, as a drip hits something.",
      "You kick the tunnel mouth. A little pebble clatters in. It takes a long time to land."),
    hsp('tunnelE','Tunnel east',[296,120,24,64],[306,160],
      "The tunnel east, lit with warm lamplight. At its end you can just see the tidy edge of a rug. The fox is a tidy fox.",
      "You step toward the tunnel. It is warm in there, and, faintly, it smells of apples. Walk on in.",
      "You call down the tunnel. Very faintly, from the hill above, a fox mutters “chasing” in his sleep. The tunnel is a very good listener.",
      "You do not kick the fox's hallway. He has asked for very little.")
  ]
};

ROOMS.lake={
  name:"Lantern Lake",short:"Lantern Lake",mx:3,my:-2,walk:{x0:3,x1:317,y0:146,y1:186},
  arrive:function(first){return first?"Lantern Lake. A great, still underground lake, black as a slate and lit only by a lantern on a post, a rim of tiny lights on the far shore, and the stalactites above, dripping slowly into their own reflections. A small rowboat waits at a short dock. Nothing has any intention of hurrying.":"Lantern Lake. The water is flat. The lantern burns. A drop falls from somewhere and makes one ring, and that is the event of the day.";},
  exits:[{side:'S',a:130,b:200,to:'cavern'},{side:'E',a:148,b:186,to:'mine'}],
  hot:[
    hsp('lake','The lake',[0,80,320,66],[160,150],
      "A vast, black, glassy lake. On its far side there are tiny lights, in a long line, like a village going to bed. You cannot tell how far they are. The lake offers no assistance.",
      "You trail a hand in the lake. It is so cold that your hand leaves the water first and does not consult you.",
      "You call across the water. The cave carries it, and returns it, turned a little fainter and more sincere.",
      "You kick a pebble into the lake. A tiny, perfect ring spreads out, and you feel you have contributed."),
    hsp('boat','Rowboat',[98,118,56,26],[118,150],
      "A little wooden rowboat tied to the dock. There are no oars. A tag on the rope reads: OARS ON LOAN. RETURN POLICY: ORAL.",
      "You tug the boat's rope. The boat nods, and drifts back. It is not going anywhere without oars, and you have reached an understanding.",
      "You ask the boat where it goes. The boat, which has no oars and no opinions, rocks politely.",
      "You do not kick a boat. It is, regrettably, the only one."),
    hsp('dock','Dock',[38,98,46,56],[60,150],
      "A short wooden dock, running into the black water, with a post at either corner and a faint smell of old rope. Someone has stood here for a long time, looking at the far lights, and decided to go home.",
      "You walk onto the dock. It creaks, thoughtfully. You step back off, having made your point.",
      "You say hello to the dock. A plank answers, with a small, wooden “creak”.",
      "You kick the dock. The dock, which has been kicked before, returns the favour with a splinter."),
    hsp('lantern','Lantern post',[246,96,24,60],[258,152],
      "A tall post with a lantern at the top, burning a warm yellow. It is the only thing in the cave that has any interest in being found.",
      "You hold your hands to the lantern. Warm, brief, welcome.",
      "You say hello to the lantern. It flickers, which in lantern is “hello”.",
      "You do not kick a lantern post. It is the only light, and you are a guest."),
    hsp('fish','Lantern fish',[150,106,100,30],[190,150],
      "A small pale fish with a lantern of its own on a stalk above its head, drifting about the lake with the unhurried air of someone off the clock. The lantern is dim. It is, you gather, a day off.",
      "You reach for the fish. It drifts, with enormous calm, one hand's width out of reach. It has done this to bigger hands than yours.",
      "You greet the fish. It looks at you, glows once, in a tone that suggests it is not on duty, and goes back to drifting.",
      "You consider kicking a fish that is in a lake. You are on the wrong side of this arrangement."),
    hsp('sign','Ferry sign',[148,136,60,22],[178,172],
      "A sign on a post: FERRY: BACK AT 5. (WHICH 5? ASK THE FERRYMAN.) Underneath, in different handwriting: FERRYMAN: ALSO OUT.",
      "You straighten the sign. The ferryman is still out, and the sign is still, in all things, correct.",
      "You read the sign out loud. The lake, as it turns out, has also been waiting.",
      "You do not kick the ferry sign. Every dispute at this lake is already being handled somewhere else."),
    hsp('farshore','Far shore',[0,76,320,14],[160,150],
      "A long thin line of tiny lights, very far off: a distant shore, or a village, or a great many small and patient mushrooms. It is a very long way across, and the lights do not appear to be coming closer.",
      "You cannot reach it. It is, as far as you can tell, a very long swim, and you have a hat.",
      "You call to the far shore. Nothing answers, but one of the lights seems to brighten, politely.",
      "You do not kick the far shore. It is much too far, and you have a very good boot.")
  ]
};

ROOMS.mine={
  name:"The Old Quartz Mine",short:"Old Mine",mx:4,my:-2,walk:WALK,
  arrive:function(first){return first?"The Old Quartz Mine. Timber frames, a pair of rails, a cart full of rocks, and a great pile of rubble at the end, where the tunnel gave up. Two lanterns burn on the beams. Somebody is keeping them lit, and you suspect that somebody is not here.":"The Old Quartz Mine. The lanterns flicker. The rubble stays exactly where it was, and appears to prefer it that way.";},
  exits:[{side:'W',a:146,b:186,to:'lake'},{side:'S',a:140,b:200,to:'burrow'}],
  hot:[
    hsp('rubble','Cave-in',[108,38,168,90],[196,150],
      "A great pile of rubble, filling the tunnel from side to side. On a board stuck into the top, in chalk: NOT YET. Beside it, on a beam, in smaller chalk: M.Q. — 4 DAYS. And then, smaller still, an arrow pointing at the rubble, and: OOPS.",
      "You push the rubble. It does not move, with the confident air of a pile that has done this before.",
      "You call to the rubble. “Not yet,” the rubble does not say, in a very rubble-like way.",
      "You kick a rock. It is a rock. It has been waiting for this. Your toe has not."),
    hsp('cart','Mine cart',[176,148,58,38],[204,186],
      "A little iron mine cart on the rails, full of rocks and, on top, one acorn. Or possibly one very acorn-shaped rock. It is hard to say which.",
      "You pick up the acorn. It is a rock, a very good acorn-shaped one, and you put it back, with dignity.",
      "You greet the cart. It rolls slightly, in a way that might be a nod and might be the slope.",
      "You kick the cart. It rolls an inch, as a courtesy, and stops."),
    hsp('pick','Pickaxe',[260,134,28,46],[272,184],
      "A pickaxe stuck in the floor, with a very small hat on top: a mining tradition, or somebody's idea of a coat rack. The hat is tiny and brown and is wearing it well.",
      "You try the pickaxe. It does not move, and neither, you understand, are you required to.",
      "You greet the pickaxe. The hat tips, very slightly, in a draught.",
      "You consider kicking a pickaxe. This is a tool whose entire purpose is a very bad day for the thing it is used on."),
    hsp('sign','Mine sign',[34,38,56,26],[62,150],
      "A sign nailed to a beam: MULCH & SONS. HOLE IN THE GROUND. EST. LAST TUESDAY. CLAIM STAKED. KEEP OUT. (THE SONS ARE OUT.)",
      "You straighten the sign. A small piece of the beam falls off. It seems to be agreeing with the sign.",
      "You read the sign out loud. The tunnel offers no sons, and no mulch.",
      "You kick the beam. A small cloud of dust falls on your hat. The beam, you gather, does not take claims lightly."),
    hsp('lamps','Lanterns',[84,50,22,32],[96,150],
      "Two lanterns, hung from the beams, burning with a steady, tidy yellow. Somebody is trimming the wicks. It is not you, and it is nobody you can see.",
      "You reach for a lantern. It is too high, and in any case the lantern, you suspect, is somebody's job.",
      "You greet the lanterns. They flicker, in a way that suggests they have an opinion about who has been trimming them.",
      "You do not kick a lantern in a wooden mine. You have, on the whole, a good survival instinct."),
    hsp('rails','Rails',[0,150,320,30],[100,172],
      "A pair of narrow iron rails, running from the rubble out into the tunnel and away. They have the air of rails that remember a great many trips, and are, in this particular case, nostalgic.",
      "You follow the rails for a moment with your hand. They are cold, and very straight.",
      "You tell the rails about your plans. They have heard plans before.",
      "You kick a rail. Your toe, which is not iron, takes the loss.")
  ]
};
ROOM_IDS.push('orchard','marsh','burrow','cavern','lake','mine');

/* new doorways from the old map */
(function(){
  ROOMS.cottage.exits.push({side:'E',a:128,b:190,to:'orchard'});
  ROOMS.birch.exits.push({side:'S',a:150,b:196,to:'orchard'});
  ROOMS.camp.exits.push({side:'W',a:140,b:186,to:'orchard'});
  ROOMS.pond.exits.push({side:'S',a:120,b:196,to:'marsh'});
  ROOMS.fox.exits.push({side:'N',a:258,b:284,to:'burrow',soft:true,land:[268,144]});
  ROOMS.fox.hot.forEach(function(h){
    if(h.id==='den'){
      h.v.look="A neat round door in the hillside, framed with roots. Inside it is dark, tidy and faintly warm. A very small mat reads: WIPE YOUR PAWS. The fox is asleep a good arm's length to the left of it. The door, as far as you can tell, is open to anyone with good manners and light feet.";
      h.v.hand="You step toward the door, softly. The fox's ear turns. You keep walking, in the way of someone who has decided to be unnoticed, and it works, or the fox is polite.";
    }
  });
})();
