// Screenshots the first 1440×900 of each design into public/thumbs/NN.jpg. Run against `npm run dev` or `npm run preview`.
// Usage: node scripts/thumbs.mjs [NN ...]   (env: SITE_URL, default http://localhost:5173/; CHROMIUM_PATH, default /usr/bin/chromium)
import { readdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const site = process.env.SITE_URL ?? 'http://localhost:5173/';
const wanted = process.argv.slice(2);
const numbers = (await readdir('src/v')).filter(name => /^\d\d-/.test(name)).map(name => name.slice(0, 2)).filter(number => !wanted.length || wanted.includes(number));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const number of numbers) {
  await page.goto(new URL(`${number}/?bare`, site).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `public/thumbs/${number}.jpg`, type: 'jpeg', quality: 72 });
  console.log(number);
}
await browser.close();
