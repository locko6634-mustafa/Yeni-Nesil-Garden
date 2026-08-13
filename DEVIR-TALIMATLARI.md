# Yeşil Nesil The Garden - Devir Talimatları

## Gerekenler

- Node.js 22.13.0 veya üzeri
- İnternet bağlantısı
- Windows kullanılıyorsa paketin içindeki `install-windows.bat` dosyası

## Kurulum

1. Arşivi masaüstüne çıkarın.
2. Çıkan klasöre girin.
3. `install-windows.bat` dosyasını çalıştırın.
4. Kurulum bitince geliştirme sunucusunu başlatmak için:

```bash
pnpm run dev
```

5. Tarayıcıda terminalde görünen lokal adresi açın.

## Önemli Klasörler

- `app/`: Sayfa kodları ve ana tasarım dosyaları
- `app/page.tsx`: Ana sayfa içeriği
- `app/globals.css`: Genel tasarım ve mobil uyum stilleri
- `public/`: Logo ve tüm görseller
- `.openai/hosting.json`: ChatGPT Sites proje bağlantısı

## Yayın

Mevcut canlı adres:

https://yesil-nesil-the-garden.vezeden12.chatgpt.site

Bu paket kaynak kod devri içindir. Başka bir hesaba veya farklı hostinge taşınacaksa proje yeniden deploy edilmelidir.

## Not

`node_modules`, `dist`, `.next`, `.vinext`, `.wrangler`, `outputs` ve geçici çalışma dosyaları arşive eklenmemiştir. Bunlar kurulum ve build sırasında yeniden oluşur.
