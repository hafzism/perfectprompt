import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const rootDir = path.resolve(import.meta.dirname, '..');
const distIndexPath = path.join(rootDir, 'dist', 'index.html');

const vite = await createServer({
  root: rootDir,
  appType: 'custom',
  server: {
    middlewareMode: true,
  },
});

try {
  const html = fs.readFileSync(distIndexPath, 'utf8');
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

  const appMarkup = renderToString(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App),
    ),
  );

  const hydratedHtml = html.replace(
    '<div id="root"></div>',
    `<div id="root">${appMarkup}</div>`,
  );

  fs.writeFileSync(distIndexPath, hydratedHtml);
} finally {
  await vite.close();
}
