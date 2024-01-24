import { Injectable } from '@angular/core';
import {Observable, map, shareReplay} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

type Keys = (typeof observedBreakpoints)[number];
export type BreakpointsState = {[K in Keys]: boolean };

const observedBreakpoints = ['XSmall', 'Small', 'Medium','Large','XLarge'] as const;

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService extends Observable<BreakpointsState>{
  private readonly observedQueries = Object.entries(Breakpoints)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([breakpointName, query]) => observedBreakpoints.includes(<never>breakpointName))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([breakpointName, query]) => query);
  private readonly _breakpointObservable$: Observable<BreakpointsState>;

  constructor(private breakpointObserver: BreakpointObserver) {
    super((subscriber) =>  {
      this._breakpointObservable$.subscribe(subscriber);
    });
    this._breakpointObservable$ =this.breakpointObserver.observe(this.observedQueries).pipe(
      map(breakPointState => Object.entries(breakPointState.breakpoints)),
      map((entries) =>
        entries.map(
          ([query, matches]) =>
            [Object.keys(Breakpoints).find((key)=> Breakpoints[key as keyof typeof Breakpoints] === query), matches]
        )
      ),
      map(entries => Object.fromEntries(entries)),
      shareReplay(1)
    )
  }
}
