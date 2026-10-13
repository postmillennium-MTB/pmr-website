
/* ---------- movement and rooms ---------- */
function walkTo(x,y,fn){var z=ROOMS[S.room].walk;wr.tx=clamp(x,z.x0,z.x1);wr.ty=clamp(y,z.y0,z.y1);wr.after=fn||null}
function goDo(h,fn){var a=atOf(h);walkTo(a[0],a[1],fn)}
function bounce(e){var k=e.side;if(k==='W')wr.x+=22;else if(k==='E')wr.x-=22;else if(k==='N')wr.y+=18;else wr.y-=18;wr.tx=null;wr.after=null;wr.fr=0}
function prepBG(){use(bgX);bgX.clearRect(0,0,W,H);SC[S.room].bg();use(ctx)}
/* enter a room from another one (placing Wren just inside the matching edge) or at an explicit [x,y] */
function enterRoom(id,from){
  var first=!S.visited[id],rm=ROOMS[id],z=rm.walk,x=wr.x,y=wr.y;
  if(from&&from.length===2&&typeof from!=='string'){x=from[0];y=from[1]}
  else if(from){
    var ex=null;rm.exits.forEach(function(q){if(q.to===from)ex=q});
    if(ex&&ex.land){x=ex.land[0];y=ex.land[1]}
    else if(ex){
      var inset=EXM+6;
      if(ex.side==='W'){x=z.x0+inset;y=clamp(wr.y,z.y0+2,z.y1-2);wr.face=1}
      else if(ex.side==='E'){x=z.x1-inset;y=clamp(wr.y,z.y0+2,z.y1-2);wr.face=-1}
      else if(ex.side==='N'){y=z.y0+inset;x=clamp(wr.x,ex.a+4,ex.b-4)}
      else{y=z.y1-inset;x=clamp(wr.x,ex.a+4,ex.b-4)}
    }
  }
  S.room=id;S.visited[id]=1;
  wr.x=x;wr.y=y;wr.tx=null;wr.ty=null;wr.after=null;wr.fr=0;hover=null;hoverExit=null;marks=[];
  prepBG();say(rm.arrive(first));updateStatus();
}
function checkExit(){
  var rm=ROOMS[S.room],z=rm.walk;
  for(var i=0;i<rm.exits.length;i++){
    var e=rm.exits[i],hit=false;
    if(e.side==='W')hit=wr.x<=z.x0+EXM&&wr.y>=e.a-EXPAD&&wr.y<=e.b+EXPAD;
    else if(e.side==='E')hit=wr.x>=z.x1-EXM&&wr.y>=e.a-EXPAD&&wr.y<=e.b+EXPAD;
    else if(e.side==='N')hit=wr.y<=z.y0+EXM&&wr.x>=e.a-EXPAD&&wr.x<=e.b+EXPAD;
    else hit=wr.y>=z.y1-EXM&&wr.x>=e.a-EXPAD&&wr.x<=e.b+EXPAD;
    if(hit){
      var m=e.lock?e.lock():null;
      if(m){bounce(e);say(m)}else enterRoom(e.to,S.room);
      return true;
    }
  }
  return false;
}
var keys={};
function kdir(){return {x:(keys.ArrowRight||keys.d||keys.D?1:0)-(keys.ArrowLeft||keys.a||keys.A?1:0),y:(keys.ArrowDown||keys.s||keys.S?1:0)-(keys.ArrowUp||keys.w||keys.W?1:0)}}
function tick(dt){
  if(S.over||S.mapOpen||S.dlg||gmOpen)return;
  var kd=kdir();
  if(kd.x||kd.y){
    var z=ROOMS[S.room].walk,m=70*dt,l=Math.sqrt(kd.x*kd.x+kd.y*kd.y);
    wr.tx=null;wr.after=null;
    wr.x=clamp(wr.x+kd.x/l*m,z.x0,z.x1);wr.y=clamp(wr.y+kd.y/l*m,z.y0,z.y1);
    if(kd.x)wr.face=kd.x>0?1:-1;
    wr.ph+=m;wr.fr=1+(((wr.ph/5)|0)&1);
    checkExit();return;
  }
  if(wr.tx===null){wr.fr=0;return}
  var dx=wr.tx-wr.x,dy=wr.ty-wr.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<1.2){wr.x=wr.tx;wr.y=wr.ty;wr.tx=null;wr.fr=0;var f=wr.after;wr.after=null;if(!checkExit()&&f)f();return}
  var m2=Math.min(70*dt,d);
  wr.x+=dx/d*m2;wr.y+=dy/d*m2;
  if(Math.abs(dx)>0.5)wr.face=dx>0?1:-1;
  wr.ph+=m2;wr.fr=1+(((wr.ph/5)|0)&1);
  checkExit();
}
function click(x,y){
  if(S.over||S.mapOpen||S.dlg||gmOpen)return;
  var h=hotAt(x,y),ex=exitAt(x,y),item=S.sel,verb=S.verb;
  if(verb==='boot'&&!item)addMark(x,y);
  /* a click in a doorway always walks you out of it, whatever is painted there */
  if(ex&&!item&&!(ex.soft&&verb==='look')){var t=exitTarget(ex,x,y);walkTo(t[0],t[1]);return}
  if(!h){walkTo(x,y,verb==='boot'&&!item?function(){say(kickMsg(x,y))}:null);return}
  if(item){S.sel=null;refreshInv();updateStatus();goDo(h,function(){useOn(item,h)});return}
  if(verb==='look'){perform('look',h);return}
  goDo(h,function(){perform(verb,h)});
}

/* ---------- boot marks: a ring where the boot lands, and a line saying where ---------- */
var marks=[];
function addMark(x,y){marks.push({x:x,y:y,t:performance.now()})}
function Circ(cx,cy,r,c){
  cx=Math.round(cx);cy=Math.round(cy);var x=r,y=0,e=1-r;
  while(x>=y){
    R(cx+x,cy+y,1,1,c);R(cx-x,cy+y,1,1,c);R(cx+x,cy-y,1,1,c);R(cx-x,cy-y,1,1,c);
    R(cx+y,cy+x,1,1,c);R(cx-y,cy+x,1,1,c);R(cx+y,cy-x,1,1,c);R(cx-y,cy-x,1,1,c);
    y++;if(e<0)e+=2*y+1;else{x--;e+=2*(y-x)+1}
  }
}
function drawMarks(now){
  var keep=[];
  for(var i=0;i<marks.length;i++){
    var m=marks[i],k=(now-m.t)/1600;
    if(k<0||k>=1){if(k<0)keep.push(m);continue}
    keep.push(m);
    /* starts just outside the pointer icon (8 px) so it is never hidden under it */
    var r=REDUCED?13:10+Math.round(k*10),c=(k<0.5||((now/90)|0)%2)?14:15;
    Circ(m.x,m.y,r+1,0);Circ(m.x,m.y,r,c);Circ(m.x,m.y,r-1,0);
    Circ(m.x,m.y,r-4,k<0.6?4:12);
    if(k<0.7){for(var d=0;d<4;d++){var dx=[1,-1,0,0][d],dy=[0,0,1,-1][d];R(m.x+dx*(r+2),m.y+dy*(r+2),1,1,c);R(m.x+dx*(r+3),m.y+dy*(r+3),1,1,c)}}
  }
  marks=keep;
}
/* the nearest named thing to a spot, by distance to its box */
function nearThing(x,y){
  var best=null,bd=1e9;
  ROOMS[S.room].hot.forEach(function(h){
    if(h.show&&!h.show())return;if(/^path/.test(h.id))return;
    var r=rectOf(h),dx=Math.max(r[0]-x,0,x-(r[0]+r[2])),dy=Math.max(r[1]-y,0,y-(r[1]+r[3])),d=Math.sqrt(dx*dx+dy*dy);
    if(d<bd){bd=d;best=h}
  });
  return best?{h:best,d:bd}:null;
}
function kickMsg(x,y){
  var nt=nearThing(x,y),z=ROOMS[S.room].walk,where='x '+Math.round(x)+', y '+Math.round(y);
  var tails=['The ground takes it well.','A small puff of dirt rises, thinks better of it, and settles.','Nothing happens, but it happens right here.','The spot is now officially kicked.','The ground notes your effort and does not pass it on.'];
  var t=tails[(S.n++)%tails.length],near='';
  if(nt&&nt.d<=14)near=' It is close to the '+nt.h.n.toLowerCase()+'.';
  else if(nt&&nt.d<=40)near=' The nearest thing is the '+nt.h.n.toLowerCase()+'.';
  else near=' There is nothing much nearby.';
  var far=y<z.y0-6?' That spot is out of reach, so you kick the ground as close to it as you can get.':'';
  return 'You kick the ground.'+far+near+' '+t+' (You aimed at '+where+'.)';
}

/* ---------- drawing ---------- */
function drawCompass(now){
  var c=S.compass;if(!c||now>c.until)return;
  var cx=292,cy=28,gold=!!S.f.sparkle;
  E(cx,cy,19,19,0);E(cx,cy,17,17,gold?14:6);E(cx,cy,15,15,15);
  R(cx-1,cy-14,2,3,0);R(cx-1,cy+11,2,3,0);R(cx-14,cy-1,3,2,0);R(cx+11,cy-1,3,2,0);
  var a=c.ang===null?(now/1000)*(gold?1.2:2.2):(c.ang*Math.PI/180)+(gold||REDUCED?0:Math.sin(now/55)*0.28+Math.sin(now/130)*0.12);
  var nx=Math.cos(a)*11,ny=Math.sin(a)*11;
  Ln(cx,cy,cx+nx,cy+ny,gold?14:4);Ln(cx+1,cy,cx+nx+1,cy+ny,gold?14:4);Ln(cx,cy,cx-nx*0.6,cy-ny*0.6,8);E(cx,cy,2,2,0);
}
function render(now){
  var t=REDUCED?0:now/1000;
  use(ctx);R(0,0,W,H,0);ctx.drawImage(bgC,0,0);
  var sc=SC[S.room],list=sc.props(t);
  list.push({y:wr.y,fn:function(){wrenDraw(wr.x,wr.y,wr.face,wr.fr,!!S.dlg)}});
  list.sort(function(a,b){return a.y-b.y});
  for(var i=0;i<list.length;i++)list[i].fn();
  if(sc.fg)sc.fg();
  drawMarks(now);
  drawCompass(now);
  if(mouse.on&&!S.mapOpen&&!S.over&&!S.dlg){var ic=ICON[S.sel||S.verb];ctx.drawImage(ic,Math.round(mouse.x-8),Math.round(mouse.y-8))}
}
var lastT=0;
function frame(now){
  var dt=Math.min(0.05,(now-lastT)/1000||0);lastT=now;
  tick(dt);render(now);
  if(dirty&&!gmOpen&&now-lastSave>1500){lastSave=now;flushSave()}
  requestAnimationFrame(frame);
}

/* ---------- input ---------- */
function cxy(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
cv.addEventListener('pointermove',function(e){
  if(e.pointerType==='touch')return;
  var p=cxy(e);mouse.x=p[0];mouse.y=p[1];mouse.on=true;
  var off=S.over||S.mapOpen||S.dlg||gmOpen;
  var h=off?null:hotAt(p[0],p[1]);
  var ex=off?null:exitAt(p[0],p[1]);
  if(h!==hover||ex!==hoverExit){hover=h;hoverExit=ex;updateStatus()}
});
cv.addEventListener('pointerleave',function(){mouse.on=false;hover=null;hoverExit=null;updateStatus()});
cv.addEventListener('pointerdown',function(e){if(e.button===2)return;var p=cxy(e);if(e.pointerType==='touch')mouse.on=false;click(p[0],p[1])});
cv.addEventListener('contextmenu',function(e){e.preventDefault();if(!S.over&&!S.mapOpen&&!S.dlg&&!gmOpen)cycleVerb()});
document.addEventListener('keyup',function(e){keys[e.key]=false});
window.addEventListener('blur',function(){keys={}});
document.addEventListener('keydown',function(e){
  if(e.target&&/^(TEXTAREA|INPUT)$/.test(e.target.tagName)){if(e.key==='Escape'&&gmOpen&&!$('gmx').hidden)closeMenu();return}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  var k=e.key;
  if(gmOpen){if(k==='Escape'&&!$('gmx').hidden)closeMenu();return}
  if(S.over)return;
  if(S.dlg){
    if(k>='1'&&k<='9'){e.preventDefault();pickOpt(+k-1)}
    else if(k==='Escape')endDialog();
    return;
  }
  if(k.indexOf('Arrow')===0||k===' ')e.preventDefault();
  if(k.indexOf('Arrow')===0||'wasdWASD'.indexOf(k)>=0&&k.length===1){keys[k]=true;if(S.mapOpen)closeMap();return}
  if(k>='1'&&k<='4')setVerb(VERBS[+k-1]);
  else if(k==='m'||k==='M'){if(S.mapOpen)closeMap();else if(has('map'))openMap();else say('You do not have a map yet. There is a very blank one on the table.')}
  else if(k==='h'||k==='H')showHint();
  else if(k==='c'||k==='C'){if(has('compass'))consult();else say('You do not have a compass yet. It is on the table, spinning.')}
  else if(k==='Escape'){if(S.mapOpen)closeMap();else openMenu('main')}
});
Array.prototype.forEach.call(document.querySelectorAll('#verbs .btn'),function(b){b.addEventListener('click',function(){if(S.over||S.dlg||gmOpen)return;if(S.mapOpen)closeMap();setVerb(b.dataset.verb)})});
Array.prototype.forEach.call(document.querySelectorAll('canvas[data-icon]'),function(c){c.getContext('2d').drawImage(ICON[c.dataset.icon],0,0)});
$('mapview').addEventListener('click',closeMap);
$('hintbtn').addEventListener('click',function(){if(S.over||S.dlg||gmOpen)return;if(S.mapOpen)closeMap();showHint()});
$('endkeep').addEventListener('click',function(){$('endcard').hidden=true;S.over=false});
$('endreset').addEventListener('click',function(){newGame()});

/* ---------- start ---------- */
function newGame(){
  S=fresh();thumbCache={};$('score').textContent='0';$('endcard').hidden=true;$('mapview').hidden=true;
  refreshInv();setVerb('look');renderDlg();enterRoom('cottage',[300,160]);
}
function boot(data){
  if(data&&data.S){
    S=data.S;if(data.wr)for(var k in data.wr)wr[k]=data.wr[k];
    $('score').textContent=String(S.score);$('mapview').hidden=true;S.mapOpen=false;$('endcard').hidden=!S.over;
    prepBG();refreshInv();setVerb(S.verb);say(S.last||'');if(S.dlg)renderDlg();updateStatus();
  }else{
    newGame();
    var sv=readSave();
    if(sv&&(sv.S.score>0||Object.keys(sv.S.visited).length>1||sv.S.inv.length>1)){held=true;openMenu('welcome',sv)}
  }
  lastT=performance.now();requestAnimationFrame(frame);
}
try{
  var hot=window.claude&&window.claude.hot;
  if(hot&&hot.snapshot)hot.snapshot(function(){return {S:S,wr:{x:wr.x,y:wr.y,face:wr.face}}});
}catch(e){}
window.QC={
  get S(){return S},get marks(){return marks},wr:wr,keys:keys,ROOMS:ROOMS,ICON:ICON,GRID:GRID,DLG:DLG,MAXS:MAXS,ROOM_IDS:ROOM_IDS,
  hot:function(id){return ROOMS[S.room].hot.filter(function(x){return x.id===id})[0]},
  run:function(verb,id){var h=this.hot(id);if(!h||(h.show&&!h.show()))return 'HIDDEN';perform(verb,h);return S.last},
  use:function(item,id){var h=this.hot(id);if(!h||(h.show&&!h.show()))return 'HIDDEN';useOn(item,h);return S.last},
  combine:function(a,b){combine(a,b);return S.last},
  walk:function(x,y,sec){walkTo(x,y);for(var i=0;i<Math.ceil((sec||8)*30);i++)tick(1/30)},
  opts:function(){return CUR.map(function(o){return o.t})},
  pick:function(i){pickOpt(i);return S.last},
  pickT:function(sub){for(var i=0;i<CUR.length;i++){if(CUR[i].t.indexOf(sub)>=0){pickOpt(i);return S.last}}return 'NOOPT:'+sub},
  render:render,enter:enterRoom,tick:tick,click:click,clickItem:clickItem,setVerb:setVerb,consult:function(){consult();return S.last},hint:hint,encodeSave:encodeSave,decodeSave:decodeSave,applySave:applySave,readSave:readSave,flushSave:flushSave,openMenu:openMenu,closeMenu:closeMenu,get gmOpen(){return gmOpen},openMap:openMap,newGame:newGame,boot:boot,thumb:thumb,endDialog:endDialog
};
if(window.claude&&window.claude.hot&&window.claude.hot.ready)window.claude.hot.ready(boot);
else boot((window.claude&&window.claude.hot&&window.claude.hot.data)||{});
})();
