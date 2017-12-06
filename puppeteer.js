const puppeteer = require('puppeteer');

(async () => {
  const devices = require('puppeteer/DeviceDescriptors');
  const browser = await puppeteer.launch({
    headless:true,
    executablePath : 'C://Users/33318/AppData/Local/Chromium/Application/chrome.exe',
  });
  const device = 'iPhone 4'
  const page = await browser.newPage();
  await page.emulate(devices[device]);
  await page.goto('http://localhost:8002');
  await page.screenshot({path: `${device}.png`, fullPage: true});
  await browser.close();
})();