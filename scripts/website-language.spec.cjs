const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const {translations,functionGuideCopy}=Function(source.slice(0,source.indexOf('\nlet activeGuideKey'))+';return {translations,functionGuideCopy}')();
const base='http://127.0.0.1:8788';
const widths=[320,375,768,1280,1920];
const localeNames={en:"English",el:"Ελληνικά","pt-BR":"Português — Brasil",de:"Deutsch",es:"Español",fr:"Français",it:"Italiano",ja:"日本語",tr:"Türkçe",ar:"العربية",hi:"हिन्दी",id:"Bahasa Indonesia"};
for(const [locale,name] of Object.entries(localeNames)){
 const dict=translations[locale],guide=functionGuideCopy[locale],query='';
 for(const width of widths){
  test(locale+' browser at '+width+'px',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/');
    await page.locator('#languageTrigger').click();
    await page.locator('button[data-lang="'+locale+'"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang',locale);
    await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
    await expect(page.locator('h1')).toHaveText(dict['hero.title']);
    await expect(page.locator('#languageCode')).toHaveText(locale==='el'?'GR':locale.toUpperCase());
    await expect(page.locator('#functionGuideList [role=tab]')).toHaveCount(14);
    for(const item of guide.items){
      await page.locator('[data-guide-key="'+item.key+'"]').click();
      await expect(page.locator('#functionGuidePanel h3')).toHaveText(item.title);
      await expect(page.locator('#functionGuidePanel ol li')).toHaveText(item.steps);
      await expect(page.locator('#functionGuidePanel')).toContainText(guide.labels.workflow);
      await expect(page.locator('#functionGuidePanel')).toContainText(item.controls);
      if(item.note) await expect(page.locator('#functionGuidePanel aside')).toContainText(item.note);
    }
    await expect(page.locator('#support h2')).toHaveText(dict['support.title']);
    await expect(page.locator('#support details')).toHaveCount(4);
    await expect(page.locator('#support .section-heading a')).toHaveAttribute('href','mailto:forymo.support@gmail.com');
    await page.locator('#support details summary').first().click();
    await expect(page.locator('#support details').first()).toHaveAttribute('open','');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await page.locator('#languageTrigger').click();
    await expect(page.locator('#languageMenu')).toBeVisible();
    await expect(page.locator('#languageMenu button').filter({hasText:name})).toBeEnabled();
    await page.keyboard.press('Escape');
    await expect(page.locator('#languageMenu')).toBeHidden();
    if(locale==='ar') expect(await page.locator('.function-guide-detail aside').evaluate(el=>getComputedStyle(el).borderRightWidth)).toBe('3px');
    await page.screenshot({path:testInfo.outputPath('forymo.png'),fullPage:true});
    await page.locator('a[href^="sunshine-pro/"]').last().click();
    await expect(page.locator('html')).toHaveAttribute('lang',locale);
    await expect(page.locator('[data-i18n="sunshine.choose"]')).toHaveText(dict['sunshine.choose']);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await page.screenshot({path:testInfo.outputPath('sunshine.png'),fullPage:true});
    await page.locator('a[href="../#top"]').last().click();
    await expect(page.locator('html')).toHaveAttribute('lang',locale);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang',locale);
    expect(errors).toEqual([]);
  });
 }
}
test('EN/EL switching persists; preview does not replace stored language',async({page})=>{
 await page.goto(base+'/');
 await page.locator('#languageTrigger').click();
 await page.locator('button[data-lang="el"]').click();
 await expect(page.locator('html')).toHaveAttribute('lang','el');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('lang','el');
 await page.goto(base+'/?preview-language=ar');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 expect(await page.evaluate(()=>localStorage.getItem('forymo-language'))).toBe('el');
 await page.goto(base+'/');
 await expect(page.locator('html')).toHaveAttribute('lang','el');
 await expect(page.locator('html')).toHaveAttribute('dir','ltr');
 await page.locator('#languageTrigger').click();
 await page.locator('button[data-lang="en"]').click();
 await expect(page.locator('h1')).toHaveText(translations.en['hero.title']);
});

const mobileSyncQuestions={"en":"My phone won't sync","el":"δεν συγχρονιζεται το κινητο","pt-BR":"meu celular não sincroniza","de":"mein Handy synchronisiert nicht","es":"mi móvil no se sincroniza","fr":"mon téléphone ne se synchronise pas","it":"il cellulare non si sincronizza","ja":"スマホが同期しない","tr":"telefon eşitlenmiyor","ar":"الهاتف لا يتزامن","hi":"मेरा फोन सिंक नहीं हो रहा","id":"ponsel saya tidak sinkron"};
for(const locale of Object.keys(localeNames)){
 test(locale+' support assistant and honest email handoff',async({page})=>{
  await page.setViewportSize({width:375,height:900});await page.goto(base+'/');
  await page.locator('#languageTrigger').click();await page.locator('button[data-lang="'+locale+'"]').click();
  await page.locator('#supportTopics').selectOption('support3');await page.locator('#supportChoose').click();
  await expect(page.locator('#supportLog .bot')).toContainText(translations[locale]['support.a3']);
  await page.locator('#supportNo').click();await expect(page.locator('#supportHandoff')).toBeVisible();
  await expect(page.locator('#supportLive')).toBeHidden();
  await expect(page.locator('#supportEmail')).toHaveAttribute('href',/^mailto:forymo.support@gmail.com\?/);
  await expect(page.locator('#supportSummary')).toHaveValue(/.+/);
  await page.locator('#supportReset').click();await expect(page.locator('#supportLog .bot')).toHaveCount(0);
  await page.locator('#supportQuestion').fill(mobileSyncQuestions[locale]);
  await page.locator('#supportForm button').click();
  await expect(page.locator('#supportLog .bot')).toContainText(functionGuideCopy[locale].items.find(x=>x.key==="mobile").note);
  await expect(page.locator('#supportFeedback')).toBeVisible();
  await expect(page.locator('#supportHandoff')).toBeHidden();
  await page.locator('#supportNo').click();
  await expect(page.locator('#supportSummary')).toHaveValue(new RegExp(mobileSyncQuestions[locale]));
  await page.locator('#supportReset').click();
  await page.locator('#supportQuestion').fill('zzzzxxyyqq');await page.locator('#supportForm button').click();
  await expect(page.locator('#supportHandoff')).toBeVisible();
  await expect(page.locator('#supportLog .bot')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 });
}

for(const locale of Object.keys(localeNames)){
 test(locale+' header: centered, symmetric, single-line and responsive',async({page},testInfo)=>{
  await page.setViewportSize({width:1920,height:900});
  await page.goto(base+'/');
  await page.locator('#languageTrigger').click();
  await page.locator('button[data-lang="'+locale+'"]').click();
  for(const width of [1920,1816,1600,1440,1366]){
   await page.setViewportSize({width,height:900});
   await expect(page.locator('.site-header .nav')).toBeVisible();
   await expect(page.locator('.site-header .nav a')).toHaveCount(8);
   await expect(page.locator('.site-header .menu-btn')).toBeHidden();
   const metrics=await page.evaluate(()=>{
    const wrap=document.querySelector('.site-header .nav-wrap');
    const box=wrap.getBoundingClientRect(), nav=wrap.querySelector('.nav');
    const controls=[wrap.querySelector('.brand'),...nav.querySelectorAll('a'),wrap.querySelector('.language-trigger'),wrap.querySelector('.button-small')];
    const rects=controls.map(n=>n.getBoundingClientRect());
    const lines=controls.slice(1).map(n=>{
     const target=n.classList.contains('language-trigger')?n.querySelector('strong'):n;
     const range=document.createRange();range.selectNodeContents(target);
     return new Set(Array.from(range.getClientRects()).filter(r=>r.width>0&&r.height>0).map(r=>Math.round(r.top))).size;
    });
    const navBox=nav.getBoundingClientRect(), logo=rects[0], actions=wrap.querySelector('.nav-actions').getBoundingClientRect();
    const rtl=document.documentElement.dir==='rtl';
    const centerError=Math.abs((navBox.left+navBox.right)/2-(box.left+box.right)/2);
    const startInset=rtl?box.right-logo.right:logo.left-box.left;
    const endInset=rtl?actions.left-box.left:box.right-actions.right;
    const trackWidth=(rtl?box.right-navBox.right:navBox.left-box.left)-parseFloat(getComputedStyle(wrap).columnGap);
    const expectedInset=Math.max(0,Math.min(trackWidth*.57,trackWidth-62));
    const brand=controls[0];
    const nodes=[...controls.slice(1),nav,wrap.querySelector('.nav-actions'),document.querySelector('main')];
    const snapshot=()=>nodes.map(n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height]});
    const before=snapshot();
    const oldStyle=brand.getAttribute('style');
    brand.style.setProperty('margin-inline-start','0px','important');
    const baseline=snapshot();
    if(oldStyle===null)brand.removeAttribute('style');else brand.setAttribute('style',oldStyle);
    const otherElementsUnchanged=before.every((r,i)=>r.every((v,j)=>Math.abs(v-baseline[i][j])<.5));
    const correctOrder=rtl?logo.left>=navBox.right&&actions.right<=navBox.left:logo.right<=navBox.left&&actions.left>=navBox.right;
    return {centerError,startInset,endInset,expectedInset,otherElementsUnchanged,correctOrder,lines,inside:rects.every(r=>r.left>=box.left-1&&r.right<=box.right+1&&r.top>=box.top-1&&r.bottom<=box.bottom+1),noOverlap:rects.every((a,i)=>rects.every((b,j)=>i===j||a.right<=b.left+1||b.right<=a.left+1)),navCenters:[...nav.querySelectorAll('a')].map(n=>{const r=n.getBoundingClientRect();return r.top+r.height/2;})};
   });
   expect(metrics.lines.every(n=>n===1)).toBe(true);
   expect(metrics.inside).toBe(true);expect(metrics.noOverlap).toBe(true);
   expect(metrics.centerError).toBeLessThan(1);
   expect(Math.abs(metrics.startInset-metrics.expectedInset)).toBeLessThan(1);
   expect(Math.abs(metrics.endInset)).toBeLessThan(1);
   expect(metrics.otherElementsUnchanged).toBe(true);
   expect(metrics.correctOrder).toBe(true);
   expect(Math.max(...metrics.navCenters)-Math.min(...metrics.navCenters)).toBeLessThan(1);
   if(width===1816||width===1366) await page.locator('.site-header').screenshot({path:testInfo.outputPath('header-'+width+'.png')});
  }
  for(const width of [1350,1280,768,375,320]){
   await page.setViewportSize({width,height:900});
   await expect(page.locator('.site-header .nav')).toBeHidden();
   await expect(page.locator('.site-header .menu-btn')).toBeVisible();
   expect(await page.locator('.site-header .brand').evaluate(n=>getComputedStyle(n).marginInlineStart)).toBe('0px');
   const codeLines=await page.locator('#languageCode').evaluate(n=>{const range=document.createRange();range.selectNodeContents(n);return range.getClientRects().length;});
   expect(codeLines).toBe(1);
   await page.locator('.site-header .menu-btn').click();
   await expect(page.locator('.site-header .nav')).toBeVisible();
   await expect(page.locator('.site-header .nav a')).toHaveCount(8);
   await expect(page.locator('.site-header .nav a[href="#support"]')).toBeVisible();
   await page.locator('.site-header .nav a[href="#support"]').click();
   await expect(page.locator('.site-header .nav')).toBeHidden();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  }
  await page.setViewportSize({width:1920,height:900});
  await page.locator('.site-header .nav a[href="sunshine-pro/"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang',locale);
  await expect(page.locator('.site-header .nav')).toBeVisible();
  await page.setViewportSize({width:320,height:900});
  await expect(page.locator('.site-header .menu-btn')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 });
}
