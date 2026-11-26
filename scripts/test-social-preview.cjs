const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..','_public');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const head=html.split('</head>')[0],url='https://www.forymo.com/assets/forymo-social-preview.jpg';
for(const [key,value] of Object.entries({'og:type':'website','og:url':'https://www.forymo.com/','og:image':url,'og:image:secure_url':url,'og:image:width':'1200','og:image:height':'630','og:image:type':'image/jpeg'}))assert(head.includes('<meta property="'+key+'" content="'+value+'"'));
for(const key of ['og:title','og:description','og:image:alt'])assert(head.includes('property="'+key+'"'));
assert(head.includes('name="twitter:card" content="summary_large_image"'));
assert(head.includes('name="twitter:image" content="'+url+'"'));
const bytes=fs.readFileSync(path.join(root,'assets','forymo-social-preview.jpg'));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'864cb95382c93dc048b049b76ed42fe27ab3edc2f3d286fd23b8f6afc4543185');
assert.equal(bytes.readUInt16BE(0),0xffd8);
let dims=null;
for(let i=2;i+4<bytes.length;){assert.equal(bytes[i++],255);while(bytes[i]===255)i++;const marker=bytes[i++];if(marker===0xda||marker===0xd9)break;const len=bytes.readUInt16BE(i);if([0xc0,0xc1,0xc2].includes(marker)){dims=[bytes.readUInt16BE(i+5),bytes.readUInt16BE(i+3)];break;}i+=len;}
assert.deepEqual(dims,[1200,630]);
console.log('PASS: Open Graph and Twitter metadata, exact approved JPEG, dimensions, and public artifact');
