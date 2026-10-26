# Kampüs Etkinlik Panosu

Bu proje, kampüsteki etkinlikleri listelemek ve kullanıcıların etkinlik önerisi yapmasını sağlamak amacıyla hazırlanmıştır.

## Kullanılan teknolojiler

- HTML
- CSS
- JavaScript
- Node.js

## Projeyi çalıştırma

1. Bilgisayarınızda Node.js yüklü olmalıdır.
2. Terminalde proje klasörüne gidin.
3. Sunucuyu başlatın:

   ```bash
   npm start
   ```

4. Tarayıcıda `http://localhost:3000` adresini açın.

Windows PowerShell'de komut çalışmazsa `npm.cmd start` kullanılabilir.

## Özellikler

- Etkinlikler sunucudan alınarak listelenir.
- Etkinlik adına göre arama yapılabilir.
- Etkinlikler türlerine göre filtrelenebilir.
- Öneri formunda ad, tarih ve e-posta bilgileri kontrol edilir.
- Sayfa farklı ekran boyutlarına uyum sağlar.

## API testleri

| İstek | Sonuç | Açıklama |
|---|---|---|
| `GET /api/etkinlikler?tur=atolye` | 200 | Atölye türündeki etkinlikleri listeler. |
| `GET /api/etkinlikler/2` | 200 | ID değeri 2 olan etkinliği getirir. |
| `GET /api/etkinlikler/999` | 404 | Bulunmayan etkinlik için hata döndürür. |
| `DELETE /api/etkinlikler/2` | 405 | Desteklenmeyen yöntem için hata döndürür. |

Test sonuçları `API_Testleri.txt` dosyasında bulunmaktadır.

## Erişilebilirlik testi

Lighthouse ile erişilebilirlik testi yapıldı. E-posta alanının etiketi varken sonuç **100**, etiket geçici olarak kaldırıldığında **93** olarak ölçüldü. Testten sonra etiket tekrar eklendi.