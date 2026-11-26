const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'_public');
const allowed=['index.html','app.js','styles.css','design-system.css','support-bot.js','support-config.js','CNAME','.nojekyll','assets','sunshine-pro'];
const aliases={'about':'#product','how-it-works':'#how','features':'#product','learn':'#how','support':'#support'};
function build(){
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 for(const p of allowed)fs.cpSync(path.join(root,p),path.join(out,p),{recursive:true});
 for(const [p,hash] of Object.entries(aliases)){
  const dest='/'+hash;fs.mkdirSync(path.join(out,p),{recursive:true});
  fs.writeFileSync(path.join(out,p,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url='+dest+'"><link rel="canonical" href="https://forymo.com/'+hash+'"><title>FORYMO</title></head><body><a href="'+dest+'">FORYMO</a></body></html>');
 }
 const actual=fs.readdirSync(out).sort(),expected=[...allowed,...Object.keys(aliases)].sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Unexpected public files');
 for(const p of ['internal','ideas','whats-new','security','get-focivo','login','route-shell.js','scripts','.github','README.md','localization'])if(fs.existsSync(path.join(out,p)))throw Error('Unfinished or internal route published: '+p);
 console.log('PASS: Public artifact contains only approved site assets, existing SunShine page and five redirects to working FORYMO sections.');
}
build();
