#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
function testAllLocales(source,pages,manifest,Params){
 const results=[];
 const assert=(v,msg)=>{if(!v)throw Error(msg);results.push(msg)};
 const {translations, functionGuideCopy}=Function(source.slice(0,source.indexOf("\nlet activeGuideKey"))+";return {translations,functionGuideCopy}")();
 const extras=Function(source.slice(source.indexOf("const ptBRExtra ="),source.indexOf("const localPreviewAllowed ="))+";return localeExtras")();
 const locales=manifest.locales.map(x=>x.code);
 assert(locales.length===12&&Object.keys(translations).length===12&&Object.keys(functionGuideCopy).length===12,"Exactly 12 translation and guide datasets");
 const en=translations.en,base=functionGuideCopy.en;
 const keys=Object.keys(en);
 const used=[...new Set(pages.flatMap(h=>[...h.matchAll(/data-i18n="([^"]+)"/g)].map(x=>x[1])))];
 for(const lang of locales){
  const dict=translations[lang],g=functionGuideCopy[lang];
  assert(Object.keys(dict).length===keys.length&&keys.every(k=>typeof dict[k]==="string"&&dict[k].trim())&&used.every(k=>dict[k]),lang+": all "+keys.length+" keys and HTML references");
  assert(g.items.length===14&&base.items.every((v,i)=>{const x=g.items[i];return x.key===v.key&&x.number===v.number&&["title","summary","purpose","controls"].every(k=>typeof x[k]==="string"&&x[k].trim())&&x.steps.length===v.steps.length&&x.steps.every(s=>typeof s==="string"&&s.trim())&&!!x.note===!!v.note})&&Object.keys(base.labels).every(k=>g.labels[k]?.trim()),lang+": all 14 guides, source steps and notes");
  if(!["en","el"].includes(lang)){
   const e=extras[lang];
   assert(["title","description","sunshineDescription","skip","faq"].every(k=>e?.[k]?.trim())&&e.metrics.length===3&&e.metrics.every(x=>x.trim())&&Object.keys(extras.de.aria).every(k=>e.aria[k]?.trim()),lang+": metadata, metrics and ARIA copy");
  }
 }
 function boot(host,search,stored,page,rogueLocale){
  const node=(text="",attrs={})=>({textContent:text,dataset:{},disabled:false,classList:{toggle(){},remove(){}},setAttribute(k,v){attrs[k]=v},getAttribute(k){return attrs[k]??null},addEventListener(){},querySelectorAll(){return []}});
  const buttons=["en","el",...(rogueLocale?[rogueLocale]:[])].map((lang,i)=>{const n=node();n.dataset={lang,code:i===1?"GR":lang.toUpperCase()};return n});
  const keyed=used.map(k=>{const n=node();n.dataset.i18n=k;return n});
  const skip=node("Skip to content"),faq=node("FAQ"),aria=node("",{"aria-label":"Primary navigation"}),code=node("EN"),meta=node("",{content:"Original description"});
  const link=node("",{href:page?"../#top":"sunshine-pro/"});
  const em=[node(),node(),node()];const stats=em.map(n=>({querySelector(){return n}}));
  const list=node(),panel=node();
  const document={documentElement:{lang:"en"},body:{dataset:page?{page:"sunshine"}:{}},head:{appendChild(){}},title:"",
   querySelectorAll(q){return q===".lang-btn"?buttons:q==="[data-i18n]"?keyed:q===".skip"?[skip]:q==='.footer-links a[href="#faq"]'?[faq]:q==="[aria-label]"?[aria]:q===".stat-grid .stat"?stats:q.startsWith("a[href=")?[link]:[]},
   querySelector(q){return q==='meta[name="description"]'?meta:null},getElementById(id){return id==="languageCode"?code:!page&&id==="functionGuideList"?list:!page&&id==="functionGuidePanel"?panel:null},createElement(){return node()},addEventListener(){}};
  const storage={value:stored,getItem(k){return k==="forymo-language"?this.value:null},setItem(k,v){this.value=v}};
  const api=Function("document","location","localStorage","URLSearchParams",source+";return {setLanguage}")(document,{hostname:host,search},storage,Params);
  return {document,storage,keyed,skip,faq,aria,code,meta,link,em,list,panel,api};
 }
 for(const lang of locales.filter(x=>!["en","el"].includes(x))){
  const e=extras[lang],expectedDir=lang==="ar"?"rtl":"ltr",query="?preview-language="+lang;
  for(const page of [false,true]){
   const local=boot("127.0.0.1",query,"el",page);
   assert(local.document.documentElement.lang===lang&&local.document.documentElement.dir===expectedDir&&local.storage.value==="el"&&local.keyed.every(n=>n.textContent===translations[lang][n.dataset.i18n])&&local.skip.textContent===e.skip&&local.aria.getAttribute("aria-label")===e.aria["Primary navigation"]&&local.meta.getAttribute("content")===(page?e.sunshineDescription:e.description)&&local.link.getAttribute("href").includes(query)&&local.em.every((n,i)=>n.textContent===e.metrics[i])&&(page?local.document.title===translations[lang]["sunshine.page.title"]:local.document.title===e.title&&local.panel.innerHTML.includes(functionGuideCopy[lang].items[0].title)),lang+": "+(page?"SunShine":"FORYMO")+" preview rendering");
   local.api.setLanguage("el");
   assert(local.document.documentElement.lang==="el"&&local.document.documentElement.dir==="ltr"&&local.link.getAttribute("href")===(page?"../#top":"sunshine-pro/")&&local.keyed.every(n=>n.textContent===translations.el[n.dataset.i18n]),lang+": "+(page?"SunShine":"FORYMO")+" restores Greek");
  }
  const pub=boot("forymo.com",query,lang,false,lang);
  assert(pub.document.documentElement.lang==="en"&&pub.storage.value==="en"&&pub.document.documentElement.dir==="ltr",lang+": public rejects even an accidentally enabled HTML button");
 }
 return results;
}
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const results=testAllLocales(read('app.js'),[read('index.html'),read('sunshine-pro/index.html')],JSON.parse(read('localization/readiness.json')),URLSearchParams);
for(const r of results)console.log('PASS: '+r);
console.log(results.length+' checks passed');
