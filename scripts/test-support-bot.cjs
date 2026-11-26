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
const obsoleteMobileCopy={
  "id": [
    "Aktif dikembangkan",
    "Belum tersedia untuk dipasang. Rilis produksi dilakukan setelah pengujian dan penerimaan akhir.",
    "FORYMO Mobile aktif dikembangkan dan belum tersedia untuk dipasang. Aplikasi hanya akan dirilis setelah pengujian yang diperlukan dan penerimaan akhir.",
    "FORYMO Mobile masih aktif dikembangkan dan belum ditawarkan sebagai instalasi produksi."
  ],
  "hi": [
    "सक्रिय विकास में",
    "अभी इंस्टॉल के लिए उपलब्ध नहीं है। परीक्षण और अंतिम स्वीकृति के बाद प्रोडक्शन रिलीज़ होगी।",
    "FORYMO Mobile सक्रिय विकास में है और अभी इंस्टॉल के लिए उपलब्ध नहीं है। आवश्यक परीक्षण और अंतिम स्वीकृति के बाद ही जारी होगा।",
    "FORYMO Mobile अभी सक्रिय विकास में है और प्रोडक्शन इंस्टॉलेशन के लिए उपलब्ध नहीं है।"
  ],
  "ar": [
    "قيد التطوير النشط",
    "غير متاح للتثبيت بعد. سيصدر الإصدار الإنتاجي بعد الاختبارات والقبول النهائي.",
    "FORYMO Mobile قيد التطوير النشط وغير متاح للتثبيت بعد. لن يصدر إلا بعد الاختبارات المطلوبة والقبول النهائي.",
    "لا يزال FORYMO Mobile قيد التطوير النشط ولا يُقدّم بعد كتثبيت إنتاجي."
  ],
  "tr": [
    "Aktif geliştirme aşamasında",
    "Henüz kuruluma açık değil. Üretim sürümü testler ve nihai kabul sonrasında yayımlanacaktır.",
    "FORYMO Mobile aktif geliştirme aşamasındadır ve henüz kurulamaz. Yalnızca gerekli testler ve nihai kabul sonrasında yayımlanacaktır.",
    "FORYMO Mobile aktif geliştirme aşamasındadır ve üretim kurulumu olarak sunulmamaktadır."
  ],
  "ja": [
    "開発中",
    "まだインストールできません。テストと最終承認後に正式版を公開します。",
    "FORYMO Mobileは開発中で、まだインストールできません。必要なテストと最終承認後にのみ公開されます。",
    "FORYMO Mobileは開発中で正式インストール版はまだ提供されていません。"
  ],
  "it": [
    "In sviluppo attivo",
    "Non ancora disponibile per l'installazione. Il rilascio in produzione seguirà i test e l'accettazione finale.",
    "FORYMO Mobile è in sviluppo attivo e non è ancora disponibile per l'installazione. Sarà rilasciata solo dopo i test richiesti e l'accettazione finale.",
    "FORYMO Mobile è ancora in sviluppo attivo e non viene offerto per installazioni in produzione."
  ],
  "fr": [
    "En développement actif",
    "Installation pas encore disponible. La version de production suivra les tests et la validation finale.",
    "FORYMO Mobile est en développement actif et ne peut pas encore être installé. Sa publication suivra les tests nécessaires et la validation finale.",
    "FORYMO Mobile est encore en développement actif et n'est pas proposé en installation de production."
  ],
  "es": [
    "En desarrollo activo",
    "Aún no disponible para instalación. La versión de producción se publicará después de las pruebas y la aceptación final.",
    "FORYMO Mobile está en desarrollo activo y aún no está disponible para instalación. Se publicará únicamente después de las pruebas necesarias y la aceptación final.",
    "FORYMO Mobile sigue en desarrollo activo y todavía no se ofrece como instalación de producción."
  ],
  "de": [
    "In aktiver Entwicklung",
    "Noch nicht zur Installation verfügbar. Die Produktivversion folgt nach Tests und abschließender Abnahme.",
    "FORYMO Mobile befindet sich in aktiver Entwicklung und kann noch nicht installiert werden. Die Veröffentlichung erfolgt erst nach den erforderlichen Tests und der abschließenden Abnahme.",
    "FORYMO Mobile befindet sich noch in aktiver Entwicklung und wird noch nicht als Produktivinstallation angeboten."
  ],
  "pt-BR": [
    "Em desenvolvimento ativo",
    "Ainda não disponível para instalação. O lançamento oficial ocorrerá após os testes e a aprovação final.",
    "O FORYMO Mobile está em desenvolvimento ativo e ainda não está disponível para instalação. Seu lançamento ocorrerá somente após os testes necessários e a aprovação final.",
    "O FORYMO Mobile ainda está em desenvolvimento ativo e não está disponível para instalação em produção."
  ],
  "en": [
    "In active development",
    "Not yet available for installation. Production release follows testing and final acceptance.",
    "FORYMO Mobile is in active development and is not yet available for installation. It will be released only after the required testing and final acceptance.",
    "FORYMO Mobile is still in active development and is not yet offered as a production installation."
  ],
  "el": [
    "Σε ενεργή ανάπτυξη",
    "Δεν είναι ακόμη διαθέσιμη για εγκατάσταση. Η τελική έκδοση θα ακολουθήσει μετά τις δοκιμές και την τελική αποδοχή.",
    "Το FORYMO Mobile βρίσκεται σε ενεργή ανάπτυξη και δεν είναι ακόμη διαθέσιμο για εγκατάσταση. Θα κυκλοφορήσει μόνο αφού ολοκληρωθούν οι απαιτούμενες δοκιμές και η τελική αποδοχή.",
    "Το FORYMO Mobile βρίσκεται ακόμη σε ενεργή ανάπτυξη και δεν προσφέρεται ακόμη ως παραγωγική εγκατάσταση."
  ]
};
let count=0;
for(const lang of Object.keys(translations)){
 const c=copy[lang],items=catalog(translations[lang],functionGuideCopy[lang],lang);assert.equal(Object.keys(c).length,20);assert(Object.values(c).every(x=>x.trim()));count++;
 assert.equal(items.length,23);assert(items.every(x=>x.title&&x.answer));count++;
 for(const x of items){assert.equal(match(x.title,items,lang).id,x.id);count++}
 for(const question of syncQuestions[lang]){const answer=match(question,items,lang);assert.equal(answer?.id,"mobile-sync",lang+": "+question);assert(answer.answer.includes(functionGuideCopy[lang].items.find(x=>x.key==="mobile").note));count++;}
 assert(items.find(x=>x.id==="mobile-sync").answer.startsWith(wifiFirst[lang]),lang+": same Wi-Fi is the first troubleshooting step");count++;
 for(const id of ["mobile-sync","guide-mobile","faq3"]){const answer=items.find(x=>x.id===id).answer;assert(!obsoleteMobileCopy[lang].some(v=>answer.includes(v)),lang+": no obsolete development disclaimer in "+id);count++;}
 for(const key of ["mobile.tag","mobile.cta","faq.a3"])assert(!obsoleteMobileCopy[lang].includes(translations[lang][key]),lang+": updated website copy "+key);count++;
 assert.equal(match("zzzzxxyyqq",items,lang),null);count++;
}
const e=emailHref("Hello & #?\nTest","el");assert(e.startsWith("mailto:forymo.support@gmail.com?"));assert(e.includes(encodeURIComponent("Hello & #?\nTest")));count++;
assert(!validConfig({baseUrl:"",websiteToken:""}));assert(!validConfig({baseUrl:"javascript:evil",websiteToken:"1234567890"}));assert(validConfig({baseUrl:"https://app.chatwoot.com",websiteToken:"publicToken123"}));count++;
console.log(count+" support assistant checks passed");
