import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import crypto from 'node:crypto';
import { PROXY_TARGET } from './proxy.const.mjs';

// Some target servers (e.g. sqa-cn01) do not support RFC 5746 secure renegotiation,
// which OpenSSL 3 / Node 18+ rejects with EPROTO ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED.
class ProxyTlsAgent extends https.Agent {
  createConnection(options, callback) {
    // Rules with a router may send the request back to the local (plain http) dev server.
    if (Number(options.port) !== 443) {
      return net.connect(options);
    }
    return super.createConnection(options, callback);
  }
}

export const proxyAgent = new ProxyTlsAgent({
  keepAlive: true,
  rejectUnauthorized: false,
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

// Only use the custom TLS agent for https targets.
// For plain http targets, forcing an https.Agent triggers
// ERR_INVALID_PROTOCOL ("Protocol http: not supported. Expected https:").
export const targetProxyAgent = PROXY_TARGET.startsWith('https:') ? proxyAgent : undefined;

// Added deepMerge utility to retain unspecified fields
export function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;

  const out = Array.isArray(target) ? [...target] : { ...target };

  for (const [k, v] of Object.entries(source)) {
    if (Array.isArray(v) && ['files', 'directories'].includes(k)) {
      const existing = Array.isArray(out[k]) ? out[k] : [];
      const mergedArray = [...new Set([...existing, ...v])];
      out[k] = mergedArray;
      continue;
    }

    if (v && typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object' && out[k] !== null && !Array.isArray(out[k])) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }

  return out;
}

function parseBuildSettingsEnv(envFilePath = path.resolve(process.cwd(), 'build-settings.env')) {
  if (!fs.existsSync(envFilePath)) {
    return {};
  }

  const content = fs.readFileSync(envFilePath, 'utf8');
  const parsed = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    parsed[key] = value;
  }

  return parsed;
}

export function getCustomModuleManifestRoot() {
  const env = parseBuildSettingsEnv();
  if (env.INST_ID && env.VIEW_ID) {
    return path.resolve(process.cwd(), 'dist', `${env.INST_ID}-${env.VIEW_ID}`);
  }

  return path.resolve(process.cwd(), 'dist', 'custom-module');
}

export function isCustomModuleAssetManifestRequest(requestPath) {
  const normalizedPath = (requestPath || '').split('?')[0].replace(/^\/+/, '/');
  const match = normalizedPath.match(/^\/(?:nde\/)?custom\/([^/]+)\/asset-manifest\.json$/);

  if (!match) {
    return false;
  }

  return !match[1].endsWith('-CENTRAL_PACKAGE');
}

export function isIzAssetManifestRequest(requestPath) {
  return isCustomModuleAssetManifestRequest(requestPath);
}

export function normalizeManifestPath(filePath, rootDirectory = process.cwd()) {
  const absoluteRootDirectory = path.resolve(rootDirectory || process.cwd());
  const absoluteFilePath = path.resolve(filePath);

  const relativePath = path.relative(absoluteRootDirectory, absoluteFilePath);
  if (!relativePath || relativePath === '.' || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return relativePath.split(path.sep).join('/');
}

export function addParentDirectories(filePaths) {
  const parentDirectories = new Set();

  for (const filePath of filePaths) {
    if (!filePath || typeof filePath !== 'string') {
      continue;
    }

    const normalized = filePath.split(/\\|\//).filter(Boolean).join('/');
    const parts = normalized.split('/').filter(Boolean);
    for (let i = 1; i < parts.length; i += 1) {
      const parent = parts.slice(0, i).join('/');
      if (parent) {
        parentDirectories.add(parent);
      }
    }
  }

  return [...parentDirectories].sort((a, b) => a.localeCompare(b));
}

export function createMergedAssetManifest(sourceManifests = []) {
  const files = new Set();
  const directories = new Set();

  for (const manifest of sourceManifests) {
    if (!manifest || typeof manifest !== 'object') {
      continue;
    }

    const fileList = Array.isArray(manifest.files) ? manifest.files : [];
    const directoryList = Array.isArray(manifest.directories) ? manifest.directories : [];

    for (const filePath of fileList) {
      if (!filePath || typeof filePath !== 'string') {
        continue;
      }

      const normalized = filePath.replace(/^\/+/, '').split('\\').join('/');
      if (!normalized) {
        continue;
      }

      files.add(normalized);
    }

    for (const directoryPath of directoryList) {
      if (!directoryPath || typeof directoryPath !== 'string') {
        continue;
      }

      const normalized = directoryPath.replace(/^\/+/, '').split('\\').join('/');
      if (!normalized) {
        continue;
      }

      directories.add(normalized);
    }
  }

  for (const filePath of files) {
    for (const parentDirectory of addParentDirectories([filePath])) {
      directories.add(parentDirectory);
    }
  }

  return {
    files: [...files].sort((a, b) => a.localeCompare(b)),
    directories: [...directories].sort((a, b) => a.localeCompare(b)),
  };
}

export function collectManifestFromDirectory(rootDirectory, manifestBase = '') {
  const root = path.resolve(rootDirectory);
  const output = {
    files: new Set(),
    directories: new Set(),
  };

  if (!fs.existsSync(root)) {
    console.warn(`[AssetManifestProxy] Skipping missing source: ${root}`);
    return output;
  }

  if (!fs.statSync(root).isDirectory()) {
    console.warn(`[AssetManifestProxy] Skipping non-directory source: ${root}`);
    return output;
  }

  console.log(`[AssetManifestProxy] Scanning: ${root}`);

  const stack = [root];
  while (stack.length > 0) {
    const currentDirectory = stack.pop();
    const entries = fs.readdirSync(currentDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name === 'asset-manifest.json') {
        continue;
      }

      const fullPath = path.join(currentDirectory, entry.name);
      const relativeRootPath = normalizeManifestPath(fullPath, root);
      if (!relativeRootPath) {
        continue;
      }

      const manifestPath = manifestBase
        ? `${manifestBase.replace(/^\/+|\/+$/g, '')}/${relativeRootPath}`
        : relativeRootPath;

      if (entry.isDirectory()) {
        output.directories.add(manifestPath);
        stack.push(fullPath);
      } else if (entry.isFile()) {
        output.files.add(manifestPath);
      }
    }
  }

  return {
    files: [...output.files],
    directories: [...output.directories],
  };
}

export function createLocalCustomModuleAssetManifest() {
  const sources = [];

  const buildManifestRoot = getCustomModuleManifestRoot();
  sources.push({ root: buildManifestRoot, base: '' });

  const srcAssetsRoot = path.resolve(process.cwd(), 'src', 'assets');
  if (fs.existsSync(srcAssetsRoot)) {
    sources.push({ root: srcAssetsRoot, base: 'assets' });
  } else {
    console.warn(`[AssetManifestProxy] Skipping missing source: ${srcAssetsRoot}`);
  }

  const manifests = [];
  for (const source of sources) {
    const manifest = collectManifestFromDirectory(source.root, source.base);
    if (manifest.files.length || manifest.directories.length) {
      manifests.push({
        files: manifest.files,
        directories: manifest.directories,
      });
    }
  }

  const merged = createMergedAssetManifest(manifests);
  console.log(`[AssetManifestProxy] Returning merged manifest: ${merged.files.length} files, ${merged.directories.length} directories`);
  return merged;
}

export function shouldProxyLandingPageRequest(requestPath) {
  const normalizedPath = (requestPath || '').split('?')[0].replace(/^\/+/, '/');
  return normalizedPath === '/nde/home' || normalizedPath === '/home';
}

export function shouldProxyLandingPageAssetRequest(requestPath) {
  const normalizedPath = (requestPath || '').split('?')[0].replace(/^\/+/, '/');
  return /^\/(?:nde\/)?custom\/[^/]+\/assets\/(?:landingpage|homepage)(?:\/|$)/.test(normalizedPath);
}

export function getAssetRelativePath(requestPath) {
  const normalizedPath = (requestPath || '').split('?')[0];
  const match = normalizedPath.match(/^\/(?:nde\/)?custom\/[^/]+\/assets\/(.*)$/);
  if (!match || !match[1]) {
    return null;
  }
  return match[1].replace(/^\/+/, '');
}

export function resolveLocalAssetFilePath(relativePath, buildRoot = getCustomModuleManifestRoot()) {
  if (!relativePath) {
    return null;
  }

  const safeRelative = relativePath.split('/').filter((segment) => segment && segment !== '..' && segment !== '.').join(path.sep);
  if (!safeRelative) {
    return null;
  }

  const candidates = [
    path.resolve(process.cwd(), 'src', 'assets', safeRelative),
    path.resolve(buildRoot, 'assets', safeRelative),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

export function resolveCustomModuleManifestPath(requestPath, buildRoot = getCustomModuleManifestRoot()) {
  if (!isCustomModuleAssetManifestRequest(requestPath)) {
    return null;
  }
  return path.join(buildRoot, 'asset-manifest.json').split(path.sep).join('/');
}

export function buildMergedManifestResponse(requestPath, localManifestPath, targetBaseUrl = PROXY_TARGET) {
  const normalizedRequestPath = (requestPath || '').split('?')[0];
  const targetManifestUrl = new URL(normalizedRequestPath.replace(/^\/+/, '/'), targetBaseUrl);
  const targetManifestUrlString = targetManifestUrl.toString();
  const localManifestPathResolved = localManifestPath ? path.resolve(localManifestPath) : null;

  console.log(`[manifest] requestPath=${requestPath}`);
  console.log(`[manifest] targetUrl=${targetManifestUrlString}`);
  console.log(`[manifest] localManifestPath=${localManifestPathResolved || 'runtime-generated'}`);

  return new Promise((resolve, reject) => {
    const isSecureTarget = targetManifestUrl.protocol === 'https:';
    const transport = isSecureTarget ? https : http;
    const request = transport.get(targetManifestUrlString, isSecureTarget ? { agent: proxyAgent } : {}, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        console.log(`[manifest] target manifest response status=${response.statusCode}`);
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300 && body) {
          try {
            const targetManifest = JSON.parse(body);
            const runtimeLocalManifest = createLocalCustomModuleAssetManifest();
            console.log('[manifest] target manifest read successfully');
            console.log('[manifest] local runtime manifest read successfully');
            const mergedManifest = deepMerge(targetManifest, runtimeLocalManifest);
            console.log('[manifest] merged manifest payload=', JSON.stringify(mergedManifest, null, 2));
            resolve({
              statusCode: 200,
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(mergedManifest),
            });
          } catch (error) {
            reject(error);
          }
          return;
        }

        console.log('[manifest] target manifest unavailable or empty, falling back to runtime-generated local manifest');
        try {
          const runtimeLocalManifest = createLocalCustomModuleAssetManifest();
          console.log('[manifest] local runtime manifest fallback payload=', JSON.stringify(runtimeLocalManifest, null, 2));
          resolve({
            statusCode: 200,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(runtimeLocalManifest),
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      console.log(`[manifest] target manifest request failed: ${error.message}`);
      try {
        const runtimeLocalManifest = createLocalCustomModuleAssetManifest();
        console.log('[manifest] local runtime manifest fallback payload=', JSON.stringify(runtimeLocalManifest, null, 2));
        resolve({
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(runtimeLocalManifest),
        });
      } catch (readError) {
        reject(readError);
      }
    });
  });
}
