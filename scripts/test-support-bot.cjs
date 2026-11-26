const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {copy,catalog,match,emailHref,validConfig}=require("../support-bot.js");
const a=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
const {translations,functionGuideCopy}=Function(a.slice(0,a.indexOf("\nlet activeGuideKey"))+";return {translations,functionGuideCopy}")();
const syncQuestions={
  "en": [
    "My phone won't sync",
    "Android mobile synchronization is not working"
  ],
  "el": [
    "δεν συγχρονιζεται το κινητο",
    "το Android δεν κάνει συγχρονισμό"
  ],
  "pt-BR": [
    "meu celular não sincroniza",
    "o Android não está sincronizando"
  ],
  "de": [
    "mein Handy synchronisiert nicht",
    "Android synchronisiert nicht"
  ],
  "es": [
    "mi móvil no se sincroniza",
    "el celular no sincroniza"
  ],
  "fr": [
    "mon téléphone ne se synchronise pas",
    "Android ne se synchronise pas"
  ],
  "it": [
    "il cellulare non si sincronizza",
    "Android non sincronizza"
  ],
  "ja": [
    "スマホが同期しない",
    "Androidの同期ができない"
  ],
  "tr": [
    "telefon eşitlenmiyor",
    "Android senkronize olmuyor"
  ],
  "ar": [
    "الهاتف لا يتزامن",
    "المزامنة لا تعمل على الهاتف"
  ],
  "hi": [
    "मेरा फोन सिंक नहीं हो रहा",
    "Android मोबाइल सिंक नहीं होता"
  ],
  "id": [
    "ponsel saya tidak sinkron",
    "Android tidak bisa sinkronisasi"
  ]
};
let count=0;
for(const lang of Object.keys(translations)){
 const c=copy[lang],items=catalog(translations[lang],functionGuideCopy[lang],lang);assert.equal(Object.keys(c).length,20);assert(Object.values(c).every(x=>x.trim()));count++;
 assert.equal(items.length,23);assert(items.every(x=>x.title&&x.answer));count++;
 for(const x of items){assert.equal(match(x.title,items,lang).id,x.id);count++}
 for(const question of syncQuestions[lang]){const answer=match(question,items,lang);assert.equal(answer?.id,"mobile-sync",lang+": "+question);assert(answer.answer.includes(functionGuideCopy[lang].items.find(x=>x.key==="mobile").note));count++;}
 assert.equal(match("zzzzxxyyqq",items,lang),null);count++;
}
const e=emailHref("Hello & #?\nTest","el");assert(e.startsWith("mailto:forymo.support@gmail.com?"));assert(e.includes(encodeURIComponent("Hello & #?\nTest")));count++;
assert(!validConfig({baseUrl:"",websiteToken:""}));assert(!validConfig({baseUrl:"javascript:evil",websiteToken:"1234567890"}));assert(validConfig({baseUrl:"https://app.chatwoot.com",websiteToken:"publicToken123"}));count++;
console.log(count+" support assistant checks passed");
