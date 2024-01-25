import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ViewConfigData} from 'src/app/models/view-config.model';
import {CONFIG_REQUEST_PATH} from "../API";
import {take, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ViewConfigService {
  constructor(private httpClient: HttpClient) { }

  public getConfigData(vid : string){
    return this.httpClient.get<ViewConfigData>(`${CONFIG_REQUEST_PATH}/${vid}`).pipe(
        tap((viewConfigData) => viewConfigData.vid = vid), take(1)
    )
  }
}
