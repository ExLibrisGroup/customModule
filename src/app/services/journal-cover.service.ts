import { Injectable } from '@angular/core';
import { SearchEntity } from '../types/searchEntity.types';
import { map, Observable, Observer } from 'rxjs';
import { SearchEntityService } from './search-entity.service';
import { EntityType } from '../shared/entity-type.enum';
import { ApiService } from './api.service';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';

export const DEFAULT_JOURNAL_COVER_INFO = {
  ariaLabel: '',
  buttonText: '',
  color: '',
  entityType: EntityType.Unknown,
  icon: '',
  url: '',
  showBrowzineButton: false,
};

@Injectable({
  providedIn: 'root',
})
export class JournalCoverService {
  constructor(
    private apiService: ApiService,
    private searchEntityService: SearchEntityService
  ) {}

  getJournalCoverUrl(entity: SearchEntity): Observable<string> {
    const observable: Observable<string> = new Observable(
      (obs: Observer<string>) => {
        ('');
      }
    );
    const entityType = this.searchEntityService.getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        return this.apiService
          .getArticle(this.searchEntityService.getDoi(entity))
          .pipe(map((res) => this.transformRes(res, entityType)));
      }
      if (entityType === EntityType.Journal) {
        return this.apiService
          .getJournal(this.searchEntityService.getIssn(entity))
          .pipe(map((res) => this.transformRes(res, entityType)));
      }
      // if not article or journal, just return empty button info
      return observable;
    } else {
      return observable;
    }
  }

  transformRes(response: ApiResult, type: EntityType): string {
    const data = this.apiService.getData(response);
    const journal = this.apiService.getIncludedJournal(response);

    // If our response object data isn't an Article and isn't a Journal,
    // we can't proceed, so return empty string
    if (!this.apiService.isArticle(data) && !this.apiService.isJournal(data)) {
      return '';
    }

    const coverImageUrl = this.getCoverImageUrl(type, data, journal);
    const defaultCoverImage = this.isDefaultCoverImage(coverImageUrl);

    // console.log('journal cover url', coverImageUrl);

    if (coverImageUrl && !defaultCoverImage && this.showJournalCoverImages()) {
      return coverImageUrl;
    }

    return '';
  }

  private getCoverImageUrl(
    type: EntityType,
    data: ArticleData | JournalData,
    journal: JournalData | null
  ): string {
    let coverImageUrl = '';

    if (type === EntityType.Journal && this.apiService.isJournal(data)) {
      if (data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if (type === EntityType.Article) {
      if (journal && journal.coverImageUrl) {
        coverImageUrl = journal.coverImageUrl;
      }
    }

    return coverImageUrl;
  }

  private isDefaultCoverImage(coverImageUrl: string): boolean {
    return !!(
      coverImageUrl && coverImageUrl.toLowerCase().indexOf('default') > -1
    );
  }

  private showJournalCoverImages() {
    let featureEnabled = true; // set back to false once implemented
    // const config = browzine.journalCoverImagesEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }
}
