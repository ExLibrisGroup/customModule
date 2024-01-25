import {createReducer, on} from "@ngrx/store";
import {FAIL, LOADING, LoadingStatus, PENDING, SUCCESS} from "../state.const";
import {loadJwtAction, loadJwtFailedAction, loadJwtSuccessAction} from "./user.actions";


export const userFeatureName = 'user';
export interface UserState {
  jwt: string | undefined,
  status: LoadingStatus
}

const initialState: UserState = {
  jwt: undefined,
  status: PENDING
}

export const userReducer = createReducer(
    initialState,
    on(loadJwtAction, (state): UserState => ({...state, status: LOADING})),
    on(loadJwtSuccessAction, (state, {jwt}): UserState => ({...state, status: SUCCESS, jwt})),
    on(loadJwtFailedAction, (state): UserState => ({...state, status: FAIL}))
)
