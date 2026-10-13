
/* ---------- verbs, registry, dialogue, compass, map ---------- */
var REDUCED=false;try{REDUCED=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){}
var VERBS=['look','hand','talk','boot'],VNAME={look:'Look at',hand:'Hand on',talk:'Talk to',boot:'Boot'};
var DIRANG={N:-90,E:0,S:90,W:180},DIRW={N:'north',E:'east',S:'south',W:'west'};
var mouse={x:-1,y:-1,on:false},hover=null,hoverExit=null;
var GRAPH={},CUR=[];
ROOM_IDS.forEach(function(id){GRAPH[id]={};ROOMS[id].exits.forEach(function(e){GRAPH[id][e.side]=e.to})});
function RNAME(id){return ROOMS[id].short}

function rectOf(h){return typeof h.r==='function'?h.r():h.r}
function atOf(h){var a=typeof h.at==='function'?h.at():h.at;if(a)return a;var r=rectOf(h);return [r[0]+r[2]/2,r[1]+r[3]+4]}
function hotAt(x,y){
  var hs=ROOMS[S.room].hot;
  for(var i=hs.length-1;i>=0;i--){var h=hs[i];if(h.show&&!h.show())continue;var r=rectOf(h);if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3])return h}
  return null;
}
function perform(verb,h){var v=h.v&&h.v[verb];var out=v!==undefined?val(v):defv(verb,h);if(out)say(out)}
function useOn(item,h){
  var u=h.u&&h.u[item],out;
  if(u!==undefined)out=val(u);
  else out='You try the '+nm(item)+' on the '+h.n.toLowerCase()+'. '+['Nothing happens, with enthusiasm.','It is about as effective as you feared.','The '+h.n.toLowerCase()+' remains unmoved.'][(++S.n)%3];
  if(out)say(out);
}

/* ---------- dialogue engine ---------- */
function startDialog(npc,node){S.dlg={n:npc,k:node||'start'};S.sel=null;S.pre='';if(refreshInv)refreshInv();renderDlg();updateStatus()}
function renderDlg(){
  var box=$('opts'),game=$('game');
  if(!S.dlg){box.hidden=true;box.innerHTML='';game.classList.remove('talking');return}
  game.classList.add('talking');
  var nd=DLG[S.dlg.n].nodes[S.dlg.k],txt=val(nd.say);
  if(nd.enter)nd.enter();
  var pre=S.pre||'';S.pre='';
  say((pre?pre+' ':'')+txt);
  CUR=(val(nd.opts)||[]).filter(function(o){return !o.if||o.if()});
  box.innerHTML='';
  CUR.forEach(function(o,i){
    var b=document.createElement('button');b.type='button';b.className='opt';
    var n=document.createElement('b');n.textContent=String(i+1);b.appendChild(n);b.appendChild(document.createTextNode(o.t));
    b.addEventListener('click',function(){pickOpt(i)});box.appendChild(b);
  });
  box.hidden=false;
}
function pickOpt(i){
  var o=CUR[i];if(!o||!S.dlg)return;
  var r=o.do?o.do():null;
  if(o.go){S.dlg.k=o.go;S.pre=r||'';renderDlg()}else endDialog(r);
}
function endDialog(msg){S.dlg=null;S.pre='';renderDlg();updateStatus();say(msg||'You step away. Conversation over, for now.')}

/* ---------- compass: it points at the next thing worth doing ---------- */
function path(from,to){
  if(from===to)return {d:null,n:0};
  var q=[[from,null,0]],seen={};seen[from]=1;
  while(q.length){var c=q.shift(),e=GRAPH[c[0]];
    for(var d in e){var nx=e[d];if(seen[nx])continue;seen[nx]=1;var f=c[1]||d;if(nx===to)return {d:f,n:c[2]+1};q.push([nx,f,c[2]+1])}}
  return {d:null,n:99};
}
function stages(){return [
  {done:function(){return S.f.jar||S.f.ink},goal:function(){return 'cottage'},here:function(){return 'The needle trembles and tugs toward the window. Something on the sill is empty and waiting.'},there:function(d){return 'The needle leans '+DIRW[d]+', toward the cottage. Something there wants collecting.'}},
  {done:function(){return S.f.ink},goal:function(){return 'garden'},here:function(){return 'The needle trembles at the ground. Something nearby is dripping.'},there:function(d){return 'The needle strains '+DIRW[d]+', toward the garden. Something there is dripping.'}},
  {done:function(){return S.f.quill},free:'The needle swings between your feather and your ink and refuses to choose. It would like them introduced.'},
  {done:function(){return S.f.trowel},goal:function(){return S.f.clue?'cross':'garden'},
    here:function(){return S.f.clue?'The needle trembles at the signpost. Something wooden is sticking out of the dirt at its foot.':'The needle tugs toward the gate and back again. Something in this garden talks when nobody is looking. Try leaving and returning.'},
    there:function(d){return S.f.clue?'The needle leans '+DIRW[d]+', toward the crossroads. Something wooden waits at the foot of the signpost.':'The needle leans '+DIRW[d]+'. The garden has been muttering, and the compass would like to hear it.'}},
  {done:function(){return S.f.cone},goal:function(){return 'grove'},
    here:function(){return S.acorns>=3?'The needle quivers at the squirrel with the ledger. You have what she wants. Probably.':'The needle jitters at the squirrel with the ledger. She wants acorns, and she pays in them for tools and shiny things. Look in watery places.'},
    there:function(d){return 'The needle leans '+DIRW[d]+', toward the sound of counting.'}},
  {done:function(){return S.f.bell},goal:function(){return 'bridge'},here:function(){return 'The needle swings toward the moose, then away, then back. Something would have to surprise him.'},there:function(d){return 'The needle leans '+DIRW[d]+', toward a long, low sigh.'}},
  {done:function(){return S.f.wokeF},goal:function(){return 'fairy'},here:function(){return 'The needle quivers at the sleeping fairy. Something loud would help.'},there:function(d){return 'The needle leans '+DIRW[d]+', toward a faint and tired glow.'}},
  {done:function(){return S.f.sparkle},goal:function(){return 'fairy'},here:function(){return has('cone')?'The needle points at Fennel, and then at your pack. She is hungry.':'The needle points at Fennel and sighs. She needs something sweet.'},there:function(d){return 'The needle leans '+DIRW[d]+', toward a faint and tired glow.'}},
  {done:function(){return S.over},goal:function(){return 'peak'},here:function(){return 'The needle holds perfectly still. Whatever you came here for, you can ink it. Quill, map, summit.'},there:function(d){return 'The needle is steady now. It leans '+DIRW[d]+', toward the Peak.'}}
]}
function hint(){
  var st=stages(),s=null,i;
  for(i=0;i<st.length;i++){if(!st[i].done()){s=st[i];break}}
  if(!s)return {ang:0,text:'The needle points calmly at the cottage, then shrugs. There is nothing left to find, and it knows it.'};
  if(s.free)return {ang:null,text:s.free};
  var g=s.goal(),r=S.room;
  if(g===r)return {ang:null,text:s.here()};
  var d=path(r,g).d;
  return {ang:DIRANG[d],text:s.there(d)};
}
function consult(){
  var h=hint(),pre='';
  if(S.f.sparkle){if(!S.cprefix2){S.cprefix2=1;pre='The compass holds steady. For once, the needle points as if it means it. '}}
  else if(!S.cprefix){S.cprefix=1;pre='The compass is dead, but even a dead needle has opinions. '}
  say(pre+h.text);
  S.compass={until:performance.now()+5000,ang:h.ang};
}

/* ---------- plain-language hints (HINT button or the H key) ---------- */
function groceryList(){
  var have=[],find=[];
  if(has('trowel'))have.push(S.f.haggled?'the trowel (2 acorns, since you argued provenance)':'the trowel (1 acorn; tell her it is engraved and she will pay 2)');
  else if(!S.f.trowel)find.push('a trowel (Crossroads, at the foot of the signpost)');
  if(has('button'))have.push('the brass button (1)');else if(!S.f.button)find.push('a brass button (in the reeds at Mill Pond)');
  if(has('spoon'))have.push('the silver spoon (1)');else if(!S.f.spoon)find.push('a silver spoon (between the rocks by the Waterfall pool)');
  if(has('tea'))have.push('the tea tin (1; Magnus would like it more, though)');
  return {have:have,find:find};
}
function plainStages(){return [
  {done:function(){return S.f.jar&&S.f.map&&S.f.compass&&S.f.tea||S.f.ink},
   a:function(){return 'Collect your things from the cottage.'},
   b:function(){var m=[];if(!S.f.map)m.push('the map (drafting table)');if(!S.f.compass)m.push('the compass (drafting table)');if(!S.f.jar)m.push('the jam jar (windowsill)');if(!S.f.tea)m.push('the tea tin (by the rain barrel)');return 'Use Hand on '+m.join(', ')+'. Then walk off the west edge of the screen to the Gnome Garden.'}},
  {done:function(){return S.f.ink},
   a:function(){return 'Fill the jam jar with ink.'},
   b:function(){return 'Go west of the cottage to the Gnome Garden. Click the jam jar in your pack, then click the mossy log on the left of the garden. Inkcap mushrooms drip ink into the jar.'}},
  {done:function(){return S.f.quill},
   a:function(){return 'Turn the feather into a quill.'},
   b:function(){return 'Click the feather in your pack, then click the ink jar.'}},
  {done:function(){return S.f.trowel},
   a:function(){return S.f.clue?'Get the trowel at the Crossroads.':'The garden gnome knows where the trowel is.'},
   b:function(){return S.f.clue?'From the Gnome Garden go north to the Crossroads. Use Hand on the base of the signpost.':'Leave the Gnome Garden and come back in (north to the Crossroads and back works). The gnome mutters a clue. Tickling him with the feather also scores a point.'}},
  {done:function(){return S.f.cone},
   a:function(){return S.acorns>=3?'You have enough acorns. Buy the pinecone from Hazel.':'Earn 3 acorns, then buy the pinecone cache from Hazel.'},
   b:function(){var g=groceryList(),t='Hazel is in Squirrel Grove, north of the cottage. Use Talk on her. You have '+S.acorns+' acorn'+(S.acorns===1?'':'s')+'; the cache costs 3.';
     if(S.acorns>=3)return t+' Choose "Buy the pinecone cache".';
     if(g.have.length)t+=' You can sell: '+g.have.join(', ')+'.';
     if(g.find.length)t+=' Still to find: '+g.find.join(', ')+'.';
     return t+' Keep the tea tin if you can; it is worth more to Magnus.'}},
  {done:function(){return S.f.bell},
   a:function(){return 'Get Magnus the moose off the bridge.'},
   b:function(){return 'Moose Bridge is west of the Crossroads. '+(has('tea')?'Talk to Magnus and give him the tea tin for points. ':'')+'Then click the feather in your pack and click Magnus: you tickle his nose. He sneezes, moves, and a bell falls out.'}},
  {done:function(){return S.f.wokeF},
   a:function(){return 'Wake the fairy with the bell.'},
   b:function(){return 'The Fairy Ring is north of the Crossroads. Click the bell in your pack, then click the sleeping fairy.'}},
  {done:function(){return S.f.sparkle},
   a:function(){return has('cone')?'Feed Fennel the pinecone.':'Fennel needs something sweet.'},
   b:function(){return has('cone')?'Click the sap pinecone in your pack, then click Fennel. Then ask her to fix the compass.':'Buy the pinecone cache from Hazel in Squirrel Grove (3 acorns), then bring it to Fennel.'}},
  {done:function(){return S.over},
   a:function(){return 'Go to Misty Peak and ink the map.'},
   b:function(){return 'Misty Peak is west of the Fairy Ring (or north of Moose Bridge, now that Magnus has moved). Click the feather in your pack, then click the map.'}}
]}
var hintMemo={k:-1,n:0};
function plainHint(){
  var st=plainStages(),i;
  for(i=0;i<st.length;i++){if(!st[i].done())break}
  if(i>=st.length)return {k:99,a:'The main story is done.',b:'For more points, use the feather on the map in each screen to ink it (the map shows what is left). The woods, the orchard, the marsh, the grotto behind the waterfall and the caves under Fox Hollow are all there to explore.'};
  return {k:i,a:st[i].a(),b:st[i].b()};
}
function showHint(){
  var h=plainHint();
  if(hintMemo.k===h.k)hintMemo.n++;else{hintMemo.k=h.k;hintMemo.n=1}
  say('Hint: '+h.a+(hintMemo.n>1?' '+h.b:' (Press HINT again for more detail.)'));
}

/* ---------- inking the map, and the finale ---------- */
var INKMSG={
  cottage:'You ink in the cottage: a small square, a smaller door, and a chimney. The Vale gains one fact.',
  garden:'You ink in the garden: a fence, some cabbages, and a gnome whose position you decline to commit to.',
  cross:'You ink in the crossroads: a plus sign and a signpost. For once the signpost points somewhere definite.',
  grove:'You ink in the grove: an oak, an aggressive number of acorns, and a small sign that says NO LOITERING. It seems fair.',
  bridge:function(){return S.f.sneezed?'You ink in the bridge: two banks, one river, and a moose labelled MAGNUS (FORMERLY STATIONARY).':'You ink in the bridge: two banks, one river, and a moose-shaped obstruction labelled MAGNUS (STATIONARY).'},
  pond:'You ink in the pond: a mill, a wheel, and a duck who would like to be left out of this.',
  fairy:'You ink in the Fairy Ring: a circle of toadstools. The ink sparkles slightly. You blame the toadstools.',
  falls:'You ink in the waterfall: a line of blue falling off the top of the page. You let it.',
  birch:'You ink in the Birch Trail: a long row of upright dashes, which is the most honest way to draw a birch.',
  pines:'You ink in the Tall Pines. The ink soaks into the page in a very dark way. You decide not to ask.',
  fox:'You ink in Fox Hollow: a hill, a door, and a very small fox-shaped smudge. You tiptoe past the smudge.',
  owl:'You ink in the Owl Tree: a large tree, a lantern, and, in tiny letters, DO NOT DISTURB.',
  grotto:'You ink in the Glimmer Grotto. The ink, delighted, glows for a moment before settling into the paper like a very small, very pleased star.',
  orchard:'You ink in the Apple Orchard: rows of small round trees, a scarecrow, and a note in the margin that says THE APPLES ARE NOT A DIRECTION. The map agrees, and draws them anyway.',
  marsh:'You ink in the Reed Marsh: a wobbly boardwalk, a great deal of blue, and, in the corner, a very small row of musical notes. The frogs would like credit.',
  burrow:"You ink in the Fox's Burrow: a round room, an armchair, and a very small shelf of acorn caps. The ink goes on tidily. It has been told to.",
  cavern:'You ink in Glowcap Cavern. The ink glows faintly in the shape of mushrooms. You did not ask it to.',
  lake:'You ink in Lantern Lake: a very large black oval, with one small yellow dot for the lantern. The map seems to find it restful.',
  mine:'You ink in the Old Quartz Mine: two rails, a cart, and a pile of rubble marked NOT YET. You do not argue.',
  camp:'You ink in the Camp: a tent, a ring of stones and a note that reads OCCUPIED (BY SPIDERS). The map seems pleased with that.'
};
function inkMap(){
  if(!S.f.quill)return 'You hold the bare feather over the map. It has nothing to write with. The map waits, blank and a little judgmental.';
  var r=S.room;
  if(S.inked[r])return 'That part is already inked. Any more would be vanity.';
  if(r==='peak'){
    if(!S.f.sparkle)return 'You hold the quill over the map. The fog is so thick that you cannot see a single thing to draw. A cartographer cannot ink what a cartographer cannot see. The compass, if it worked, might help.';
    S.inked[r]=1;finale();return null;
  }
  S.inked[r]=1;pts(1,'ink_'+r);delete thumbCache[r];
  return val(INKMSG[r]);
}
function combine(a,b){
  var k=[a,b].sort().join('|'),out;
  if(k==='feather|inkjar'){S.f.quill=1;out='You dip the feather in the ink. It makes a fine quill, an excellent pen, and a questionable decision about your hat.'}
  else if(k==='feather|map')out=inkMap();
  else if(k==='inkjar|map')out='You pour ink onto the map. It is now a stain with a border. Cartography does not work this way.';
  else if(k==='cone|tea'||k==='cone|jar')out='You consider combining them. Whatever you are imagining is sticky, and Fennel would not approve.';
  else out='You try the '+nm(a)+' with the '+nm(b)+'. They do not get along.';
  if(out)say(out);
}
function finale(){
  pts(5,'finale');S.over=true;
  var n=ROOM_IDS.filter(function(k){return S.inked[k]}).length;
  $('endtext').textContent='The quill touches the paper and the map takes over, drawing itself faster than you can follow: a fence, a pond, a grove, a very specific moose. Thistlewick Vale is back, with its edges where they belong, and the compass settles on the cottage as if home were the point all along. Master Quill is still missing, and the plaque did say DESCENT NOT RECORDED, but you are the one with the quill. Score: '+S.score+' of '+MAXS+'. Places inked: '+n+' of '+ROOM_IDS.length+'.'+(S.score<MAXS?' There are still points lying around out there.':' That is every point there is.');
  $('endcard').hidden=false;
}

/* ---------- map overlay with thumbnails of inked places ---------- */
var thumbCache={};
function thumb(id){
  if(thumbCache[id])return thumbCache[id];
  var big=mk(),keep=bgX;
  bgX=big.getContext('2d');
  try{SC[id].bg()}finally{bgX=keep;use(ctx)}
  var c=mk(80,50),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(big,0,0,80,50);
  thumbCache[id]=c;return c;
}
function openMap(){
  var gd=$('mapgrid'),cells=[],i,j,minx=9,miny=9,maxx=-9,maxy=-9;gd.innerHTML='';
  ROOM_IDS.forEach(function(id){var r=ROOMS[id];minx=Math.min(minx,r.mx);maxx=Math.max(maxx,r.mx);miny=Math.min(miny,r.my);maxy=Math.max(maxy,r.my)});
  var rows=maxy-miny+1,cols=maxx-minx+1;
  for(i=0;i<rows;i++){var rw=[];for(j=0;j<cols;j++)rw.push(null);cells.push(rw)}
  ROOM_IDS.forEach(function(id){cells[ROOMS[id].my-miny][ROOMS[id].mx-minx]=id});
  gd.style.setProperty('--cols',String(cols));gd.style.setProperty('--asp',rows>5?'8/3.4':'8/5');
  for(i=0;i<rows;i++)for(j=0;j<cols;j++){
    var k=cells[i][j],c=document.createElement('div'),cls='cell';
    if(k&&S.visited[k]){
      cls+=S.inked[k]?' ink':' pen';
      if(S.inked[k]){
        var tc=document.createElement('canvas');tc.width=80;tc.height=50;tc.getContext('2d').drawImage(thumb(k),0,0);tc.className='th';c.appendChild(tc);
        var sp=document.createElement('span');sp.className='nm';sp.textContent=RNAME(k);c.appendChild(sp);
      }else c.textContent=RNAME(k);
      if(k===S.room)cls+=' here';
    }
    c.className=cls;gd.appendChild(c);
  }
  var nink=ROOM_IDS.filter(function(k){return S.inked[k]}).length;
  $('mapnote').textContent=nink?('Inked: '+nink+' of '+ROOM_IDS.length+'. Pencil is where you have been. Ink is where you made it stick.'):'Pencil is where you have been. Ink is where you made it stick.';
  $('mapview').hidden=false;S.mapOpen=true;
  say(nink?'The map fills in, one inked place at a time.':'You unroll the map. Pencil marks where you have been. Without ink, it will not stay.');
}
function closeMap(){$('mapview').hidden=true;S.mapOpen=false}

/* ---------- inventory and verb bar ---------- */
/* Doorways: generous zones along the edge of the walk area. EXPAD widens each exit sideways, EXM is how close to the edge counts as "through". */
var EXPAD=12,EXM=6,EXBAND=18;
function exitAt(x,y){
  var rm=ROOMS[S.room],z=rm.walk;
  for(var i=0;i<rm.exits.length;i++){var e=rm.exits[i],hit;
    if(e.side==='W')hit=x<z.x0+EXBAND&&y>=e.a-EXPAD&&y<=e.b+EXPAD;
    else if(e.side==='E')hit=x>z.x1-EXBAND&&y>=e.a-EXPAD&&y<=e.b+EXPAD;
    else if(e.side==='N')hit=y<z.y0+6&&x>=e.a-EXPAD&&x<=e.b+EXPAD;
    else hit=y>z.y1-EXBAND&&x>=e.a-EXPAD&&x<=e.b+EXPAD;
    if(hit)return e}
  return null;
}
/* where to walk so that Wren goes right through an exit */
function exitTarget(e,x,y){
  var z=ROOMS[S.room].walk,lo=e.a+6,hi=e.b-6;if(hi<lo){lo=hi=(e.a+e.b)/2}
  if(e.side==='W')return [z.x0,clamp(y,lo,hi)];
  if(e.side==='E')return [z.x1,clamp(y,lo,hi)];
  if(e.side==='N')return [clamp(x,lo,hi),z.y0];
  return [clamp(x,lo,hi),z.y1];
}
function updateStatus(){
  var a;
  if(S.dlg)a='Talking to '+DLG[S.dlg.n].name;
  else{a=S.sel?('Use '+label(S.sel)+(hover?' on '+hover.n:'')):(VNAME[S.verb]+(hover?' '+hover.n:''));
    if(!hover&&hoverExit)a='Exit: '+RNAME(hoverExit.to)}
  $('status').textContent=ROOMS[S.room].name+'  |  '+a;
}
refreshInv=function(){
  var box=$('inv');box.innerHTML='';
  if(!S.inv.length){var e=document.createElement('div');e.className='empty';e.textContent='Nothing yet.';box.appendChild(e);return}
  S.inv.forEach(function(id){
    var b=document.createElement('button');b.className='btn item';b.type='button';b.setAttribute('aria-pressed',S.sel===id?'true':'false');
    var c=document.createElement('canvas');c.width=16;c.height=16;c.getContext('2d').drawImage(ICON[id],0,0);
    var s=document.createElement('span');s.textContent=label(id);
    b.appendChild(c);b.appendChild(s);
    b.addEventListener('click',function(){clickItem(id)});
    box.appendChild(b);
  });
};
function setVerb(v){
  S.verb=v;S.sel=null;
  var bs=document.querySelectorAll('#verbs .btn');
  for(var i=0;i<bs.length;i++)bs[i].setAttribute('aria-pressed',bs[i].dataset.verb===v?'true':'false');
  refreshInv();updateStatus();
}
function cycleVerb(){setVerb(VERBS[(VERBS.indexOf(S.verb)+1)%4])}
function clickItem(id){
  if(S.over||S.dlg||gmOpen)return;
  if(S.mapOpen)closeMap();
  if(S.sel&&S.sel!==id){var a=S.sel;S.sel=null;refreshInv();updateStatus();combine(a,id);return}
  if(S.sel===id){S.sel=null;refreshInv();updateStatus();return}
  if(id==='map'){openMap();return}
  if(id==='compass'){consult();return}
  if(S.verb==='look'){say(val(ITEMLOOK[id]));return}
  if(S.verb==='talk'){say('You talk to the '+nm(id)+'. It listens the way objects do.');return}
  if(S.verb==='boot'){say('You consider kicking the '+nm(id)+' in your pack. Your toes vote no.');return}
  S.sel=id;refreshInv();updateStatus();
}
