const fs=require('fs');const {createCanvas}=require('canvas');
function mkP(){const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;if(k==='getBoundingClientRect')return()=>({left:0,top:0,width:960,height:600});if(k==='then')return undefined;return mkP()},set(){return true},apply(){return mkP()}})}
const cvMain=createCanvas(320,200);cvMain.addEventListener=()=>{};cvMain.getBoundingClientRect=()=>({left:0,top:0,width:960,height:600});
global.window=global;global.addEventListener=()=>{};
global.document={getElementById:(id)=>id==='cv'?cvMain:mkP(),createElement:(t)=>t==='canvas'?createCanvas(320,200):mkP(),querySelectorAll:()=>mkP(),addEventListener(){}};
global.requestAnimationFrame=()=>0;
(0,eval)(fs.readFileSync(__dirname+'/../build/game.js','utf8'));
const Q=window.QC;
const OUT=__dirname+'/../screenshots/';fs.mkdirSync(OUT,{recursive:true});
function save(name,sc){const big=createCanvas(320*sc,200*sc),x=big.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(cvMain,0,0,320*sc,200*sc);fs.writeFileSync(OUT+name+'.png',big.toBuffer('image/png'))}
const only=process.argv.slice(2);
const jobs=[
 ['grove',[170,170],{}],['bridge',[220,160],{}],['bridge_after',[200,160],{sneezed:1,stache:1}],['pond',[110,160],{}],
 ['fairy',[100,176],{}],['fairy_awake',[110,176],{wokeF:1}],['fairy_bright',[110,176],{wokeF:1,sparkle:1}],
 ['falls',[120,168],{}],['grotto',[160,150],{}],['orchard',[160,160],{}],['marsh',[120,160],{}],['burrow',[150,160],{}],['cavern',[150,168],{}],['lake',[120,166],{}],['mine',[150,168],{}],['peak',[130,170],{}],['peak_clear',[130,170],{sparkle:1,wokeF:1}],
 ['birch',[150,168],{}],['pines',[120,168],{}],['fox',[120,170],{}],['owl',[120,170],{}],['camp',[100,176],{}]
];
for(const [name,at,f] of jobs){
  if(only.length&&!only.includes(name))continue;
  const room=name.split('_')[0];
  Q.newGame();Object.assign(Q.S.f,f);Q.enter(room,at);Q.render(2300);save(name,3);
}
console.log('done');
