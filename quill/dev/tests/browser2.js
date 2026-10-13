const {chromium}=require('playwright-core');const path=require('path');
const D=path.resolve(__dirname,'..')+'/';require('fs').mkdirSync(D+'screenshots',{recursive:true});
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
  const p=await b.newPage({viewport:{width:1000,height:1300}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+D+'build/quill-and-compass.html');await p.waitForTimeout(500);
  const box=await p.locator('#cv').boundingBox();
  const at=(x,y)=>[box.x+x*box.width/320,box.y+y*box.height/200];
  const room=()=>p.evaluate(()=>QC.S.room);
  const click=async(x,y,w=1200)=>{const [a,c]=at(x,y);await p.mouse.click(a,c);await p.waitForTimeout(w)};
  // walk the woods loop with real mouse clicks, deliberately off-centre
  await p.evaluate(()=>QC.enter('grove',[170,170]));await p.waitForTimeout(200);
  const steps=[[316,150,'birch'],[316,150,'pines'],[266,10,'fox'],[2,170,'owl'],[2,160,'falls']];
  for(const [x,y,exp] of steps){await click(x,y,4500);console.log('clicked',x,y,'->',await room(),room()===exp?'':'(expected '+exp+')')}
  // loop back the other way: falls E -> owl -> S birch -> W grove
  await click(316,160,4500);console.log('falls E ->',await room());
  await click(200,198,4500);console.log('owl S ->',await room());
  await click(2,160,4500);console.log('birch W ->',await room());
  // boot ring
  await p.click('[data-verb=boot]');await click(200,176,300);
  await p.screenshot({path:D+'screenshots/live_bootring.png'});
  console.log('marks',await p.evaluate(()=>QC.marks.length));
  await p.waitForTimeout(3500);console.log('msg:',await p.locator('#msg').innerText());
  console.log('marks after 3.5s',await p.evaluate(()=>QC.marks.length));
  // map with the woods inked/visited
  await p.evaluate(()=>{QC.S.inv.push('map');['cottage','garden','cross','grove','bridge','pond','fairy','falls','peak','birch','pines','fox','owl','camp'].forEach(r=>QC.S.visited[r]=1);QC.S.inked.birch=1;QC.S.inked.owl=1;QC.S.inked.grove=1});
  await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map14.png'});await p.keyboard.press('m');
  await p.setViewportSize({width:390,height:844});await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map14_phone.png'});
  console.log(errs.join('\n')||'no page errors');await b.close();
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
