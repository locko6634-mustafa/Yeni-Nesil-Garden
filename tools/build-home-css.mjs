import { readFile, writeFile } from "node:fs/promises";

const homeCssDirectory = new URL("../css/home/", import.meta.url);
const outputFile = new URL("site.css", homeCssDirectory);

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
    .replace(/\s*([\{\}\:\;\,\>\~])\s*/g, "$1")
    .replace(/;;+/g, ";")
    .trim();
}

const minified = minifyCss(sections.join("\n\n"));
const banner = "/* Otomatik uretilir: npm run build:css */\n";

await writeFile(outputFile, `${banner}${minified}\n`, "utf8");

console.log(`Ana sayfa CSS paketi olusturuldu: ${sourceFiles.length} modul.`);
