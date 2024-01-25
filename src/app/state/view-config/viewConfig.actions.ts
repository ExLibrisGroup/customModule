import {createAction, props} from "@ngrx/store";
import {ViewConfigData} from "../../models/view-config.model";

export const loadViewConfigAction = createAction('[view-config] load view-config', props<{vid: string}>());
export const loadViewConfigSuccessAction = createAction('[view-config] load view-config success', props<{viewConfig : ViewConfigData}>());
export const loadViewConfigFailedAction = createAction('[view-config] load view-config failed');
