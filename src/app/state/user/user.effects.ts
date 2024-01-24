import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadJwtAction, loadJwtFailedAction, loadJwtSuccessAction} from "./user.actions";
import {catchError, map, of, switchMap} from "rxjs";
import {JwtService} from "../../infra/services/jwt.service";

@Injectable()
export class UserEffects {
  constructor(private actions$ : Actions, private jwtService: JwtService) {
  }

  loadJwt$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadJwtAction),
      switchMap(({vid}) => this.jwtService.getGuestJwt(vid).pipe(
          map(jwt => loadJwtSuccessAction({jwt})),
          catchError(() => of(loadJwtFailedAction()))
      ))
    )
  })
}
