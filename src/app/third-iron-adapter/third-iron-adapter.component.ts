import { Component, inject, OnInit, signal } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { map, Observable, toArray } from 'rxjs';
import { SingleButtonComponent } from '../components/single-button/single-button.component';

type SearchItemsState = { entities: Record<string, object> };
// type FullDisplayStater = { selectedRecordId: string };

export type ButtonInfo = {
  ariaLabel: string;
  buttonText: string;
  url: string;
};

// TODO rename these assets?
// enum ImageUrl {
//   BrowzineBook = 'https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg',
//   PDF = 'https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg',
//   ArticleAlert = 'https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg',
//   ArticleDefault = 'https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg',
// }

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
  // TODO - load info instead of hardcorded
  buttonInfo1 = signal({
    ariaLabel: 'A test aria label',
    buttonText: 'Test Third Iron button',
    url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
  });

  buttonInfo2 = signal({
    ariaLabel: 'A second test aria label',
    buttonText: 'Second test button',
    url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
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
