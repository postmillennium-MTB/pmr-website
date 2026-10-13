const fs=require('fs');
function mkP(){const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;if(k==='getContext')return()=>mkP();if(k==='getBoundingClientRect')return()=>({left:0,top:0,width:960,height:600});if(k==='then')return undefined;return mkP()},set(){return true},apply(){return mkP()}})}
global.window=global;global.addEventListener=()=>{};
global.document={getElementById:()=>mkP(),createElement:()=>mkP(),createTextNode:()=>mkP(),querySelectorAll:()=>mkP(),addEventListener(){}};
global.requestAnimationFrame=()=>0;
(0,eval)(fs.readFileSync(__dirname+'/../build/game.js','utf8'));
const Q=window.QC;let fails=0;
function ok(c,m){if(!c){console.log('FAIL',m);fails++}else console.log('ok  ',m)}
const S=()=>Q.S;
function path(from,to){const q=[[from]],seen={[from]:1};while(q.length){const p=q.shift(),c=p[p.length-1];if(c===to)return p;for(const e of Q.ROOMS[c].exits){if(!seen[e.to]){seen[e.to]=1;q.push(p.concat(e.to))}}}return null}
function step(e){const m=(e.a+e.b)/2;const t={W:[0,m],E:[320,m],N:[m,0],S:[m,200]}[e.side];Q.walk(t[0],t[1],14)}
function goto(id){
  let guard=0;
  while(S().room!==id&&guard++<20){
    const p=path(S().room,id);if(!p){console.log('no path',S().room,id);fails++;return}
    const e=Q.ROOMS[S().room].exits.find(x=>x.to===p[1]);
    const before=S().room;step(e);
    if(S().room===before){console.log('  blocked at',before,'->',p[1],'|',S().last.slice(0,60));return false}
  }
  return S().room===id;
}
// graph sanity: every exit has a reverse exit
for(const id of Q.ROOM_IDS)for(const e of Q.ROOMS[id].exits){if(!Q.ROOMS[e.to].exits.some(x=>x.to===id))console.log('FAIL no reverse',id,'->',e.to),fails++}
for(const id of Q.ROOM_IDS){Q.newGame();Q.enter(id,[160,170]);Q.render(1000)}
ok(true,'all rooms render');
Q.newGame();
['map','compass','jar','tea'].forEach(i=>Q.run('hand',i));ok(S().score===4,'score 4: '+S().score);
ok(goto('garden'),'cottage->garden by walking');
Q.use('feather','gnome');Q.use('jar','log');ok(S().f.ink===1,'ink '+S().score);
ok(goto('cross'),'garden->cross');
goto('garden');goto('cross');
Q.run('hand','base');ok(S().f.trowel===1,'trowel '+S().score);
Q.combine('feather','inkjar');ok(S().f.quill===1,'quill');
ok(goto('pond'),'->pond');Q.run('hand','button');ok(S().f.button===1,'button');
ok(goto('falls'),'->falls');Q.run('hand','spoon');ok(S().f.spoon===1,'spoon');
ok(goto('grove'),'->grove');
Q.run('talk','hazel');console.log('  opts',Q.opts());
Q.pickT('Sell the trowel');Q.pickT('provenance');Q.pickT('Sell for 2');ok(S().acorns===2,'2 acorns');
Q.pickT('Sell the button');Q.pickT('Sell for 1');ok(S().acorns===3,'3 acorns');
Q.pickT('Buy the pinecone');ok(S().inv.includes('cone')&&S().acorns===0,'cone bought, acorns 0');
Q.pickT('Goodbye');ok(!S().dlg,'dialog closed');
console.log('  score',S().score);
ok(goto('bridge'),'->bridge (bridge reachable from grove?)');
console.log('  at',S().room);
// blocked north before moose moves
const b=goto('peak');console.log('  peak via bridge before sneeze reachable?',b,S().room);
goto('bridge');
Q.run('talk','moose');Q.pickT('tea');Q.pickT('Hand over');ok(S().f.gaveTea===1,'tea given');Q.pickT('Goodbye');
console.log('  tickle:',Q.use('feather','moose').slice(0,80));ok(S().f.sneezed===1&&S().inv.includes('bell'),'sneezed, bell');
ok(goto('fairy'),'->fairy');
console.log('  bell:',(Q.use('bell','fennel')||'').slice(0,60));
console.log('  opts',Q.opts());
Q.pickT('map went blank');Q.pickT('Where would I find');Q.pickT('I see');Q.pickT('Goodbye');
Q.use('cone','fennel');console.log('  opts',Q.opts());Q.pickT('fix the compass');
ok(S().f.sparkle===1,'sparkle');Q.pickT('Thank');Q.pickT('Goodbye');
console.log('  score before ink tour',S().score);
let guard=0;
while(guard++<40){
  const todo=Q.ROOM_IDS.filter(r=>!S().inked[r]&&r!=='peak');if(!todo.length)break;
  // nearest
  todo.sort((a,b)=>path(S().room,a).length-path(S().room,b).length);
  if(!goto(todo[0]))break;
  Q.combine('feather','map');
}
S().acorns=1;ok(goto('grotto'),'->grotto');console.log('  wish:',String(Q.use('acorn','pool')).slice(0,70));ok(S().f.wished===1&&S().acorns===1,'wish granted, acorn returned');
console.log('  score before peak',S().score,'inked',Object.keys(S().inked).length);
ok(goto('peak'),'->peak');Q.combine('feather','map');
ok(S().over===true,'finale');ok(S().score===61,'score 61: '+S().score);
Q.newGame();ok(S().score===0,'reset');
console.log(fails?('FAILS: '+fails):'ALL PASS');process.exit(fails?1:0);
