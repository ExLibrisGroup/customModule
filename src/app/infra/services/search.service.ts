import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DELIVERY_REQUEST_PATH, SEARCH_REQUEST_PATH} from "../API";
import {Doc, SearchData, SearchParams} from "../../models/search.model";
import {Observable, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {PENDING, SUCCESS } from 'src/app/state/state.const';

@Injectable({
  providedIn: 'root'
})
export class SearchService{

  constructor(private httpClient: HttpClient, private store: Store) { }

  public getSearchData(searchParams: SearchParams) : Observable<SearchData>{
      const searchUrl = SEARCH_REQUEST_PATH + this.getDumbParams(searchParams);
      return this.httpClient.get<SearchData>(searchUrl).pipe(
          tap(data =>
              data.docs.forEach(doc => doc.deliveryStatus = doc.delivery? SUCCESS : PENDING))
      );
  }

  //TODO- replace this method with smart selector state management parameters
  private getDumbParams (searchParams: SearchParams) : string {
    return `?acTriggered=false&blendFacetsSeparately=false&citationTrailFilterByAvailability=true&disableCache=false&getMore=0&inst=TRAINING_1_INST&lang=en&limit=10&newspapersActive=true&newspapersSearch=false&offset=0&pcAvailability=false&q=any,contains,${searchParams.searchTerm}&qExclude=&qInclude=&rapido=false&refEntryActive=false&rtaLinks=true&scope=${searchParams.scope}&searchInFulltextUserSelection=false&skipDelivery=Y&sort=rank&tab=Everything`;
  }

  public getDelivery(searchParams: SearchParams, recordIds: string[]) {
    const deliveryUrl = DELIVERY_REQUEST_PATH + this.getDumbParams(searchParams);
    return this.httpClient.post<Doc[]>(deliveryUrl, recordIds);
  }
}
