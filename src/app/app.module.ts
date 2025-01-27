import {ApplicationRef, DoBootstrap, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {createCustomElement, NgElementConstructor} from "@angular/elements";
import {RecommendationsComponent} from "./custom1-module/recommendations/recommendations.component";
import {Router} from "@angular/router";
import {selectorComponentMap} from "./custom1-module/customComponentMappings";


export const AppModule = ({providers}: {providers:any}) => {
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
      for (const [key, value] of selectorComponentMap) {
        const customElement = createCustomElement(value, {injector: this.injector});
        this.webComponentSelectorMap.set(key, customElement);
      }
    }

    /**
     * Use componentMapping, selectorComponentMap
     * @param componentName
     */
    public getComponentRef(componentName:string) {
      return this.webComponentSelectorMap.get(componentName);
    }
  }
  return AppModule
}

