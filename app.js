const puppeteer = require('puppeteer');

async function dimensionTest () {
  const browser = await puppeteer.launch({headless: true, slowMo: 250});
  const page = await browser.newPage();
  await page.setViewport({
      width: 1280,
      height: 1000
  })
  await page.goto('https://spotify.com/');

// Browswer Performance
  const performanceMetrics = await page._client.send('Performance.getMetrics');
  console.log(performanceMetrics);

// Network Performance
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  console.log(performanceTiming.responseEnd - performanceTiming.navigationStart);

  await browser.close();
};

for (let i = 0; i < 10; i++) {
    dimensionTest();
}