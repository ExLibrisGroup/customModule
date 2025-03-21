//set the url of the server you want to test your code with and start the development server using the following command:
// ng serve --proxy-config ./proxy/proxy.conf.mjs
// const environments = {
//     'example': 'https://myPrimoVE.com',
//   }

//   export const PROXY_TARGET = environments['example'];

const environments = {
  example: "https://myPrimoVE.com",
  "sqa-na02": "https://sqa-na02.alma.exlibrisgroup.com",
};

export const PROXY_TARGET = environments["sqa-na02"];
