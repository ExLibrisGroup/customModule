import {ApplicationRef, DoBootstrap, EnvironmentInjector, Injector, isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
// import {StoreDevtoolsModule} from "@ngrx/store-devtools";
// import * as StateConstants from "./state/state.const";
import {createCustomElement, NgElementConstructor} from "@angular/elements";
import {RecommendationsComponent} from "./custom1-module/recommendations/recommendations.component";
import {BriefResultComponent} from "./custom1-module/brief-result/brief-result/brief-result.component";
import {Router} from "@angular/router";


// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-top-bar-before', RecommendationsComponent],
  ['nde-search-result-item-container-before', BriefResultComponent]

]);
export const AppModule = (providers: any) => {
   @NgModule({
    declarations: [
      AppComponent,
      RecommendationsComponent
    ],
    imports: [
      BrowserModule,
    ],
    providers: providers,
    bootstrap: []
  })
  class AppModule implements DoBootstrap{
    private webComponentSelectorMap = new Map<string,  NgElementConstructor<unknown>>();
    constructor(private injector: Injector, private router: Router) {
      router.dispose(); //this prevents the router from being initialized and interfering with the shell app router
    }
    ngDoBootstrap(appRef: ApplicationRef) {
      console.log('Start ngDoBootstrap of AppModule:' );
      for (const [key, value] of selectorComponentMap) {
        const customElement = createCustomElement(value, {injector: this.injector});
        this.webComponentSelectorMap.set(key, customElement);
      }
    }

    /**
     * Use componentMapping, selectorComponentMap
     * @param componentName
     * @param injector
     * @param hostComponentInstance
     */

    public getComponentRef(componentName:string, injector: Injector, hostComponentInstance: unknown) {
      const customComponentFactory = selectorComponentMap.get(componentName);
      if (customComponentFactory) {
        const customInjector = Injector.create({
          providers: [{provide: 'HOST_COMPONENT', useValue: hostComponentInstance}],
          parent: this.injector
        });
        return createCustomElement(customComponentFactory, {injector: customInjector});
      }

      return selectorComponentMap.get(componentName);
    }
  }
  return AppModule
}

