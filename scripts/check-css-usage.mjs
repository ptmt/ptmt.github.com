import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const cssPath = path.join(rootDir, 'public/styles.css');
const contentRoots = ['templates', 'pages', 'posts', 'garage', 'public'];
const markupExtensions = new Set(['.hbs', '.html', '.md']);
const scriptExtensions = new Set(['.js', '.mjs', '.cjs']);
const usedClasses = new Set(['status-active', 'status-archived', 'status-idea']);
const usedIds = new Set();

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function addTokensFromSelector(selector) {
  for (const match of selector.matchAll(/([.#])([_a-zA-Z][-_a-zA-Z0-9]*)/g)) {
    const [, tokenType, token] = match;
    if (tokenType === '.') {
      usedClasses.add(token);
    } else {
      usedIds.add(token);
    }
  }
}

function addClasses(value) {
  for (const token of value.split(/\s+/)) {
    if (!token || token.includes('{')) {
      continue;
    }
    usedClasses.add(token);
  }
}

function readContentTokens(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const extension = path.extname(filePath);

  if (markupExtensions.has(extension)) {
    for (const match of text.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
      addClasses(match[1]);
    }

    for (const match of text.matchAll(/id\s*=\s*["']([^"']+)["']/g)) {
      if (!match[1].includes('{')) {
        usedIds.add(match[1]);
      }
    }
  }

  if (scriptExtensions.has(extension) || text.includes('<script>') || text.includes('classList.')) {
    for (const match of text.matchAll(/className\s*=\s*['"]([^'"]+)['"]/g)) {
      addClasses(match[1]);
    }

    for (const match of text.matchAll(/classList\.(?:add|remove|toggle|contains)\(([^)]*)\)/g)) {
      for (const tokenMatch of match[1].matchAll(/['"]([^'"]+)['"]/g)) {
        addClasses(tokenMatch[1]);
      }
    }

    for (const match of text.matchAll(/(?:querySelector|querySelectorAll|closest)\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      addTokensFromSelector(match[1]);
    }
  }
}

function getUnusedSelectors(cssText) {
  const unusedSelectors = new Set();
  const strippedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  for (const match of strippedCss.matchAll(/([^{}]+)\{/g)) {
    const selectorGroup = match[1].trim();

    if (
      !selectorGroup ||
      selectorGroup.startsWith('@') ||
      selectorGroup === 'from' ||
      selectorGroup === 'to' ||
      selectorGroup.endsWith('%')
    ) {
      continue;
    }

    for (const selector of selectorGroup.split(',')) {
      const normalizedSelector = selector.trim().replace(/\s+/g, ' ');
      if (!normalizedSelector) {
        continue;
      }

      const tokens = [...normalizedSelector.matchAll(/([.#])([_a-zA-Z][-_a-zA-Z0-9]*)/g)];
      if (tokens.length === 0) {
        continue;
      }

      const isUsed = tokens.every(([, tokenType, token]) =>
        tokenType === '.' ? usedClasses.has(token) : usedIds.has(token),
      );

      if (!isUsed) {
        unusedSelectors.add(normalizedSelector);
      }
    }
  }

  return [...unusedSelectors].sort();
}

for (const contentRoot of contentRoots) {
  for (const filePath of walk(path.join(rootDir, contentRoot))) {
    readContentTokens(filePath);
  }
}

const css = fs.readFileSync(cssPath, 'utf8');
const unusedSelectors = getUnusedSelectors(css);

if (unusedSelectors.length === 0) {
  console.log('No unused CSS selectors found in public/styles.css');
  process.exit(0);
}

console.log('Unused CSS selectors found in public/styles.css:');
for (const selector of unusedSelectors) {
  console.log(`- ${selector}`);
}

process.exit(1);
