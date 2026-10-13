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
  const log=async(m)=>console.log(m,await room());
  // walk the new surface doorways by real clicks, deliberately off-centre
  await p.evaluate(()=>QC.enter('cottage',[220,170]));await p.waitForTimeout(200);
  await click(316,160,5000);await log('cottage E ->');                 // orchard
  await click(316,150,5000);await log('orchard E ->');                // camp
  await click(2,160,5000);await log('camp W ->');                     // orchard
  await click(176,112,5000);await log('orchard N ->');                // birch
  await click(170,198,5000);await log('birch S ->');                  // orchard
  await p.evaluate(()=>QC.enter('pond',[160,170]));await p.waitForTimeout(200);
  await click(150,198,5000);await log('pond S ->');                   // marsh
  await click(170,112,5000);await log('marsh N ->');                  // pond
  // the fox's door: LOOK should only describe it, HAND (or just clicking with Look off) walks in
  await p.evaluate(()=>QC.enter('fox',[170,170]));await p.waitForTimeout(200);
  await p.click('[data-verb=look]');await click(268,112,900);await log('look at den ->');
  console.log('  msg:',(await p.locator('#msg').innerText()).slice(0,80));
  await p.click('[data-verb=hand]');await click(268,112,6000);await log('hand on den ->');
  await p.screenshot({path:D+'screenshots/live_burrow.png'});
  await click(262,60,5000);await log('burrow N tunnel ->');           // mine
  await click(2,160,5000);await log('mine W ->');                      // lake
  await p.screenshot({path:D+'screenshots/live_lake.png'});
  await click(160,198,5000);await log('lake S ->');                    // cavern
  await click(316,160,5000);await log('cavern E ->');                  // burrow
  await click(160,198,6000);await log('burrow S (door) ->');           // fox
  console.log('  fox pos',await p.evaluate(()=>[Math.round(QC.S.x||0)]));
  // map with all rooms
  await p.evaluate(()=>{QC.S.inv.push('map');QC.ROOM_IDS.forEach(r=>QC.S.visited[r]=1)});
  await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map21.png'});await p.keyboard.press('m');
  await p.setViewportSize({width:390,height:844});await p.keyboard.press('m');await p.waitForTimeout(400);await p.screenshot({path:D+'screenshots/live_map21_phone.png'});
  console.log(errs.join('\n')||'no page errors');await b.close();
})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
