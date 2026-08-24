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
