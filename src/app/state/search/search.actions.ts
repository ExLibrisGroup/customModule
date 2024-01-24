import {createAction, props} from "@ngrx/store";
import {Doc, SearchData, SearchParams} from "../../models/search.model";

//TODO- for searchAction - add all search params as props
export const searchAction =
    createAction('[Search] Load search', props<{searchParams: SearchParams}>());
export const searchSuccessAction =
    createAction('[Search] Load search success', props<{searchResultsData : SearchData}>());
export const searchFailedAction = createAction('[Search] Load search failed');
export const deliveryAction =
  createAction('[Search] Load delivery', props<{searchParams: SearchParams, recordIds: string[]}>())
export const deliverySuccessAction =
  createAction('[Search] Load delivery success', props<{docsToUpdate: Doc[]}>());

