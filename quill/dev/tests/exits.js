/* Doorway test: clicking a little off-centre near any exit must still carry Wren through it. */
const fs=require('fs');
function mkP(){const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;if(k==='getContext')return()=>mkP();if(k==='getBoundingClientRect')return()=>({left:0,top:0,width:960,height:600});if(k==='then')return undefined;return mkP()},set(){return true},apply(){return mkP()}})}
global.window=global;global.addEventListener=()=>{};
global.document={getElementById:()=>mkP(),createElement:()=>mkP(),createTextNode:()=>mkP(),querySelectorAll:()=>mkP(),addEventListener(){}};
global.requestAnimationFrame=()=>0;
(0,eval)(fs.readFileSync(__dirname+'/../build/game.js','utf8'));
const Q=window.QC;let fails=0,n=0;
function ok(c,m){n++;if(!c){console.log('FAIL',m);fails++}}
const free=['cottage','garden','cross','grove','bridge','pond','fairy','falls','peak','birch','pines','fox','owl','camp','grotto'];
ok(Q.ROOM_IDS.length===21,'21 rooms');
for(const id of free){
  const rm=Q.ROOMS[id];
  for(const e of rm.exits){
    if(e.lock&&e.lock())continue;
    for(const off of [-9,0,9]){            /* click off-centre, up to 9 px outside the painted doorway */
      Q.newGame();Q.setVerb('hand');Q.S.f.sneezed=1;Q.enter(id,[160,160]);
      const m=(e.a+e.b)/2,p={W:[2,clampv(m+off*(off<0?-1:1)*0+((off<0)?e.a-9-m:(off>0?e.b+9-m:0)))],E:[318,0],N:[0,2],S:[0,198]}[e.side];
      let x,y;
      if(e.side==='W'){x=2;y=off<0?e.a-9:off>0?e.b+9:m}
      else if(e.side==='E'){x=318;y=off<0?e.a-9:off>0?e.b+9:m}
      else if(e.side==='N'){y=2;x=off<0?e.a-9:off>0?e.b+9:m}
      else{y=198;x=off<0?e.a-9:off>0?e.b+9:m}
      Q.click(x,y);for(let i=0;i<30*14&&Q.S.room===id;i++)Q.tick(1/30);
      ok(Q.S.room===e.to,id+' '+e.side+' -> '+e.to+' with click at '+Math.round(x)+','+Math.round(y)+' (landed in '+Q.S.room+')');
    }
  }
}
function clampv(v){return v}
/* arriving must not bounce straight back */
for(const id of free){for(const e of Q.ROOMS[id].exits){if(e.lock&&e.lock())continue;Q.newGame();Q.S.f.sneezed=1;Q.enter(id,[160,160]);Q.enter(e.to,id);for(let i=0;i<60;i++)Q.tick(1/30);ok(Q.S.room===e.to,'no bounce after entering '+e.to+' from '+id)}}
/* boot marks */
Q.newGame();Q.enter('grove',[170,170]);Q.setVerb('boot');Q.click(200,176);ok(Q.marks.length===1,'boot click leaves a mark');
for(let i=0;i<200;i++)Q.tick(1/30);ok(/You kick the ground/.test(Q.S.last)&&/x 200, y 176/.test(Q.S.last),'boot message says where: '+Q.S.last);
Q.setVerb('look');Q.click(200,176);ok(Q.marks.length===1,'look click leaves no extra mark');
console.log(fails?('FAILS '+fails+' of '+n):('ALL PASS ('+n+' checks)'));process.exit(fails?1:0);
