# Yeşil Nesil The Garden — Proje Talimatları

Bu dosya proje kökünün tamamı için geçerlidir. Daha alt bir dizinde `AGENT.md` veya `AGENTS.md` bulunursa o dizindeki işler için en yakın talimat dosyası önceliklidir.

## Proje Yapısı

- Proje, framework ve paket yöneticisi gerektirmeyen çok sayfalı bir Vanilla HTML5, CSS ve JavaScript sitesidir.
- Ortak stiller `css/shared/fonts.css` ve derlenen `css/home/site.css` (kaynak modüller `css/home/*.css` altında; derleme `npm run build:css` veya `node tools/build-home-css.mjs`), detay sayfası stilleri `css/garden-pages/garden-pages.css`, davranışlar ES modülleri olarak `js/home/app.js` ve `js/garden-pages/app.js` içindedir.
- Yerel statik sunucu `tools/serve.mjs`; üretim sunucusu `deploy/nginx.conf` ve `deploy/Dockerfile` ile tanımlanır.
- Sürüm kontrolündeki görseller ve fontlar sırasıyla `storage/public-media/images/` ve `assets/fonts/` altında tutulur.
- Büyük ham videolar `incoming-videos/`, yayın videoları `storage/public-media/videos/` altında yerel kalır ve Git'e eklenmez.

## Geliştirme Kuralları

- Mevcut Vanilla mimariyi koru; açık talep olmadan framework, bundler, paket yöneticisi veya backend ekleme.
- HTML girişlerini proje kökünde tut. Yeni ortak stilleri ve davranışları mevcut ortak dosyalara veya sorumluluğu açık alt dosyalara ekle.
- JavaScript'te inline event handler ve HTML içinde iş mantığı kullanma. Dinamik metni `textContent` ile yaz; zorunlu HTML üretimini güvenli ve merkezi tut.
- Tasarım tokenlarını `:root` değişkenlerinde merkezileştir. 320, 375, 768 ve 1440 px genişliklerde yatay taşma, klavye erişimi ve görünür odak durumlarını kontrol et.
- Bilgilendirici görsellere anlamlı `alt`, dekoratif görsellere `alt=""` ver; boyutları belirt ve ilk ekran dışındaki medyayı lazy-load et.
- `/media/` URL sözleşmesini koru. Medya yolu değişikliklerinde HTML tüketicilerini, `tools/serve.mjs`, Nginx yapılandırmasını, Docker bind mount'unu ve testleri birlikte değerlendir.
- Videolar ilk yüklemede indirilmemeli; mevcut `data-video-src`, `preload="none"` ve kullanıcı etkileşimiyle yükleme davranışını koru.
- Üretim domaini, yönlendirme, CSP, cache veya güvenlik başlığı değişikliklerinde `deploy/nginx.conf`, `compose.production.yaml` ve ilgili testleri birlikte güncelle.
- Gerçek sır, token, müşteri verisi, üretim `.env` dosyası veya özel anahtar commit etme.

## Çalıştırma ve Doğrulama

- Bağımsız yerel sunucuyu Linux'ta `bash ./sunucu_baslat.sh` veya `sh ./run_server.sh`, Windows'ta `powershell -ExecutionPolicy Bypass -File .\sunucu_baslat.ps1` ile başlat.
- Testleri `node --test tools/serve.test.mjs` ile çalıştır.
- Değişen HTML/CSS/JS davranışını masaüstü ve mobil görünümde kontrol et; tarayıcı konsolu, başarısız istek ve erişilebilirlik sorunlarını hata kabul et.
- Üretim yapılandırması değiştiyse ayrıca `docker compose -f compose.production.yaml config -q` çalıştır ve mümkünse imajı oluşturup healthcheck'i doğrula.
- Testleri atlama, zayıflatma veya `skip`/`only` ile kapsamı daraltma. Üretilmiş test raporlarını ve ekran görüntülerini commit etme.

## Git ve Teslim

- İşe başlamadan önce `git status --short --branch` çalıştır ve kullanıcıya ait mevcut değişiklikleri koru.
- İlgisiz refactor, toplu biçimlendirme veya bağımlılık güncellemesi yapma.
- Yalnız değiştirilen açık dosya yollarını stage et; `git add .` ve `git add -A` kullanma.
- Commit öncesi ilgili yollar için `git diff --check -- <dosyalar>` ve ardından `git diff --cached --check` çalıştır.
- Doğrulanmış, tek amaçlı değişikliği anlamlı bir commit ile mevcut dala gönder; force push, amend, reset veya kullanıcı değişikliklerini geri alan komutlar kullanma.
