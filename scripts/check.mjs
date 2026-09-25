// Loads the index and every design at 1440 and 390 and reports page errors, failed or off-site requests,
// horizontal overflow and empty pages. Usage: node scripts/check.mjs [NN ...]   (env: SITE_URL, CHROMIUM_PATH)
import { readdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const site = process.env.SITE_URL ?? 'http://localhost:5173/';
const wanted = process.argv.slice(2);
const numbers = (await readdir('src/v')).filter(name => /^\d\d-/.test(name)).map(name => name.slice(0, 2)).filter(number => !wanted.length || wanted.includes(number));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' });
let failures = 0;
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
  for (const route of ['', ...numbers]) {
    const problems = [];
    const onError = error => problems.push(`error: ${error.message}`);
    const onResponse = response => { if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`); };
    const onRequest = request => { if (!request.url().startsWith(new URL(site).origin) && !/^(data|blob):/.test(request.url())) problems.push(`off-site: ${request.url()}`); };
    page.on('pageerror', onError); page.on('response', onResponse); page.on('request', onRequest);
    await page.goto(new URL(route ? `${route}/` : '', site).href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, text: document.querySelector('#app')?.textContent?.trim().length ?? 0, nav: !!document.querySelector('.kd-nav') }));
    if (layout.overflow > 1) problems.push(`overflows by ${layout.overflow}px`);
    if (layout.text < 200) problems.push('looks empty');
    if (route && !layout.nav) problems.push('gallery bar missing');
    page.off('pageerror', onError); page.off('response', onResponse); page.off('request', onRequest);
    if (problems.length) { failures++; console.log(`${route || 'index'} @${width}: ${problems.join('; ')}`); }
  }
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} page(s) with problems` : 'all pages ok');
process.exitCode = failures ? 1 : 0;
