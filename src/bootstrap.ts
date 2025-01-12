import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {bootstrap} from "@angular-architects/module-federation-tools";



// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

bootstrap(AppModule, {
  production: false,
  appType: 'microfrontend'
}).then(r => console.log('microfrontend bootstrap success', r));
