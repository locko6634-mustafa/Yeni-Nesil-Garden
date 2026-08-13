import type { Metadata } from "next";

const gardens = [
  {
    name: "Hayal Bahçe",
    image: "/gardens/hayal-bahce-thumb.webp",
    mood: "Geniş yeşil alanda açık hava davetleri",
    detail: "Gölge, göl kenarı ve nikah düzeniyle büyük davet akışını rahat taşıyan ferah bahçe.",
  },
  {
    name: "Kale Bahçe",
    image: "/gardens/kale-bahce-thumb.webp",
    mood: "Beyaz kemerler ve büyük şemsiyeler",
    detail: "Klasik, aydınlık ve düzenli masa yerleşimiyle kalabalık kır düğünleri için güçlü atmosfer.",
  },
  {
    name: "Masal Bahçe",
    image: "/gardens/masal-bahce-thumb.webp",
    mood: "Romantik, korunaklı ve davetkar",
    detail: "Sıcak gün ışığı, yeşil doku ve süslemeli alanlarıyla masalsı bir kutlama hissi.",
  },
  {
    name: "Rüya Bahçe",
    image: "/gardens/ruya-bahce-thumb.webp",
    mood: "Bohem ışıklar ve özel masa düzeni",
    detail: "Sıcak aydınlatma, ahşap masalar ve altın sandalye detaylarıyla samimi davet atmosferi.",
  },
];

const menuGroups = [
  {
    name: "KOKTEYL MENÜ",
    label: "Kokteyl",
    image: "/menu/kokteyl.jpg",
    items: [
      { title: "Limon Dip Soslu Kurudite", text: "Salatalık ve taze havuç dilimleri." },
      { title: "Cips – Çerez Tabağı", text: "Kokteyl akışına uygun masa ikramı." },
      { title: "İkram Tabağı (Kişiye Özel)", text: "Su böreği, mini poğaça, mini pizza, pembe sultan, makarna salatası, yaprak sarma ve çiğ köfte." },
      { title: "Pasta", text: "Frambuazlı Yaş Pasta" },
      { title: "Meyve İkramı", text: "Mevsim meyveleri." },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
  {
    name: "BEYAZ ET MENÜ",
    label: "Ana yemek",
    image: "/menu/beyaz-et.jpg",
    items: [
      { title: "Ara Sıcak", text: "Su Böreği" },
      { title: "Ana Yemek", text: "Özel Yeşil Nesil soslu piliç sote, tereyağlı pirinç pilavı, patates püresi ve garnitür." },
      { title: "Pasta", text: "Frambuazlı Yaş Pasta" },
      { title: "Meyve", text: "Mevsim Meyveleri" },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
  {
    name: "KIRMIZI ET MENÜ",
    label: "Ana yemek",
    image: "/menu/kirmizi-et.jpg",
    items: [
      { title: "Ara Sıcak", text: "Su Böreği" },
      { title: "Ana Yemek", text: "Taze baharatlarla marine edilmiş çoban kavurma, tereyağlı pirinç pilavı, patates püresi ve garnitür." },
      { title: "Pasta", text: "Frambuazlı Yaş Pasta" },
      { title: "Meyve", text: "Mevsim Meyveleri" },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
  {
    name: "BEYAZ ET SET MENÜ",
    label: "Set menü",
    image: "/menu/beyaz-et-set.jpg",
    items: [
      { title: "Ordövr Tabağı", text: "Haydari, şakşuka, havuç tarator, acılı ezme, Amerikan salatası, zeytinyağlı yaprak sarması, yeşillik eşliğinde cevizli çiğ köfte, salatalık ve domates." },
      { title: "Ara Sıcak", text: "Su Böreği" },
      { title: "Ana Yemek", text: "Özel Yeşil Nesil soslu piliç sote, tereyağlı pirinç pilavı, patates püresi ve garnitür." },
      { title: "Pasta", text: "Frambuazlı Yaş Pasta" },
      { title: "Meyve", text: "Mevsim Meyveleri" },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
  {
    name: "KIRMIZI ET SET MENÜ",
    label: "Set menü",
    image: "/menu/kirmizi-et-set.jpg",
    items: [
      { title: "Ordövr Tabağı", text: "Haydari, şakşuka, havuç tarator, acılı ezme, Amerikan salatası, zeytinyağlı yaprak sarması, yeşillik eşliğinde cevizli çiğ köfte, salatalık ve domates." },
      { title: "Ara Sıcak", text: "Su Böreği" },
      { title: "Ana Yemek", text: "Taze baharatlarla marine edilmiş çoban kavurma, tereyağlı pirinç pilavı, patates püresi ve garnitür." },
      { title: "Pasta", text: "Frambuazlı Yaş Pasta" },
      { title: "Meyve", text: "Mevsim Meyveleri" },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
  {
    name: "HÜNKAR BEĞENDİ SET MENÜ",
    label: "Set menü",
    image: "/menu/kirmizi-et-set.jpg",
    items: [
      { title: "Ordövr Tabağı", text: "Haydari, şakşuka, havuç tarator, acılı ezme, Amerikan salatası, zeytinyağlı yaprak sarması, zeytinyağlı enginar, humus ve pembe sultan." },
      { title: "Ara Sıcak", text: "Su Böreği" },
      { title: "Ana Yemek", text: "Hünkar beğendi, tereyağlı pirinç pilavı, patates püresi, garnitür ve kişiye özel mevsim salata." },
      { title: "Pasta", text: "Kalıplı Dondurmalı Pasta" },
      { title: "Meyve", text: "Mevsim Meyveleri" },
      { title: "İçecek", text: "Soft İçecek" },
    ],
  },
];

const services = [
  {
    name: "Düğün",
    image: "/services/service-dugun.webp",
    detail: "Doğanın içinde, zarif masa düzeni ve güçlü organizasyon akışıyla unutulmaz kır düğünleri.",
  },
  {
    name: "Kına",
    image: "/services/service-kina.webp",
    detail: "Işık, müzik ve geleneksel dokuyu sıcak bir bahçe atmosferiyle buluşturan kına geceleri.",
  },
  {
    name: "Nişan",
    image: "/services/service-nisan.webp",
    detail: "Romantik süslemeler, şık karşılama ve fotoğraf değeri yüksek nişan davetleri.",
  },
  {
    name: "Nikah Seremonisi",
    image: "/services/service-nikah-seremonisi.webp",
    detail: "Yeşil alan, nikah yolu ve zarif seremoni düzeninin bir arada olduğu açık hava törenleri.",
  },
];

const eventPackages = [
  {
    type: "Kına Paketi",
    name: "KLASİK PAKET",
    image: "/packages/kina-klasik.jpg",
    badge: "Kına Paketi",
    summary: "Sade, sıcak ve geleneksel kına akışı için temel paket.",
    items: [
      "3 kişilik profesyonel dans ekibi",
      "Profesyonel DJ ve müzik arşivi",
      "Standart paket kına tahtı ve yan aksesuarları",
      "Kına tepsisi, sepeti, duvak ve seremoni aksesuarları",
      "Bindallı, 10 adet pelerin/kaftan ve organizasyon yönetimi",
    ],
  },
  {
    type: "Kına Paketi",
    name: "Kına Premium",
    image: "/packages/kina-premium.jpg",
    badge: "En çok tercih",
    summary: "Daha gösterişli sahne, dekor ve fotoğraf etkisi isteyen davetler için.",
    items: ["Özel kına sahnesi ve taht kurulumu", "Zengin çiçek, mum ve ışık dekoru", "Giriş seremonisi için alan planı", "Fotoğraf köşesi ve detay çekim noktaları"],
  },
  {
    type: "Fotoğraf Paketi",
    name: "Classic Paket",
    image: "/packages/fotograf-klasik.jpg",
    badge: "Classic",
    summary: "Düğün günü temel çekim ihtiyaçları için hazırlanan fotoğraf paketi.",
    items: ["Aktüel Kamera (Full 1080p)", "10 Poz Dijital Aile Pozu (Düğün Sonunda)"],
  },
  {
    type: "Fotoğraf Paketi",
    name: "Gold Paket",
    image: "/packages/fotograf-premium.jpg",
    badge: "Gold",
    summary: "Fotoğraf, video, drone ve gelin-damat çekimlerini kapsayan geniş paket.",
    items: [
      "Aktüel Kamera (Full 1080p)",
      "10 Poz Dijital Aile Pozu (Düğün Sonunda)",
      "Drone Çekimi",
      "Düğün Hikayesi (Düğün Anında)",
      "Gelin Damat Ön Çekim",
      "Gelin Damat Fotoğraf Arşivi (Takı ve 3. şahıslar verilmez)",
    ],
  },
];

const testimonials = [
  {
    names: "Ece & Kaan",
    photo: "/couples/couple-1.webp",
    garden: "Hayal Bahçe",
    quote:
      "Salonun yeşil alanı, nikah yolu ve masa düzeni tam hayal ettiğimiz gibiydi. Misafirlerimiz mekanın ferahlığını çok beğendi.",
  },
  {
    names: "Derya & Mert",
    photo: "/couples/couple-2.webp",
    garden: "Kale Bahçe",
    quote:
      "Kale Bahçe'nin beyaz dokusu ve aydınlık atmosferi fotoğraflarda harika durdu. Organizasyon boyunca her şey çok düzenliydi.",
  },
  {
    names: "Naz & Can",
    photo: "/couples/couple-3.webp",
    garden: "Masal Bahçe",
    quote:
      "Masal Bahçe gerçekten adının hakkını veriyor. Hem romantik hem de misafirlerin rahat ettiği çok sıcak bir alan.",
  },
  {
    names: "Selin & Burak",
    photo: "/couples/couple-4.webp",
    garden: "Rüya Bahçe",
    quote:
      "Işıklar, masa düzeni ve doğal ortam sayesinde gece boyunca çok özel bir atmosfer oluştu. Herkesten güzel yorum aldık.",
  },
];

const faqs = [
  {
    question: "Yağmur veya olumsuz hava koşullarında çözümünüz var mı?",
    answer:
      "Kale Bahçe ve Masal Bahçe'de, bahçelerin toplam kapasitesini koruyabilecek büyüklükte dev şemsiyelerimiz bulunmaktadır. Hayal Bahçe'de ise her masanın üzerine gazebo şemsiye kurulumu yapılarak misafirlerimiz yağmurdan korunmaktadır.",
  },
  {
    question: "Misafirlerimizin kullanabileceği otopark bulunuyor mu?",
    answer:
      "Evet. Tesisimizde 500 araç kapasiteli açık otopark bulunmaktadır.",
  },
  {
    question: "Düğün paketlerinizin içerisinde neler bulunuyor?",
    answer:
      "Paketlerimiz; mekân kullanımı, masa ve sandalye düzeni, konsept süsleme, ikramlıklar ve organizasyon hizmetlerini kapsamaktadır. Paket içerikleri, çiftlerimizin ihtiyaçlarına göre özel olarak hazırlanabilmektedir.",
  },
  {
    question: "Düğün günümüzde bizimle ilgilenecek bir yetkili bulunuyor mu?",
    answer:
      "Evet. Düğün gününüzde, programın başından sonuna kadar size eşlik edecek bir gelin-damat asistanınız bulunmaktadır.",
  },
  {
    question: "Kaç kişilik organizasyonlar düzenleyebiliyorsunuz?",
    answer:
      "Tesisimizde dört farklı konsepte sahip bahçe bulunmaktadır. Bu bahçelerde 50 kişiden 1.500 kişiye kadar farklı kapasitelere uygun organizasyonlar düzenleyebilmekteyiz.",
  },
];

export const metadata: Metadata = {
  title: "Yeşil Nesil The Garden | Kır Düğünü ve Davet Bahçeleri",
  description:
    "Polonezköy Hayal Ormanları'nda, dört farklı kır düğünü bahçesiyle doğanın içinde davet ve organizasyon deneyimi.",
};

function PackageItems({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((detail) => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="anasayfa">
        <nav className="nav" aria-label="Ana navigasyon">
          <a className="brand" href="#anasayfa" aria-label="Yeşil Nesil The Garden">
            <img src="/yesil-nesil-logo-transparent.png" alt="Yeşil Nesil logo" />
            <span>Yeşil Nesil The Garden</span>
          </a>
          <div className="nav-links">
            <a href="#bahceler">Bahçeler</a>
            <a href="#hizmetler">Hizmetler</a>
            <a href="#paketler">Paketler</a>
            <a href="#menu">Menü</a>
            <a href="#yorumlar">Yorumlar</a>
            <a href="#iletisim">İletişim</a>
          </div>
        </nav>

        <div className="hero-showcase">
          <img
            src="/gardens/hayal-bahce.webp"
            alt="Hayal Bahçe havadan kır düğünü düzeni"
          />
          <div className="hero-overlay">
            <p className="eyebrow">Polonezköy Hayal Ormanları</p>
            <h1>Yeşil Nesil The Garden</h1>
            <p className="lead">
              İstanbul'un merkezine yakın, Kavacık'a yalnızca 10 dakika
              mesafede; doğanın eşliğinde dört farklı konseptte kır düğünü
              bahçesiyle hayalinizdeki davete ev sahipliği yapıyor.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#bahceler">
                Bahçeleri incele
              </a>
              <a className="button secondary" href="#iletisim">
                Rezervasyon al
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="bahceler">
        <div className="section-heading gardens-heading">
          <h2>Yeşil Nesil The Garden Mekanlar</h2>
        </div>
        <div className="garden-grid">
          {gardens.map((garden, index) => (
            <article className="garden-card" key={garden.name}>
              <div className="image-slot garden-image photo-slot">
                <img src={garden.image} alt={`${garden.name} görseli`} />
              </div>
              <div>
                <p className="garden-number">0{index + 1}</p>
                <h3>{garden.name}</h3>
                <p className="mood">{garden.mood}</p>
                <p>{garden.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split" id="menu">
        <div className="menu-copy">
          <p className="eyebrow">Menü içerikleri</p>
          <h2>Kişi Başı Fiyatlar</h2>
        </div>
        <div className="menu-list">
          {menuGroups.map((group) => (
            <details className="menu-row" key={group.name}>
              <summary>
                <img src={group.image} alt={`${group.name} menü görseli`} />
                <span>
                  <small>{group.label}</small>
                  {group.name}
                </span>
                <b aria-hidden="true">+</b>
              </summary>
              <ul>
                {group.items.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <em>{item.text}</em>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="section packages" id="paketler">
        <div className="section-heading packages-heading">
          <h2>Kına ve fotoğraf paketleri</h2>
        </div>
        <div className="package-tabs">
          <input type="radio" name="package-tab" id="photo-packages" defaultChecked />
          <input type="radio" name="package-tab" id="henna-packages" />
          <div className="package-switch" aria-label="Paket seçimi">
            <label htmlFor="photo-packages">Fotoğraf Paketleri</label>
            <label htmlFor="henna-packages">Kına Paketleri</label>
          </div>
          <div className="package-track">
            <div className="package-grid photo-grid">
              {eventPackages
                .filter((item) => item.type === "Fotoğraf Paketi")
                .map((item) => (
                  <article className="package-card" key={item.name}>
                    <div className="package-cover">
                      <img src={item.image} alt={`${item.name} görseli`} />
                      <span>{item.badge}</span>
                    </div>
                    <div className="package-body">
                      <p className="package-type">{item.type}</p>
                      <h3>{item.name}</h3>
                      <PackageItems items={item.items} />
                    </div>
                  </article>
                ))}
            </div>
            <div className="package-grid henna-grid">
              {eventPackages
                .filter((item) => item.type === "Kına Paketi")
                .map((item) => (
                  <article className="package-card" key={item.name}>
                    <div className="package-cover">
                      <img src={item.image} alt={`${item.name} görseli`} />
                      <span>{item.badge}</span>
                    </div>
                    <div className="package-body">
                      <p className="package-type">{item.type}</p>
                      <h3>{item.name}</h3>
                      <PackageItems items={item.items} />
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section services" id="hizmetler">
        <div className="section-heading services-heading">
          <h2>Hizmetlerimiz</h2>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.name}>
              <div className="service-image image-slot photo-slot">
                <img src={service.image} alt={`${service.name} hizmet görseli`} />
              </div>
              <div className="service-content">
                <h3>{service.name}</h3>
                <p>{service.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section satisfaction" id="yorumlar">
        <div className="review-heading">
          <p className="eyebrow">Değerlendirmeler</p>
          <h2>
            Google'da <span>2.869</span> değerlendirmede <span>4,4/5</span>
          </h2>
          <p>
            Puan ve yorum sayısı Google Haritalar'dan günlük çekilir. Çiftlerin
            kendi deneyimlerinden kısa notlar.
          </p>
          <a href="#iletisim">Yorumları Google'da gör →</a>
        </div>
        <div className="satisfaction-grid">
          {testimonials.map((item) => (
            <div className="testimonial-card" key={item.names}>
              <div className="review-card-head">
                <div className="couple-photo" aria-label={`${item.names} çift fotoğrafı`}>
                  <img src={item.photo} alt={`${item.names} çift fotoğrafı`} />
                </div>
                <div>
                  <p className="couple-name">{item.names}</p>
                  <p className="stars" aria-label="5 yıldız">
                    ★★★★★
                  </p>
                </div>
              </div>
              <div>
                <p className="garden-tag">{item.garden}</p>
                <blockquote>{item.quote}</blockquote>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section faq" id="sorular">
        <div className="faq-heading">
          <h2>Sık Sorulan Sorular</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <b aria-hidden="true">+</b>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section contact" id="iletisim">
        <div className="contact-copy">
          <p className="eyebrow">İletişim</p>
          <h2>Hayalinizdeki davet için görüşelim</h2>
          <p>
            Telefon, WhatsApp, Instagram, adres ve Google Maps bilgileri
            geldiğinde burası doğrudan iletişime yönlendirecek.
          </p>
        </div>
        <a className="button primary" href="tel:+90">
          İletişim bilgisi eklenecek
        </a>
      </section>
      <nav className="mobile-bottom-nav" aria-label="Mobil navigasyon">
        <a href="#bahceler">Bahçeler</a>
        <a href="#hizmetler">Hizmetler</a>
        <a href="#paketler">Paketler</a>
        <a href="#menu">Menü</a>
        <a href="#yorumlar">Yorumlar</a>
        <a href="#iletisim">İletişim</a>
      </nav>
    </main>
  );
}
