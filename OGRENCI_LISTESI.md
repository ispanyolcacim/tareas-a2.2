# Öğrenci listeleri

Ödevlerdeki başlangıç ve teslim isim seçimleri, portalın kullandığı Google Sheets kaynağından güncellenir. Mevcut ödev içeriği, tasarımı, soruları ve teslim işlevleri korunur.

## Yeni öğrenci ekleme

1. Portalın bağlı olduğu Google Sheets dosyasını açın.
2. Öğrencinin seviyesine ait sekmede öğrenci adını ekleyin. Ödev Takip Merkezi için kişisel kodunu da aynı satırdaki Öğrenci Kodu sütununda tutun.
3. Ödev sayfasını yenileyin. Liste, önbellek yenilendikten sonra yeni ismi alfabetik sırada gösterir.

Eski öğrencilerin satırlarını silmeden yeni dönem öğrencilerini ekleyin. Ödevde zaten kayıtlı adlar ve bu kurulumdaki isim yedeği de korunarak birleştirilir. Eşdeğer yazımlarla tekrar eden isimler listede bir kez gösterilir.

## Korunan davranış

- Başlangıç ve teslim seçimleri ayrı kalır; öğrenci son adımda ismini düzeltebilir.
- Seçimler arasındaki düzeltme, isim listesi yenilendiğinde sıfırlanmaz.
- Sorulara ait diğer açılır listeler etkilenmez.
- Yeni isimler, ödevin mevcut teslim düzeninde ilgili seviyeye bağlanır.
- Google Sheets bağlantısı çalışmasa da eski isimler ve kurulumdaki isim yedeği seçilebilir.
- Bağlantı yalnızca öğrenci adlarını ister. Kişisel giriş kodları bu JavaScript dosyasına taşınmaz.

## Dosyalar

Öğrenci seçimi içeren HTML dosyalarının başlığına yalnızca şu bağlantı eklenmiştir:

```html
<script src="student-roster.js" defer></script>
```

`student-roster.js`, mevcut isimleri korur, isim yedeğini ekler ve güncel adları portalın mevcut öğrenci listesi servisi üzerinden alır. Her ödevin kendi teslim kodu kullanılmaya devam eder.
