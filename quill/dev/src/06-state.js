
/* ---------- state and helpers ---------- */
var S=null;
var wr={x:232,y:166,face:-1,fr:0,ph:0,tx:null,ty:null,after:null};
var MAXS=61;
var ITEMS={map:'Map',compass:'Compass',feather:'Feather',jar:'Jam jar',inkjar:'Ink jar',trowel:'Trowel',tea:'Tea tin',acorn:'Acorns',button:'Button',spoon:'Spoon',bell:'Bell',cone:'Sap cone'};
function fresh(){return {room:'cottage',score:0,inv:['feather'],f:{},got:{},visited:{},inked:{},acorns:0,gEnt:0,gIdx:0,gMut:0,verb:'look',sel:null,last:'',over:false,mapOpen:false,n:0,compass:null,cprefix:false,dlg:null,pre:''}}
function has(id){return S.inv.indexOf(id)>=0}
function add(id){if(!has(id))S.inv.push(id);if(refreshInv)refreshInv()}
function del(id){var i=S.inv.indexOf(id);if(i>=0)S.inv.splice(i,1);if(refreshInv)refreshInv()}
function pts(n,key){if(S.got[key])return;S.got[key]=1;S.score+=n;$('score').textContent=S.score}
function say(t){S.last=t;$('msg').textContent=t;dirty=true}
function nm(id){return (ITEMS[id]||id).toLowerCase()}
function label(id){return id==='acorn'?'Acorns ('+S.acorns+')':ITEMS[id]}
function take(id,flag,n,msg){S.f[flag]=1;add(id);if(n)pts(n,flag);return msg}
function addAcorns(n){S.acorns+=n;add('acorn');if(refreshInv)refreshInv()}
function spendAcorns(n){S.acorns=Math.max(0,S.acorns-n);if(S.acorns===0)del('acorn');if(refreshInv)refreshInv()}
function val(v){return typeof v==='function'?v():v}
var refreshInv=null;

var DEF={
  look:['It is a %. It looks like one.','Nothing about the % surprises you.','You study the %. The % studies nothing back.'],
  hand:['You cannot do much with the %, and you have checked.','You poke the %. It remains a %.','Hands on, hopes dashed. The % is not helping.'],
  talk:['The % is not chatty.','You address the %. The % has no comment.','You say a few words to the %. It listens the way objects do.'],
  boot:['You consider kicking the %, and decide your boot deserves better.','You kick the %. Mostly you learn about your toe.','Violence against the % solves nothing, but it does hurt.']
};
function defv(verb,h){var a=DEF[verb];S.n++;return a[S.n%a.length].replace(/%/g,h.n.toLowerCase())}

var ITEMLOOK={
  feather:function(){return S.f.quill?'Your feather, now a working quill. It drips. You hold it well away from the hat.':'Your hat feather. It doubles as a quill, a tickler and a wind gauge, depending on how desperate things get.'},
  jar:'An empty jam jar. The jam left months ago. The jar stayed out of loyalty, and would like to be useful. Anything that drips ink would do nicely.',
  inkjar:'A jar of ink, collected drip by drip from inkcap mushrooms. It smells of wet newspaper and ambition.',
  trowel:'A small trowel. The handle is carved: B. MULCH. HANDS OFF.',
  tea:'A tin of Lapsang Souchong. It smells like a campfire that went to finishing school.',
  acorn:function(){return 'Acorns, legal tender in the Vale. Hazel is the only central bank, and she does not take questions. You have '+S.acorns+'. Hazel sells a pinecone for 3.'},
  button:'A brass button, still shiny. Its coat left without it, and it is not coping well.',
  spoon:'A silver spoon. Whoever lost it was born with one and has not noticed it is gone.',
  bell:'A small brass bell, slightly dented. Engraved: PROPERTY OF F. FENNEL, CHIEF NAVIGATION FAIRY (PROVISIONAL).',
  cone:'A fat pinecone glazed with amber sap. It smells like maple syrup that went to finishing school.'
};
