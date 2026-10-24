import fs from 'node:fs';
import { test, expect } from '@playwright/test';

test.use({
  launchOptions: process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
});

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sidebar = read('templates/home.hbs')
  .match(/\{\{#content "right-column"\}\}([\s\S]*?)\{\{\/content\}\}/)[1]
  .replace('{{include "partials/footer.hbs"}}', read('templates/partials/footer.hbs'));
const image = {
  src: '/image.svg',
  alt: 'GitHub contributions',
  title: 'Private contributions on GitHub in 2025',
  source: { path: '/2025/return/', title: 'We are so back' },
};
const quote = {
  text: 'Filesystems still exist in 2075, one way or another.',
  source: { path: '/2025/lost-in-time/', title: 'Lost in time' },
};

async function openSidebar(page, { images = [image], quotes = [quote], brokenImage = false, failedRequests = false } = {}) {
  const releases = {};
  const pending = Object.fromEntries(['images', 'quote', 'image'].map((name) => [
    name, new Promise((resolve) => { releases[name] = resolve; }),
  ]));
  await page.route('http://sidebar.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === '/') {
      return route.fulfill({ contentType: 'text/html', body: `<!doctype html>
        <html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/plain.css"></head>
        <body><div class="page-container"><header class="site-header">Home</header>
        <main class="main-content"><div class="home-layout">Latest posts</div></main>
        ${sidebar}</div><script defer src="/main.js"></script></body></html>` });
    }
    if (['/styles.css', '/plain.css', '/main.js'].includes(pathname)) {
      return route.fulfill({
        contentType: pathname.endsWith('.css') ? 'text/css' : 'text/javascript',
        body: read(`public${pathname}`),
      });
    }
    if (pathname.startsWith('/datasource/')) {
      const name = pathname.includes('images') ? 'images' : 'quote';
      await pending[name];
      if (failedRequests) return route.abort();
      const data = name === 'images' ? images : quotes;
      return route.fulfill({ contentType: 'application/json', body: typeof data === 'string' ? data : JSON.stringify(data) });
    }
    if (pathname === '/image.svg') {
      await pending.image;
      return brokenImage ? route.abort() : route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><rect width="1600" height="1000" fill="#ddd"/></svg>',
      });
    }
    return route.abort();
  });
  await page.goto('http://sidebar.test/', { waitUntil: 'domcontentloaded' });
  return releases;
}

async function positions(page) {
  return page.evaluate(() => Object.fromEntries(
    ['.random-image-section', '.random-quote-section', '.home-right-column footer'].map((selector) => {
      const { top, height } = document.querySelector(selector).getBoundingClientRect();
      return [selector, { top, height }];
    }),
  ));
}

for (const width of [375, 1280]) {
  test.describe(`${width}px sidebar`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const first of ['images', 'quote']) {
      test(`keeps its layout when ${first} data arrives first`, async ({ page }) => {
        const release = await openSidebar(page);
        const before = await positions(page);
        await expect(page.locator('#random-image .image-wrapper')).toHaveCount(1);
        const imageRequest = page.waitForRequest('http://sidebar.test/image.svg');
        release[first]();
        if (first === 'quote') {
          await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
        } else {
          await imageRequest;
        }
        expect(await positions(page)).toEqual(before);
        release.images();
        release.quote();
        await imageRequest;
        await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
        await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'true');
        expect(await positions(page)).toEqual(before);
        release.image();
        await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
        await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
        expect(await positions(page)).toEqual(before);
        await expect(page.locator('#random-image .image-title')).toHaveText(image.title);
        await expect(page.locator('#random-image figcaption')).toContainText('Image from');
        await expect(page.locator('#random-image .image-source-link')).toHaveAttribute('href', image.source.path);
        await expect(page.locator('#random-quote blockquote')).toHaveText(quote.text);
        await expect(page.locator('#random-quote figcaption')).toContainText('Quote from');
        await expect(page.locator('#random-quote .quote-source-link')).toHaveAttribute('href', quote.source.path);
      });
    }

    test('keeps long captions and quotes readable without growing the layout', async ({ page }) => {
      const longImage = { ...image, title: image.title.repeat(20), source: { ...image.source, title: image.source.title.repeat(20) } };
      const longQuote = { ...quote, text: quote.text.repeat(100), attributes: { 'data-author': 'An author' } };
      const release = await openSidebar(page, { images: [longImage], quotes: [longQuote] });
      const before = await positions(page);
      Object.values(release).forEach((resolve) => resolve());
      await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
      expect(await positions(page)).toEqual(before);
      for (const selector of ['#random-image .image-source', '#random-quote']) {
        expect(await page.locator(selector).evaluate((el) => {
          el.scrollTop = el.scrollHeight;
          return el.scrollTop > 0 && getComputedStyle(el).overflowY === 'auto';
        })).toBe(true);
      }
      await expect(page.locator('#random-quote .quote-author')).toHaveText('— An author');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    for (const data of [[], 'not json']) {
      test(`finishes loading with ${Array.isArray(data) ? 'empty' : 'invalid'} data`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const release = await openSidebar(page, { images: data, quotes: data });
        const before = await positions(page);
        Object.values(release).forEach((resolve) => resolve());
        await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
        await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
        await expect(page.locator('#random-image')).toContainText('No image available.');
        await expect(page.locator('#random-quote')).toContainText('No quote available.');
        expect(await positions(page)).toEqual(before);
        expect(errors).toEqual([]);
      });
    }

    test('finishes loading after an image fails', async ({ page }) => {
      const release = await openSidebar(page, { brokenImage: true });
      const before = await positions(page);
      Object.values(release).forEach((resolve) => resolve());
      await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-image')).toContainText('No image available.');
      expect(await positions(page)).toEqual(before);
    });

    test('finishes loading when datasource requests fail', async ({ page }) => {
      const release = await openSidebar(page, { failedRequests: true });
      const before = await positions(page);
      Object.values(release).forEach((resolve) => resolve());
      await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
      expect(await positions(page)).toEqual(before);
    });

    test('retries a broken image and falls back to its alt text for the caption', async ({ page }) => {
      await page.addInitScript(() => { Math.random = () => 0; });
      const release = await openSidebar(page, {
        images: [{ ...image, src: '/missing.svg' }, { ...image, title: undefined }],
      });
      const before = await positions(page);
      Object.values(release).forEach((resolve) => resolve());
      await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-image img')).toHaveAttribute('src', image.src);
      await expect(page.locator('#random-image .image-title')).toHaveText(image.alt);
      expect(await positions(page)).toEqual(before);
    });

    test('shows an image description even without a source', async ({ page }) => {
      const release = await openSidebar(page, { images: [{ ...image, source: undefined }], quotes: [{ text: quote.text }] });
      Object.values(release).forEach((resolve) => resolve());
      await expect(page.locator('#random-image')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-quote')).toHaveAttribute('aria-busy', 'false');
      await expect(page.locator('#random-image .image-title')).toHaveText(image.title);
      await expect(page.locator('#random-image .image-source-link')).toHaveCount(0);
      await expect(page.locator('#random-quote .quote-source-link')).toHaveCount(0);
    });
  });
}