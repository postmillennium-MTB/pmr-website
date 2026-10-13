
/* ---------- new actors: Hazel, Magnus, Fennel ---------- */
function flipB(x,y,f){return function(dx,dy,w,h,c){R(f>0?x+dx:x-dx-w+1,y+dy,w,h,c)}}
function flipD(x,y,f){return function(dx,dy,w,h,c1,c2){for(var yy=0;yy<h;yy++)for(var xx=0;xx<w;xx++){var px=dx+xx;R(f>0?x+px:x-px,y+dy+yy,1,1,((xx+yy)&1)?c2:c1)}}}

/* Hazel, a squirrel with a ledger's worth of opinions. Faces right when f>0. */
function squirrelDraw(x,y,t,f){
  x=Math.round(x);y=Math.round(y);
  var B=flipB(x,y,f),sw=Math.round(Math.sin(t*1.6)*1.5);
  B(-12,-5,5,6,6);B(-14,-11,5,7,6);B(-15,-18,6,8,6);B(-13,-25,7,8,6);B(-10+sw,-30,7,6,6);B(-8+sw,-33,5,3,6);
  B(-15,-15,2,4,14);B(-13+sw,-29,2,3,14);B(-9+sw,-33,3,1,14);
  B(-7,-15,11,14,6);B(1,-13,3,10,15);B(-9,-8,6,8,6);
  B(-5,-2,6,2,6);B(2,-2,6,2,6);B(3,-1,5,1,0);
  B(1,-24,10,9,6);B(2,-28,3,4,6);B(7,-28,3,4,6);B(3,-29,1,1,0);B(8,-29,1,1,0);
  B(8,-21,2,2,0);B(9,-19,3,3,15);B(11,-20,2,2,0);B(4,-18,3,3,6);
  B(4,-14,4,3,6);B(7,-16,4,4,14);B(7,-17,4,2,6);
}

/* Magnus, a moose in mourning for tea. Faces right when f>0. */
function mooseDraw(x,y,t,f,opt){
  x=Math.round(x);y=Math.round(y);opt=opt||{};
  var B=flipB(x,y,f),BD=flipD(x,y,f);
  function fp(pts){return pts.map(function(p){return [f>0?x+p[0]:x-p[0],y+p[1]]})}
  function PP(pts,c){P(fp(pts),c)}
  function PPD(pts,c1,c2){PD(fp(pts),c1,c2)}
  function OL(pts,c){var q=fp(pts);for(var i=0;i<q.length;i++){var a=q[i],b=q[(i+1)%q.length];Ln(a[0],a[1],b[0],b[1],c)}}
  /* far antler (behind, hazy) */
  PPD([[30,-52],[18,-64],[14,-80],[20,-70],[22,-86],[28,-72],[34,-70],[40,-56]],14,6);
  /* far legs, darker */
  BD(-22,-26,6,26,6,0);BD(12,-26,6,26,6,0);B(-23,-3,8,3,0);B(11,-3,8,3,0);
  /* body with a shoulder hump, rump and tail stub */
  PP([[-32,-40],[-24,-47],[-6,-48],[6,-57],[18,-56],[26,-46],[24,-24],[-28,-24],[-34,-30]],6);
  PPD([[-32,-31],[24,-31],[24,-24],[-28,-24]],6,0);
  OL([[-32,-40],[-24,-47],[-6,-48],[6,-57],[18,-56],[26,-46],[24,-24],[-28,-24],[-34,-30]],0);
  PPD([[6,-57],[18,-56],[26,-46],[12,-46]],6,14);
  B(-36,-38,4,8,0);
  /* near legs */
  B(-29,-26,9,26,0);B(-28,-26,7,24,6);B(-28,-4,7,4,0);B(-26,-18,2,14,0);
  B(16,-26,9,26,0);B(17,-26,7,24,6);B(17,-4,7,4,0);B(18,-18,2,14,0);
  /* neck and head */
  PP([[12,-56],[26,-54],[40,-46],[38,-30],[24,-34]],6);
  PP([[30,-52],[44,-54],[54,-42],[62,-34],[62,-27],[50,-27],[40,-34],[32,-40]],6);
  PPD([[40,-34],[62,-27],[50,-27],[38,-33]],6,0);
  OL([[30,-52],[44,-54],[54,-42],[62,-34],[62,-27],[50,-27],[40,-34],[32,-40]],0);
  B(58,-31,6,6,6);B(62,-30,2,2,0);
  B(34,-33,3,10,0);B(35,-32,1,7,6);
  B(32,-58,5,5,6);B(33,-57,2,3,0);
  if(opt.awake){B(46,-47,4,4,15);B(48,-46,2,3,0);B(45,-49,6,1,0);B(55,-34,6,1,0)}
  else{B(45,-46,5,1,0);B(45,-48,6,1,0);B(55,-34,6,1,0)}
  if(opt.stache){B(56,-28,10,2,0);B(54,-27,2,2,0);B(66,-27,2,2,0)}
  /* near antler: a palm with five tines */
  var palm=[[38,-54],[46,-56],[50,-62],[58,-70],[64,-80],[58,-72],[54,-88],[48,-76],[44,-90],[38,-76],[32,-86],[28,-72],[24,-76],[30,-60]];
  PP(palm,14);
  PPD([[38,-54],[46,-56],[50,-62],[58,-70],[52,-64],[40,-66],[32,-62],[30,-60]],14,6);
  OL(palm,6);
  if(!opt.clean){
    var nests=[[64,-81],[54,-89],[44,-91],[32,-87],[24,-77],[14,-81],[22,-87]];
    for(var i=0;i<nests.length;i++){
      var n=nests[i],bob=Math.round(Math.sin(t*2+i)*0.6);
      B(n[0]-3,n[1]+bob,8,4,6);B(n[0]-3,n[1]+bob,8,1,0);B(n[0]-2,n[1]+3+bob,6,1,0);B(n[0]-4,n[1]+1+bob,2,1,0);B(n[0]+5,n[1]+1+bob,2,1,0);
      if(i%2===0){B(n[0]-1,n[1]-3+bob,3,3,7);B(n[0]+2,n[1]-4+bob,2,2,7);B(n[0]+3,n[1]-3+bob,1,1,14)}
    }
  }
  if(!opt.awake){
    for(var k=0;k<3;k++){var a=((t*0.4+k/3)%1),px=f>0?x+66+a*14:x-66-a*14,py=y-28-a*12;E(px,py,1+Math.round(a*3),1+Math.round(a*2),a<0.6?7:8)}
  }
}

/* Fennel, Chief Navigation Fairy (provisional). state: 'asleep' | 'awake'; bright when recharged. */
function fairyDraw(x,y,t,state,bright){
  x=Math.round(x);y=Math.round(y);
  var dress=bright?13:7,hair=bright?14:8,wa=bright?11:7,wb=bright?15:8,skin=bright?12:7;
  if(state==='asleep'){
    ED(x-4,y-17,10,5,wa,wb);
    R(x-10,y-9,17,6,dress);R(x-10,y-9,17,1,hair===8?7:15);
    R(x+6,y-12,7,7,skin);R(x+5,y-14,9,3,hair);R(x+10,y-9,1,1,0);R(x+11,y-8,2,1,4);
    R(x-13,y-8,3,2,skin);R(x-14,y-6,2,2,skin);
    var z=((t*0.6)%1);for(var i=0;i<3;i++){var a=(z+i/3)%1,zx=x+14+a*10,zy=y-18-a*18;
      R(zx,zy,4,1,15);R(zx+3,zy+1,1,1,15);R(zx+2,zy+2,1,1,15);R(zx+1,zy+3,1,1,15);R(zx,zy+4,4,1,15)}
  }else{
    var bob=Math.round(Math.sin(t*3)*2),fl=Math.sin(t*20)>0?5:3;
    if(bright){ED(x,y-16+bob,14,14,13,11)}
    ED(x-9,y-17+bob,fl,7,wa,wb);ED(x+9,y-17+bob,fl,7,wa,wb);
    P([[x-5,y-5+bob],[x+5,y-5+bob],[x+2,y-16+bob],[x-2,y-16+bob]],dress);
    R(x-3,y-23+bob,7,7,skin);R(x-4,y-25+bob,9,3,hair);R(x-4,y-23+bob,2,6,hair);
    R(x,y-20+bob,1,1,0);R(x+2,y-20+bob,1,1,0);R(x,y-17+bob,3,1,bright?4:0);
    R(x-2,y-5+bob,1,5,skin);R(x+1,y-5+bob,1,5,skin);
  }
}
function sparkles(t,cx,cy,rx,ry,n,seed){
  var r=rng(seed);
  for(var i=0;i<n;i++){
    var a=r()*6.283,b=r()*6.283,ph=r()*6.283,sp=0.5+r()*0.8;
    var px=cx+Math.cos(a+t*sp)*rx*(0.4+r()*0.6),py=cy+Math.sin(b+t*sp*0.8)*ry*(0.4+r()*0.6);
    var tw=Math.sin(t*5+ph)>0;
    R(px,py,1,1,tw?15:14);if(tw){R(px-1,py,3,1,14);R(px,py-1,1,3,14)}
  }
}
