import "@angular/compiler";
import { AppModule } from './app/app.module';
import {bootstrap} from "@angular-architects/module-federation-tools";

export const appModule = bootstrap(AppModule, {
  production: false,
  appType: 'microfrontend'
}).then(r => {console.log('custom remotote app bootstrap success', r); return r});


