import {Component, Inject, Input, Optional} from '@angular/core';
import {Doc, SearchMetaData, Facet} from "../models/search.model";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {createFeatureSelector, createSelector} from "@ngrx/store";


export const SUCCESS: "success" = 'success';
export const FAIL: "fail" = 'fail';
export const LOADING: "loading" = 'loading';
export const PENDING: "pending" = 'pending';
export type LoadingStatus = typeof PENDING | typeof LOADING | typeof SUCCESS| typeof FAIL;
export const USER: "user" = 'user';
export const TIMEOUT: "timeout" = 'timeout';
export type LogoutReason = typeof USER | typeof TIMEOUT;
export const MAX_STATE_ACTIONS_IN_HISTORY = 25;
export const MAX_STACK_FRAMES_IN_HISTORY = 25;
export const INDEX_ZERO = 0;
export const getRecordId = (doc: Doc) => doc.pnx.control.recordid[INDEX_ZERO];
export const searchAdapter = createEntityAdapter<Doc>({
  selectId: getRecordId
});



export type stringBoolean= "N" | "Y";
export interface SearchParams {
  q: string,
  scope: string,
  skipDelivery?: stringBoolean,
  offset?: number,
  limit?: number,
  sort?: string,
  inst?: string,
  refEntryActive?: boolean,
  disableCache?: boolean,
  newspapersActive?: boolean,
  qInclude?: string[],
  qExclude?: string[],
  multiFacets?: string[],
  pfilter?: string,
  tab?: string,
  mode?: string,
  isCDSearch?: boolean,
  pcAvailability?: boolean,
  searchInFulltextUserSelection?: boolean
}
export const searchFeatureName = 'Search';
export const selectSearchState = createFeatureSelector<SearchState>(searchFeatureName);
export interface SearchState extends EntityState<Doc>{
  status: LoadingStatus,
  searchParams: SearchParams | null,
  searchResultsMetaData: SearchMetaData | null,
  selectedPageSize: number | null,
  filter: {status: LoadingStatus , filters: Facet[] | null},
  searchNotificationMsg:string,
  presentNotification:boolean,
  isSearchAndAppendMode?: boolean,
  numOfItemsToAppend?: number,
  pcAvailabilityToggleValue:boolean,
  searchInFullTextToggleValue: boolean
}


const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = searchAdapter.getSelectors(selectSearchState);
export const selectAllSearchResults = selectAll;

@Component({
  selector: 'full-display-details',
  templateUrl: './full-display-details.component.html',
  styleUrls: ['./full-display-details.component.scss']
})
export class FullDisplayDetailsComponentDist{
  imageUrl: string | undefined;
  subject: string | undefined;
  searchResults$: Observable<Doc[]>;
  public isConnected: boolean = false;

  @Input() private hostComponent!: any;

  constructor(public store: Store) { 
    this.searchResults$ = this.store.select(selectAllSearchResults);


  }


  ngOnInit(): void {
    console.log('FullDisplayDetailsComponent ngOnInit:', this.getSubjectText());
    this.subject = this.getSubjectText();
    this.checkMmsId();

  }



  private getSubjectText(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'subject' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['subject']?.join(', ');
    }else{
      return undefined;
    }
  }


  public getDesc(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'description' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['description']?.join(', ');
    }else{
      return undefined;
    }
  }


  public getTitle(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'title' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['title']?.join(', ');
    }else{
      return undefined;
    }
  }


  public getAuthor(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'author' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['contributor']?.join(', ');
    }else{
      return undefined;
    }
  }

  public getCreationDate(): string | undefined { 
    if(this.hostComponent){
      // Safe access using bracket notation for 'creationdate' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['creationdate']?.join(', ');
    }else{
      return undefined;
    }
  }


  public getFormat(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'format' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['format']?.join(', ');
    }else{
      return undefined;
    }
  }

  public getPublisher(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'publisher' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['publisher']?.join(', ');
    }else{
      return undefined;
    }
  }

  public getIsPartOf(): string | undefined {
    if(this.hostComponent){
      // Safe access using bracket notation for 'ispartof' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.display?.['ispartof']?.join(', ');
    }else{
      return undefined;
    }
  }

  public getMmsId(): string | undefined {
    if(this.hostComponent){
      //console.log('FullDisplayDetailsComponent getMmsId:', this.hostComponent.searchResult?.pnx?.control);
      // Safe access using bracket notation for 'mmsid' based on TypeScript's requirement
      return this.hostComponent.searchResult?.pnx?.control?.['recordid']?.join(', ');
    }else{
      return undefined;
    }
  }

  private checkMmsId(): void {
    console.log('FullDisplayDetailsComponent checkMmsId:', window.location.href);
  
    // Parse the query string manually
    const params = new URLSearchParams(window.location.search);
    const docid = params.get('docid');
    const mmsId = this.getMmsId();
  
    console.log('MmsId:', mmsId, 'DocId:', docid);
    this.isConnected = (docid === mmsId);
  }

}
