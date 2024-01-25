import {createFeatureSelector, createSelector} from "@ngrx/store";
import {searchAdapter, searchFeatureName, SearchState} from "./search.reducer";

export const selectSearchState = createFeatureSelector<SearchState>(searchFeatureName);

export const selectSearchLoadingStatus = createSelector(
  selectSearchState,
  response => response.status
);

/* default entity adapter selectors */
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = searchAdapter.getSelectors(selectSearchState);

// select the array of search ids
export const selectAllSearchIds = selectIds;

// select the dictionary of search entities
// more performance wise
export const selectAllSearchEntities = selectEntities;

// select the array of search
export const selectAllSearchResults = selectAll;

// select the total search count
export const selectSearchTotalCount = selectTotal;

export const selectSearchParams = createSelector(
  selectSearchState,
  (state) => state.searchParams
);

export const selectEntityIdsWithNoDeliverySection = createSelector(
  selectAllSearchResults,
  (searchResults) =>
      searchResults.filter(doc => !doc.delivery).map(doc => searchAdapter.selectId(doc) as string)
);


