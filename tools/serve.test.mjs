import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createStaticServer, DEFAULT_HOST } from "./serve.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, "..");
const mediaRoot = path.join(rootDir, "storage", "public-media");
const sourceFiles = [
  "index.html",
  "hayal-bahce.html",
  "kale-bahce.html",
  "masal-bahce.html",
  "ruya-bahce.html",
  "sitemap.xml"
];

test("tüm medya URL'leri public-media altındaki gerçek dosyalara karşılık gelir", async () => {
  const mediaPathPattern = /(?:https:\/\/yesilnesilthegarden\.com\/|\.\/)?media\/([\w./-]+\.(?:gif|ico|jpe?g|png|svg|webp))/gi;
  const referencedPaths = new Set();

  for (const sourceFile of sourceFiles) {
    const content = await readFile(path.join(rootDir, sourceFile), "utf8");
    for (const match of content.matchAll(mediaPathPattern)) referencedPaths.add(match[1]);
  }

  assert.ok(referencedPaths.size > 0, "Kaynak dosyalarda medya URL'si bulunamadı.");

  for (const referencedPath of referencedPaths) {
    const mediaFile = path.resolve(mediaRoot, ...referencedPath.split("/"));
    assert.equal(path.relative(mediaRoot, mediaFile).startsWith(".."), false);
    assert.equal((await stat(mediaFile)).isFile(), true, `Eksik medya: ${referencedPath}`);
  }
});

test("Hayal Bahçe galerisi beş mekan ve altı çift fotoğrafını kullanır", async () => {
  const content = await readFile(path.join(rootDir, "hayal-bahce.html"), "utf8");
  const gallery = content.match(/<div class="garden-gallery" id="hayal-gallery">([\s\S]*?)<\/div>/)?.[1];

  assert.ok(gallery, "Hayal Bahçe galerisi bulunamadı.");

  const imagePaths = [...gallery.matchAll(/media\/images\/gardens\/hayal-bahce\/(mekan|cift)-\d{2}\.webp/g)];
  assert.equal(imagePaths.length, 11);
  assert.equal(imagePaths.filter((match) => match[1] === "mekan").length, 5);
  assert.equal(imagePaths.filter((match) => match[1] === "cift").length, 6);
});

test("Hayal Bahçe sayfasındaki tüm görseller üretim medya URL'sini kullanır", async () => {
  const content = await readFile(path.join(rootDir, "hayal-bahce.html"), "utf8");

  assert.doesNotMatch(content, /\.\/media\/images\//);
  assert.ok(content.match(/https:\/\/yesilnesilthegarden\.com\/media\/images\//g)?.length >= 20);
});

test("diğer bahçe galerileri ayıklanmış mekan ve çeşitli çift fotoğraflarını sunucudan kullanır", async () => {
  const galleries = [
    { file: "masal-bahce.html", id: "masal-gallery", slug: "masal-bahce", venueCount: 5, coupleCount: 7, removed: ["mekan-01", "mekan-05"] },
    { file: "kale-bahce.html", id: "kale-gallery", slug: "kale-bahce", venueCount: 4, coupleCount: 8, removed: ["mekan-03", "mekan-04", "mekan-06", "mekan-08"] },
    { file: "ruya-bahce.html", id: "ruya-gallery", slug: "ruya-bahce", venueCount: 8, coupleCount: 6, removed: ["mekan-03", "mekan-05", "mekan-10", "mekan-12", "cift-06"] }
  ];

  for (const { file, id, slug, venueCount, coupleCount, removed } of galleries) {
    const content = await readFile(path.join(rootDir, file), "utf8");
    const gallery = content.match(new RegExp(`<div class="garden-gallery" id="${id}">([\\s\\S]*?)<\\/div>`))?.[1];

    assert.ok(gallery, `${file}: galeri bulunamadı.`);
    assert.equal(gallery.match(new RegExp(`media/images/gardens/${slug}/mekan-\\d{2}\\.webp`, "g"))?.length, venueCount);
    assert.equal(gallery.match(new RegExp(`media/images/gardens/${slug}/cift-\\d{2}\\.webp`, "g"))?.length, coupleCount);
    for (const removedImage of removed) assert.doesNotMatch(gallery, new RegExp(`${slug}/${removedImage}\\.webp`));
    assert.doesNotMatch(content, /\.\/media\/images\//);
  }
});

test("bahçe videoları oynatma isteğine kadar MP4 kaynağını yüklemez", async () => {
  const videoPages = [
    { file: "hayal-bahce.html", slug: "hayal-bahce", count: 2 },
    { file: "masal-bahce.html", slug: "masal-bahce", count: 1 },
    { file: "kale-bahce.html", slug: "kale-bahce", count: 2 }
  ];

  for (const { file, slug, count } of videoPages) {
    const content = await readFile(path.join(rootDir, file), "utf8");

    assert.equal(content.match(/class="garden-video-card"/g)?.length, count, `${file}: video kartı sayısı`);
    assert.equal(content.match(/<video\b/g)?.length, count, `${file}: video etiketi sayısı`);
    assert.equal(content.match(/preload="none"/g)?.length, count, `${file}: preload kapalı olmalı`);
    assert.equal(content.match(/class="garden-video-play"/g)?.length, count, `${file}: erişilebilir oynat düğmesi`);
    assert.equal(content.match(new RegExp(`data-video-src="https://yesilnesilthegarden\\.com/media/videos/${slug}/video-\\d{2}\\.mp4"`, "g"))?.length, count);
    assert.equal(content.match(new RegExp(`poster="https://yesilnesilthegarden\\.com/media/images/gardens/${slug}/video-\\d{2}-poster\\.webp"`, "g"))?.length, count);
    assert.doesNotMatch(content, /<video\b[^>]*\ssrc=/, `${file}: MP4 URL'si ilk HTML yükünde video src olmamalı`);
  }

  const ruyaContent = await readFile(path.join(rootDir, "ruya-bahce.html"), "utf8");
  assert.doesNotMatch(ruyaContent, /data-video-src=|<video\b/);
  assert.match(ruyaContent, /class="garden-video-empty"/);

  const script = await readFile(path.join(rootDir, "script.js"), "utf8");
  const styles = await readFile(path.join(rootDir, "css/garden-pages.css"), "utf8");
  assert.match(script, /dataset\.videoSrc/);
  assert.match(script, /video\.src\s*=/);
  assert.match(script, /await video\.play\(\)/);
  assert.match(styles, /\.garden-video-card\s*\{[\s\S]*?aspect-ratio:\s*9\s*\/\s*16;/);
  assert.match(styles, /\.garden-video-card\s*\{[\s\S]*?max-width:\s*420px;/);
});

test("üretim sunucusu aynı kaynaktaki videoları range desteğiyle sunar", async () => {
  const nginxConfig = await readFile(path.join(rootDir, "deploy/nginx.conf"), "utf8");
  const deployWorkflow = await readFile(path.join(rootDir, ".github/workflows/deploy-production.yml"), "utf8");

  assert.match(nginxConfig, /media-src 'self'/);
  assert.match(nginxConfig, /location \^~ \/media\/videos\//);
  assert.doesNotMatch(nginxConfig, /max_ranges\s+0;/);
  assert.match(deployWorkflow, /--exclude='storage\/public-media\/videos\/'/);
});

test("tüm bahçe sayfaları ortak asimetrik galeri düzenini kullanır", async () => {
  const content = await readFile(path.join(rootDir, "css/garden-pages.css"), "utf8");
  const script = await readFile(path.join(rootDir, "script.js"), "utf8");
  const gardenPages = sourceFiles.filter((sourceFile) => sourceFile.endsWith("-bahce.html"));

  assert.match(content, /\.garden-gallery-columns\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2/);
  assert.match(content, /\.garden-gallery-column\s*\{[\s\S]*?flex-direction:\s*column/);
  assert.match(content, /\.garden-gallery img\s*\{[\s\S]*?height:\s*auto/);
  assert.match(content, /\.garden-gallery\.is-opening figure\s*\{[\s\S]*?animation:/);
  assert.match(script, /estimatedColumnHeights/);
  assert.match(script, /--gallery-expanded-height/);
  assert.match(script, /ResizeObserver/);

  for (const gardenPage of gardenPages) {
    const pageContent = await readFile(path.join(rootDir, gardenPage), "utf8");
    assert.match(pageContent, /class="garden-gallery"/);
  }
});

test("Rüya Bahçe galerisi tekrar fotoğraflarını içermez", async () => {
  const content = await readFile(path.join(rootDir, "ruya-bahce.html"), "utf8");

  for (const removedImage of ["mekan-03", "mekan-05", "mekan-10", "mekan-12", "cift-06"]) {
    assert.doesNotMatch(content, new RegExp(`ruya-bahce/${removedImage}\\.webp`));
  }
});

test("bahçe galerilerinde erişilebilir tümünü gör kontrolü bulunur", async () => {
  const gardenPages = sourceFiles.filter((sourceFile) => sourceFile.endsWith("-bahce.html"));

  for (const gardenPage of gardenPages) {
    const content = await readFile(path.join(rootDir, gardenPage), "utf8");
    const galleryId = content.match(/<div class="garden-gallery" id="([^"]+)">/)?.[1];

    assert.ok(galleryId, `${gardenPage}: galeri kimliği eksik.`);
    assert.match(content, new RegExp(`class="garden-gallery-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="${galleryId}"`));
    assert.match(content, /<span>Tümünü Gör<\/span>/);
    assert.match(content, /<script src="\.\/script\.js" defer><\/script>/);
  }
});

test("yerel sunucu güncel statik yolları no-cache ile sunar ve eski yolları reddeder", async (t) => {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, DEFAULT_HOST, resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));

  const address = server.address();
  assert.ok(address && typeof address === "object");
  const origin = `http://${DEFAULT_HOST}:${address.port}`;

  const [mediaResponse, fontResponse, cssResponse, legacyMediaResponse, legacyCssResponse] = await Promise.all([
    fetch(`${origin}/media/images/favicon-32.png`),
    fetch(`${origin}/assets/fonts/jost-latin.woff2`),
    fetch(`${origin}/css/garden-pages.css`),
    fetch(`${origin}/assets/favicon-32.png`),
    fetch(`${origin}/garden-pages.css`)
  ]);

  assert.equal(mediaResponse.status, 200);
  assert.equal(mediaResponse.headers.get("content-type"), "image/png");
  assert.equal(fontResponse.status, 200);
  assert.equal(fontResponse.headers.get("content-type"), "font/woff2");
  assert.equal(cssResponse.status, 200);
  assert.equal(cssResponse.headers.get("content-type"), "text/css; charset=utf-8");
  assert.equal(cssResponse.headers.get("cache-control"), "no-cache");
  assert.equal(legacyMediaResponse.status, 404);
  assert.equal(legacyCssResponse.status, 404);
});
