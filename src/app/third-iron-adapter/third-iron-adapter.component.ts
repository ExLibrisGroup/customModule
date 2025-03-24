import { Component, inject, OnInit, signal } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { map, Observable, toArray } from 'rxjs';
import { SingleButtonComponent } from '../single-button/single-button.component';

type SearchItemsState = { entities: Record<string, object> };
// type FullDisplayStater = { selectedRecordId: string };

export type ButtonInfo = {
  ariaLabel: string;
  buttonText: string;
  url: string;
  icon?: string;
};

const selectSearchState = createFeatureSelector<SearchItemsState>('Search');
const selectSearchEntities = createSelector(
  selectSearchState,
  (state) => state.entities
);
@Component({
  selector: 'custom-third-iron-adapter',
  standalone: true,
  imports: [SingleButtonComponent],
  templateUrl: './third-iron-adapter.component.html',
  styleUrl: './third-iron-adapter.component.scss',
})
export class ThirdIronAdapterComponent {
  buttonInfo = signal({
    url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
    buttonText: 'Test Third Iron button',
    ariaLabel: 'A test aria label',
  });

  searchItemsState$: Observable<SearchItemsState> | undefined;
  public store = inject(Store);
  searchEntities$: Observable<Record<string, object>> | undefined;
  ngOnInit() {
    this.searchEntities$ = this.store.select(selectSearchEntities).pipe(
      map((records) => {
        return records;
      })
    );

    this.searchEntities$.subscribe((records) =>
      console.log('SEARCH ENTITIES:', records)
    );
  }
}
