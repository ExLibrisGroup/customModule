import {Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {
  deliveryAction,
  deliverySuccessAction,
  searchAction,
  searchFailedAction,
  searchSuccessAction
} from "./search.actions";
import {catchError, EMPTY, map, of, switchMap} from "rxjs";
import {SearchService} from "../../infra/services/search.service";
import {Store} from "@ngrx/store";
import {selectEntityIdsWithNoDeliverySection, selectSearchParams} from "./search.selector";

@Injectable()
export class SearchEffects {

  search$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(searchAction),
        switchMap(({searchParams}) => this.searchService.getSearchData(searchParams).pipe(
          map((searchResultsData) => searchSuccessAction({searchResultsData})),
          catchError(() => of(searchFailedAction()))))
      )
    }
  );

  triggerDeliveryOnSearchSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchSuccessAction),
      concatLatestFrom(() => [this.store.select(selectSearchParams), this.store.select(selectEntityIdsWithNoDeliverySection)]),
      switchMap(([, searchParams, idsWithoutDelivery]) => {
        if (searchParams && idsWithoutDelivery.length) {
          return of(deliveryAction({searchParams, recordIds: idsWithoutDelivery}));
        }
        return EMPTY;
      })
    )
  });

  delivery$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deliveryAction),
      switchMap(({searchParams, recordIds}) =>
        this.searchService.getDelivery(searchParams, recordIds).pipe(
          map((docs) => deliverySuccessAction({docsToUpdate: docs}))
        ))
    )
  })

  constructor(private actions$: Actions,
              private searchService: SearchService, private store: Store) { }
}
