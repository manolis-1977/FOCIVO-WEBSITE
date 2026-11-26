const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {copy,catalog,match,emailHref,validConfig}=require("../support-bot.js");
const a=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
const {translations,functionGuideCopy}=Function(a.slice(0,a.indexOf("\nlet activeGuideKey"))+";return {translations,functionGuideCopy}")();
let count=0;
for(const lang of Object.keys(translations)){
 const c=copy[lang],items=catalog(translations[lang],functionGuideCopy[lang]);assert.equal(Object.keys(c).length,20);assert(Object.values(c).every(x=>x.trim()));count++;
 assert.equal(items.length,22);assert(items.every(x=>x.title&&x.answer));count++;
 for(const x of items){assert.equal(match(x.title,items,lang).id,x.id);count++}
 assert.equal(match("zzzzxxyyqq",items,lang),null);count++;
}
const e=emailHref("Hello & #?\nTest","el");assert(e.startsWith("mailto:forymo.support@gmail.com?"));assert(e.includes(encodeURIComponent("Hello & #?\nTest")));count++;
assert(!validConfig({baseUrl:"",websiteToken:""}));assert(!validConfig({baseUrl:"javascript:evil",websiteToken:"1234567890"}));assert(validConfig({baseUrl:"https://app.chatwoot.com",websiteToken:"publicToken123"}));count++;
console.log(count+" support assistant checks passed");
