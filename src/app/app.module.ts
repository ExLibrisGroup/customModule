import {
  ApplicationRef,
  DoBootstrap,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { Router } from '@angular/router';
import { selectorComponentMap } from './third-iron-module/customComponentMappings';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AutoAssetSrcDirective } from './services/auto-asset-src.directive';
import { provideHttpClient } from '@angular/common/http';

export const AppModule = ({ providers }: { providers: any }) => {
  @NgModule({
    declarations: [AppComponent, AutoAssetSrcDirective],
    exports: [AutoAssetSrcDirective],
    imports: [BrowserModule, CommonModule, TranslateModule.forRoot({})],
    providers: [...providers, provideHttpClient()],
    bootstrap: [],
  })
  class AppModule implements DoBootstrap {
    private webComponentSelectorMap = new Map<
      string,
      NgElementConstructor<unknown>
    >();

    constructor(private injector: Injector, private router: Router) {
      router.dispose(); //this prevents the router from being initialized and interfering with the shell app router
    }

    ngDoBootstrap(appRef: ApplicationRef) {
      for (const [key, value] of selectorComponentMap) {
        const customElement = createCustomElement(value, {
          injector: this.injector,
        });
        this.webComponentSelectorMap.set(key, customElement);
      }
    }

    /**
     * Use componentMapping, selectorComponentMap
     * @param componentName
     */
    public getComponentRef(componentName: string) {
      return this.webComponentSelectorMap.get(componentName);
    }
  }
  return AppModule;
};
