const puppeteer = require("puppeteer");
const devices = require('puppeteer/DeviceDescriptors');

module.exports.spotifyMetrics = async function({ device }) {
  const browser = await puppeteer.launch({ headless: true, slowMo: 250 });
  const page = await browser.newPage();

  if (device === "mobile") {
    await page.emulate(devices['iPhone 6']);
    await page._client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 200, // ms
        downloadThroughput: 1500 * 1024 / 8, // 1500 kb/s
        uploadThroughput: 700 * 1024 / 8, // 700 kb/s
      });
    await page._client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.goto("https://spotify.com/");

  // Browswer Performance
  const performanceMetrics = await page._client.send("Performance.getMetrics");
  const browserPerf = performanceMetrics.metrics.filter(obj =>
    obj.name.includes("Duration")
  );

  // Network Performance
  const perfTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  const returnObj = {
    networkPerformance: perfTiming.domComplete - perfTiming.navigationStart
  };

  browserPerf.forEach(
    obj => (returnObj[obj.name] = Math.floor(obj.value * 1000))
  );

  await browser.close();
  return returnObj;
};
