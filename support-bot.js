/* FORYMO website support assistant — deterministic, guide-grounded, no external calls until explicit live handoff. */
(function(){
"use strict";
const copy={
  "en": {
    "title": "FORYMO Support Assistant",
    "intro": "Ask a question or select a topic. Answers come from the published FORYMO guides, not an AI model.",
    "question": "Type your question",
    "ask": "Ask",
    "topics": "Choose a topic",
    "noMatch": "I couldn't find a reliable answer in the guides. Try a topic or contact our support team.",
    "helpful": "Did this solve your problem?",
    "yes": "Yes",
    "no": "No",
    "resolved": "Glad the answer helped. You can ask another question.",
    "human": "Contact a representative",
    "handoff": "You can send the conversation summary to our support team. Email is not a live chat; send the message yourself in your mail application.",
    "privacy": "Do not enter passwords, payment details, recovery keys or private workspace data. Questions stay in this browser until you choose to share them.",
    "email": "Open email with summary",
    "live": "Open live support",
    "liveUnavailable": "Live chat is not currently configured. Email remains available.",
    "reset": "Clear conversation",
    "context": "Conversation summary — review before sharing",
    "loading": "Opening the support service…",
    "liveFailed": "Live support could not be opened. Please use email."
  },
  "el": {
    "title": "Βοηθός υποστήριξης FORYMO",
    "intro": "Γράψε μια ερώτηση ή επίλεξε θέμα. Οι απαντήσεις προέρχονται από τους δημοσιευμένους οδηγούς FORYMO, όχι από μοντέλο AI.",
    "question": "Γράψε την ερώτησή σου",
    "ask": "Ρώτησε",
    "topics": "Επίλεξε θέμα",
    "noMatch": "Δεν βρήκα αξιόπιστη απάντηση στους οδηγούς. Δοκίμασε ένα θέμα ή επικοινώνησε με την υποστήριξη.",
    "helpful": "Λύθηκε το πρόβλημά σου;",
    "yes": "Ναι",
    "no": "Όχι",
    "resolved": "Χαίρομαι που βοήθησε η απάντηση. Μπορείς να κάνεις άλλη ερώτηση.",
    "human": "Επικοινωνία με εκπρόσωπο",
    "handoff": "Μπορείς να στείλεις τη σύνοψη της συνομιλίας στην ομάδα υποστήριξης. Το email δεν είναι ζωντανή συνομιλία· στείλε εσύ το μήνυμα από την εφαρμογή email.",
    "privacy": "Μην εισάγεις κωδικούς, στοιχεία πληρωμών, κλειδιά ανάκτησης ή ιδιωτικά δεδομένα. Οι ερωτήσεις μένουν στον browser μέχρι να επιλέξεις να τις κοινοποιήσεις.",
    "email": "Άνοιγμα email με σύνοψη",
    "live": "Άνοιγμα ζωντανής υποστήριξης",
    "liveUnavailable": "Η ζωντανή συνομιλία δεν έχει ρυθμιστεί ακόμη. Η επικοινωνία μέσω email είναι διαθέσιμη.",
    "reset": "Εκκαθάριση συνομιλίας",
    "context": "Σύνοψη συνομιλίας — έλεγχος πριν την κοινοποίηση",
    "loading": "Άνοιγμα υπηρεσίας υποστήριξης…",
    "liveFailed": "Δεν άνοιξε η ζωντανή υποστήριξη. Χρησιμοποίησε το email."
  },
  "pt-BR": {
    "title": "Assistente de suporte FORYMO",
    "intro": "Faça uma pergunta ou escolha um assunto. As respostas vêm dos guias publicados do FORYMO, não de um modelo de IA.",
    "question": "Digite sua pergunta",
    "ask": "Perguntar",
    "topics": "Escolha um assunto",
    "noMatch": "Não encontrei uma resposta confiável nos guias. Escolha um assunto ou fale com o suporte.",
    "helpful": "Isso resolveu seu problema?",
    "yes": "Sim",
    "no": "Não",
    "resolved": "Que bom que a resposta ajudou. Você pode fazer outra pergunta.",
    "human": "Falar com um atendente",
    "handoff": "Você pode enviar o resumo da conversa à equipe de suporte. E-mail não é chat ao vivo; envie a mensagem no seu aplicativo de e-mail.",
    "privacy": "Não informe senhas, dados de pagamento, chaves de recuperação ou dados privados. As perguntas ficam no navegador até você escolher compartilhá-las.",
    "email": "Abrir e-mail com resumo",
    "live": "Abrir suporte ao vivo",
    "liveUnavailable": "O chat ao vivo ainda não está configurado. O e-mail continua disponível.",
    "reset": "Limpar conversa",
    "context": "Resumo da conversa — revise antes de compartilhar",
    "loading": "Abrindo o serviço de suporte…",
    "liveFailed": "Não foi possível abrir o suporte ao vivo. Use o e-mail."
  },
  "de": {
    "title": "FORYMO-Supportassistent",
    "intro": "Stellen Sie eine Frage oder wählen Sie ein Thema. Die Antworten stammen aus veröffentlichten FORYMO-Anleitungen, nicht aus einem KI-Modell.",
    "question": "Geben Sie Ihre Frage ein",
    "ask": "Fragen",
    "topics": "Thema auswählen",
    "noMatch": "Ich habe keine verlässliche Antwort in den Anleitungen gefunden. Wählen Sie ein Thema oder kontaktieren Sie den Support.",
    "helpful": "Ist Ihr Problem gelöst?",
    "yes": "Ja",
    "no": "Nein",
    "resolved": "Schön, dass die Antwort geholfen hat. Sie können eine weitere Frage stellen.",
    "human": "Supportmitarbeiter kontaktieren",
    "handoff": "Sie können die Gesprächszusammenfassung an den Support senden. E-Mail ist kein Livechat; senden Sie die Nachricht selbst in Ihrer Mail-App.",
    "privacy": "Geben Sie keine Passwörter, Zahlungsdaten, Wiederherstellungsschlüssel oder privaten Daten ein. Fragen bleiben bis zur Freigabe im Browser.",
    "email": "E-Mail mit Zusammenfassung öffnen",
    "live": "Live-Support öffnen",
    "liveUnavailable": "Livechat ist noch nicht eingerichtet. E-Mail ist verfügbar.",
    "reset": "Gespräch löschen",
    "context": "Gesprächszusammenfassung — vor dem Teilen prüfen",
    "loading": "Supportdienst wird geöffnet…",
    "liveFailed": "Live-Support konnte nicht geöffnet werden. Nutzen Sie E-Mail."
  },
  "es": {
    "title": "Asistente de soporte FORYMO",
    "intro": "Haz una pregunta o elige un tema. Las respuestas proceden de las guías publicadas de FORYMO, no de un modelo de IA.",
    "question": "Escribe tu pregunta",
    "ask": "Preguntar",
    "topics": "Elige un tema",
    "noMatch": "No encontré una respuesta fiable en las guías. Prueba un tema o contacta con soporte.",
    "helpful": "¿Se resolvió tu problema?",
    "yes": "Sí",
    "no": "No",
    "resolved": "Me alegra que la respuesta haya ayudado. Puedes hacer otra pregunta.",
    "human": "Contactar con un representante",
    "handoff": "Puedes enviar el resumen de la conversación al equipo de soporte. El correo no es chat en directo; envía tú el mensaje desde tu aplicación de correo.",
    "privacy": "No introduzcas contraseñas, datos de pago, claves de recuperación ni datos privados. Las preguntas permanecen en el navegador hasta que decidas compartirlas.",
    "email": "Abrir correo con resumen",
    "live": "Abrir soporte en directo",
    "liveUnavailable": "El chat en directo aún no está configurado. El correo sigue disponible.",
    "reset": "Borrar conversación",
    "context": "Resumen de la conversación — revisa antes de compartir",
    "loading": "Abriendo el servicio de soporte…",
    "liveFailed": "No se pudo abrir el soporte en directo. Usa el correo."
  },
  "fr": {
    "title": "Assistant d’assistance FORYMO",
    "intro": "Posez une question ou choisissez un sujet. Les réponses proviennent des guides FORYMO publiés, pas d’un modèle d’IA.",
    "question": "Saisissez votre question",
    "ask": "Demander",
    "topics": "Choisir un sujet",
    "noMatch": "Je n’ai pas trouvé de réponse fiable dans les guides. Choisissez un sujet ou contactez l’assistance.",
    "helpful": "Votre problème est-il résolu ?",
    "yes": "Oui",
    "no": "Non",
    "resolved": "Ravi que la réponse ait été utile. Vous pouvez poser une autre question.",
    "human": "Contacter un conseiller",
    "handoff": "Vous pouvez envoyer le résumé de la conversation à l’assistance. L’e-mail n’est pas un chat en direct ; envoyez vous-même le message dans votre messagerie.",
    "privacy": "Ne saisissez pas de mots de passe, données de paiement, clés de récupération ou données privées. Les questions restent dans votre navigateur jusqu’au partage volontaire.",
    "email": "Ouvrir un e-mail avec le résumé",
    "live": "Ouvrir l’assistance en direct",
    "liveUnavailable": "Le chat en direct n’est pas encore configuré. L’e-mail reste disponible.",
    "reset": "Effacer la conversation",
    "context": "Résumé de la conversation — vérifier avant partage",
    "loading": "Ouverture du service d’assistance…",
    "liveFailed": "Impossible d’ouvrir l’assistance en direct. Utilisez l’e-mail."
  },
  "it": {
    "title": "Assistente FORYMO",
    "intro": "Fai una domanda o scegli un argomento. Le risposte provengono dalle guide FORYMO pubblicate, non da un modello di IA.",
    "question": "Scrivi la domanda",
    "ask": "Chiedi",
    "topics": "Scegli un argomento",
    "noMatch": "Non ho trovato una risposta affidabile nelle guide. Scegli un argomento o contatta l’assistenza.",
    "helpful": "Il problema è risolto?",
    "yes": "Sì",
    "no": "No",
    "resolved": "Sono felice che la risposta sia stata utile. Puoi fare un’altra domanda.",
    "human": "Contatta un operatore",
    "handoff": "Puoi inviare il riepilogo della conversazione all’assistenza. L’e-mail non è una chat dal vivo; invia tu il messaggio dalla tua app di posta.",
    "privacy": "Non inserire password, dati di pagamento, chiavi di recupero o dati privati. Le domande rimangono nel browser finché non scegli di condividerle.",
    "email": "Apri e-mail con riepilogo",
    "live": "Apri assistenza dal vivo",
    "liveUnavailable": "La chat dal vivo non è ancora configurata. L’e-mail è disponibile.",
    "reset": "Cancella conversazione",
    "context": "Riepilogo della conversazione — verifica prima di condividere",
    "loading": "Apertura del servizio di assistenza…",
    "liveFailed": "Impossibile aprire l’assistenza dal vivo. Usa l’e-mail."
  },
  "ja": {
    "title": "FORYMOサポートアシスタント",
    "intro": "質問を入力するか、トピックを選択してください。回答はAIモデルではなく、公開済みのFORYMOガイドに基づきます。",
    "question": "質問を入力",
    "ask": "質問する",
    "topics": "トピックを選択",
    "noMatch": "ガイドから信頼できる回答を見つけられませんでした。トピックを選ぶか、サポートにお問い合わせください。",
    "helpful": "問題は解決しましたか？",
    "yes": "はい",
    "no": "いいえ",
    "resolved": "お役に立ててよかったです。別の質問もできます。",
    "human": "担当者に問い合わせる",
    "handoff": "会話の要約をサポートに送ることができます。メールはライブチャットではありません。メールアプリでご自身で送信してください。",
    "privacy": "パスワード、決済情報、復旧キー、個人データは入力しないでください。共有を選ぶまで質問はブラウザー内に留まります。",
    "email": "要約付きメールを開く",
    "live": "ライブサポートを開く",
    "liveUnavailable": "ライブチャットはまだ設定されていません。メールは利用できます。",
    "reset": "会話を消去",
    "context": "会話の要約 — 共有前に確認",
    "loading": "サポートサービスを開いています…",
    "liveFailed": "ライブサポートを開けませんでした。メールをご利用ください。"
  },
  "tr": {
    "title": "FORYMO Destek Asistanı",
    "intro": "Bir soru yazın veya konu seçin. Yanıtlar yapay zekâ modelinden değil, yayımlanmış FORYMO kılavuzlarından gelir.",
    "question": "Sorunuzu yazın",
    "ask": "Sor",
    "topics": "Konu seçin",
    "noMatch": "Kılavuzlarda güvenilir yanıt bulamadım. Bir konu seçin veya destek ekibine ulaşın.",
    "helpful": "Sorununuz çözüldü mü?",
    "yes": "Evet",
    "no": "Hayır",
    "resolved": "Yanıtın yardımcı olmasına sevindim. Başka bir soru sorabilirsiniz.",
    "human": "Temsilciyle iletişime geçin",
    "handoff": "Görüşme özetini destek ekibine gönderebilirsiniz. E-posta canlı sohbet değildir; mesajı posta uygulamanızdan kendiniz gönderin.",
    "privacy": "Parola, ödeme bilgisi, kurtarma anahtarı veya özel veri girmeyin. Sorular siz paylaşmayı seçene kadar tarayıcıda kalır.",
    "email": "Özetle e-posta aç",
    "live": "Canlı desteği aç",
    "liveUnavailable": "Canlı sohbet henüz yapılandırılmadı. E-posta kullanılabilir.",
    "reset": "Görüşmeyi temizle",
    "context": "Görüşme özeti — paylaşmadan önce inceleyin",
    "loading": "Destek hizmeti açılıyor…",
    "liveFailed": "Canlı destek açılamadı. E-posta kullanın."
  },
  "ar": {
    "title": "مساعد دعم FORYMO",
    "intro": "اكتب سؤالًا أو اختر موضوعًا. تأتي الإجابات من أدلة FORYMO المنشورة، وليس من نموذج ذكاء اصطناعي.",
    "question": "اكتب سؤالك",
    "ask": "اسأل",
    "topics": "اختر موضوعًا",
    "noMatch": "لم أجد إجابة موثوقة في الأدلة. اختر موضوعًا أو تواصل مع فريق الدعم.",
    "helpful": "هل حُلّت مشكلتك؟",
    "yes": "نعم",
    "no": "لا",
    "resolved": "يسعدني أن الإجابة ساعدتك. يمكنك طرح سؤال آخر.",
    "human": "التواصل مع ممثل الدعم",
    "handoff": "يمكنك إرسال ملخص المحادثة إلى فريق الدعم. البريد الإلكتروني ليس محادثة مباشرة؛ أرسل الرسالة بنفسك من تطبيق البريد.",
    "privacy": "لا تدخل كلمات مرور أو بيانات دفع أو مفاتيح استرداد أو بيانات خاصة. تبقى الأسئلة في المتصفح حتى تختار مشاركتها.",
    "email": "فتح البريد مع الملخص",
    "live": "فتح الدعم المباشر",
    "liveUnavailable": "لم تُضبط المحادثة المباشرة بعد. البريد الإلكتروني متاح.",
    "reset": "مسح المحادثة",
    "context": "ملخص المحادثة — راجعه قبل المشاركة",
    "loading": "جارٍ فتح خدمة الدعم…",
    "liveFailed": "تعذر فتح الدعم المباشر. استخدم البريد الإلكتروني."
  },
  "hi": {
    "title": "FORYMO सहायता सहायक",
    "intro": "सवाल लिखें या विषय चुनें। जवाब प्रकाशित FORYMO मार्गदर्शिकाओं से आते हैं, AI मॉडल से नहीं।",
    "question": "अपना सवाल लिखें",
    "ask": "पूछें",
    "topics": "विषय चुनें",
    "noMatch": "मार्गदर्शिकाओं में भरोसेमंद जवाब नहीं मिला। विषय चुनें या सहायता से संपर्क करें।",
    "helpful": "क्या समस्या हल हो गई?",
    "yes": "हाँ",
    "no": "नहीं",
    "resolved": "खुशी है कि जवाब उपयोगी रहा। आप दूसरा सवाल पूछ सकते हैं।",
    "human": "प्रतिनिधि से संपर्क करें",
    "handoff": "आप बातचीत का सार सहायता टीम को भेज सकते हैं। ईमेल लाइव चैट नहीं है; अपने मेल ऐप में संदेश स्वयं भेजें।",
    "privacy": "पासवर्ड, भुगतान जानकारी, पुनर्प्राप्ति कुंजी या निजी डेटा न लिखें। सवाल आपके साझा करने तक ब्राउज़र में रहते हैं।",
    "email": "सार के साथ ईमेल खोलें",
    "live": "लाइव सहायता खोलें",
    "liveUnavailable": "लाइव चैट अभी कॉन्फ़िगर नहीं है। ईमेल उपलब्ध है।",
    "reset": "बातचीत साफ़ करें",
    "context": "बातचीत का सार — साझा करने से पहले जाँचें",
    "loading": "सहायता सेवा खुल रही है…",
    "liveFailed": "लाइव सहायता नहीं खुल सकी। ईमेल का उपयोग करें।"
  },
  "id": {
    "title": "Asisten Dukungan FORYMO",
    "intro": "Ajukan pertanyaan atau pilih topik. Jawaban berasal dari panduan FORYMO yang diterbitkan, bukan model AI.",
    "question": "Tulis pertanyaan Anda",
    "ask": "Tanya",
    "topics": "Pilih topik",
    "noMatch": "Saya tidak menemukan jawaban yang dapat diandalkan dalam panduan. Pilih topik atau hubungi dukungan.",
    "helpful": "Apakah masalah Anda teratasi?",
    "yes": "Ya",
    "no": "Tidak",
    "resolved": "Senang jawaban ini membantu. Anda dapat mengajukan pertanyaan lain.",
    "human": "Hubungi petugas dukungan",
    "handoff": "Anda dapat mengirim ringkasan percakapan kepada tim dukungan. Email bukan chat langsung; kirim sendiri pesan di aplikasi email.",
    "privacy": "Jangan masukkan kata sandi, data pembayaran, kunci pemulihan, atau data pribadi. Pertanyaan tetap di browser hingga Anda memilih untuk membagikannya.",
    "email": "Buka email dengan ringkasan",
    "live": "Buka dukungan langsung",
    "liveUnavailable": "Chat langsung belum dikonfigurasi. Email tetap tersedia.",
    "reset": "Hapus percakapan",
    "context": "Ringkasan percakapan — tinjau sebelum berbagi",
    "loading": "Membuka layanan dukungan…",
    "liveFailed": "Dukungan langsung tidak dapat dibuka. Gunakan email."
  }
};
const aliases={"en":["missing task|task missing|task not showing|task not appear","reminder not|reminder missing|notification not|alarm not","restore|recover|backup restore","contact|support|helpdesk|representative"],"el":["εργασία δεν|εργασια δεν|δεν εμφανίζεται εργασία|εργασία λείπει","υπενθύμιση δεν|υπενθυμιση δεν|ειδοποίηση δεν|δεν εμφανίστηκε η υπενθύμιση","επαναφορά|ανάκτηση|επαναφερω|ανακτηση","επικοινωνία|εκπρόσωπο|υποστήριξη"],"pt-BR":["tarefa não|tarefa sumiu","lembrete não|notificação não","restaurar|recuperar","atendente|contato|suporte"],"de":["aufgabe fehlt|aufgabe nicht","erinnerung nicht|erinnerung fehlt","wiederherstellen|wiederherstellung","mitarbeiter|kontakt|support"],"es":["tarea no|no aparece una tarea","recordatorio no|no apareció un recordatorio","restaurar|recuperar","representante|contactar|soporte"],"fr":["tâche manque|tâche ne|tâche absente","rappel ne|rappel absent","restaurer|restauration","conseiller|contacter|assistance"],"it":["attività non|attività manca","promemoria non|promemoria manca","ripristinare|ripristino","operatore|contatto|assistenza"],"ja":["タスクが表示されない","リマインダーが表示されない","復元","担当者|問い合わせ"],"tr":["görev görünmüyor|görev neden","hatırlatıcı görünmedi|hatırlatıcı neden","geri yükle","temsilci|iletişim|destek"],"ar":["لا تظهر مهمة|المهمة لا تظهر","لم يظهر التذكير|التذكير لا يظهر","استعادة|استعيد","ممثل|التواصل|الدعم"],"hi":["कार्य क्यों नहीं|कार्य नहीं दिख","रिमाइंडर क्यों नहीं|रिमाइंडर नहीं दिख","पुनर्स्थापित|पुनर्स्थापना","प्रतिनिधि|संपर्क"],"id":["tugas tidak muncul","pengingat tidak muncul","memulihkan|pemulihan","petugas|hubungi|dukungan"]};
const normalize=s=>String(s).normalize("NFKC").toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/[^\p{L}\p{N}]+/gu," ").trim();
const STOP=new Set(["the","a","an","and","how","can","i","my","to","do","is","what","why","please","μου","το","να","πως","πώς","για","και","την","τι","de","la","el","en","que","le","les","des","un","une","der","die","das","und","ich","wie"]);
function catalog(dict,guide){
 return [...[1,2,3,4].map(n=>({id:"support"+n,title:dict["support.q"+n],answer:dict["support.a"+n]})),...[1,2,3,4].map(n=>({id:"faq"+n,title:dict["faq.q"+n],answer:dict["faq.a"+n]})),...guide.items.map(x=>({id:"guide-"+x.key,title:x.title,answer:[x.summary,x.purpose,...x.steps.map((s,i)=>(i+1)+". "+s),guide.labels.controls+": "+x.controls,x.note?guide.labels.note+": "+x.note:""].filter(Boolean).join("\n\n")}))];
}
function match(query,items,lang){
 const q=normalize(query);if(q.length<2)return null;
 const exact=items.find(x=>normalize(x.title)===q);if(exact)return exact;
 const group=aliases[lang]||aliases.en;
 for(let i=0;i<group.length;i++)if(group[i].split("|").some(s=>q.includes(normalize(s))))return items.find(x=>x.id==="support"+(i+1));
 const tokens=[...new Set(q.split(" ").filter(t=>t.length>=3&&!STOP.has(t)))];
 const scored=items.map(x=>{const title=normalize(x.title),words=title.split(" ");let score=tokens.reduce((n,t)=>n+(words.includes(t)?3:words.some(w=>w.length>=4&&t.length>=4&&(w.startsWith(t)||t.startsWith(w)))?1:0),0);if(title.length>=3&&q.includes(title))score+=6;return {x,score};}).sort((a,b)=>b.score-a.score);
 return scored[0]?.score>=3&&scored[0].score>(scored[1]?.score||0)?scored[0].x:null;
}
function emailHref(summary,lang){return "mailto:forymo.support@gmail.com?subject="+encodeURIComponent("FORYMO Support ["+lang+"]")+"&body="+encodeURIComponent(summary.slice(0,1800));}
function validConfig(c){return Boolean(c&&typeof c.websiteToken==="string"&&/^[a-zA-Z0-9_-]{10,200}$/.test(c.websiteToken)&&typeof c.baseUrl==="string"&&/^https:\/\/([a-z0-9-]+\.)+[a-z0-9-]+(?::\d+)?$/i.test(c.baseUrl));}
if(typeof module!=="undefined"&&module.exports){module.exports={copy,catalog,match,emailHref,validConfig};return;}
const root=document.getElementById("supportAssistant");if(!root)return;
const get=id=>document.getElementById(id);
let locale=document.documentElement.lang||"en",turns=[],handoff=false,resolved=false,feedback=false,liveStatus="",sdkPromise=null;
const cfg=window.FORYMO_SUPPORT_CONFIG;
const ui=()=>copy[locale]||copy.en, items=()=>catalog(translations[locale]||translations.en,functionGuideCopy[locale]||functionGuideCopy.en);
const find=id=>items().find(x=>x.id===id);
function summary(){return turns.map(t=>{const x=t.id&&find(t.id);return (t.q||x?.title||"")+"\n"+(x?.answer||ui().noMatch);}).join("\n\n").slice(0,1800);}
function render(){
 const c=ui();root.querySelectorAll("[data-support-copy]").forEach(n=>{n.textContent=c[n.dataset.supportCopy]});
 get("supportQuestion").placeholder=c.question;
 const topics=get("supportTopics");topics.replaceChildren();
 for(const item of items()){const opt=document.createElement("option");opt.value=item.id;opt.textContent=item.title;topics.append(opt);}
 const log=get("supportLog");log.replaceChildren();
 for(const t of turns){const x=t.id&&find(t.id);for(const [type,value] of [["visitor",t.q||x?.title||""],["bot",x?.answer||c.noMatch]]){const div=document.createElement("div");div.className="support-message "+type;div.textContent=value;log.append(div);}}
 if(resolved){const div=document.createElement("div");div.className="support-message bot";div.textContent=c.resolved;log.append(div);}
 log.scrollTop=log.scrollHeight;
 get("supportFeedback").hidden=!feedback;
 get("supportHandoff").hidden=!handoff;
 if(handoff){get("supportSummary").value=summary();get("supportEmail").href=emailHref(get("supportSummary").value,locale);}
 get("supportLive").hidden=!validConfig(cfg);
 get("supportLiveUnavailable").hidden=validConfig(cfg);
 get("supportLiveStatus").textContent=liveStatus?c[liveStatus]:"";
}
function add(id,q){turns.push({id,q});if(turns.length>12)turns.shift();resolved=false;feedback=Boolean(id);handoff=!id;render();}
get("supportForm").addEventListener("submit",e=>{e.preventDefault();const q=get("supportQuestion").value.trim();if(!q)return;const x=match(q,items(),locale);get("supportQuestion").value="";add(x?.id||null,q);});
get("supportChoose").addEventListener("click",()=>add(get("supportTopics").value,""));
get("supportYes").addEventListener("click",()=>{resolved=true;feedback=false;handoff=false;render();});
function escalate(){handoff=true;feedback=false;resolved=false;render();get("supportHandoff").scrollIntoView({block:"nearest"});}
get("supportNo").addEventListener("click",escalate);get("supportHuman").addEventListener("click",escalate);
get("supportReset").addEventListener("click",()=>{turns=[];handoff=false;feedback=false;resolved=false;liveStatus="";get("supportQuestion").value="";render();});
get("supportSummary").addEventListener("input",e=>{get("supportEmail").href=emailHref(e.target.value,locale);});
function loadSdk(){
 if(window.$chatwoot)return Promise.resolve();
 if(sdkPromise)return sdkPromise;
 sdkPromise=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>finish(false),15000);
  function ready(){finish(Boolean(window.$chatwoot));}
  function finish(ok){clearTimeout(timer);window.removeEventListener("chatwoot:ready",ready);ok?resolve():reject(Error("chat unavailable"));}
  window.chatwootSettings={hideMessageBubble:true,locale, useBrowserLanguage:false,enableFileUpload:false};
  window.addEventListener("chatwoot:ready",ready,{once:true});
  const script=document.createElement("script");script.src=cfg.baseUrl+"/packs/js/sdk.js";script.async=true;script.onerror=()=>{script.remove();finish(false);};script.onload=()=>{try{window.chatwootSDK.run({websiteToken:cfg.websiteToken,baseUrl:cfg.baseUrl});}catch(_){finish(false);}};
  document.head.append(script);
 }).catch(e=>{sdkPromise=null;throw e;});return sdkPromise;
}
get("supportLive").addEventListener("click",async()=>{if(!validConfig(cfg))return;liveStatus="loading";render();try{await loadSdk();window.$chatwoot.setLocale?.(locale);window.$chatwoot.toggle("open");liveStatus="";}catch(_){liveStatus="liveFailed";}render();});
new MutationObserver(()=>{const next=document.documentElement.lang;if(next!==locale){locale=next;render();}}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
render();
})();