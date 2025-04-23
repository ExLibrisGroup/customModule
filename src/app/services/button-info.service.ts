import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchEntityService } from './search-entity.service';
import { UnpaywallService } from './unpaywall.service';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { map, Observable, Observer } from 'rxjs';
import { ApiResult, Data, Journal } from '../types/tiData.types';
import { EntityType } from '../shared/entity-type.enum';
import { IconType } from '../shared/icon-type.enum';
import { ButtonType } from '../shared/button-type.enum';

export const DEFAULT_BUTTON_INFO = {
  ariaLabel: '',
  buttonText: '',
  url: '',
  icon: '',
  color: '',
};

@Injectable({
  providedIn: 'root',
})
export class ButtonInfoService {
  constructor(
    private apiService: ApiService,
    private searchEntityService: SearchEntityService,
    private unpaywallService: UnpaywallService
  ) {}

  getButtonInfo(entity: SearchEntity): Observable<ButtonInfo> {
    const observable: Observable<ButtonInfo> = new Observable(
      (obs: Observer<ButtonInfo>) => {
        DEFAULT_BUTTON_INFO;
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

  transformRes(response: ApiResult, type: EntityType): ButtonInfo {
    const data = this.getData(response);
    const journal = this.getIncludedJournal(response);

    const displayInfo = this.displayWaterfall(response, type, data, journal);
    console.log('displayInfo', displayInfo);

    return displayInfo;
  }

  /**
   *
   * The waterfall is as follows:
   * - Retraction
   * -- EOC
   * ---- Problematic Journal
   * ------ Direct PDF link
   * -------- Article link
   * ---------- Unpaywall
   * - Browzine link check
   */
  displayWaterfall(
    tiArticleOrJournalResponse: ApiResult,
    type: EntityType,
    data: Data,
    journal: Journal | null
  ): ButtonInfo {
    const browzineWebLink = this.getBrowZineWebLink(data);
    const browzineEnabled = this.getBrowZineEnabled(type, data, journal);
    const coverImageUrl = this.getCoverImageUrl(type, data, journal);
    const defaultCoverImage = this.isDefaultCoverImage(coverImageUrl);
    const directToPDFUrl = this.getDirectToPDFUrl(type, data);
    const articleLinkUrl = this.getArticleLinkUrl(type, data);

    const articleRetractionUrl = this.getArticleRetractionUrl(type, data);
    const articleEocNoticeUrl = this.getArticleEOCNoticeUrl(type, data);
    const problematicJournalArticleNoticeUrl =
      this.getProblematicJournalArticleNoticeUrl(type, data);

    // const coverImageUrl = getCoverImageUrl(scope, data, journal);
    // const defaultCoverImage = isDefaultCoverImage(coverImageUrl);

    console.log('retractionUrl:', articleRetractionUrl);
    console.log('directToPDFUrl:', directToPDFUrl);
    console.log('articleLinkUrl:', articleLinkUrl);

    let buttonType = ButtonType.None;
    let showBrowzineButton = false;

    // Alert type buttons //
    if (
      articleRetractionUrl &&
      type === EntityType.Article &&
      this.showRetractionWatch()
    ) {
      buttonType = ButtonType.Retraction;
    } else if (
      articleEocNoticeUrl &&
      type === EntityType.Article &&
      this.showExpressionOfConcern()
    ) {
      buttonType = ButtonType.ExpressionOfConcern;
    } else if (
      problematicJournalArticleNoticeUrl &&
      type === EntityType.Article
    ) {
      buttonType = ButtonType.ProblematicJournalArticle;
    }

    // DirectToPDF
    else if (
      directToPDFUrl &&
      type === EntityType.Article &&
      this.showDirectToPDFLink()
    ) {
      buttonType = ButtonType.DirectToPDF;
    }

    // ArticleLink
    else if (
      this.showFormatChoice() &&
      articleLinkUrl &&
      type === EntityType.Article &&
      this.showDirectToPDFLink() &&
      this.showArticleLink()
    ) {
      buttonType = ButtonType.ArticleLink;
    }

    // Check unpaywall
    else if (
      tiArticleOrJournalResponse.status === 404 ||
      (type === EntityType.Article &&
        !directToPDFUrl &&
        !articleLinkUrl &&
        this.unpaywallService.getUnpaywallUsable(type, data))
    ) {
      // this.unpaywallService.unpaywallWaterfall(
      //   tiArticleOrJournalResponse,
      //   type
      // );
    }

    console.log('buttonType', buttonType);
    let buttonText = '';
    let icon = '';
    let linkUrl = '';
    let browzineButtonText = '';
    let browzineUrl = '';

    switch (buttonType) {
      case ButtonType.Retraction:
        buttonText = 'Retracted Article'; // TODO - add config: browzine.articleRetractionWatchText
        icon = IconType.ArticleAlert;
        linkUrl = articleRetractionUrl;
        break;
      case ButtonType.ExpressionOfConcern:
        buttonText = 'Expression of Concern'; // TODO - add config: browzine.articleExpressionOfConcernText
        icon = IconType.ArticleAlert;
        linkUrl = articleEocNoticeUrl;
        break;
      case ButtonType.ProblematicJournalArticle:
        buttonText = 'Problematic Journal'; // TODO - add config: browzine.problematicJournalText
        icon = IconType.ArticleAlert;
        linkUrl = problematicJournalArticleNoticeUrl;
        break;
      case ButtonType.DirectToPDF:
        buttonText = 'Download PDF'; // TODO - add config: browzine.articlePDFDownloadLinkText || browzine.primoArticlePDFDownloadLinkText
        icon = IconType.DownloadPDF;
        linkUrl = directToPDFUrl;
        break;
      case ButtonType.ArticleLink:
        buttonText = 'Read Article'; // TODO - add config: browzine.articleLinkText
        icon = IconType.ArticleLink;
        linkUrl = articleLinkUrl;
        break;
    }

    // Browzine Journal link check
    if (
      browzineWebLink &&
      browzineEnabled &&
      type === EntityType.Journal &&
      this.showJournalBrowZineWebLinkText()
    ) {
      showBrowzineButton = true;
    }

    // Browzine Article in context link check
    if (
      browzineWebLink &&
      browzineEnabled &&
      type === EntityType.Article &&
      (directToPDFUrl || articleLinkUrl) &&
      this.showArticleBrowZineWebLinkText()
    ) {
      showBrowzineButton = true;
    }

    return {
      ariaLabel: buttonText || '',
      buttonText: buttonText || '',
      color: 'sys-primary',
      entityType: type,
      icon: icon || '',
      url: linkUrl,
      browzineUrl: browzineWebLink,
      showBrowzineButton,
    };
  }

  getData(response: ApiResult) {
    let data = {};

    if (Array.isArray(response.body.data)) {
      data =
        response.body.data
          .filter(function (journal: any) {
            return journal?.browzineEnabled === true;
          })
          .pop() || [];
    } else {
      data = response.body.data;
    }

    console.log('RESPONSE::', response);
    console.log('DATA::', data);

    return data;
  }

  getIncludedJournal(response: ApiResult): Journal | null {
    let journal = null;

    if (response.body.included) {
      journal = Array.isArray(response.body.included)
        ? response.body.included[0]
        : response.body.included;
    }

    return journal;
  }

  getBrowZineWebLink(data: Data): string {
    return data?.browzineWebLink ? data.browzineWebLink : '';
  }

  getBrowZineEnabled(
    type: EntityType,
    data: Data,
    journal: Journal | null
  ): boolean {
    let browzineEnabled = false;

    if (type === EntityType.Journal) {
      if (data?.browzineEnabled) {
        browzineEnabled = data.browzineEnabled;
      }
    }

    if (type === EntityType.Article) {
      if (journal?.browzineEnabled) {
        browzineEnabled = journal.browzineEnabled;
      }
    }

    return browzineEnabled;
  }

  getDirectToPDFUrl(type: EntityType, data: Data): string {
    let directToPDFUrl = '';

    if (type === EntityType.Article) {
      if (data?.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  }

  getArticleLinkUrl(type: EntityType, data: Data): string {
    let articleLinkUrl = '';

    if (type === EntityType.Article) {
      if (data && data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  }

  getCoverImageUrl(
    type: EntityType,
    data: Data,
    journal: Journal | null
  ): string {
    let coverImageUrl = '';

    if (type === EntityType.Journal) {
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

  isDefaultCoverImage(coverImageUrl: string): boolean {
    return !!(
      coverImageUrl && coverImageUrl.toLowerCase().indexOf('default') > -1
    );
  }

  getArticleRetractionUrl(type: EntityType, data: Data): string {
    let articleRetractionUrl = '';

    if (type === EntityType.Article) {
      if (data && data.retractionNoticeUrl) {
        articleRetractionUrl = data.retractionNoticeUrl;
      }
    }

    return articleRetractionUrl;
  }

  getArticleEOCNoticeUrl(type: EntityType, data: Data): string {
    let articleEocNoticeUrl = '';

    if (type === EntityType.Article) {
      if (data && data.expressionOfConcernNoticeUrl) {
        articleEocNoticeUrl = data.expressionOfConcernNoticeUrl;
      }
    }
    return articleEocNoticeUrl;
  }

  getProblematicJournalArticleNoticeUrl(type: EntityType, data: Data): string {
    let problematicJournalArticleNoticeUrl = '';

    if (type === EntityType.Article) {
      if (data && data.problematicJournalArticleNoticeUrl) {
        problematicJournalArticleNoticeUrl =
          data.problematicJournalArticleNoticeUrl;
      }
    }
    return problematicJournalArticleNoticeUrl;
  }

  // TODO - load from config //
  // MOVE TO primo-config.service ?? //
  showDirectToPDFLink(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // var config = browzine.articlePDFDownloadLinkEnabled;
    // var prefixConfig = browzine.primoArticlePDFDownloadLinkEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    // if (
    //   typeof prefixConfig !== "undefined" &&
    //   prefixConfig !== null &&
    //   prefixConfig === false
    // ) {
    //   featureEnabled = false;
    // }

    return featureEnabled;
  }

  showArticleLink(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleLinkEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load from config //
  showFormatChoice(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // var config = browzine.showFormatChoice;

    // if (config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load from config //
  showRetractionWatch(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleRetractionWatchEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  showExpressionOfConcern(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleExpressionOfConcernEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  showJournalBrowZineWebLinkText() {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.journalBrowZineWebLinkTextEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  showArticleBrowZineWebLinkText() {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleBrowZineWebLinkTextEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }
}
