const puppeteer = require("puppeteer");

module.exports.spotifyMetrics = async function() {
  const browser = await puppeteer.launch({ headless: true, slowMo: 250 });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1000
  });
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
