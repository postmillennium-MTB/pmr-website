
/* ---------- 0.6: the Apple Orchard, the Reed Marsh, and the caves under Fox Hollow ---------- */
function ceilTeeth(seed,c1,c2,hmin,hspan,step){
  var r=rng(seed);
  for(var x=-6;x<340;x+=(step||18)){var h=hmin+(r()*hspan|0);P([[x-9,0],[x,h],[x+9,0]],c1);PD([[x,h],[x+9,0],[x,0]],c1,c2)}
}
function rn(v){return Math.round(v)}

/* ----- the Apple Orchard ----- */
function appleTree(x,base,s,seed){
  var r=rng(seed||1),i;
  R(x-3*s,base-14*s,rn(6*s),rn(14*s),6);R(x+s,base-14*s,rn(2*s),rn(14*s),0);
  E(x,base-26*s,rn(21*s),rn(14*s),2);ED(x-4*s,base-29*s,rn(15*s),rn(9*s),10,2);
  for(i=0;i<9;i++){var ax=x-17*s+r()*34*s,ay=base-36*s+r()*20*s;R(ax,ay,2,2,4);R(ax,ay,1,1,12)}
}
function scarecrow(x,y,t){
  R(x-1,y-34,3,34,6);R(x-14,y-26,29,3,6);
  P([[x-9,y-26],[x+9,y-26],[x+7,y-10],[x-7,y-10]],5);PD([[x-9,y-26],[x+9,y-26],[x+7,y-18],[x-7,y-18]],5,13);
  R(x-3,y-14,6,5,4);
  E(x,y-33,5,5,14);R(x-2,y-34,1,1,0);R(x+2,y-34,1,1,0);R(x-1,y-30,3,1,0);
  /* a hat with a feather, uncomfortably familiar */
  R(x-9,y-38,19,2,2);R(x-5,y-45,11,7,2);R(x-5,y-39,11,1,0);
  var w=Math.round(Math.sin(t*2)*1);
  Ln(x+5,y-43,x+11+w,y-52,12);Ln(x+6,y-43,x+12+w,y-51,12);
  for(var i=0;i<4;i++)R(x-17+i,y-24+(i&1)*2,1,3,14);for(i=0;i<4;i++)R(x+14+i,y-24+(i&1)*2,1,3,14);
}
function beehive(x,y,t,ph){
  R(x-2,y-2,20,2,6);R(x,y-16,16,14,14);D(x,y-16,16,14,14,6);R(x-2,y-19,20,3,6);R(x+6,y-8,4,3,0);
  R(x,y-2,2,4,6);R(x+14,y-2,2,4,6);
  for(var i=0;i<4;i++){var a=t*2.2+ph+i*1.6;R(x+8+Math.cos(a)*13,y-10+Math.sin(a*1.3)*8,1,1,(i&1)?0:14)}
}
function barrow(x,y){
  P([[x-14,y-14],[x+14,y-14],[x+10,y-3],[x-10,y-3]],6);PD([[x-14,y-14],[x+14,y-14],[x+10,y-3],[x-10,y-3]],6,0);
  for(var i=0;i<6;i++)E(x-10+i*4,y-15-(i&1),2,2,4);R(x-9,y-16,3,1,12);
  Ln(x+14,y-14,x+26,y-18,6);Ln(x-14,y-14,x-22,y-18,6);E(x+3,y-1,4,4,0);E(x+3,y-1,2,2,8);
  R(x-8,y-3,2,5,0);R(x+7,y-3,2,5,0);
}
SC.orchard={
  bg:function(){
    use(bgX);
    var r=rng(211),x,i;
    sky(100);clouds([[60,24,20,4],[240,38,16,3],[160,14,12,2]]);
    E(40,104,90,20,3);E(280,106,90,18,3);
    R(0,98,W,102,2);D(0,98,W,5,2,10);
    for(x=8;x<330;x+=38)appleTree(x+(r()*10|0),120,0.55,x);
    R(0,120,W,80,2);D(0,120,W,5,2,10);tufts(212,110,124,198,10);speck(213,80,0,124,320,200,[10,10,2,14]);
    /* the path: west to east, and a spur north to the birches */
    P([[0,152],[320,148],[320,176],[0,180]],6);P([[150,152],[196,150],[184,114],[164,114]],6);
    speck(214,100,0,148,320,180,[14,7,4,6]);
    /* fallen apples */
    for(i=0;i<14;i++){var ax=r()*320,ay=184+r()*12;R(ax,ay,2,2,4)}
    for(i=0;i<8;i++){R(r()*320,124+r()*20,2,2,4)}
    rocks(215,5,0,320,186,198,8,7);
  },
  props:function(t){
    return [
      {y:142,fn:function(){appleTree(34,142,1.5,31);R(40,86,2,50,6);R(52,86,2,50,6);for(var i=0;i<6;i++)R(40,92+i*8,14,2,6)}},
      {y:140,fn:function(){appleTree(296,140,1.5,32)}},
      {y:134,fn:function(){scarecrow(236,134,t)}},
      {y:136,fn:function(){beehive(100,136,t,0);beehive(124,136,t,2)}},
      {y:130,fn:function(){
        R(188,106,3,26,6);R(158,102,40,10,6);R(158,102,40,1,14);R(159,103,38,1,0);R(159,111,38,1,0);
        R(162,106,26,1,0);R(162,108,18,1,0);
      }},
      {y:190,fn:function(){barrow(140,190)}},
      {y:194,fn:function(){
        /* a bench and a basket */
        R(214,180,40,4,6);R(214,184,3,10,6);R(250,184,3,10,6);R(214,170,40,3,6);R(216,172,2,8,6);R(250,172,2,8,6);
        R(262,186,14,8,6);R(262,186,14,2,14);for(var i=0;i<4;i++)E(266+i*3,185,2,2,4);
      }},
      {y:300,fn:function(){
        /* an apple lets go every so often */
        var a=((t*0.22)%1),ax=300,ay=90+a*52;if(a<0.9)R(ax,ay,2,2,4)
      }}
    ];
  },
  fg:function(){E(6,199,18,6,2);E(314,198,22,7,2)}
};

/* ----- the Reed Marsh ----- */
function frog(x,y,t,ph){
  var c=((t*0.8+ph)%3)<0.5;
  E(x,y-3,6,4,2);E(x,y-1,4,2,10);E(x-3,y-7,2,2,2);E(x+3,y-7,2,2,2);R(x-3,y-7,1,1,0);R(x+3,y-7,1,1,0);
  R(x-5,y,3,1,2);R(x+3,y,3,1,2);
  if(c){E(x,y-2,3,3,14);R(x-6+((t*9|0)&1)*12,y-12,1,1,15)}
}
function heron(x,y,t){
  var b=Math.round(Math.sin(t*0.9)*1);
  Ln(x,y,x,y-30,14);Ln(x+1,y,x+1,y-30,14);R(x-3,y-1,7,2,14);
  E(x,y-38,5,10,7);E(x-1,y-37,3,6,15);
  Ln(x+3,y-44,x+6,y-56+b,7);Ln(x+4,y-44,x+7,y-56+b,7);
  E(x+7,y-58+b,3,2,15);Ln(x+10,y-58+b,x+19,y-56+b,14);R(x+8,y-59+b,1,1,0);
  Ln(x-4,y-38,x-12,y-30,8);Ln(x-4,y-36,x-12,y-28,8);R(x+5,y-60+b,5,1,0);
}
SC.marsh={
  bg:function(){
    use(bgX);
    var r=rng(231),x,i;
    sky(80);D(0,56,W,24,11,9);clouds([[90,22,22,4],[240,40,16,3]]);
    E(40,84,90,16,3);E(280,86,100,14,3);
    /* water, all of it */
    R(0,78,W,122,3);D(0,78,W,40,3,11);D(0,118,W,30,3,9);
    for(i=0;i<60;i++){var wx=r()*320,wy=84+r()*114;R(wx,wy,6+r()*14,1,r()<0.5?15:11)}
    /* reeds on the far bank */
    for(x=0;x<320;x+=3){var h=10+(r()*16|0);Ln(x,92,x+(r()<0.5?-2:2),92-h,(x&1)?2:10)}
    /* the boardwalk: east-west, with a spur north */
    R(0,148,W,34,6);D(0,148,W,34,6,0);
    for(x=0;x<320;x+=8){R(x,148,1,34,0)}R(0,148,W,2,14);R(0,180,W,2,0);
    P([[152,150],[192,150],[184,106],[160,106]],6);PD([[152,150],[192,150],[184,106],[160,106]],6,0);Ln(160,150,166,106,0);Ln(172,150,172,106,0);Ln(184,150,178,106,0);Ln(152,150,160,106,0);Ln(192,150,184,106,0);
    /* pilings */
    for(x=6;x<320;x+=40){R(x,180,4,14,0);R(x+1,180,2,13,6)}
    /* lily pads */
    for(i=0;i<16;i++){var lx=r()*320,ly=104+r()*38;if(lx>140&&lx<200)continue;E(lx,ly,5,2,2);R(lx+1,ly-1,3,1,10)}
    for(i=0;i<10;i++){var ly2=190+r()*8,lx2=r()*320;E(lx2,ly2,5,2,2)}
  },
  props:function(t){
    return [
      {y:300,fn:function(){
        /* dragonfly */
        var a=t*1.1,x=200+Math.sin(a)*70,y=108+Math.sin(a*2.1)*14;
        R(x,y,5,1,11);R(x+1,y-1,3,1,15);R(x+1,y+1,3,1,15);R(x+5,y,1,1,12);
      }},
      {y:104,fn:function(){frog(52,112,t,0);frog(260,120,t,1.1)}},
      {y:150,fn:function(){frog(112,134,t,2.2)}},
      {y:150,fn:function(){heron(286,150,t)}},
      {y:174,fn:function(){
        /* the sign */
        R(46,150,3,30,6);R(22,138,52,20,15);R(22,138,52,1,0);R(22,157,52,1,0);R(22,138,1,20,0);R(73,138,1,20,0);
        R(26,142,44,2,0);R(26,146,36,2,0);R(26,150,24,2,0);R(26,154,12,2,4);
      }},
      {y:200,fn:function(){
        /* cattails in front */
        var s=function(x,h){var w=Math.round(Math.sin(t*1.3+x)*1);Ln(x,198,x+w,198-h,2);R(x-1+w,198-h-6,3,7,6);R(x+w,198-h-8,1,2,6)};
        s(14,36);s(24,28);s(300,40);s(310,32);s(190,22);
      }}
    ];
  },
  fg:function(){}
};

/* ----- the Fox's Burrow (a very tidy hole) ----- */
SC.burrow={
  bg:function(){
    use(bgX);
    var r=rng(251),x,i;
    R(0,0,W,200,0);
    R(0,0,W,126,6);D(0,0,W,126,6,0);
    for(x=0;x<340;x+=26)P([[x-12,0],[x,14+(r()*14|0)],[x+12,0]],6);
    for(i=0;i<14;i++){var rx=r()*320;Ln(rx,0,rx+(r()*10-5),12+r()*30,8)}
    /* the two tunnels, drawn before the floor so they stand on it */
    ED(281,112,26,28,8,0);E(281,114,21,25,0);
    ED(6,112,28,34,8,0);E(6,114,23,31,0);
    /* the floor: swept */
    R(0,122,W,78,8);D(0,122,W,78,8,0);
    R(0,122,W,2,0);
    E(281,126,21,3,0);E(6,126,23,3,0);
    /* the rug */
    E(160,166,96,17,4);ED(160,166,86,13,4,12);ED(160,166,50,8,12,14);E(160,166,26,4,4);
    /* shelves of acorn caps */
    R(24,60,70,4,6);R(24,86,70,4,6);R(24,112,70,4,6);R(22,56,4,64,6);R(92,56,4,64,6);
    for(i=0;i<9;i++){E(32+i*7,59,3,2,14);E(32+i*7,85,3,2,6);E(32+i*7,111,3,2,14)}
    R(24,60,70,1,0);R(24,86,70,1,0);R(24,112,70,1,0);
    /* a framed certificate */
    R(112,36,38,26,6);R(114,38,34,22,15);R(116,42,30,2,0);R(116,46,24,2,0);R(116,50,28,2,0);R(116,54,10,2,4);
    /* the lamp, on a tall stand */
    R(172,74,2,52,6);R(168,126,10,2,6);R(170,70,6,6,6);E(173,68,6,5,14);E(173,68,3,3,15);
    /* the armchair */
    R(194,96,52,32,4);R(198,100,44,22,12);D(198,100,44,22,12,4);
    R(190,108,10,24,4);R(240,108,10,24,4);R(194,116,52,14,4);R(194,116,52,2,12);
    R(196,130,5,5,6);R(239,130,5,5,6);
    /* a mug and very small spectacles on the arm */
    R(243,104,5,4,15);R(244,105,3,2,6);
  },
  props:function(t){
    return [
      {y:300,fn:function(){
        var f=Math.sin(t*5)>0.2?1:0;EF(173,68,10+f,9,14,0);
        for(var i=0;i<5;i++){var a=((t*0.4+i*0.2)%1);R(120+i*20+Math.sin(t+i)*5,60+a*80,1,1,i&1?14:15)}
      }}
    ];
  },
  fg:function(){
    E(160,208,44,22,0);E(160,210,38,20,11);ED(160,212,30,16,15,11);
    R(118,186,84,3,6);
    R(132,176,56,10,6);R(132,176,56,1,0);R(132,185,56,1,0);
    R(136,178,48,2,0);R(136,182,34,2,0);
  }
};

/* ----- Glowcap Cavern ----- */
function glowcap(x,base,h,w,c1,c2,t,ph){
  var g=Math.sin(t*1.5+ph)>0;
  EF(x,base-h-4,w+10,Math.round(w*0.6)+8,c2,g?0:1);
  R(x-2,base-h,5,h,7);R(x-2,base-h,2,h,15);R(x+2,base-h,1,h,8);
  E(x,base-h,w,Math.round(w*0.55),c1);E(x,base-h+Math.round(w*0.3),w-2,Math.round(w*0.25),c2);
  R(x-w+4,base-h-Math.round(w*0.3),2,2,15);R(x+Math.round(w*0.3),base-h-Math.round(w*0.4),3,2,15);R(x-3,base-h-Math.round(w*0.5)+2,2,1,15);
  E(x,base,6,2,0);
}
SC.cavern={
  bg:function(){
    use(bgX);
    var r=rng(271),x,i;
    R(0,0,W,200,0);R(0,0,W,126,0);D(0,60,W,66,0,1);
    ceilTeeth(272,8,0,16,36,18);
    R(0,122,W,78,8);D(0,122,W,78,8,0);speck(273,120,0,124,320,200,[7,8,0,1,5]);
    /* a thin bright shaft from a crack in the ceiling */
    P([[140,0],[176,0],[200,126],[120,126]],1);PD([[140,0],[176,0],[200,126],[120,126]],1,0);
    PD([[148,0],[168,0],[184,126],[134,126]],1,9);
    /* a small stream along the back */
    P([[0,120],[320,116],[320,128],[0,132]],1);PD([[0,122],[320,118],[320,126],[0,130]],1,9);
    for(i=0;i<22;i++)R(r()*320,120+r()*8,3+r()*5,1,i&1?11:15);
    /* the entry on the east: a tunnel mouth, warm lamplight */
    E(318,152,16,28,0);E(318,152,12,24,6);ED(318,156,10,18,6,14);
    /* the arch to the north: a dark passage */
    ED(158,118,20,12,0,1);E(158,122,16,10,0);
    for(i=0;i<5;i++){var sx=20+i*68+(r()*20|0),sh=18+(r()*20|0);P([[sx-8,176],[sx,176-sh],[sx+8,176]],8);PD([[sx,176-sh],[sx+8,176],[sx,176]],8,0)}
  },
  props:function(t){
    return [
      {y:150,fn:function(){glowcap(52,150,40,16,13,5,t,0);glowcap(26,160,22,10,11,3,t,1.5)}},
      {y:168,fn:function(){glowcap(98,172,16,8,10,2,t,3)}},
      {y:150,fn:function(){glowcap(250,152,50,20,11,3,t,2);glowcap(284,164,28,12,13,5,t,4)}},
      {y:184,fn:function(){glowcap(190,186,12,7,13,5,t,5);glowcap(206,188,8,5,10,2,t,6)}},
      {y:300,fn:function(){
        /* spores, rising */
        var r=rng(275);for(var i=0;i<22;i++){var a=((t*0.12+i*0.047)%1),x=r()*320,y=190-a*160+r()*10;
          if((i&1)||Math.sin(t*3+i)>-0.3)R(x+Math.sin(t+i)*5,y,1,1,(i%3===0)?11:(i%3===1?13:10))}
      }}
    ];
  },
  fg:function(){}
};

/* ----- Lantern Lake ----- */
SC.lake={
  bg:function(){
    use(bgX);
    var r=rng(291),x,i;
    R(0,0,W,200,0);
    ceilTeeth(292,8,0,20,40,17);
    /* the lake: black glass with dim reflections */
    R(0,80,W,76,0);D(0,100,W,56,0,1);
    for(x=-6;x<340;x+=19){var h=14+(r()*14|0);P([[x-9,150],[x,150+h*0.6],[x+9,150]],1)}
    for(i=0;i<50;i++){var wx=r()*320,wy=88+r()*62;R(wx,wy,6+r()*18,1,r()<0.6?1:9)}
    /* far shore: tiny lights, a tiny town of mushrooms */
    R(0,84,W,6,8);D(0,84,W,6,8,0);
    for(i=0;i<18;i++){var tx=10+r()*300,ty=80+r()*4;R(tx,ty,1,1,(i%3)?14:11);R(tx,86+r()*3,1,1,(i%3)?6:3)}
    for(i=0;i<18;i++)R(10+r()*300,98+r()*30,1,1,i&1?14:11);
    /* the near shore */
    R(0,146,W,54,8);D(0,146,W,54,8,0);speck(293,90,0,148,320,200,[7,8,0,1]);
    P([[0,146],[320,146],[320,152],[0,152]],7);D(0,146,W,6,7,8);
    /* the dock: planks into the water */
    R(40,118,40,34,6);D(40,118,40,34,6,0);R(40,118,2,34,0);R(78,118,2,34,0);for(i=0;i<5;i++)R(40,120+i*7,40,1,0);
    R(40,116,4,6,6);R(76,116,4,6,6);R(42,100,1,16,6);R(78,100,1,16,6);
  },
  props:function(t){
    var bob=Math.round(Math.sin(t*0.9)*1);
    return [
      {y:300,fn:function(){
        /* drips from the ceiling, rings below */
        var r=rng(295);for(var i=0;i<3;i++){var a=((t*0.3+i*0.33)%1),x=120+i*60+r()*20;
          if(a<0.5)R(x,30+a*2*90,1,2,15);else{var q=(a-0.5)*2;ED(x,128+i*5,Math.round(2+q*14),Math.round(1+q*4),q<0.6?11:1,0)}}
      }},
      {y:130,fn:function(){
        /* the rowboat */
        P([[100,128+bob],[150,128+bob],[142,138+bob],[108,138+bob]],6);PD([[100,128+bob],[150,128+bob],[142,138+bob],[108,138+bob]],6,0);
        R(100,127+bob,50,2,14);R(122,124+bob,2,4,6);Ln(80,122,100,129+bob,7);
        E(125,140,26,3,1);
      }},
      {y:150,fn:function(){
        /* lantern post, off duty fish in the water */
        R(256,100,3,52,6);R(250,98,15,3,6);R(252,104,11,12,0);R(253,105,9,10,14);R(256,105,3,10,6);
        EF(258,110,14,12,14,0);EF(258,110,26,20,6,1);
      }},
      {y:300,fn:function(){
        /* a fish, its own lantern on a stalk, drifting */
        var fx=200+Math.sin(t*0.5)*40,fy=120+Math.sin(t*0.9)*3;
        E(fx,fy,9,4,8);P([[fx-9,fy],[fx-14,fy-4],[fx-14,fy+4]],8);R(fx+5,fy-1,1,1,15);
        Ln(fx+4,fy-3,fx+10,fy-9,8);R(fx+10,fy-10,2,2,Math.sin(t*3)>-0.3?14:6);
      }},
      {y:176,fn:function(){
        /* a sign on a post */
        R(176,150,3,28,6);R(150,138,56,18,15);R(150,138,56,1,0);R(150,155,56,1,0);R(150,138,1,18,0);R(205,138,1,18,0);
        R(154,142,48,2,0);R(154,146,40,2,0);R(154,150,28,2,4);
      }}
    ];
  },
  fg:function(){}
};

/* ----- the Old Quartz Mine ----- */
function timber(x,w,top){R(x,top,w,126-top,6);R(x,top,w,126-top,6);R(x+1,top,2,126-top,0);R(x+w-3,top,2,126-top,0);R(x,top,w,3,0);for(var y=top+12;y<126;y+=12)R(x,y,w,1,0)}
SC.mine={
  bg:function(){
    use(bgX);
    var r=rng(311),x,i;
    R(0,0,W,200,0);
    R(0,0,W,126,8);D(0,0,W,126,8,0);
    for(i=0;i<60;i++)R(r()*320,r()*126,1+r()*6,1,r()<0.5?0:7);
    ceilTeeth(312,0,8,10,20,22);
    /* the work face: a cave-in, pale rubble */
    P([[110,126],[130,60],[180,40],[240,50],[270,126]],0);
    for(i=0;i<40;i++){var bx=124+r()*140,by=62+r()*60;E(bx,by,3+r()*6,2+r()*4,r()<0.5?8:7)}
    for(i=0;i<14;i++)R(124+r()*140,62+r()*60,2,2,r()<0.5?11:3);
    /* beams across */
    R(0,22,W,6,6);R(0,22,W,1,0);R(0,27,W,1,0);
    timber(20,14,22);timber(286,14,22);timber(100,12,22);timber(212,12,22);
    /* floor and rails */
    R(0,126,W,74,8);D(0,126,W,74,8,0);speck(313,100,0,128,320,200,[7,8,0]);
    for(x=0;x<320;x+=14){R(x,150,6,3,6);R(x,172,7,3,6)}
    R(0,152,W,2,7);R(0,156,W,1,8);R(0,173,W,2,7);R(0,177,W,1,8);
    /* sign, nailed to a beam */
    R(36,40,52,22,15);R(36,40,52,1,0);R(36,61,52,1,0);R(36,40,1,22,0);R(87,40,1,22,0);
    R(40,45,44,2,0);R(40,50,36,2,0);R(40,55,22,2,4);
  },
  props:function(t){
    var f=Math.sin(t*7)>-0.2;
    return [
      {y:170,fn:function(){
        /* the mine cart, full of rock and one acorn */
        P([[180,160],[230,160],[222,178],[188,178]],8);PD([[180,160],[230,160],[222,178],[188,178]],8,7);R(178,158,54,3,0);R(179,158,52,1,7);
        E(194,182,5,5,0);E(194,182,3,3,8);E(218,182,5,5,0);E(218,182,3,3,8);
        for(var i=0;i<5;i++)E(190+i*9,157-(i&1)*2,5,3,i&1?7:8);R(212,150,4,4,6);R(213,149,2,1,6);
      }},
      {y:176,fn:function(){
        /* a pickaxe, stuck in the floor, hung with a hat */
        R(272,148,3,30,6);R(264,146,20,4,8);R(264,146,4,6,8);R(280,146,4,6,8);R(270,142,8,5,2);R(274,139,2,4,12);
      }},
      {y:300,fn:function(){
        /* lamplight, flickering */
        EF(96,66,14+(f?1:0),12,14,0);R(94,58,4,10,6);E(96,64,5,4,14);if(f)E(96,64,3,2,15);
        EF(250,64,14+(f?0:1),12,14,1);R(248,58,4,10,6);E(250,58,5,4,14);if(f)E(250,58,3,2,15);
      }}
    ];
  },
  fg:function(){}
};
