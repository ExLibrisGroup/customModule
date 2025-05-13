import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchEntityService } from './search-entity.service';
import { UnpaywallService } from './unpaywall.service';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { map, mergeMap, Observable, of } from 'rxjs';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';
import { EntityType } from '../shared/entity-type.enum';
import { IconType } from '../shared/icon-type.enum';
import { ButtonType } from '../shared/button-type.enum';
import { UnpaywallResponse } from '../types/unpaywall.types';

export const DEFAULT_BUTTON_INFO = {
  ariaLabel: '',
  buttonText: '',
  buttonType: ButtonType.None,
  color: '',
  entityType: EntityType.Unknown,
  icon: '',
  url: '',
  showBrowzineButton: false,
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
    const entityType = this.searchEntityService.getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        const doi = this.searchEntityService.getDoi(entity);
        return this.apiService.getArticle(doi).pipe(
          // pass article response into display waterfall to get buttonInfo object
          map(
            (
              articleResponse
            ): { articleResponse: ApiResult; buttonInfo: ButtonInfo } =>
              this.displayWaterfall(articleResponse, entityType)
          ),
          // based on buttonInfo object, determine if we need to fallback to Unpaywall
          mergeMap(
            ({ articleResponse, buttonInfo }): Observable<ButtonInfo> =>
              this.shouldMakeUnpaywallCall(
                articleResponse,
                entityType,
                buttonInfo.buttonType
              ) && doi
                ? // fallback to Unpaywall
                  this.makeUnpaywallCall(articleResponse, buttonInfo, doi)
                : // no fallback, just return buttonInfo from display waterfall
                  of(buttonInfo)
          )
        );
      }
      if (entityType === EntityType.Journal) {
        const issn = this.searchEntityService.getIssn(entity);
        return this.apiService.getJournal(issn).pipe(
          map((journalResponse) => {
            const waterfallResponse = this.displayWaterfall(
              journalResponse,
              entityType
            );
            return waterfallResponse.buttonInfo;
          })
        );
      }
      // if not article or journal, just return empty button info
      // 'of' creates an Observable from the given value
      return of(DEFAULT_BUTTON_INFO);
    } else {
      return of(DEFAULT_BUTTON_INFO);
    }
  }

  /**
   *
   * The waterfall is as follows:
   * - Retraction
   * -- EOC
   * ---- Problematic Journal
   * ------ Direct PDF link
   * -------- Article link
   * - Browzine link check
   */
  private displayWaterfall(
    response: ApiResult,
    type: EntityType
  ): { articleResponse: ApiResult; buttonInfo: ButtonInfo } {
    const data = this.apiService.getData(response);
    const journal = this.apiService.getIncludedJournal(response);
    const defaultReturn = {
      articleResponse: response,
      buttonInfo: DEFAULT_BUTTON_INFO,
    };

    // If our response object data isn't an Article and isn't a Journal,
    // we can't proceed, so return the default empty button info
    if (!this.apiService.isArticle(data) && !this.apiService.isJournal(data)) {
      return defaultReturn;
    }

    const browzineWebLink = this.getBrowZineWebLink(data);
    const browzineEnabled = this.getBrowZineEnabled(type, data, journal);
    const directToPDFUrl = this.getDirectToPDFUrl(type, data);
    const articleLinkUrl = this.getArticleLinkUrl(type, data);
    const articleRetractionUrl = this.getArticleRetractionUrl(type, data);
    const articleEocNoticeUrl = this.getArticleEOCNoticeUrl(type, data);
    const problematicJournalArticleNoticeUrl =
      this.getProblematicJournalArticleNoticeUrl(type, data);

    let buttonType = ButtonType.None;
    let showBrowzineButton = false;
    let buttonText = '';
    let icon = '';
    let linkUrl = '';

    // Alert type buttons //
    if (
      articleRetractionUrl &&
      type === EntityType.Article &&
      this.showRetractionWatch()
    ) {
      buttonType = ButtonType.Retraction;
      buttonText = 'Retracted Article'; // TODO - add config: browzine.articleRetractionWatchText
      icon = IconType.ArticleAlert;
      linkUrl = articleRetractionUrl;
    } else if (
      articleEocNoticeUrl &&
      type === EntityType.Article &&
      this.showExpressionOfConcern()
    ) {
      buttonType = ButtonType.ExpressionOfConcern;
      buttonText = 'Expression of Concern'; // TODO - add config: browzine.articleExpressionOfConcernText
      icon = IconType.ArticleAlert;
      linkUrl = articleEocNoticeUrl;
    } else if (
      problematicJournalArticleNoticeUrl &&
      type === EntityType.Article
    ) {
      buttonType = ButtonType.ProblematicJournalArticle;
      buttonText = 'Problematic Journal'; // TODO - add config: browzine.problematicJournalText
      icon = IconType.ArticleAlert;
      linkUrl = problematicJournalArticleNoticeUrl;
    }

    // DirectToPDF
    else if (
      directToPDFUrl &&
      type === EntityType.Article &&
      this.showDirectToPDFLink()
    ) {
      buttonType = ButtonType.DirectToPDF;
      buttonText = 'Download PDF'; // TODO - add config: browzine.articlePDFDownloadLinkText || browzine.primoArticlePDFDownloadLinkText
      icon = IconType.DownloadPDF;
      linkUrl = directToPDFUrl;
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
      buttonText = 'Read Article'; // TODO - add config: browzine.articleLinkText
      icon = IconType.ArticleLink;
      linkUrl = articleLinkUrl;
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

    // console.log('***ButtonType', buttonType);
    // console.log('***linkUrl', linkUrl);

    const buttonInfo = {
      ariaLabel: buttonText || '',
      buttonText: buttonText || '',
      buttonType,
      color: 'sys-primary',
      entityType: type,
      icon: icon || '',
      url: linkUrl,
      browzineUrl: browzineWebLink,
      showBrowzineButton,
    };
    return {
      buttonInfo,
      articleResponse: response,
    };
  }

  private getBrowZineWebLink(data: ArticleData | JournalData): string {
    return data?.browzineWebLink ? data.browzineWebLink : '';
  }

  private getBrowZineEnabled(
    type: EntityType,
    data: ArticleData | JournalData,
    journal: JournalData | null
  ): boolean {
    let browzineEnabled = false;

    if (type === EntityType.Journal && this.apiService.isJournal(data)) {
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

  private getDirectToPDFUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let directToPDFUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data?.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  }

  private getArticleLinkUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let articleLinkUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data && data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  }

  private getArticleRetractionUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let articleRetractionUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data && data.retractionNoticeUrl) {
        articleRetractionUrl = data.retractionNoticeUrl;
      }
    }

    return articleRetractionUrl;
  }

  private getArticleEOCNoticeUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let articleEocNoticeUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data && data.expressionOfConcernNoticeUrl) {
        articleEocNoticeUrl = data.expressionOfConcernNoticeUrl;
      }
    }
    return articleEocNoticeUrl;
  }

  private getProblematicJournalArticleNoticeUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let problematicJournalArticleNoticeUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data && data.problematicJournalArticleNoticeUrl) {
        problematicJournalArticleNoticeUrl =
          data.problematicJournalArticleNoticeUrl;
      }
    }
    return problematicJournalArticleNoticeUrl;
  }

  private shouldMakeUnpaywallCall(
    response: ApiResult,
    entityType: EntityType,
    buttonType: ButtonType
  ): boolean {
    const data = this.apiService.getData(response);

    // If we aren't dealing with an Article, don't continue with Unpaywall call
    if (!this.apiService.isArticle(data)) {
      return false;
    }

    // If unpaywall config is not enabled, don't continue with Unpaywall call
    if (!this.isUnpaywallEnabled()) {
      return false;
    }

    // if we have an alert type button (retraction, EOC, problematic journal),
    // don't continue with Unpaywall call
    if (this.isAlertButton(buttonType)) {
      return false;
    }

    const shouldAvoidUnpaywall = this.shouldAvoidUnpaywall(response);
    const isUnpaywallUsable = this.getUnpaywallUsable(entityType, data);
    const directToPDFUrl = this.getDirectToPDFUrl(entityType, data);
    const articleLinkUrl = this.getArticleLinkUrl(entityType, data);

    if (
      response.status === 404 ||
      (!directToPDFUrl &&
        !articleLinkUrl &&
        !shouldAvoidUnpaywall &&
        isUnpaywallUsable)
    ) {
      console.log('SHOULD MAKE UNPAYWALL CALL');
      return true;
    }
    console.log('DO NOT MAKE UNPAYWALL CALL');
    return false;
  }

  private shouldAvoidUnpaywall(response: ApiResult) {
    if (
      response.hasOwnProperty('meta') &&
      response?.meta?.hasOwnProperty('avoidUnpaywall')
    ) {
      return response.meta.avoidUnpaywall;
    } else {
      return false;
    }
  }

  private getUnpaywallUsable(
    type: EntityType,
    data: ArticleData | JournalData
  ) {
    if (type !== EntityType.Article || this.apiService.isJournal(data)) {
      return false;
    }
    if (
      !data ||
      (this.apiService.isArticle(data) &&
        !data.hasOwnProperty('unpaywallUsable'))
    ) {
      return true;
    }
    return data.unpaywallUsable;
  }

  private isUnpaywallEnabled() {
    return (
      // TODO - load from config
      // browzine.articlePDFDownloadViaUnpaywallEnabled ||
      // browzine.articleLinkViaUnpaywallEnabled ||
      // browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled ||
      // browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled
      true
    );
  }

  private makeUnpaywallCall(
    articleResponse: ApiResult,
    buttonInfo: ButtonInfo,
    doi: string
  ): Observable<ButtonInfo> {
    return this.apiService.getUnpaywall(doi).pipe(
      map((unpaywallRes) => {
        const data = this.apiService.getData(articleResponse);
        const avoidUnpaywallPublisherLinks = !!(
          this.apiService.isArticle(data) && data?.avoidUnpaywallPublisherLinks
        );

        const unpaywallButtonInfo = this.unpaywallService.unpaywallWaterfall(
          unpaywallRes,
          avoidUnpaywallPublisherLinks
        );

        if (unpaywallButtonInfo.url && unpaywallButtonInfo.url !== '') {
          return unpaywallButtonInfo;
        } else {
          // original button info from Article Response
          return buttonInfo;
        }
      })
    );
  }

  private isAlertButton(buttonType: ButtonType): boolean {
    let isAlertType = false;

    switch (buttonType) {
      case ButtonType.Retraction:
      case ButtonType.ExpressionOfConcern:
      case ButtonType.ProblematicJournalArticle:
        isAlertType = true;
        break;
    }

    return isAlertType;
  }

  // TODO - load from config //
  // TODO - MOVE TO primo-config.service //
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
