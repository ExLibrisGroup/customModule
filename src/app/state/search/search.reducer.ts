import {createReducer, on} from "@ngrx/store";
import * as StateConstants from "src/app/state/state.const";
import {LOADING, LoadingStatus, PENDING, SUCCESS} from "src/app/state/state.const";
import {Doc, SearchMetaData, SearchParams} from "../../models/search.model";
import {
    deliveryAction,
    deliverySuccessAction,
    searchAction,
    searchFailedAction,
    searchSuccessAction
} from "./search.actions";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {INDEX_ZERO} from "../../infra/number.const";

export const searchFeatureName = 'Search';
export interface SearchState extends EntityState<Doc>{
    status: LoadingStatus,
    searchParams: SearchParams | null,
    searchResultsMetaData: SearchMetaData | null
}

export const searchAdapter = createEntityAdapter<Doc>({
    selectId: doc => doc.pnx.control.recordid[INDEX_ZERO]
});
const initialState: SearchState = searchAdapter.getInitialState({
    status: PENDING,
    searchParams: null,
    searchResultsMetaData: null
})

export const searchReducer = createReducer(initialState,
    on(searchAction, (state, {searchParams}) => searchAdapter.removeAll({
        ...state,
        searchParams,
        searchResultsMetaData: null,
        status: StateConstants.LOADING
    })),
    on(searchSuccessAction, (state, {searchResultsData}) => {
        const {docs, ...searchResultsMetadata} = searchResultsData;
        return searchAdapter.setAll(docs,
            {...state, status: SUCCESS, searchResultsMetaData: searchResultsMetadata})
    }),
    on(searchFailedAction, (state): SearchState => ({...state, status: StateConstants.FAIL})),
    on(deliveryAction, (state, {recordIds}) =>
        searchAdapter.updateMany(recordIds.map(id => ({id, changes: {deliveryStatus: LOADING}})), state)),
    on(deliverySuccessAction, (state, {docsToUpdate}) => {
      const updates = docsToUpdate.map(doc =>
          ({id: searchAdapter.selectId(doc) as string, changes: {deliveryStatus: SUCCESS, delivery: doc.delivery, enrichment: doc.enrichment}}));
      return searchAdapter.updateMany(updates, state);
    })
)
