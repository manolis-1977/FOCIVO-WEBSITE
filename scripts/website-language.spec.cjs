// Run with Playwright installed: npx playwright test scripts/website-language.spec.cjs
const {test,expect}=require('@playwright/test');
const base='http://127.0.0.1:8788';
const widths=[320,375,768,1280,1920];
for(const width of widths){
  test('PT-BR real browser at '+width+'px',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/?preview-language=pt-BR');
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    await expect(page.locator('html')).toHaveAttribute('dir','ltr');
    await expect(page.locator('h1')).toHaveText('Seu dia é mais do que uma lista de tarefas.');
    await expect(page.locator('#languageCode')).toHaveText('PT-BR');
    await expect(page.locator('#functionGuideList [role=tab]')).toHaveCount(14);
    const titles=['Hoje','Foco','Tarefas','Rotinas','Lembretes','Busca','Calendário','Análises','Organização','Backup e recuperação','Sincronização','Dispositivos móveis','Configurações','Diagnóstico'];
    for(const title of titles){
      await page.locator('#functionGuideList [role=tab]').filter({hasText:title}).click();
      await expect(page.locator('#functionGuidePanel h3')).toHaveText(title);
      await expect(page.locator('#functionGuidePanel ol li')).toHaveCount(3);
      await expect(page.locator('#functionGuidePanel')).toContainText('Como usar');
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await page.locator('#languageTrigger').click();
    await expect(page.locator('#languageMenu')).toBeVisible();
    await expect(page.locator('#languageMenu button').filter({hasText:'Português — Brasil'})).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(page.locator('#languageMenu')).toBeHidden();
    await page.locator('a[href^="sunshine-pro/"]').last().click();
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    await expect(page.locator('[data-i18n="sunshine.choose"]')).toHaveText('Escolha uma função');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await page.locator('a[href^="../?preview-language"]').last().click();
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    expect(errors).toEqual([]);
  });
}
test('EN/EL switching persists; preview does not replace stored language',async({page})=>{
  await page.goto(base+'/');
  await page.locator('#languageTrigger').click();
  await page.locator('button[data-lang="el"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang','el');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','el');
  await page.goto(base+'/?preview-language=pt-BR');
  await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
  expect(await page.evaluate(()=>localStorage.getItem('forymo-language'))).toBe('el');
  await page.goto(base+'/');
  await expect(page.locator('html')).toHaveAttribute('lang','el');
  await page.locator('#languageTrigger').click();
  await page.locator('button[data-lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toHaveText('Your day is more than a list of tasks.');
});
