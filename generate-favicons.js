const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const svgPath = 'file://' + path.resolve(__dirname, 'images/favicon.svg');

  const sizes = [
    { size: 32, out: 'images/favicon-32.png' },
    { size: 180, out: 'images/apple-touch-icon.png' },
    { size: 512, out: 'images/favicon-512.png' },
  ];

  for (const { size, out } of sizes) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.goto(svgPath, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const svg = document.querySelector('svg');
      svg.style.width = '100vw';
      svg.style.height = '100vh';
      svg.style.display = 'block';
    });
    await page.screenshot({ path: out, omitBackground: false });
  }

  await browser.close();
  console.log('favicons generated');
})();
