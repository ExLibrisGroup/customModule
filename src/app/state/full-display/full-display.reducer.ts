import {createReducer, on} from "@ngrx/store";
import {changeFullDisplaySelectedRecordIdAction} from "./full-display.actions";

export const fullDisplayFeatureName = 'full-display';
export interface FullDisplayState {
    selectedRecordId: string | undefined,
}

const initialState: FullDisplayState = {
    selectedRecordId: undefined
}

export const fullDisplayReducer = createReducer(
    initialState,
    on(changeFullDisplaySelectedRecordIdAction, (state, {selectedRecordId}): FullDisplayState => ({...state, selectedRecordId}))
)
