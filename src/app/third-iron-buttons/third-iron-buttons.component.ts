import { Component, inject, OnInit, signal, input, Input } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { map, Observable, toArray } from 'rxjs';
import { BaseButtonComponent } from '../components/base-button/base-button.component';
import { BrowzineButtonComponent } from '../components/browzine-button/browzine-button.component';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { SearchEntityService } from '../services/search-entity.service';
import { ButtonInfoService } from '../services/button-info.service';
import { AsyncPipe } from '@angular/common';

type SearchItemsState = { entities: Record<string, SearchEntity> };
// type FullDisplayStater = { selectedRecordId: string };

const selectSearchState = createFeatureSelector<SearchItemsState>('Search');
const selectSearchEntities = createSelector(
  selectSearchState,
  (state) => state.entities
);
@Component({
  selector: 'custom-third-iron-buttons',
  standalone: true,
  imports: [BaseButtonComponent, BrowzineButtonComponent, AsyncPipe],
  templateUrl: './third-iron-buttons.component.html',
  styleUrl: './third-iron-buttons.component.scss',
  providers: [SearchEntityService],
})
export class ThirdIronButtonsComponent {
  @Input() private hostComponent!: any;
  // hostComponent = input.required<any>();

  //public buttonInfo: ButtonInfo = DEFAULT_BUTTON_INFO;
  buttonInfo$!: Observable<ButtonInfo>;

  searchItemsState$: Observable<SearchItemsState> | undefined;
  public store = inject(Store);
  searchEntities$: Observable<Record<string, SearchEntity>> | undefined;

  constructor(
    private buttonInfoService: ButtonInfoService,
    private searchEntityService: SearchEntityService
  ) {}

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
    if (!this.searchEntityService.shouldEnhance(searchResult)) {
      return;
    }

    console.log('searchResult', searchResult);
    this.buttonInfo$ = this.buttonInfoService.getButtonInfo(searchResult);
  };
}
