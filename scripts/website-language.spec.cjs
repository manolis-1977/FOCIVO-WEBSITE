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
  await page.locator('#supportQuestion').fill('zzzzxxyyqq');await page.locator('#supportForm button').click();
  await expect(page.locator('#supportHandoff')).toBeVisible();
  await expect(page.locator('#supportLog .bot')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 });
}
