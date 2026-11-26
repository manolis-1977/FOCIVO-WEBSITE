const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('app.js'),html=read('index.html');
const {translations,functionGuideCopy}=Function(source.slice(0,source.indexOf('\nlet activeGuideKey'))+';return {translations,functionGuideCopy}')();
const {catalog,match}=require('../support-bot.js');
const nav=['today','focus','tasks','routines','reminders','mobile','organize','search','calendar','analytics','sync','backup','settings','diagnostics'].sort();
const labels={"en":"Illustrative preview","el":"Ενδεικτική προεπισκόπηση","pt-BR":"Prévia ilustrativa","de":"Illustrative Vorschau","es":"Vista ilustrativa","fr":"Aperçu illustratif","it":"Anteprima illustrativa","ja":"画面イメージ","tr":"Temsili önizleme","ar":"معاينة توضيحية","hi":"उदाहरणात्मक पूर्वावलोकन","id":"Pratinjau ilustratif"};
let count=0;
for(const [lang,d] of Object.entries(translations)){
 const guide=functionGuideCopy[lang],mobile=guide.items.find(x=>x.key==='mobile');
 assert.deepEqual(guide.items.map(x=>x.key).sort(),nav);count++;
 assert(d['mobile.body'].includes('Focus'));count++;
 assert(d['faq.a3'].includes('Wi-Fi')&&d['faq.a3'].includes('6'));count++;
 assert(mobile.steps[0].includes('Wi-Fi')&&mobile.steps[1].includes('6'));count++;
 assert.equal(d['mock.synced'],labels[lang]);count++;
 const items=catalog(d,guide,lang);
 assert.equal(match(d['faq.q3'],items,lang).answer,d['faq.a3']);count++;
 assert(items.find(x=>x.id==='guide-mobile').answer.includes(mobile.steps[1]));count++;
}
assert(html.includes('href="#support" data-i18n="desktop.cta"'));count++;
assert(html.includes('data-i18n="cta.body"'));count++;
assert(html.includes('data-i18n="mock.synced">Illustrative preview'));count++;
console.log(count+' product alignment checks passed');
