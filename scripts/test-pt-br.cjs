#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
function run(source,pages,manifest,Params){
 const result=[];function check(v,label){if(!v)throw Error(label);result.push(label)}
 const {translations:t,functionGuideCopy:g}=Function(source.slice(0,source.indexOf("\nlet activeGuideKey"))+";return {translations,functionGuideCopy}")();
 const pt=t["pt-BR"],en=t.en,guide=g["pt-BR"],base=g.en;
 check(Object.keys(en).length===146&&Object.keys(pt).length===146&&Object.keys(en).every(k=>pt[k]?.trim()),"146/146 dictionary keys");
 check(guide.items.length===14&&base.items.every((x,i)=>{const y=guide.items[i];return x.key===y.key&&x.number===y.number&&["title","summary","purpose","controls"].every(k=>y[k]?.trim())&&y.steps.length===x.steps.length&&y.steps.every(v=>v.trim())&&(!x.note||y.note?.trim())}),"14/14 guides, all steps and notes");
 check(Object.keys(base.labels).every(k=>guide.labels[k]?.trim()),"Guide labels");
 check(pages.every(h=>[...h.matchAll(/data-i18n="([^"]+)"/g)].every(x=>pt[x[1]])),"Both website pages: translated keyed content");
 check(pages.every(h=>![...h.matchAll(/<button\b[^>]*>/g)].some(x=>/data-lang="pt-BR"/.test(x[0])&&!/\bdisabled\b/.test(x[0]))),"PT-BR public selection disabled");
 check(manifest.locales.find(x=>x.code==="pt-BR").status==="IN PREPARATION","Manifest remains unreleased");
 function boot(host,search,stored,sunshine=false){
  const node=(text="",attrs={})=>({textContent:text,dataset:{},disabled:false,classList:{toggle(){},remove(){}},setAttribute(k,v){attrs[k]=v},getAttribute(k){return attrs[k]??null},addEventListener(){},querySelectorAll(){return []}});
  const buttons=["en","el"].map((lang,i)=>{const b=node();b.dataset={lang,code:i?"GR":"EN"};return b});
  const token=node();token.dataset.i18n="hero.title";const skip=node("Skip to content"),code=node("EN"),meta=node("",{content:"Original description"});
  const d={documentElement:{lang:"en"},body:{dataset:sunshine?{page:"sunshine"}:{}},head:{appendChild(){}},title:"",
   querySelectorAll(q){return q===".lang-btn"?buttons:q==="[data-i18n]"?[token]:q===".skip"?[skip]:[]},querySelector(q){return q==='meta[name="description"]'?meta:null},getElementById(id){return id==="languageCode"?code:null},createElement(){return node()},addEventListener(){}};
  const storage={value:stored,getItem(k){return k==="forymo-language"?this.value:null},setItem(k,v){this.value=v}};
  const api=Function("document","location","localStorage","URLSearchParams",source+";return {setLanguage}")(d,{hostname:host,search},storage,Params);
  return {d,storage,token,skip,code,meta,api};
 }
 const pub=boot("forymo.com","?preview-language=pt-BR","pt-BR");
 check(pub.d.documentElement.lang==="en"&&pub.storage.value==="en","Public hostname rejects unreleased locale");
 const local=boot("127.0.0.1","?preview-language=pt-BR","el");
 check(local.d.documentElement.lang==="pt-BR"&&local.storage.value==="el"&&local.token.textContent===pt["hero.title"]&&local.skip.textContent==="Ir para o conteúdo"&&local.code.textContent==="PT-BR","Loopback preview without persistence");
 local.api.setLanguage("el");
 check(local.d.documentElement.lang==="el"&&local.token.textContent===t.el["hero.title"]&&local.skip.textContent==="Skip to content","Greek restored after preview");
 check(boot("forymo.com","","en").token.textContent===en["hero.title"]&&boot("forymo.com","","el").token.textContent===t.el["hero.title"],"EN/EL original rendering");
 const sun=boot("localhost","?preview-language=pt-BR","en",true);
 check(sun.d.title===pt["sunshine.page.title"]&&sun.meta.getAttribute("content").startsWith("SunShine Pro"),"SunShine preview metadata");
 return result;
}
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const results=run(read('app.js'),[read('index.html'),read('sunshine-pro/index.html')],JSON.parse(read('localization/readiness.json')),URLSearchParams);
for(const r of results)console.log('PASS: '+r);
console.log(results.length+' checks passed');
