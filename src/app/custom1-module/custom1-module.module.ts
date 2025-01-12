import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  isDevMode, createComponent, EnvironmentInjector, Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as utils from './utils';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreModule} from '@ngrx/store';
import * as StateConstants from '../state/state.const';
import {TranslateModule} from "@ngx-translate/core";
import {RecommendationsComponent} from "./recommendations/recommendations.component";
import {BriefResultComponent} from "./brief-result/brief-result/brief-result.component";


// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-top-bar-before', RecommendationsComponent],

]);



@NgModule({
  declarations: [
    RecommendationsComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({}),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: StateConstants.MAX_STATE_ACTIONS_IN_HISTORY,
      logOnly: !isDevMode(),
      trace: true,
      traceLimit: StateConstants.MAX_STACK_FRAMES_IN_HISTORY
      , connectInZone: true
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Custom1ModuleModule {
  static utils = utils; // Expose the utilities for consumption

  constructor() {
    console.log('Start constructor of Custom1ModuleModule:' );

  }

  /**
   * Use componentMapping, selectorComponentMap
   * @param componentName
   * @param environmentInjector
   * @param injector
   */

  public getComponentRef(componentName:string, environmentInjector: EnvironmentInjector, injector: Injector) {
    const componentFactory = selectorComponentMap.get(componentName);
    if (componentFactory){
      return createComponent(componentFactory, {environmentInjector: environmentInjector})
    }
    return null;
  }


}
