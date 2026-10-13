const {chromium}=require('playwright-core');
const D=__dirname+'/../';
require('fs').mkdirSync(D+'screenshots',{recursive:true});
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
  const ctx=await b.newContext({viewport:{width:1000,height:1300}});
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  const url='file://'+require('path').resolve(D,'build/quill-and-compass.html');
  await p.goto(url);await p.waitForTimeout(500);
  console.log('first visit: menu open?',await p.evaluate(()=>QC.gmOpen));
  // play: pick up map via real click, walk west
  const box=await p.locator('#cv').boundingBox();
  const at=(x,y)=>[box.x+x*box.width/320,box.y+y*box.height/200];
  await p.click('[data-verb=hand]');
  let [x,y]=at(170,137);await p.mouse.click(x,y);await p.waitForTimeout(2800);
  await p.click('[data-verb=look]');
  [x,y]=at(2,165);await p.mouse.click(x,y);await p.waitForTimeout(6000);
  const st=()=>p.evaluate(()=>QC.S.room+' score='+QC.S.score+' inv='+QC.S.inv.join(','));
  console.log('before reload',await st());
  await p.waitForTimeout(2000); // autosave
  await p.reload();await p.waitForTimeout(600);
  console.log('after reload: welcome shown?',await p.evaluate(()=>QC.gmOpen),'|',await p.locator('#gmnote').innerText());
  await p.screenshot({path:D+'screenshots/live_welcome.png'});
  await p.click('#gmcont');await p.waitForTimeout(300);
  console.log('after continue',await st(),'menu',await p.evaluate(()=>QC.gmOpen));
  // keys in textarea must not move/verb-switch
  await p.click('#menubtn');await p.waitForTimeout(200);
  const code=await p.locator('#gmout').inputValue();console.log('code',code.slice(0,16),code.length);
  await p.screenshot({path:D+'screenshots/live_menu.png'});
  await p.click('#gmin');await p.keyboard.type('1234wasd');
  console.log('typed into box; verb still',await p.evaluate(()=>QC.S.verb));
  await p.fill('#gmin','garbage');await p.click('#gmload');console.log('bad load msg:',await p.locator('#gmmsg').innerText());
  // restart with confirm
  await p.click('#gmreset');console.log('reset label:',await p.locator('#gmreset').innerText());
  await p.click('#gmreset');await p.waitForTimeout(200);console.log('after restart',await st());
  // load the earlier code
  await p.click('#menubtn');await p.fill('#gmin',code);await p.click('#gmload');await p.waitForTimeout(200);
  console.log('after load code',await st(),'menu',await p.evaluate(()=>QC.gmOpen));
  // Esc toggles menu
  await p.keyboard.press('Escape');console.log('esc opens',await p.evaluate(()=>QC.gmOpen));await p.keyboard.press('Escape');console.log('esc closes',await p.evaluate(()=>QC.gmOpen));
  // phone
  await p.setViewportSize({width:390,height:844});await p.click('#menubtn');await p.waitForTimeout(300);await p.screenshot({path:D+'screenshots/live_menu_phone.png'});
  // NEW GAME path: reload with save, choose new game
  await p.keyboard.press('Escape');await p.waitForTimeout(2200);
  await p.reload();await p.waitForTimeout(500);await p.click('#gmnew');await p.waitForTimeout(2200);
  console.log('new game choice',await st());
  await p.reload();await p.waitForTimeout(500);
  console.log('after new game then reload: welcome?',await p.evaluate(()=>QC.gmOpen));
  console.log(errs.join('\n')||'no page errors');
  await b.close();
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
