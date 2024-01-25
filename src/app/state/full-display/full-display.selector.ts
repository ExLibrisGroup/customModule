import {createFeatureSelector, createSelector} from "@ngrx/store";
import {fullDisplayFeatureName, FullDisplayState} from "./full-display.reducer";
import {selectAllSearchEntities} from "../search/search.selector";


const selectFullDisplayState = createFeatureSelector<FullDisplayState>(fullDisplayFeatureName);

export const selectSelectedRecordId = createSelector(
    selectFullDisplayState,
    (state) => state.selectedRecordId
)

export const selectCurrentRecord = createSelector(
    selectSelectedRecordId,
    selectAllSearchEntities,
    (selectedRecordId, searchEntities) => selectedRecordId? searchEntities[selectedRecordId] : undefined
)
