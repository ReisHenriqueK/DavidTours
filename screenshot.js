const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  // Force lazy-loaded images to resolve before capturing, otherwise
  // full-page screenshots can render blank boxes for images that were
  // never scrolled into view.
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    await Promise.all(Array.from(document.images).map(img =>
      img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
    ));
  });
  await page.screenshot({ path: 'screenshot-full.png', fullPage: true });
  await browser.close();
  console.log('done');
})();
