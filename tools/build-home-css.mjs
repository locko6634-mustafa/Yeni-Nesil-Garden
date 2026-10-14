import { readFile, writeFile } from "node:fs/promises";

const homeCssDirectory = new URL("../css/home/", import.meta.url);
const rootDirectory = new URL("../", import.meta.url);
const outputFile = new URL("site.css", homeCssDirectory);
const rootOutputFile = new URL("styles.css", rootDirectory);

const sourceFiles = [
  "base.css",
  "home.css",
  "gardens.css",
  "services.css",
  "packages.css",
  "satisfaction.css",
  "menu.css",
  "reviews.css",
  "contact.css",
  "faq.css",
  "responsive.css",
  "motion.css"
];

const sections = await Promise.all(
  sourceFiles.map(async (fileName) => {
    const css = await readFile(new URL(fileName, homeCssDirectory), "utf8");
    return `/* Kaynak: ${fileName} */\n\n${css.trim()}`;
  })
);

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([\{\}\:\;\,\>\+\~])\s*/g, "$1")
    .replace(/;;+/g, ";")
    .replace(/;}/g, "}")
    .trim();
}

const unminified = sections.join("\n\n");
const minified = minifyCss(unminified);
const banner = "/* Otomatik uretilir: npm run build:css */\n";

await writeFile(outputFile, `${banner}${minified}\n`, "utf8");

// Root styles.css uyumluluğu için fontlar ile birlikte derlenmiş halini yaz
const fontsCss = await readFile(new URL("../css/shared/fonts.css", import.meta.url), "utf8");
// root'taki styles.css için font yolları ./assets/fonts/ formatına getirilir
const rootFontsCss = fontsCss.replaceAll("../../assets/fonts/", "./assets/fonts/");
await writeFile(rootOutputFile, `${banner}${rootFontsCss}\n\n${unminified}\n`, "utf8");

console.log(`Ana sayfa CSS paketi olusturuldu: ${sourceFiles.length} modul.`);
