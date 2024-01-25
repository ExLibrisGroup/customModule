import {createFeatureSelector, createSelector} from "@ngrx/store";
import {userFeatureName, UserState} from "./user.reducer";


const selectUserFeature = createFeatureSelector<UserState>(userFeatureName);
export const selectUserLoadingStatus = createSelector(
    selectUserFeature,
    userState => userState.status
);
export const selectJwt = createSelector(
    selectUserFeature,
    userState => userState.jwt
);
