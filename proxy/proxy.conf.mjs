import {PROXY_TARGET} from "./proxy.const.mjs";


const proxyRules = [
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
    secure: true,
    logLevel: 'debug',
    pathRewrite: { '^/nde/custom/.*/': '' },

  },
  {
    context: [
      '**', '!/nde/custom/**'
    ],
    target: PROXY_TARGET,
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',

  }
];



export default proxyRules;
