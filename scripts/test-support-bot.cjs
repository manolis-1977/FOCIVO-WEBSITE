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
const wifiFirst={
  "en": "For local Mobile–Desktop synchronization, first make sure your phone and computer are connected to the same Wi-Fi network.",
  "el": "Για τον τοπικό συγχρονισμό Mobile–Desktop, πρώτα βεβαιώσου ότι το κινητό και ο υπολογιστής είναι συνδεδεμένα στο ίδιο δίκτυο Wi-Fi.",
  "pt-BR": "Para a sincronização local entre celular e computador, primeiro confirme que ambos estão conectados à mesma rede Wi-Fi.",
  "de": "Für die lokale Synchronisierung zwischen Mobilgerät und Desktop prüfen Sie zuerst, ob beide mit demselben WLAN (Wi-Fi) verbunden sind.",
  "es": "Para la sincronización local entre el móvil y el ordenador, comprueba primero que ambos estén conectados a la misma red Wi-Fi.",
  "fr": "Pour la synchronisation locale entre le mobile et l’ordinateur, vérifiez d’abord que les deux appareils sont connectés au même réseau Wi-Fi.",
  "it": "Per la sincronizzazione locale tra telefono e computer, verifica prima che entrambi siano connessi alla stessa rete Wi-Fi.",
  "ja": "モバイル端末とパソコンのローカル同期では、まず両方が同じWi-Fiネットワークに接続されていることを確認してください。",
  "tr": "Mobil cihaz ile masaüstü bilgisayar arasında yerel eşitleme için önce her iki cihazın da aynı Wi-Fi ağına bağlı olduğunu kontrol edin.",
  "ar": "للمزامنة المحلية بين الهاتف والحاسوب، تأكد أولًا من اتصال الجهازين بشبكة Wi-Fi نفسها.",
  "hi": "मोबाइल और डेस्कटॉप के बीच स्थानीय सिंक के लिए पहले सुनिश्चित करें कि दोनों डिवाइस एक ही Wi-Fi नेटवर्क से जुड़े हैं।",
  "id": "Untuk sinkronisasi lokal antara ponsel dan komputer, pastikan terlebih dahulu keduanya terhubung ke jaringan Wi-Fi yang sama."
};
let count=0;
for(const lang of Object.keys(translations)){
 const c=copy[lang],items=catalog(translations[lang],functionGuideCopy[lang],lang);assert.equal(Object.keys(c).length,20);assert(Object.values(c).every(x=>x.trim()));count++;
 assert.equal(items.length,23);assert(items.every(x=>x.title&&x.answer));count++;
 for(const x of items){assert.equal(match(x.title,items,lang).id,x.id);count++}
 for(const question of syncQuestions[lang]){const answer=match(question,items,lang);assert.equal(answer?.id,"mobile-sync",lang+": "+question);assert(answer.answer.includes(functionGuideCopy[lang].items.find(x=>x.key==="mobile").note));count++;}
 assert(items.find(x=>x.id==="mobile-sync").answer.startsWith(wifiFirst[lang]),lang+": same Wi-Fi is the first troubleshooting step");count++;
 assert.equal(match("zzzzxxyyqq",items,lang),null);count++;
}
const e=emailHref("Hello & #?\nTest","el");assert(e.startsWith("mailto:forymo.support@gmail.com?"));assert(e.includes(encodeURIComponent("Hello & #?\nTest")));count++;
assert(!validConfig({baseUrl:"",websiteToken:""}));assert(!validConfig({baseUrl:"javascript:evil",websiteToken:"1234567890"}));assert(validConfig({baseUrl:"https://app.chatwoot.com",websiteToken:"publicToken123"}));count++;
console.log(count+" support assistant checks passed");
