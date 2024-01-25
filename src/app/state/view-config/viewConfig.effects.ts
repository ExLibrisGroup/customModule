import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, of, switchMap} from "rxjs";
import {loadViewConfigAction, loadViewConfigFailedAction, loadViewConfigSuccessAction} from "./viewConfig.actions";
import { ViewConfigService } from "src/app/infra/services/view-config.service";

@Injectable()
export class ViewConfigEffects {

  loadViewConfig$ = createEffect(() => { return this.actions$.pipe(
    ofType(loadViewConfigAction),
    switchMap(({vid}) => this.httpService.getConfigData(vid).pipe(
      map((viewConfig) => loadViewConfigSuccessAction({viewConfig})),
      catchError(() => of(loadViewConfigFailedAction()))))
    ) }
  );

  constructor(private actions$: Actions,
    private httpService : ViewConfigService) { }

}
