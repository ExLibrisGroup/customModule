import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  isDevMode
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as utils from './utils';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreModule} from '@ngrx/store';
import * as StateConstants from '../state/state.const';
import {TranslateModule} from "@ngx-translate/core";


// Define the map
export const selectorComponentMap = new Map<string, any>([
  // Add more pairs as needed
]);



@NgModule({
  declarations: [

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
      , connectInZone: true})
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
   */

  public getComponentRef(componentName:string ){
    return selectorComponentMap.get(componentName);
  }


}
