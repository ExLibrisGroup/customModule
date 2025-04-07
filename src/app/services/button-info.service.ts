import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { getDoi, getEntityType, getIssn } from '../shared/searchEntityUtils';
import {
  DEFAULT_BUTTON_INFO,
  EntityType,
} from '../third-iron-adapter/third-iron-adapter.component';
import { map, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonInfoService {
  constructor(private apiService: ApiService) {}

  getButtonInfo(entity: SearchEntity): Observable<ButtonInfo> {
    const observable: Observable<ButtonInfo> = new Observable(
      (obs: Observer<ButtonInfo>) => {
        DEFAULT_BUTTON_INFO;
      }
    );
    const entityType = getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        // this.apiService.getArticle(getDoi(entity)).subscribe((res: any) => {
        //   console.log('API Result:', res);
        //   return {
        //     ariaLabel: 'test',
        //     buttonText: `DOI: ${res.data?.doi}`,
        //     color: 'sys-primary',
        //     icon: 'pdf-download-icon',
        //     url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
        //   };
        // });
        return this.apiService
          .getArticle(getDoi(entity))
          .pipe(map((res) => this.transformRes(res)));
      }
      if (entityType === EntityType.Journal) {
        return this.apiService
          .getJournal(getIssn(entity))
          .pipe(map((res) => this.transformRes(res)));
      }

      // if not article or journal, just return empty button info
      return observable;
    } else {
      return observable;
    }
  }

  transformRes(res: any): ButtonInfo {
    return {
      ariaLabel: 'test',
      buttonText: `DOI: ${res.data?.doi}`,
      color: 'sys-primary',
      icon: 'pdf-download-icon',
      url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
    };
  }
}
