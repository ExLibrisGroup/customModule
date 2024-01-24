import {createReducer, on} from "@ngrx/store";
import {loadViewConfigAction, loadViewConfigFailedAction, loadViewConfigSuccessAction} from "./viewConfig.actions";
import {ViewConfigData} from "../../models/view-config.model";
import * as StateConstants from "src/app/state/state.const";
import {LoadingStatus} from "src/app/state/state.const";

export const viewConfigFeatureName = 'viewConfig';
export interface ViewConfigState {
  status: LoadingStatus,
  config: ViewConfigData | undefined
}

const initialState: ViewConfigState = {status: StateConstants.PENDING, config: undefined};

export const viewConfigReducer = createReducer(initialState,
  on(loadViewConfigAction, (state): ViewConfigState => ({...state, status: StateConstants.LOADING})),
  on(loadViewConfigSuccessAction, (state, {viewConfig}): ViewConfigState => ({status: StateConstants.SUCCESS, config: viewConfig})),
  on(loadViewConfigFailedAction, (state): ViewConfigState => ({...state, status: StateConstants.FAIL}))
  )

