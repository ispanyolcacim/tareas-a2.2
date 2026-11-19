// The 25 mixed translations from the lesson PDF. The score checks the target verb phrase.
export const homework = [
  ['Okula gitmeyi sevmemişti.', 'No le había gustado ir al colegio.', ['no le había gustado']],
  ['Para kazanmayı severler.', 'Les gusta ganar dinero.', ['les gusta ganar']],
  ['Bu sabah spor yapmanız gerekti.', 'Esta mañana habéis tenido que hacer deporte.', ['habéis tenido que hacer', 'han tenido que hacer']],
  ['Eskiden mor rengi sevmezdin.', 'Antes no te gustaba el color morado.', ['no te gustaba', 'no te gustaban']],
  ['Müzeye girebilecekti.', 'Iba a poder entrar en el museo.', ['iba a poder entrar']],
  ['Sağlıklı beslenmemiz lazım.', 'Tenemos que alimentarnos bien.', ['tenemos que alimentarnos', 'nos tenemos que alimentar', 'tenemos que comer']],
  ['Çocukken her pazar duş almam gerekiyordu.', 'De niño, tenía que ducharme todos los domingos.', ['tenía que ducharme', 'me tenía que duchar', 'tenía que tomar una ducha']],
  ['Dün makyaj yapmaları gerekti.', 'Ayer tuvieron que maquillarse.', ['tuvieron que maquillarse', 'se tuvieron que maquillar']],
  ['Bu sabah patronumdan e-posta almadım.', 'Esta mañana no he recibido ningún correo de mi jefe.', ['no he recibido']],
  ['Erken kalkabilirsin.', 'Puedes levantarte temprano.', ['puedes levantarte', 'te puedes levantar', 'puedes madrugar']],
  ['Sinemaya gitmeyi düşünüyordu.', 'Estaba pensando en ir al cine.', ['estaba pensando en ir', 'pensaba en ir']],
  ['Dün bebek duş almaktan hoşlanmadı.', 'Ayer al bebé no le gustó ducharse.', ['no le gustó ducharse', 'no le gustó tomar una ducha', 'no le gustó bañarse']],
  ['Kitaplar hakkında düşünüyorsun.', 'Estás pensando en los libros.', ['estás pensando', 'piensas']],
  ['Kampta hep yumurta pişirirdik.', 'En el campamento siempre cocinábamos huevos.', ['cocinábamos', 'preparábamos', 'hacíamos', 'freíamos']],
  ['Bu gece araba sürecek.', 'Esta noche va a conducir.', ['va a conducir', 'va a manejar']],
  ['Alışveriş yapabilecek.', 'Va a poder hacer la compra.', ['va a poder hacer', 'va a poder ir de compras', 'va a poder comprar']],
  ['Okula gitmeden önce duş alman gerekiyordu.', 'Tenías que ducharte antes de ir al colegio.', ['tenías que ducharte', 'te tenías que duchar', 'tenías que tomar una ducha']],
  ['Dün kıyafetleri yıkamadın.', 'Ayer no lavaste la ropa.', ['no lavaste']],
  ['Dün gece uyuyabildik.', 'Anoche pudimos dormir.', ['pudimos dormir']],
  ['Eskiden görüntülü konuşma yapamıyorduk.', 'Antes no podíamos hacer videollamadas.', ['no podíamos hacer', 'no podíamos hablar', 'no podíamos realizar']],
  ['Yaşlı insanlara her zaman yardım eder.', 'Siempre ayuda a las personas mayores.', ['ayuda a', 'ayuda en']],
  ['Bayramdan önce evi temizlemiştiniz.', 'Antes de la festividad habíais limpiado la casa.', ['habíais limpiado', 'habían limpiado']],
  ['Bu sabah kahvaltıdaki domatesleri sevmedim.', 'Esta mañana no me han gustado los tomates del desayuno.', ['no me han gustado']],
  ['Doktora danışabilmiştik.', 'Habíamos podido consultar al médico.', ['habíamos podido consultar', 'habíamos podido hablar', 'habíamos podido preguntarle']],
  ['Dün dans edecekti.', 'Ayer iba a bailar.', ['iba a bailar']],
];

export function hasTargetStructure(value, patterns) {
  const words = value.normalize('NFC').toLocaleLowerCase('es').match(/\p{L}+/gu);
  if (!words) return false;
  return patterns.some(pattern => {
    const target = pattern.split(' ');
    return words.some((_, start) => words[start - 1] !== 'no' &&
      target.every((word, offset) => words[start + offset] === word));
  });
}
