import {createAction, props} from "@ngrx/store";


export const changeFullDisplaySelectedRecordIdAction =
    createAction('[full-display] change selected record id', props<{selectedRecordId: string}>());
