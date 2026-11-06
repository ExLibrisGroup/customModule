import { cpSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { defineConfig, type Plugin } from 'vite';

const { dependencies } = JSON.parse(readFileSync('./package.json', 'utf8'));
const shared = (packages: string[], options: object = {}) =>
  Object.fromEntries(packages.map((name) => {
    const pkg = name.startsWith('@') ? name.split('/').slice(0, 2).join('/') : name.split('/')[0];
    return [name, { requiredVersion: dependencies[pkg], ...options }];
  }));

export default defineConfig(({ mode }) => ({
  root: 'src',
  base: './',
  plugins: [
    federation({
      name: 'customModule',
      filename: 'remoteEntry.js',
      exposes: {
        './custom-module': './src/bootstrap.ts',
      },
      shared: {
        ...shared([
          '@angular/core',
          '@angular/core/primitives/event-dispatch',
          '@angular/core/primitives/signals',
          '@angular/common',
          '@angular/common/http',
          '@angular/router',
          '@angular/platform-browser',
          'rxjs',
          'rxjs/operators',
        ]),
        ...shared(['@ngx-translate/core', '@ngrx/store'], { singleton: true }),
      },
      dts: false,
    }),
    ...angular({ tsconfig: resolve('tsconfig.app.json') }),
    customThemeCss('app/styles/_customized-theme.scss'),
    copyAssets(['assets']),
    mode === 'proxy' && primoProxy(),
  ],
  build: {
    outDir: '../dist/custom-module',
    emptyOutDir: true,
    assetsDir: '',
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve('src/index.html'),
        custom: resolve('src/app/styles/_customized-theme.scss'),
      },
      output: {
        assetFileNames: ({ names }) => names.includes('custom.css') ? 'custom.css' : '[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 4201,
    strictPort: true,
    origin: 'http://localhost:4201',
    cors: true,
    allowedHosts: true,
  },
}));

/** The theme is loaded by Primo as /custom.css, like the Angular CLI non-injected "custom" styles bundle. */
function customThemeCss(file: string): Plugin {
  return {
    name: 'custom-theme-css',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url?.split('?')[0] === '/custom.css') req.url = `/${file}?direct`;
        next();
      });
    },
    generateBundle(_options, bundle) {
      if (!bundle['custom.css']) this.emitFile({ type: 'asset', fileName: 'custom.css', source: '' });
    },
  };
}

function copyAssets(paths: string[]): Plugin {
  return {
    name: 'copy-assets',
    apply: 'build',
    writeBundle({ dir }) {
      for (const path of paths) {
        cpSync(resolve('src', path), resolve(dir!, path), {
          recursive: true,
          filter: (source) => !/(^|[\\/])\.[^\\/]+$/.test(source),
        });
      }
    },
  };
}

/** Same rules as `ng serve --proxy-config`: local files first, then ./proxy/proxy.conf.mjs. */
function primoProxy(): Plugin {
  return {
    name: 'primo-proxy',
    async configureServer(server) {
      const { default: rules } = await import('./proxy/proxy.conf.mjs');
      return () => {
        for (const { context, bypass, ...options } of rules) {
          const proxy = createProxyMiddleware(context, options);
          server.middlewares.use((req, res, next) => bypass?.(req, res) || proxy(req, res, next));
        }
      };
    },
  };
}
