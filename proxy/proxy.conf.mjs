import fs from 'node:fs';
import path from 'node:path';
import {PROXY_TARGET} from "./proxy.const.mjs";
import {buildMergedManifestResponse, createLocalCustomModuleAssetManifest, deepMerge, getAssetRelativePath, isCustomModuleAssetManifestRequest, targetProxyAgent, resolveCustomModuleManifestPath, resolveLocalAssetFilePath} from "./proxy-utils.mjs";

const assetContentTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function getAssetContentType(filePath) {
  return assetContentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function serveCustomModuleManifest(req, res) {
  const manifestPath = resolveCustomModuleManifestPath(req.url);
  if (!manifestPath) {
    return false;
  }

  try {
    const response = await buildMergedManifestResponse(req.url, manifestPath, PROXY_TARGET);
    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
    return true;
  } catch (error) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: `Unable to read Custom Module asset manifest from ${manifestPath}: ${error.message}` }));
    return true;
  }
}






const proxyRules = [
  {
    context: ['/nde/home', '/home'],
    target: PROXY_TARGET,
    agent: targetProxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    selfHandleResponse: true,
    onProxyRes(proxyRes, req, res) {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        const body = Buffer.concat(chunks);
        res.statusCode = proxyRes.statusCode || 200;
        res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html; charset=utf-8');
        res.end(body);
      });
    }
  },
  {
    context: [
      '/custom/*/assets',
      '/custom/*/assets/**',
      '/nde/custom/*/assets',
      '/nde/custom/*/assets/**'
    ],
    target: PROXY_TARGET,
    agent: targetProxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    bypass: (req, res) => {
      const relativePath = getAssetRelativePath(req.url);
      const localFile = relativePath ? resolveLocalAssetFilePath(relativePath) : null;
      if (process.env.PROXY_TRACE) {
        if (localFile) {
          console.log(`[asset-trace] ${req.url} -> LOCAL ${localFile}`);
        } else {
          console.log(`[asset-trace] ${req.url} -> REMOTE ${PROXY_TARGET}${req.url}`);
        }
      }
      if (!localFile) {
        return null;
      }

      res.writeHead(200, {
        'content-type': getAssetContentType(localFile),
        'cache-control': 'no-cache',
      });
      res.end(fs.readFileSync(localFile));
      return true;
    },
  },
  {
    context: ['/custom/*/asset-manifest.json', '/nde/custom/*/asset-manifest.json'],
    target: PROXY_TARGET,
    agent: targetProxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    selfHandleResponse: true,
    onProxyRes(proxyRes, req, res) {
      serveCustomModuleManifest(req, res).then((handled) => {
        if (handled) {
          return;
        }

        const chunks = [];
        proxyRes.on('data', chunk => chunks.push(chunk));
        proxyRes.on('end', () => {
          const body = Buffer.concat(chunks);
          res.statusCode = proxyRes.statusCode || 200;
          res.setHeader('content-type', proxyRes.headers['content-type'] || 'application/json');
          res.end(body);
        });
      });
    }
  },
  {
    context: ['/primaws/rest/pub/configuration/vid/'],
    target: PROXY_TARGET,
    agent: targetProxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    selfHandleResponse: true,
    onProxyRes(proxyRes, req, res) {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        try {
          const bodyStr = Buffer.concat(chunks).toString('utf8');
          const json = JSON.parse(bodyStr);
          const out = JSON.stringify(json);
          res.setHeader('content-type', 'application/json');
          res.end(out);
        } catch (e) {
          res.end(Buffer.concat(chunks));
        }
      });
    }
  },
  {
    context: [
      '/nde/custom/**'
    ],
    target: 'not-needed',
    router: (req) => {
      const url = `${req.protocol}://${req.get('host')}`
      console.log(url);
      return url;

    },
    secure: false,
    logLevel: 'debug',
    pathRewrite: { '^/nde/custom/.*/': '' },

  },
  {
    context: [
      '**', '!/nde/custom/**', '!/nde/home', '!/home', '!/assets/**', '!/.well-known/**'
    ],
    target: PROXY_TARGET,
    agent: targetProxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',

  }
];



export default proxyRules;
