// Each option pairs its wording with feedback for that particular selection.
export const multipleChoice = [
  {
    prompt: 'Eve vardığımda kardeşim akşam yemeğini çoktan hazırlamıştı.',
    correct: 1,
    choices: [
      ['Cuando llegué a casa, mi hermano preparó la cena.', 'Preparó, yemeğin eve vardığım sırada ya da ardından hazırlandığını anlatır. Hazırlığın ben gelmeden önce bittiğini belirten yapı había preparado.'],
      ['Cuando llegué a casa, mi hermano ya había preparado la cena.', 'Ya había preparado, eve varıştan önce tamamlanan işi anlatır.'],
      ['Cuando llegué a casa, mi hermano estaba preparando la cena.', 'Estaba preparando, ben geldiğimde hazırlığın sürdüğünü söyler.'],
      ['Cuando llegué a casa, mi hermano iba a preparar la cena.', 'Iba a preparar, o anda henüz gerçekleşmemiş bir planı anlatır.'],
    ],
  },
  {
    prompt: 'Çocukken her yaz gölde yüzerdik.',
    correct: 3,
    choices: [
      ['El verano pasado nadamos en el lago.', 'El verano pasado tek bir yazı anlatır. Türkçe cümle çocukluktaki tekrar eden bir alışkanlığı anlatıyor.'],
      ['De pequeños, teníamos que nadar en el lago todos los veranos.', 'Teníamos que nadar, yüzmenin bir zorunluluk olduğunu ekler.'],
      ['De pequeños, podíamos nadar en el lago todos los veranos.', 'Podíamos nadar, yüzebilme olanağını bildirir. Alışkanlık için nadábamos yeterli.'],
      ['De pequeños, nadábamos en el lago todos los veranos.', 'De pequeños ve todos los veranos çocuklukta tekrar eden eylemi gösterir. Bu bağlamda nadábamos kullanılır.'],
    ],
  },
  {
    prompt: 'Bu hafta şu ana kadar iki kez müzeye gittim.',
    correct: 0,
    choices: [
      ['En lo que va de semana, he ido dos veces al museo.', 'En lo que va de semana, devam eden haftanın şu ana kadarki bölümünü gösterir. He ido bu dönemde gerçekleşen ziyaretleri anlatır.'],
      ['En lo que va de semana, hemos ido dos veces al museo.', 'Hemos ido, “gittik” anlamına gelir. Türkçe cümlede konuşan kişi kendi ziyaretlerini anlatıyor.'],
      ['La semana pasada fui dos veces al museo.', 'La semana pasada ve fui, geçen haftadaki iki ziyareti anlatır.'],
      ['Antes iba al museo dos veces por semana.', 'Iba ve por semana, eskiden her hafta tekrarlanan bir alışkanlığı anlatır.'],
    ],
  },
  {
    prompt: 'Dün perdeyi kapatmadın.',
    correct: 2,
    choices: [
      ['Ayer no tuviste que cerrar la cortina.', 'No tuviste que cerrar, perdeyi kapatman gerekmedi demektir.'],
      ['Ayer no pudiste cerrar la cortina.', 'No pudiste cerrar, perdeyi kapatamadığını anlatır.'],
      ['Ayer no cerraste la cortina.', 'Ayer bitmiş bir zaman dilimi. No cerraste, kapatma eyleminin gerçekleşmediğini bildirir.'],
      ['Ayer no quisiste cerrar la cortina.', 'No quisiste cerrar, perdeyi kapatmak istemediğini anlatır.'],
    ],
  },
  {
    prompt: 'Çocuklar yağmurlu günlerde evde resim yapmayı sever.',
    correct: 3,
    choices: [
      ['A los niños les gustaba dibujar en casa los días de lluvia.', 'Les gustaba, geçmişteki beğeniyi anlatır. Cümle güncel bir alışkanlığı anlatıyor.'],
      ['A los niños les gustan los dibujos de los días de lluvia.', 'Les gustan los dibujos, çocukların resimlerin kendisini sevdiğini söyler.'],
      ['A los niños les gusta ver dibujos en casa los días de lluvia.', 'Ver dibujos resimlere bakmayı anlatır. Türkçe cümlede çocuklar resim yapıyor.'],
      ['A los niños les gusta dibujar en casa los días de lluvia.', 'Beğeniyi yaşayan çocuklar için les, sevilen eylem dibujar olduğu için tekil gusta gelir.'],
    ],
  },
  {
    prompt: 'Dünkü gezi hoşuna gitmedi mi?',
    correct: 1,
    choices: [
      ['¿No te gustaban las excursiones?', 'Gustaban geçmişte gezilere karşı genel tutumunu sorar.'],
      ['¿No te gustó la excursión de ayer?', 'Te ikinci tekil kişiyi, gustó ise dünkü gezinin nasıl karşılandığını gösterir.'],
      ['¿No te gustó organizar la excursión de ayer?', 'Organizar eklenince soru geziyi düzenleme deneyimiyle ilgili olur.'],
      ['¿No te gustó el final de la excursión de ayer?', 'El final ifadesi soruyu gezinin sonuyla sınırlar.'],
    ],
  },
  {
    prompt: 'Müzeye girmeden önce bilet almamız gerekmişti.',
    correct: 2,
    choices: [
      ['Habíamos pensado comprar las entradas antes de entrar en el museo.', 'Habíamos pensado comprar, bilet almayı düşündüğümüzü belirtir.'],
      ['No habíamos tenido que comprar las entradas antes de entrar en el museo.', 'Olumsuz no, bilet alma zorunluluğunun olmadığını anlatır.'],
      ['Habíamos tenido que comprar las entradas antes de entrar en el museo.', 'Habíamos tenido que, müzeye girişten önceki bilet alma zorunluluğunu anlatır.'],
      ['Habíamos podido comprar las entradas antes de entrar en el museo.', 'Habíamos podido comprar, biletleri alabilmiş olduğumuzu belirtir.'],
    ],
  },
  {
    prompt: 'Bu sabah erken kalkmak zorunda kaldım.',
    correct: 0,
    choices: [
      ['Esta mañana he tenido que levantarme temprano.', 'He tenido que erken kalkmanın zorunlu olduğunu anlatır. Levantarme birinci tekil kişiye uyar.'],
      ['Esta mañana he podido levantarme temprano.', 'He podido, erken kalkmayı başardığını ya da buna imkânın olduğunu söyler.'],
      ['Esta mañana me ha gustado levantarme temprano.', 'Me ha gustado, erken kalkmaktan hoşlandığını söyler.'],
      ['Esta mañana he intentado levantarme temprano.', 'He intentado, erken kalkmayı denediğini bildirir.'],
    ],
  },
  {
    prompt: 'Julia yeşil elmaları sever. Boşluğu doldur.',
    context: 'A Julia ___ las manzanas verdes.',
    correct: 1,
    choices: [
      ['le gusta', 'Le Julia için doğru, fakat las manzanas verdes çoğul olduğu için fiil gustan olur.'],
      ['le gustan', 'Le tek bir kişiye, Julia’ya işaret eder. Gustan çoğul özne las manzanas verdes ile uyumludur.'],
      ['les gustan', 'Gustan çoğul özneye uyuyor. Les ise beğeniyi yaşayan birden fazla kişiyi gösterir.'],
      ['les gusta', 'Julia için le, çoğul las manzanas verdes için gustan gerekir.'],
    ],
  },
  {
    prompt: 'Şu anda komşularımız bahçede konuşuyor.',
    correct: 2,
    choices: [
      ['Ahora mismo nuestros vecinos van a hablar en el jardín.', 'Van a hablar, konuşmanın şimdi başlayacağını ya da planlandığını anlatır.'],
      ['Nuestros vecinos estaban hablando en el jardín hace un rato.', 'Estaban hablando ve hace un rato, az önce süren bir eylemi anlatır.'],
      ['Ahora mismo nuestros vecinos están hablando en el jardín.', 'Ahora mismo ve están hablando, konuşmanın tam şu anda sürdüğünü gösterir.'],
      ['Nuestros vecinos ya han hablado en el jardín.', 'Ya han hablado, konuşmanın gerçekleştiğini ve tamamlandığını bildirir.'],
    ],
  },
  {
    prompt: 'Sen geldiğinde biz akşam yemeği yiyorduk.',
    correct: 0,
    choices: [
      ['Cuando llegaste, estábamos cenando.', 'Estábamos cenando, sen geldiğinde akşam yemeğinin sürmekte olduğunu gösterir.'],
      ['Cuando llegaste, íbamos a cenar.', 'Íbamos a cenar, sen geldiğinde yemeğin henüz bir plan olduğunu anlatır.'],
      ['Cuando llegaste, ya habíamos cenado.', 'Ya habíamos cenado, sen gelmeden önce yemeği bitirdiğimizi söyler.'],
      ['Cuando llegaste, tuvimos que cenar.', 'Tuvimos que cenar, o anda yemek yememiz gerektiğini bildirir.'],
    ],
  },
  {
    prompt: 'Yarın ilk otobüse binebilecek miyim?',
    correct: 3,
    choices: [
      ['¿Tengo que coger el primer autobús mañana?', 'Tengo que, ilk otobüse binmenin gerekli olup olmadığını sorar.'],
      ['¿Voy a coger el primer autobús mañana?', 'Voy a coger, ilk otobüse binme planını sorar. Binebilme anlamı için poder gerekir.'],
      ['¿Vamos a poder coger el primer autobús mañana?', 'Vamos a poder, “binebilecek miyiz” demektir. Cümlede soruyu bir kişi kendisi için soruyor.'],
      ['¿Voy a poder coger el primer autobús mañana?', 'Voy a gelecek zaman anlamı verir. Poder, ilk otobüse binmenin mümkün olup olmadığını sorar.'],
    ],
  },
  {
    prompt: 'Dün e-postayı akşam gönderecektik.',
    correct: 2,
    choices: [
      ['Ayer estábamos enviando el correo por la noche.', 'Estábamos enviando, gönderim işleminin sürdüğünü söyler.'],
      ['Ayer tuvimos que enviar el correo por la noche.', 'Tuvimos que enviar, akşam göndermek zorunda kaldığımızı anlatır.'],
      ['Ayer íbamos a enviar el correo por la noche.', 'Íbamos a enviar, dün akşam için planlanan eylemi anlatır.'],
      ['Ayer pudimos enviar el correo por la noche.', 'Pudimos enviar, e-postayı gönderebildiğimizi söyler.'],
    ],
  },
  {
    prompt: 'Yola çıkmadan önce hazırlanacağız. Dönüşlü zamiri çekimli fiilden önce gösteren seçeneği seç.',
    correct: 0,
    choices: [
      ['Nos vamos a preparar antes de salir.', 'Nos zamiri çekimli vamos fiilinden önce. Bu yerleşim yönergeyle uyumlu.'],
      ['Vamos a prepararnos antes de salir.', 'Bu çeviri de doğru. Bu soruda özellikle nos zamirinin çekimli fiilden önceki konumu isteniyor.'],
      ['Vamos a preparar todo antes de salir.', 'Preparar todo, “her şeyi hazırlamak” demektir. Kendi hazırlığımız için prepararse kullanılır.'],
      ['Me voy a preparar antes de salir.', 'Me voy a preparar, “hazırlanacağım” demektir. “Hazırlanacağız” için nos ve vamos gerekir.'],
    ],
  },
  {
    prompt: 'Şu anda tıraş oluyorum. Dönüşlü zamirin gerundio ile birleştiği doğru seçeneği seç.',
    correct: 3,
    choices: [
      ['Ahora me estoy afeitando.', 'Bu çeviri doğru ve me çekimli fiilden önce. Yönerge zamirin gerundio sonuna eklenmesini istiyor.'],
      ['Ahora estoy afeitandome.', 'Zamirin yeri doğru. Afeitándome yazarken sözcüğün vurgusunu korumak için á gerekir.'],
      ['Ahora estoy afeitándonos.', 'Afeitándonos, nos zamirini içerir. Birinci tekil kişi estoy ile me kullanılmalı.'],
      ['Ahora estoy afeitándome.', 'Estoy birinci tekil kişiye uyar. Gerundio sonuna me eklenince afeitándome biçimini alır.'],
    ],
  },
  {
    prompt: 'Dün randevuyu değiştirebildik.',
    correct: 1,
    choices: [
      ['Ayer tuvimos que cambiar la cita.', 'Tuvimos que cambiar, değiştirmek zorunda kaldığımızı söyler.'],
      ['Ayer pudimos cambiar la cita.', 'Pudimos cambiar, geçmişte randevuyu değiştirmeyi başardığımızı anlatır.'],
      ['Ayer íbamos a poder cambiar la cita.', 'Íbamos a poder, değiştirebileceğimize dair geçmişteki beklentiyi anlatır.'],
      ['Ayer no pudimos cambiar la cita.', 'No pudimos, “değiştiremedik” anlamına gelir.'],
    ],
  },
  {
    prompt: 'Eskiden pencereden denizi görebiliyorduk.',
    correct: 0,
    choices: [
      ['Antes podíamos ver el mar desde la ventana.', 'Podíamos, geçmişte düzenli olarak var olan görme imkânını anlatır.'],
      ['Antes teníamos que mirar el mar desde la ventana.', 'Teníamos que mirar, denize bakmak zorunda olduğumuzu belirtir.'],
      ['Desde la ventana pudimos ver el mar aquella mañana.', 'Pudimos ve aquella mañana, denizi görebildiğimiz tek bir sabahı anlatır.'],
      ['Antes nos gustaba ver el mar desde la ventana.', 'Nos gustaba, manzarayı seyretmenin hoşumuza gittiğini anlatır.'],
    ],
  },
  {
    prompt: 'Onlar geldiğinde ben kapıyı açmayı çoktan başarmıştım.',
    correct: 2,
    choices: [
      ['Cuando llegaron, pude abrir la puerta.', 'Pude abrir eylemin onlar geldiği sırada gerçekleştiğini anlatır.'],
      ['Cuando llegaron, todavía tenía que abrir la puerta.', 'Todavía tenía que abrir, kapıyı açma işinin o anda hâlâ yapılmadığını belirtir.'],
      ['Cuando llegaron, ya había podido abrir la puerta.', 'Ya había podido abrir, onlar gelmeden önce kapıyı açabilmiş olduğunu gösterir.'],
      ['Cuando llegaron, iba a poder abrir la puerta.', 'Iba a poder abrir, o anda kapıyı açabileceğine dair bir beklentiyi anlatır.'],
    ],
  },
  {
    prompt: 'Hayatımda hiç tek başıma trenle seyahat etmedim.',
    correct: 1,
    choices: [
      ['Nunca había viajado solo en tren.', 'Había viajado, geçmişteki bir ana kadar olan deneyimi anlatır.'],
      ['Nunca he viajado solo en tren.', 'He viajado, bugüne kadarki hayat deneyimini anlatır. Nunca bu deneyimin hiç yaşanmadığını gösterir.'],
      ['Antes nunca viajaba solo en tren.', 'Viajaba, eskiden geçerli olan bir seyahat alışkanlığını tarif eder.'],
      ['No pude viajar solo en tren.', 'No pude, belirli bir tren yolculuğunu tek başına yapamadığını bildirir.'],
    ],
  },
  {
    prompt: 'Sakatlandıktan sonra bir süre koşamadı.',
    correct: 3,
    choices: [
      ['Después de lesionarse, no tuvo que correr durante un tiempo.', 'No tuvo que correr, bir süre koşması gerekmediğini söyler.'],
      ['Después de lesionarse, no quiso correr durante un tiempo.', 'No quiso correr, bir süre koşmak istemediğini anlatır.'],
      ['Después de lesionarse, dejó de correr durante un tiempo.', 'Dejó de correr, koşmayı bıraktığını bildirir. Koşamadığını söylemek için poder kullanılır.'],
      ['Después de lesionarse, no pudo correr durante un tiempo.', 'No pudo correr, sakatlıktan sonra bir süre koşamadığını açıkça söyler.'],
    ],
  },
  {
    prompt: 'Dün köprü mühendisler tarafından kontrol edildi.',
    correct: 0,
    choices: [
      ['Ayer el puente fue inspeccionado por los ingenieros.', 'Fue inspeccionado tamamlanan edilgen eylemi bildirir. Por los ingenieros eylemi kimin yaptığını söyler.'],
      ['Ayer el puente estaba en revisión.', 'Estaba en revisión köprünün incelemede olduğunu belirtir. Kimin incelediğini ve işlemin tamamlandığını söylemez.'],
      ['Ayer los ingenieros tuvieron que inspeccionar el puente.', 'Tuvieron que inspeccionar, mühendislerin köprüyü incelemek zorunda kaldığını anlatır.'],
      ['Ayer los ingenieros iban a inspeccionar el puente.', 'Iban a inspeccionar, incelemenin planlandığını söyler.'],
    ],
  },
  {
    prompt: 'Pencereler dün teknisyenler tarafından onarıldı. Boşluğu doldur.',
    context: 'Las ventanas ___ ayer por los técnicos.',
    correct: 1,
    choices: [
      ['fueron reparados', 'Fueron çoğul özneye uyuyor. Las ventanas dişil çoğul olduğu için reparadas gerekir.'],
      ['fueron reparadas', 'Las ventanas dişil ve çoğul. Bu yüzden fueron ve reparadas birlikte kullanılır.'],
      ['fue reparada', 'Fue reparada tekil bir pencere için kullanılabilir. Burada özne çoğul.'],
      ['habían reparado', 'Habían reparado etken bir yapıdır. Burada özne yapılan onarımdan etkilenen pencereler.'],
    ],
  },
  {
    prompt: 'Toplantıdan önce dosyaları gönderebilmiştik.',
    correct: 3,
    choices: [
      ['Antes de la reunión ya habíamos enviado los archivos.', 'Habíamos enviado, dosyaları önceden gönderdiğimizi söyler. Gönderebilmiş olduğumuzu vurgulamak için podido gerekir.'],
      ['Antes de la reunión íbamos a poder enviar los archivos.', 'Íbamos a poder, geçmişteki beklentiyi anlatır.'],
      ['Antes de la reunión teníamos que enviar los archivos.', 'Teníamos que, dosyaları gönderme zorunluluğunu anlatır.'],
      ['Antes de la reunión ya habíamos podido enviar los archivos.', 'Habíamos podido, dosyaları geçmişteki toplantıdan önce gönderebilmiş olduğumuzu gösterir.'],
    ],
  },
  {
    prompt: 'Bugün yemeği hazırlamadan önce ellerimi yıkadım.',
    correct: 2,
    choices: [
      ['Hoy he tenido que lavarme las manos antes de preparar la comida.', 'He tenido que, elleri yıkamanın gerekli olduğunu ekler.'],
      ['Hoy iba a lavarme las manos antes de preparar la comida.', 'Iba a lavarme, planı anlatır. Türkçe cümlede eller gerçekten yıkandı.'],
      ['Hoy me he lavado las manos antes de preparar la comida.', 'Hoy devam eden zaman dilimini gösterir. Me he lavado, eylemi birinci tekil kişide tamamlanmış olarak anlatır.'],
      ['Hoy he podido lavarme las manos antes de preparar la comida.', 'He podido, elleri yıkayabilme imkânını ya da bunu başarmayı vurgular.'],
    ],
  },
  {
    prompt: 'Yarın hepimiz saat sekizde buluşacağız.',
    correct: 0,
    choices: [
      ['Mañana todos nos vamos a encontrar a las ocho.', 'Nos vamos a encontrar, hepimizin yarın saat sekizde buluşma planını anlatır.'],
      ['Mañana todos vamos a poder encontrarnos a las ocho.', 'Vamos a poder, saat sekizde buluşabileceğimizi söyler. Türkçe cümle doğrudan buluşma planını bildirir.'],
      ['Mañana todos nos tenemos que encontrar a las ocho.', 'Nos tenemos que encontrar, saat sekizde buluşmanın zorunlu olduğunu söyler.'],
      ['Mañana todos nos vamos a encontrar a las nueve.', 'Gelecek zaman yapısı doğru. A las nueve saat dokuzda demektir, istenen saat sekiz.'],
    ],
  },
];
