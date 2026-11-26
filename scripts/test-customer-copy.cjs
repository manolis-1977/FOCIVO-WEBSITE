const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('app.js');
const {translations,functionGuideCopy}=Function(source.slice(0,source.indexOf('\nlet activeGuideKey'))+';return {translations,functionGuideCopy}')();
const {copy}=require('../support-bot.js');
const stale={
  "en": [
    "All 12 languages are available on this website. Application languages and services have their own release status.",
    "The website is available in 12 languages. Choose your language from the menu to read the pages, guides and FAQ. Application language availability is separate.",
    "Cloud/BYOC capabilities remain subject to their release and acceptance status.",
    "Email opens in your mail application. The website guides are translated; availability of individual support services may vary.",
    "Live chat is not currently configured. Email remains available."
  ],
  "el": [
    "Και οι 12 γλώσσες είναι διαθέσιμες στην ιστοσελίδα. Οι γλώσσες και οι υπηρεσίες των εφαρμογών έχουν ξεχωριστή κατάσταση διάθεσης.",
    "Η ιστοσελίδα είναι διαθέσιμη σε 12 γλώσσες. Επίλεξε τη γλώσσα σου από το μενού για να διαβάσεις τις σελίδες, τους οδηγούς και τις συχνές ερωτήσεις. Η διαθεσιμότητα γλωσσών των εφαρμογών είναι ανεξάρτητη.",
    "Οι δυνατότητες Cloud/BYOC παραμένουν συνδεδεμένες με την κατάσταση κυκλοφορίας και τελικής αποδοχής τους.",
    "Το email ανοίγει στην εφαρμογή ηλεκτρονικού ταχυδρομείου σου. Οι οδηγοί της ιστοσελίδας είναι μεταφρασμένοι· η διαθεσιμότητα επιμέρους υπηρεσιών υποστήριξης μπορεί να διαφέρει.",
    "Η ζωντανή συνομιλία δεν έχει ρυθμιστεί ακόμη. Η επικοινωνία μέσω email είναι διαθέσιμη."
  ],
  "pt-BR": [
    "Todos os 12 idiomas estão disponíveis neste site. Os idiomas e serviços dos aplicativos têm seu próprio status de lançamento.",
    "O site está disponível em 12 idiomas. Escolha seu idioma no menu para ler as páginas, os guias e as perguntas frequentes. A disponibilidade de idiomas nos aplicativos é independente.",
    "Os recursos de nuvem/BYOC continuam sujeitos ao respectivo status de lançamento e aprovação.",
    "O e-mail abre no seu aplicativo de correio. Os guias do site estão traduzidos; a disponibilidade de serviços específicos de suporte pode variar.",
    "O chat ao vivo ainda não está configurado. O e-mail continua disponível."
  ],
  "de": [
    "Alle 12 Sprachen sind auf dieser Website verfügbar. Die Sprachen und Dienste der Anwendungen haben einen eigenen Veröffentlichungsstatus.",
    "Die Website ist in 12 Sprachen verfügbar. Wählen Sie Ihre Sprache im Menü, um Seiten, Anleitungen und häufige Fragen zu lesen. Die Sprachverfügbarkeit der Anwendungen ist davon unabhängig.",
    "Cloud- und BYOC-Funktionen unterliegen ihrem jeweiligen Veröffentlichungs- und Abnahmestatus.",
    "Die E-Mail wird in Ihrer Mail-Anwendung geöffnet. Die Website-Anleitungen sind übersetzt; die Verfügbarkeit einzelner Supportdienste kann variieren.",
    "Livechat ist noch nicht eingerichtet. E-Mail ist verfügbar."
  ],
  "es": [
    "Los 12 idiomas están disponibles en este sitio web. Los idiomas y servicios de las aplicaciones tienen su propio estado de publicación.",
    "El sitio web está disponible en 12 idiomas. Elige tu idioma en el menú para leer las páginas, las guías y las preguntas frecuentes. La disponibilidad de idiomas de las aplicaciones es independiente.",
    "Las funciones de nube y BYOC siguen sujetas a su estado de publicación y aceptación.",
    "El correo se abre en tu aplicación de correo electrónico. Las guías del sitio están traducidas; la disponibilidad de servicios de soporte específicos puede variar.",
    "El chat en directo aún no está configurado. El correo sigue disponible."
  ],
  "fr": [
    "Les 12 langues sont disponibles sur ce site. Les langues et les services des applications ont leur propre état de publication.",
    "Le site est disponible en 12 langues. Choisissez votre langue dans le menu pour consulter les pages, les guides et les questions fréquentes. La disponibilité des langues dans les applications est indépendante.",
    "Les fonctions cloud et BYOC restent soumises à leur état de publication et de validation.",
    "Le message s'ouvre dans votre application de messagerie. Les guides du site sont traduits ; la disponibilité de certains services d'assistance peut varier.",
    "Le chat en direct n’est pas encore configuré. L’e-mail reste disponible."
  ],
  "it": [
    "Tutte le 12 lingue sono disponibili su questo sito. Le lingue e i servizi delle applicazioni hanno uno stato di rilascio separato.",
    "Il sito è disponibile in 12 lingue. Scegli la tua lingua dal menu per leggere pagine, guide e domande frequenti. La disponibilità delle lingue nelle applicazioni è indipendente.",
    "Le funzionalità cloud e BYOC rimangono soggette al rispettivo stato di rilascio e accettazione.",
    "L'e-mail si apre nell'applicazione di posta. Le guide del sito sono tradotte; la disponibilità dei singoli servizi di assistenza può variare.",
    "La chat dal vivo non è ancora configurata. L’e-mail è disponibile."
  ],
  "ja": [
    "このウェブサイトでは12言語すべてを利用できます。アプリの対応言語やサービスには別途リリース状況があります。",
    "ウェブサイトは12言語に対応しています。メニューから言語を選ぶと、ページ、ガイド、よくある質問を読めます。アプリの対応言語は別途定められています。",
    "クラウドとBYOC機能はそれぞれの公開・承認状況に従います。",
    "メールアプリが開きます。サイトのガイドは翻訳済みですが、個別のサポートサービスの提供状況は異なる場合があります。",
    "ライブチャットはまだ設定されていません。メールは利用できます。"
  ],
  "tr": [
    "Bu web sitesinde 12 dilin tamamı kullanılabilir. Uygulamaların dil ve hizmetleri ayrı yayımlama durumlarına sahiptir.",
    "Web sitesi 12 dilde kullanılabilir. Sayfaları, kılavuzları ve sık sorulan soruları okumak için menüden dilinizi seçin. Uygulamaların dil desteği bundan bağımsızdır.",
    "Bulut ve BYOC özellikleri yayımlama ve kabul durumlarına bağlıdır.",
    "E-posta, posta uygulamanızda açılır. Site kılavuzları çevrilmiştir; belirli destek hizmetlerinin kullanılabilirliği değişebilir.",
    "Canlı sohbet henüz yapılandırılmadı. E-posta kullanılabilir."
  ],
  "ar": [
    "تتوفر اللغات الاثنتا عشرة جميعها على هذا الموقع. أما لغات التطبيقات وخدماتها فلها حالة إصدار مستقلة.",
    "الموقع متاح بـ12 لغة. اختر لغتك من القائمة لقراءة الصفحات والأدلة والأسئلة الشائعة. توفر لغات التطبيقات مستقل عن الموقع.",
    "تخضع وظائف السحابة وBYOC لحالة إصدارها وقبولها.",
    "يفتح البريد في تطبيق البريد لديك. أدلة الموقع مترجمة، وقد يختلف توفر خدمات الدعم الفردية.",
    "لم تُضبط المحادثة المباشرة بعد. البريد الإلكتروني متاح."
  ],
  "hi": [
    "इस वेबसाइट पर सभी 12 भाषाएँ उपलब्ध हैं। ऐप की भाषाओं और सेवाओं की रिलीज़ स्थिति अलग है।",
    "वेबसाइट 12 भाषाओं में उपलब्ध है। पृष्ठ, मार्गदर्शिकाएँ और अक्सर पूछे जाने वाले प्रश्न पढ़ने के लिए मेनू से अपनी भाषा चुनें। ऐप की भाषाओं की उपलब्धता अलग है।",
    "क्लाउड और BYOC सुविधाएँ अपनी रिलीज़ और स्वीकृति स्थिति पर निर्भर हैं।",
    "ईमेल आपके मेल ऐप में खुलता है। वेबसाइट की मार्गदर्शिकाएँ अनूदित हैं; अलग-अलग सहायता सेवाओं की उपलब्धता भिन्न हो सकती है।",
    "लाइव चैट अभी कॉन्फ़िगर नहीं है। ईमेल उपलब्ध है।"
  ],
  "id": [
    "Semua 12 bahasa tersedia di situs ini. Bahasa dan layanan aplikasi memiliki status rilis tersendiri.",
    "Situs tersedia dalam 12 bahasa. Pilih bahasa Anda dari menu untuk membaca halaman, panduan, dan pertanyaan umum. Ketersediaan bahasa aplikasi terpisah dari situs.",
    "Kemampuan cloud dan BYOC tetap bergantung pada status rilis dan penerimaan masing-masing.",
    "Email akan dibuka di aplikasi email Anda. Panduan situs telah diterjemahkan; ketersediaan layanan dukungan tertentu dapat berbeda.",
    "Chat langsung belum dikonfigurasi. Email tetap tersedia."
  ]
};
let count=0;
for(const [lang,old] of Object.entries(stale)){
 const d=translations[lang],g=functionGuideCopy[lang];
 const visible=[...Object.entries(d).filter(([k])=>!k.startsWith('sunshine.')&&k!=='language.preparing').map(([,v])=>v),...g.items.flatMap(x=>[x.title,x.summary,x.purpose,...x.steps,x.controls,x.note||'']),...Object.values(copy[lang])];
 for(const v of old){assert(!visible.some(s=>s.includes(v)),lang+': obsolete customer copy');count++;}
 assert(g.items.find(x=>x.key==='sync').note.trim());count++;
}
assert(!read('index.html').includes(stale.en[0]));count++;
console.log(count+' customer copy checks passed');
