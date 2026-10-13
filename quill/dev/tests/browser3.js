const {chromium}=require('playwright-core');const path=require('path');
const D=path.resolve(__dirname,'..')+'/';require('fs').mkdirSync(D+'screenshots',{recursive:true});
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
  const p=await b.newPage({viewport:{width:1000,height:1300}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+D+'build/quill-and-compass.html');await p.waitForTimeout(500);
  const box=await p.locator('#cv').boundingBox();
  const at=(x,y)=>[box.x+x*box.width/320,box.y+y*box.height/200];
  const st=()=>p.evaluate(()=>[QC.S.room,Math.round(QC.S.x),Math.round(QC.S.y)]);
  const click=async(x,y,w=1200)=>{const [a,c]=at(x,y);await p.mouse.click(a,c);await p.waitForTimeout(w)};
  await p.evaluate(()=>QC.enter('falls',[200,170]));await p.waitForTimeout(300);
  await p.screenshot({path:D+'screenshots/live_falls.png'});
  // LOOK at waterfall: should only describe
  await p.click('[data-verb=look]');await click(262,40,800);console.log('look ->',await st(),(await p.locator('#msg').innerText()).slice(0,90));
  // HAND at waterfall: walk in
  await p.click('[data-verb=hand]');await click(262,40,7000);console.log('hand ->',await st());
  await p.screenshot({path:D+'screenshots/live_grotto.png'});
  // back out: walk to south edge
  await click(160,198,5000);console.log('back S ->',await st());
  // HINT button + H
  await p.click('#hintbtn');await p.waitForTimeout(300);const h1=await p.locator('#msg').innerText();console.log('hint1:',h1.slice(0,120));
  await p.keyboard.press('h');await p.waitForTimeout(300);const h2=await p.locator('#msg').innerText();console.log('hint2:',h2.slice(0,120),h1!==h2?'(escalated)':'(same)');
  // map with grotto
  await p.evaluate(()=>{QC.S.inv.push('map');QC.ROOM_IDS.forEach(r=>QC.S.visited[r]=1)});
  await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map15.png'});await p.keyboard.press('m');
  await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:D+'screenshots/live_phone_header.png'});
  await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map15_phone.png'});
  console.log(errs.join('\n')||'no page errors');await b.close();
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
