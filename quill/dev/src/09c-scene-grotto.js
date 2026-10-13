
/* ---------- THE GLIMMER GROTTO (behind the waterfall) ---------- */
function crystal(x,y,h,c1,c2,lean){
  var l=lean||0;
  P([[x-6,y],[x-4+l,y-h*0.75],[x+l,y-h],[x+5+l,y-h*0.7],[x+7,y]],c1);
  PD([[x+l,y-h],[x+5+l,y-h*0.7],[x+7,y],[x+1,y]],c1,c2);
  Ln(x-4+l,y-h*0.75,x-4,y,15);R(x+l-1,y-h+2,1,3,15);
}
SC.grotto={
  bg:function(){
    use(bgX);
    var r=rng(171),x,i;
    R(0,0,W,200,0);
    R(0,0,W,126,1);D(0,70,W,56,1,0);D(0,0,W,24,1,0);
    /* a round window of daylight, far back, full of leaves */
    E(160,86,38,42,0);ED(160,86,35,39,11,15);ED(160,88,30,34,10,11);
    ED(148,96,12,16,2,10);ED(172,98,13,15,2,10);ED(160,78,10,10,10,15);R(158,100,5,24,6);
    ED(160,86,35,39,11,15);   /* light spills over the leaves */
    for(i=0;i<9;i++)R(140+r()*40,60+r()*50,1,1,15);
    /* stalactites */
    for(x=-6;x<340;x+=19){var h=14+(r()*30|0);P([[x-9,0],[x,h],[x+9,0]],8);PD([[x,h],[x+9,0],[x,0]],8,0)}
    /* floor and the wishing pool */
    R(0,122,W,78,8);D(0,122,W,78,8,0);
    speck(172,80,0,124,320,200,[7,8,0,1]);
    E(160,152,92,22,0);ED(160,151,88,20,3,1);ED(160,151,74,15,9,3);ED(160,151,50,9,11,9);
    for(i=0;i<20;i++)R(100+r()*120,144+r()*14,2,1,15);
    /* crystal clusters */
    crystal(24,150,70,13,5,-2);crystal(46,156,48,11,3,2);crystal(10,162,36,13,15,1);crystal(64,164,30,11,3,-1);
    crystal(296,150,74,11,3,2);crystal(274,158,46,13,5,-2);crystal(312,166,34,11,15,-1);crystal(254,166,28,13,5,1);
    /* stalagmites at the edges */
    P([[86,172],[96,140],[106,172]],8);PD([[96,140],[106,172],[96,172]],8,0);P([[218,176],[228,146],[238,176]],8);PD([[228,146],[238,176],[228,176]],8,0);
  },
  props:function(t){
    return [
      {y:300,fn:function(){
        /* drifting lights */
        var r=rng(173);
        for(var i=0;i<16;i++){
          var bx=r()*320,by=24+r()*130,sp=0.2+r()*0.4,ph=r()*6.28;
          var px=bx+Math.sin(t*sp+ph)*14,py=by+Math.sin(t*sp*1.3+ph*2)*9;
          var tw=Math.sin(t*3+ph)>-0.2;
          R(px,py,1,1,tw?15:11);if(tw&&(i&1)){R(px-1,py,3,1,11);R(px,py-1,1,3,11)}
        }
      }},
      {y:120,fn:function(){
        /* the pool breathes: slow rings spread from the middle */
        for(var i=0;i<3;i++){var a=((t*0.22+i/3)%1);ED(160,151,Math.round(6+a*60),Math.round(2+a*11),a<0.5?15:11,9)}
      }},
      {y:154,fn:function(){
        /* crystals pulse */
        var g=Math.sin(t*2)>0.3;if(g){R(25,86,1,1,15);R(297,82,1,1,15);R(47,112,1,1,15);R(275,114,1,1,15)}
        if(Math.sin(t*2.7+1)>0.6){R(11,127,1,1,15);R(313,132,1,1,15)}
      }}
    ];
  },
  fg:function(){
    /* the waterfall, seen from behind, across the way out */
    for(var x=104;x<218;x+=3){R(x,181,1,19,(x/3|0)&1?15:11)}
    R(104,181,114,1,15);
    var t=performance.now()/1000;
    for(var i=0;i<14;i++){var a=((t*1.4+i*0.37)%1);R(106+i*8,181+a*19,1,5,15)}
  }
};
