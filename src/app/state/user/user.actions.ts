import {createAction, props} from "@ngrx/store";

export  const loadJwtAction = createAction('[User] load jwt', props<{vid: string}>());
export const loadJwtSuccessAction = createAction('[User] load jwt success', props<{jwt: string}>());
export const loadJwtFailedAction = createAction('[User] load jwt failed');
