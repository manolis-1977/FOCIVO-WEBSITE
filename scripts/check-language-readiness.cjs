#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
function checkReadiness(js,pages,manifest) {
  const end=js.indexOf("\nlet activeGuideKey");
  const {translations:t,functionGuideCopy:g}=Function(js.slice(0,end)+";return {translations,functionGuideCopy}")();
  const publicMatch=js.match(/const publicLocales = Object\.freeze\((\[[^\n]*\])\);/);
  const publicLocales=publicMatch?JSON.parse(publicMatch[1]):[];
  const expected=["en","el","pt-BR","de","es","fr","it","ja","tr","ar","hi","id"];
  const required=["website","windows","mobile","store","support","terminology","layout","editorial","accountSubscription","transactionalEmail","legalPrivacy","aiSupport"];
  const failures=[],report=[];
  const codes=manifest.locales.map(x=>x.code);
  if(JSON.stringify(codes)!==JSON.stringify(expected)) failures.push("Manifest locale order or membership invalid");
  if(new Set(publicLocales).size!==publicLocales.length||publicLocales.some(c=>!codes.includes(c))) failures.push("Runtime allowlist invalid");
  const advertised=manifest.locales.filter(x=>x.status==="AVAILABLE").map(x=>x.code);
  if(JSON.stringify(publicLocales)!==JSON.stringify(advertised)) failures.push("Runtime allowlist and manifest AVAILABLE disagree");
  const baseKeys=Object.keys(t.en),base=g.en.items;
  const used=[...new Set(pages.flatMap(h=>[...h.matchAll(/data-i18n="([^"]+)"/g)].map(x=>x[1])))];
  const enabled=p=>[...p.matchAll(/<button\b[^>]*>/g)].map(x=>x[0]).filter(x=>/\bdata-lang="/.test(x)&&!/\bdisabled\b/.test(x)).map(x=>x.match(/\bdata-lang="([^"]+)"/)[1]);
  for(const [i,page] of pages.entries()){
    const active=enabled(page);
    if(active.length!==publicLocales.length||new Set(active).size!==active.length||active.some(c=>!publicLocales.includes(c))) failures.push("Page "+i+": enabled language buttons disagree with runtime");
  }
  const rows=[...pages[0].matchAll(/<div class="language-status( is-ready)?"[^>]*><strong>([^<]+)<\/strong><span>[^<]+<\/span><small data-i18n="language\.(available|preparing)">/g)];
  if(rows.length!==expected.length) failures.push("Roadmap must have exactly 12 language rows");
  const filled=v=>typeof v==="string"&&v.trim().length>0;
  for(const locale of manifest.locales){
    const {code,name,status}=locale,dict=t[code],guide=g[code];
    const row=rows.filter(x=>x[2]===name);
    if(row.length!==1||Boolean(row[0]?.[1])!==(status==="AVAILABLE")||row[0]?.[3]!== (status==="AVAILABLE"?"available":"preparing")) failures.push(code+": roadmap mismatch");
    if(!["AVAILABLE","IN PREPARATION"].includes(status)) failures.push(code+": invalid status");
    const missing=baseKeys.filter(k=>!filled(dict?.[k]));
    const extras=Object.keys(dict||{}).filter(k=>!Object.hasOwn(t.en,k));
    const missingHtml=used.filter(k=>!filled(dict?.[k]));
    const missingGuide=base.filter((b,i)=>{
      const x=guide?.items?.[i];
      return !x||x.key!==b.key||x.number!==b.number||["title","summary","purpose","controls"].some(k=>!filled(x[k]))||!Array.isArray(x.steps)||x.steps.length!==b.steps.length||x.steps.some(v=>!filled(v))||(Boolean(b.note)!==Boolean(x.note))||(b.note&&!filled(x.note));
    });
    const labelsOk=Object.keys(g.en.labels).every(k=>filled(guide?.labels?.[k]));
    const complete=missing.length===0&&extras.length===0&&missingHtml.length===0&&missingGuide.length===0&&guide?.items?.length===base.length&&labelsOk;
    const approval=required.every(k=>locale.approvals?.[k]===true)&&(code!=="ar"||locale.approvals?.rtl===true);
    if(extras.length) failures.push(code+": extra dictionary keys "+extras.join(", "));
    if((dict||guide)&&!complete) failures.push(code+": incomplete staged or published copy");
    if(status==="AVAILABLE"&&!complete) failures.push(code+": published incomplete copy");
    if(status==="AVAILABLE"&&!["en","el"].includes(code)&&!approval) failures.push(code+": published without full approvals");
    report.push({code,status,keys:(baseKeys.length-missing.length)+"/"+baseKeys.length,guides:(base.length-missingGuide.length)+"/"+base.length,approval:approval?"PASS":"PENDING"});
  }
  return {failures,report};
}
module.exports={checkReadiness};
if(require.main===module){const read=p=>fs.readFileSync(path.join(root,p),'utf8');const {report,failures}=checkReadiness(read('app.js'),[read('index.html'),read('sunshine-pro/index.html')],JSON.parse(read('localization/readiness.json')));console.table(report);if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('PASS: Manifest, runtime, selectors, roadmap and complete copy agree.');}
