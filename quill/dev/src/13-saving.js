
/* ---------- saving: autosave in the browser, plus a copy-and-paste save code ---------- */
var SAVEKEY='qc-save-v1',SAVEV=1,gmOpen=false,held=false,dirty=false,lastSave=0,saveOK=true,confirmReset=false;
var TRANSIENT={sel:1,mapOpen:1,dlg:1,pre:1,compass:1,over:1,last:1};
function snap(){var o={};for(var k in S)if(!TRANSIENT[k])o[k]=S[k];return {v:SAVEV,S:o,wr:{x:Math.round(wr.x),y:Math.round(wr.y),face:wr.face}}}
function encodeSave(){var j=JSON.stringify(snap());return 'QC1.'+btoa(unescape(encodeURIComponent(j)))}
function plain(o){var r={};if(o&&typeof o==='object'&&!Array.isArray(o))for(var k in o){var v=o[k];if(typeof v==='number'||typeof v==='boolean'||typeof v==='string')r[k]=v}return r}
/* turn untrusted data into a safe game state, or null */
function sanitize(o){
  if(!o||o.v!==SAVEV||!o.S||typeof o.S!=='object')return null;
  var s=o.S,b=fresh();
  if(typeof s.room!=='string'||!ROOMS[s.room])return null;
  b.room=s.room;
  b.score=clamp(Math.round(+s.score)||0,0,MAXS);
  b.acorns=clamp(Math.round(+s.acorns)||0,0,99);
  b.gEnt=clamp(Math.round(+s.gEnt)||0,0,99);b.gMut=clamp(Math.round(+s.gMut)||0,0,99);b.n=clamp(Math.round(+s.n)||0,0,99999);
  b.gIdx=clamp(Math.round(+s.gIdx)||0,0,GPOS.length-1);
  b.f=plain(s.f);b.got=plain(s.got);b.visited=plain(s.visited);b.inked=plain(s.inked);
  b.cprefix=!!s.cprefix;
  b.inv=Array.isArray(s.inv)?s.inv.filter(function(id,i,a){return typeof id==='string'&&ITEMS[id]&&a.indexOf(id)===i}):['feather'];
  if(b.acorns>0&&b.inv.indexOf('acorn')<0)b.inv.push('acorn');
  if(b.acorns===0)b.inv=b.inv.filter(function(id){return id!=='acorn'});
  var z=ROOMS[b.room].walk,w=o.wr||{};
  return {S:b,wr:{x:clamp(+w.x||160,z.x0,z.x1),y:clamp(+w.y||160,z.y0,z.y1),face:w.face===-1?-1:1}};
}
function decodeSave(txt){
  try{
    txt=String(txt||'').replace(/\s+/g,'');
    if(txt.indexOf('QC1.')!==0)return null;
    return sanitize(JSON.parse(decodeURIComponent(escape(atob(txt.slice(4))))));
  }catch(e){return null}
}
function readSave(){try{var t=localStorage.getItem(SAVEKEY);return t?sanitize(JSON.parse(t)):null}catch(e){return null}}
function writeSave(){
  if(held||!S)return;
  try{localStorage.setItem(SAVEKEY,JSON.stringify(snap()));saveOK=true}catch(e){saveOK=false}
}
function applySave(sv){
  S=sv.S;thumbCache={};
  wr.x=sv.wr.x;wr.y=sv.wr.y;wr.face=sv.wr.face;wr.tx=null;wr.ty=null;wr.after=null;wr.fr=0;
  hover=null;hoverExit=null;
  $('score').textContent=String(S.score);$('endcard').hidden=true;$('mapview').hidden=true;
  prepBG();refreshInv();setVerb('look');renderDlg();
  say('Game restored. You are at '+ROOMS[S.room].name+'.');updateStatus();dirty=true;
}
function summary(sv){
  var n=ROOM_IDS.filter(function(k){return sv.S.inked[k]}).length;
  return 'Score '+sv.S.score+' of '+MAXS+'. At '+ROOMS[sv.S.room].name+'. Places inked: '+n+' of '+ROOM_IDS.length+'.';
}
function setGm(id,t){$(id).textContent=t}
function openMenu(mode,sv){
  gmOpen=true;if(S&&S.mapOpen)closeMap();
  $('gamemenu').hidden=false;
  var wel=mode==='welcome';
  $('gmwelcome').hidden=!wel;$('gmmain').hidden=wel;$('gmx').hidden=wel;
  confirmReset=false;setGm('gmreset','RESTART GAME');
  if(wel){
    setGm('gmtitle','WELCOME BACK');
    setGm('gmnote',summary(sv)+' Starting over replaces this save.');
    gmPending=sv;
  }else{
    setGm('gmtitle','SAVE AND LOAD');
    setGm('gmnote',saveOK?'Your game autosaves in this browser as you play. For a backup, or to move to another device, copy the save code below.':'Autosave is not available here (a private window blocks it). Copy the save code below to keep your game.');
    $('gmout').value=encodeSave();$('gmin').value='';setGm('gmmsg','');
  }
}
var gmPending=null;
function closeMenu(){gmOpen=false;$('gamemenu').hidden=true;for(var k in keys)keys[k]=false}
function gmMsg(t){setGm('gmmsg',t)}
$('menubtn').addEventListener('click',function(){if(gmOpen)closeMenu();else openMenu('main')});
$('gmx').addEventListener('click',closeMenu);
$('gmcont').addEventListener('click',function(){if(gmPending){applySave(gmPending);gmPending=null}held=false;closeMenu()});
$('gmnew').addEventListener('click',function(){gmPending=null;held=false;dirty=true;closeMenu()});
$('gmcopy').addEventListener('click',function(){
  var ta=$('gmout');ta.value=encodeSave();ta.focus();ta.select();
  var done=false;
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value);done=true}}catch(e){}
  if(!done){try{done=document.execCommand('copy')}catch(e){}}
  gmMsg(done?'Copied. Paste it somewhere safe.':'The code is selected. Copy it with Ctrl+C or the share menu.');
});
$('gmload').addEventListener('click',function(){
  var sv=decodeSave($('gmin').value);
  if(!sv){gmMsg('That code did not load. Make sure you copied all of it, starting with QC1.');return}
  applySave(sv);held=false;closeMenu();
});
$('gmreset').addEventListener('click',function(){
  if(!confirmReset){confirmReset=true;setGm('gmreset','REALLY RESTART?');gmMsg('This erases your progress. Copy your save code first if you want a backup. Click again to confirm.');return}
  newGame();held=false;dirty=true;closeMenu();
});
function flushSave(){if(dirty){dirty=false;writeSave()}}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flushSave()});
window.addEventListener('pagehide',flushSave);
