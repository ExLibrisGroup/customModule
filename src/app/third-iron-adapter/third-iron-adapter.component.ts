import { Component, inject, OnInit, signal, input, Input } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { map, Observable, toArray } from 'rxjs';
import { SingleButtonComponent } from '../components/single-button/single-button.component';
import { shouldEnhance } from '../shared/searchEntityUtils';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { ButtonInfoService } from '../services/button-info.service';
import { AsyncPipe } from '@angular/common';

type SearchItemsState = { entities: Record<string, SearchEntity> };
// type FullDisplayStater = { selectedRecordId: string };

export enum ButtonType {
  DirectToPDF = 'DirectToPDF',
  ArticleLink = 'ArticleLink',
  Retraction = 'Retraction',
  ExpressionOfConcern = 'ExpressionOfConcern',
  ProblematicJournal = 'ProblematicJournal',
}

export enum EntityType {
  Article = 'article',
  Journal = 'journal',
}

export const DEFAULT_BUTTON_INFO = {
  ariaLabel: '',
  buttonText: '',
  url: '',
  icon: '',
  color: '',
};

const selectSearchState = createFeatureSelector<SearchItemsState>('Search');
const selectSearchEntities = createSelector(
  selectSearchState,
  (state) => state.entities
);
@Component({
  selector: 'custom-third-iron-adapter',
  standalone: true,
  imports: [SingleButtonComponent, AsyncPipe],
  templateUrl: './third-iron-adapter.component.html',
  styleUrl: './third-iron-adapter.component.scss',
})
export class ThirdIronAdapterComponent {
  @Input() private hostComponent!: any;
  // hostComponent = input.required<any>();

  //public buttonInfo: ButtonInfo = DEFAULT_BUTTON_INFO;
  buttonInfo$!: Observable<any>;

  searchItemsState$: Observable<SearchItemsState> | undefined;
  public store = inject(Store);
  searchEntities$: Observable<Record<string, SearchEntity>> | undefined;

  constructor(private buttonInfoService: ButtonInfoService) {}

  ngOnInit() {
    // Start the process for determining if a button should be displayed and with what info
    this.enhance(this.hostComponent.searchResult);

    this.searchEntities$ = this.store.select(selectSearchEntities).pipe(
      map((records) => {
        return records;
      })
    );

    this.searchEntities$.subscribe((records) => {
      // console.log('SEARCH ENTITIES:', records);
      // console.log('adapter host', this.hostComponent);
      // console.log('searchResult DOI:', getDoi(this.hostComponent.searchResult));
      // for (const [key, record] of Object.entries(records)) {
      //   // console.log(`${key}: ${value}`);
      //   const shouldDisplay = isOpenAccess(record);
      //   console.log('!! is OA? !!', shouldDisplay);
      //   if (shouldDisplay) {
      //     // this.buttonInfo1.set(getButtonInfo(record));
      //   }
      // }
    });
  }

  enhance = (searchResult: SearchEntity) => {
    if (!shouldEnhance(searchResult)) {
      return;
    }

    console.log('searchResult', searchResult);
    this.buttonInfo$ = this.buttonInfoService.getButtonInfo(searchResult);
  };
}
