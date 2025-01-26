import "@angular/compiler";
import { AppModule } from './app/app.module';
import {bootstrap} from "@angular-architects/module-federation-tools";
import {Store, StoreModule} from "@ngrx/store";

export const bootstrapRemoteApp = (providers: any) => {
   return bootstrap(AppModule(providers), {
    production: false,
    appType: 'microfrontend'
  }).then(r => {
    console.log('custom remotote app bootstrap success', r);
    return r
  });
}

