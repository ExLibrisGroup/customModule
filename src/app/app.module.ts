import {isDevMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Custom1ModuleModule} from "./custom1-module/custom1-module.module";
import { StoreModule } from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import * as StateConstants from "./state/state.const";
import {viewConfigFeatureName, viewConfigReducer} from "./state/view-config/viewConfig.reducer";
import {userFeatureName, userReducer} from "./state/user/user.reducer";
import {searchFeatureName, searchReducer} from "./state/search/search.reducer";
import {fullDisplayFeatureName, fullDisplayReducer} from "./state/full-display/full-display.reducer";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Custom1ModuleModule,
    StoreModule.forRoot({
      [viewConfigFeatureName]: viewConfigReducer,
      [userFeatureName]: userReducer,
      [searchFeatureName]: searchReducer,
      [fullDisplayFeatureName]: fullDisplayReducer
    }, {}),
    StoreDevtoolsModule.instrument({
      maxAge: StateConstants.MAX_STATE_ACTIONS_IN_HISTORY,
      logOnly: !isDevMode(),
      trace: true,
      traceLimit: StateConstants.MAX_STACK_FRAMES_IN_HISTORY
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
