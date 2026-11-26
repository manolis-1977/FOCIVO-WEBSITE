#!/usr/bin/env node
'use strict';

/**
 * FORYMO language-release gate. No external dependencies.
 * Run: node scripts/check-language-readiness.cjs
 *
 * A locale is not publicly AVAILABLE merely because its label exists.
 * Website text, 14-function guide and cross-platform editorial approvals
 * must all pass before a locale may be enabled.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const start = js.indexOf('const translations = ');
const guide = js.indexOf('const functionGuideCopy = ');
const end = js.indexOf('\nlet activeGuideKey', guide);
if (start < 0 || guide < 0 || end < 0) throw Error('Translation or guide definitions not found');
const sandbox = {};
vm.runInNewContext(js.slice(start, end).replace('const translations =', 'var translations =').replace('const functionGuideCopy =', 'var functionGuideCopy ='), sandbox, {timeout:1000});
const {translations, functionGuideCopy} = sandbox;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'localization', 'readiness.json'), 'utf8'));
const baseKeys = Object.keys(translations.en);
const baseGuide = functionGuideCopy.en.items.map(x=>x.key);
const fields = ['title','summary','purpose','controls'];
const failures = [];
const report = [];
for (const locale of manifest.locales) {
  const dict = translations[locale.code];
  const guideData = functionGuideCopy[locale.code];
  const missing = !dict ? baseKeys.slice() : baseKeys.filter(k => typeof dict[k] !== 'string' || !dict[k].trim());
  const extra = !dict ? [] : Object.keys(dict).filter(k=>!Object.hasOwn(translations.en,k));
  const missingGuide = !guideData ? baseGuide.slice() : baseGuide.filter(key => {
    const item = guideData.items.find(x => x.key === key);
    return !item || fields.some(f=>typeof item[f] !== 'string' || !item[f].trim()) || !Array.isArray(item.steps) || item.steps.length < 2 || item.steps.some(x=>typeof x !== 'string' || !x.trim());
  });
  const labelsOk = !!guideData && ['purpose','workflow','controls','note'].every(k=>typeof guideData.labels[k] === 'string' && guideData.labels[k].trim());
  const usedKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(x=>x[1]);
  const missingHtmlKeys = usedKeys.filter(k=>!dict || typeof dict[k] !== 'string' || !dict[k].trim());
  const duplicateGuideKeys = guideData ? new Set(guideData.items.map(x=>x.key)).size !== guideData.items.length : false;
  const copyComplete = !!dict && !!guideData && missing.length===0 && missingGuide.length===0 && missingHtmlKeys.length===0 && labelsOk && !duplicateGuideKeys;
  const approvals = locale.approvals || {};
  const fullApproval = ['website','windows','mobile','store','support','terminology','layout','editorial'].every(k=>approvals[k]===true) && (locale.code!=='ar' || approvals.rtl===true);
  if(locale.status==='AVAILABLE' && (!copyComplete || !fullApproval)) failures.push(locale.code + ': marked AVAILABLE without complete content and approvals');
  if(locale.status==='AVAILABLE' && locale.code!=='en' && locale.code!=='el' && !html.includes('data-lang="'+locale.code+'"')) failures.push(locale.code + ': AVAILABLE but missing selectable language control');
  if(extra.length) failures.push(locale.code + ': unexpected dictionary keys '+extra.join(', '));
  report.push({code:locale.code, status:locale.status, websiteKeys:dict ? baseKeys.length-missing.length+'/'+baseKeys.length : '0/'+baseKeys.length, guideItems:guideData ? baseGuide.length-missingGuide.length+'/'+baseGuide.length : '0/'+baseGuide.length, htmlKeysMissing:missingHtmlKeys.length, approvals:fullApproval?'PASS':'PENDING'});
}
if(manifest.locales.length!==12 || manifest.locales.filter(x=>x.status==='AVAILABLE').length!==2) {
  // When another language is responsibly released, update the release count policy here.
  failures.push('Expected current baseline: 12 languages, 2 AVAILABLE');
}
console.table(report);
if(failures.length){console.error(failures.join('\n')); process.exitCode=1;}
else console.log('PASS: Incomplete languages cannot be advertised as AVAILABLE.');
