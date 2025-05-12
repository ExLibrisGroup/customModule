import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchEntityService } from './search-entity.service';
import { UnpaywallService } from './unpaywall.service';
import { SearchEntity } from '../types/searchEntity.types';
import { ButtonInfo } from '../types/buttonInfo.types';
import { firstValueFrom, map, mergeMap, Observable, Observer } from 'rxjs';
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
    const observable: Observable<ButtonInfo> = new Observable(
      (obs: Observer<ButtonInfo>) => {
        DEFAULT_BUTTON_INFO;
      }
    );
    const entityType = this.searchEntityService.getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        const doi = this.searchEntityService.getDoi(entity);
        return this.apiService.getArticle(doi).pipe(
          mergeMap((res): Observable<ButtonInfo> => {
            // return this.displayWaterfall(res, entityType);

            const buttonInfo = this.displayWaterfall(res, entityType);

            console.log('getButtonInfo:::', buttonInfo);

            const data = this.apiService.getData(res);
            const avoidUnpaywallPublisherLinks = !!(
              this.apiService.isArticle(data) &&
              data?.avoidUnpaywallPublisherLinks
            );

            // Possibly make Unpaywall call
            if (
              this.shouldMakeUnpaywallCall(
                res,
                entityType,
                buttonInfo.buttonType
              ) &&
              doi
            ) {
              return this.apiService.getUnpaywall(doi).pipe(
                map((unpaywallRes) => {
                  const unpaywallButtonInfo =
                    this.unpaywallService.unpaywallWaterfall(
                      unpaywallRes,
                      avoidUnpaywallPublisherLinks
                    );

                  console.log('unpaywallButtonInfo:::', unpaywallButtonInfo);

                  if (
                    unpaywallButtonInfo.url &&
                    unpaywallButtonInfo.url !== ''
                  ) {
                    return unpaywallButtonInfo;
                  } else {
                    return buttonInfo;
                  }
                })
              );
            }

            const buttonInfo$: Observable<ButtonInfo> = new Observable(
              (obs: Observer<ButtonInfo>) => {
                buttonInfo;
              }
            );

            console.log('getButtonInfo returning:::', buttonInfo$);
            return buttonInfo$;
          })
        );
      }
      if (entityType === EntityType.Journal) {
        const issn = this.searchEntityService.getIssn(entity);
        return this.apiService
          .getJournal(issn)
          .pipe(map((res) => this.displayWaterfall(res, entityType)));
      }
      // if not article or journal, just return empty button info
      return observable;
    } else {
      return observable;
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
  displayWaterfall(response: ApiResult, type: EntityType): ButtonInfo {
    // console.log(':::displayWaterfall API Response:::', response);
    const data = this.apiService.getData(response);
    const journal = this.apiService.getIncludedJournal(response);

    // If our response object data isn't an Article and isn't a Journal,
    // we can't proceed, so return the default empty button info
    if (!this.apiService.isArticle(data) && !this.apiService.isJournal(data)) {
      return DEFAULT_BUTTON_INFO;
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

    // console.log('***browzineWebLink', browzineWebLink);
    // console.log('***browzineEnabled', browzineEnabled);
    // console.log('***showBrowzineButton', showBrowzineButton);
    // console.log('***type', type);
    // console.log('***directToPDFUrl', directToPDFUrl);
    // console.log('***ButtonType', buttonType);
    // console.log('***linkUrl', linkUrl);

    return {
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
  }

  getBrowZineWebLink(data: ArticleData | JournalData): string {
    return data?.browzineWebLink ? data.browzineWebLink : '';
  }

  getBrowZineEnabled(
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

  getDirectToPDFUrl(type: EntityType, data: ArticleData | JournalData): string {
    let directToPDFUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data?.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  }

  getArticleLinkUrl(type: EntityType, data: ArticleData | JournalData): string {
    let articleLinkUrl = '';

    if (type === EntityType.Article && this.apiService.isArticle(data)) {
      if (data && data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  }

  getArticleRetractionUrl(
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

  getArticleEOCNoticeUrl(
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

  getProblematicJournalArticleNoticeUrl(
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
