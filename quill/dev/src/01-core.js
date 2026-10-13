(function(){
'use strict';
/* ---------- core: EGA palette, pixel helpers, icons ---------- */
var W=320,H=200;
var PAL=['#000000','#0000AA','#00AA00','#00AAAA','#AA0000','#AA00AA','#AA5500','#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFF55','#FFFFFF'];
var $=function(id){return document.getElementById(id)};
var cv=$('cv'),ctx=cv.getContext('2d');
function mk(w,h){var c=document.createElement('canvas');c.width=w||W;c.height=h||H;return c}
var bgC=mk(),bgX=bgC.getContext('2d');
var g=ctx;
function use(x){g=x;if(g)g.imageSmoothingEnabled=false}
function R(x,y,w,h,c){if(w<=0||h<=0)return;g.fillStyle=PAL[c];g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function D(x,y,w,h,c1,c2){for(var yy=0;yy<h;yy++)for(var xx=0;xx<w;xx++)R(x+xx,y+yy,1,1,((xx+yy)&1)?c2:c1)}
function E(cx,cy,rx,ry,c){for(var dy=-ry;dy<=ry;dy++){var hw=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry+0.0001))));R(cx-hw,cy+dy,hw*2+1,1,c)}}
function ED(cx,cy,rx,ry,c1,c2){for(var dy=-ry;dy<=ry;dy++){var hw=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry+0.0001))));for(var dx=-hw;dx<=hw;dx++)R(cx+dx,cy+dy,1,1,((dx+dy)&1)?c2:c1)}}
function P(pts,c){
  var y0=1e9,y1=-1e9,i,j;
  for(i=0;i<pts.length;i++){y0=Math.min(y0,pts[i][1]);y1=Math.max(y1,pts[i][1])}
  for(var y=Math.floor(y0);y<=Math.floor(y1);y++){
    var xs=[];
    for(i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];
      if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    xs.sort(function(p,q){return p-q});
    for(j=0;j+1<xs.length;j+=2){var xa=Math.round(xs[j]),xb=Math.round(xs[j+1]);R(xa,y,xb-xa+1,1,c)}
  }
}
function PD(pts,c1,c2){
  var y0=1e9,y1=-1e9,i,j;
  for(i=0;i<pts.length;i++){y0=Math.min(y0,pts[i][1]);y1=Math.max(y1,pts[i][1])}
  for(var y=Math.floor(y0);y<=Math.floor(y1);y++){
    var xs=[];
    for(i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];
      if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    xs.sort(function(p,q){return p-q});
    for(j=0;j+1<xs.length;j+=2){var xa=Math.round(xs[j]),xb=Math.round(xs[j+1]);for(var x=xa;x<=xb;x++)R(x,y,1,1,((x+y)&1)?c2:c1)}
  }
}
/* translucent ellipse: only every other pixel (for fog and haze) */
function EF(cx,cy,rx,ry,c,ph){for(var dy=-ry;dy<=ry;dy++){var hw=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry+0.0001))));for(var dx=-hw;dx<=hw;dx++)if(((cx+dx+cy+dy+(ph||0))&1)===0)R(cx+dx,cy+dy,1,1,c)}}
function Ln(x0,y0,x1,y1,c){
  x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  var dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy,n=0;
  for(;;){R(x0,y0,1,1,c);if((x0===x1&&y0===y1)||n++>600)break;var e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}
}
function rng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function clamp(v,a,b){return v<a?a:(v>b?b:v)}

/* ---------- icons (16x16): verbs and items ---------- */
var CH={k:0,B:1,G:2,C:3,R:4,M:5,N:6,L:7,D:8,b:9,g:10,c:11,r:12,m:13,y:14,w:15};
var GRID={
look:['................','................','................','....kkkkkkkk....','..kkwwwwwwwwkk..','.kwwwwbbbbwwwwk.','kwwwwbbkkbbwwwwk','kwwwwbbkkbbwwwwk','.kwwwwbbbbwwwwk.','..kkwwwwwwwwkk..','....kkkkkkkk....'],
hand:['................','.......kk.......','......krrk......','......krrk.kk...','......krrkkrrk..','..kk..krrkrrrrk.','.krrkkkrrrrrrrk.','.krrrrkrrrrrrrk.','..krrrrrrrrrrrk.','..krrrrrrrrrrk..','...krrrrrrrrrk..','...krrrrrrrrk...','....krrrrrrrk...','....kkkkkkkkk...'],
talk:['................','..kkkkkkkkkkkk..','.kwwwwwwwwwwwwk.','kwwwwwwwwwwwwwwk','kwwkkwwkkwwkkwwk','kwwwwwwwwwwwwwwk','kwwwwwwwwwwwwwwk','.kwwwwwwwwwwwwk.','..kkkkwwkkkkkk..','.....kwwk.......','......kwk.......','.......kk.......'],
boot:['................','.....kkkkk......','.....kNNNk......','.....kNyNk......','.....kNNNk......','.....kNyNk......','.....kNNNkk.....','.....kNNNNNkk...','.....kNNNNNNNk..','....kNNNNNNNNNk.','....kkkkkkkkkkk.'],
map:['................','................','.NNNNNNNNNNNNNN.','.NyyyyyyyyyyyyN.','.NyyyyyyLLyyyyN.','.NyyyyLyyyLyyyN.','.NyyyyyyyyyyyyN.','.NyLyyyyyyyyyyN.','.NyyyyyyyyLyyyN.','.NyyyyyyyyyyyyN.','.NNNNNNNNNNNNNN.'],
compass:['................','.....kkkkkk.....','...kkNNNNNNkk...','..kNNwwwwwwNNk..','.kNNwwwRwwwwNNk.','.kNwwwwRwwwwwNk.','kNNwwwwRwwwwwNNk','kNwwwwwkwwwwwwNk','kNwwwwwbwwwwwwNk','kNNwwwwbwwwwwNNk','.kNwwwwbwwwwwNk.','.kNNwwwwwwwwNNk.','..kNNwwwwwwNNk..','...kkNNNNNNkk...','.....kkkkkk.....'],
feather:['................','..............rr','............rrrr','..........rrrrRr','........rrrrRrr.','......rrrrRrr...','....rrrrRrr.....','...rrrRrr.......','..rwRrr.........','.kwwr...........','kwk.............','k...............']
};
var RECTS={
jar:[[4,4,8,9,11],[3,3,10,1,0],[3,4,1,10,0],[12,4,1,10,0],[3,13,10,1,0],[4,1,8,2,6],[4,3,8,1,7],[5,5,1,6,15]],
inkjar:[[4,4,8,9,11],[4,8,8,5,1],[5,9,1,3,9],[3,3,10,1,0],[3,4,1,10,0],[12,4,1,10,0],[3,13,10,1,0],[4,1,8,2,6],[4,3,8,1,7],[5,5,1,3,15]],
trowel:[[6,1,4,2,7],[5,3,6,3,7],[5,6,6,2,7],[6,8,4,1,7],[7,3,1,4,15],[5,3,1,5,8],[10,3,1,5,8],[7,9,2,2,8],[6,11,4,4,6],[6,14,4,1,0]],
tea:[[3,2,10,2,7],[3,4,10,10,4],[5,6,6,5,15],[6,7,4,1,0],[6,9,3,1,0],[3,13,10,1,8]],
acorn:[[7,1,2,2,6],[4,3,8,3,6],[3,5,10,1,0],[4,6,8,5,14],[5,11,6,2,14],[6,13,4,1,14],[10,7,2,4,6],[5,7,1,3,15]],
button:[[5,3,6,1,14],[4,4,8,1,14],[3,5,10,6,14],[4,11,8,1,14],[5,12,6,1,14],[11,5,1,6,6],[6,6,1,1,0],[9,6,1,1,0],[6,9,1,1,0],[9,9,1,1,0],[4,5,2,1,15]],
spoon:[[6,1,4,1,15],[5,2,6,4,15],[6,6,4,1,15],[10,2,1,4,7],[7,7,2,7,7],[9,7,1,7,8],[7,13,2,1,8]],
bell:[[7,1,2,2,6],[6,3,4,1,14],[5,4,6,1,14],[4,5,8,4,14],[3,9,10,2,14],[2,11,12,1,6],[7,12,2,2,6],[5,5,1,3,15],[10,5,2,5,6]],
cone:[[7,0,2,1,6],[6,1,4,2,6],[5,3,6,2,6],[4,5,8,3,6],[4,8,8,3,6],[5,11,6,2,6],[6,13,4,1,6],[5,4,1,1,0],[8,4,1,1,0],[6,6,1,1,0],[9,6,1,1,0],[5,8,1,1,0],[8,8,1,1,0],[6,10,1,1,0],[9,10,1,1,0],[11,9,2,4,14],[11,13,2,1,14]]
};
var ICON={};
function paintIcon(name){
  var c=mk(16,16),x=c.getContext('2d'),p=g;use(x);
  var gr=GRID[name];
  if(gr){for(var y=0;y<gr.length;y++)for(var i=0;i<16;i++){var ch=gr[y].charAt(i);if(ch&&ch!=='.'&&CH[ch]!==undefined)R(i,y,1,1,CH[ch])}}
  else if(RECTS[name]){RECTS[name].forEach(function(r){R(r[0],r[1],r[2],r[3],r[4])})}
  g=p;ICON[name]=c;return c;
}
['look','hand','talk','boot','map','compass','feather','jar','inkjar','trowel','tea','acorn','button','spoon','bell','cone'].forEach(paintIcon);
