import { Injectable } from '@angular/core';
import { SearchEntity } from '../types/searchEntity.types';
import { map, Observable, Observer, of } from 'rxjs';
import { SearchEntityService } from './search-entity.service';
import { EntityType } from '../shared/entity-type.enum';
import { HttpService } from './http.service';
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

/**
 * This Service is responsible for initiating the call to Third Iron article/journal endpoints
 * to retrieve a Journal Cover image url
 */
@Injectable({
  providedIn: 'root',
})
export class JournalCoverService {
  constructor(
    private httpService: HttpService,
    private searchEntityService: SearchEntityService
  ) {}

  getJournalCoverUrl(entity: SearchEntity): Observable<string> {
    const entityType = this.searchEntityService.getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        return this.httpService
          .getArticle(this.searchEntityService.getDoi(entity))
          .pipe(map((res) => this.transformRes(res, entityType)));
      }
      if (entityType === EntityType.Journal) {
        return this.httpService
          .getJournal(this.searchEntityService.getIssn(entity))
          .pipe(map((res) => this.transformRes(res, entityType)));
      }
      // if not article or journal, just return empty button info
      // 'of' creates an Observable
      return of('');
    } else {
      return of('');
    }
  }

  transformRes(response: ApiResult, type: EntityType): string {
    const data = this.httpService.getData(response);
    const journal = this.httpService.getIncludedJournal(response);

    // If our response object data isn't an Article and isn't a Journal,
    // we can't proceed, so return empty string
    if (
      !this.httpService.isArticle(data) &&
      !this.httpService.isJournal(data)
    ) {
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

    if (type === EntityType.Journal && this.httpService.isJournal(data)) {
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
