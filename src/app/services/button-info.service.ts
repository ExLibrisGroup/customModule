import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of } from 'rxjs';
import { HttpService } from './http.service';
import { SearchEntityService } from './search-entity.service';
import { UnpaywallService } from './unpaywall.service';
import { ConfigService } from './config.service';
import { SearchEntity } from '../types/searchEntity.types';
import { DisplayWaterfallResponse } from '../types/displayWaterfallResponse.types';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';
import { EntityType } from '../shared/entity-type.enum';
import { ButtonType } from '../shared/button-type.enum';
import { CombinedLink, OnlineLink } from '../types/primoViewModel.types';
import { PrimoViewModel } from '../types/primoViewModel.types';
import { TranslationService } from './translation.service';

export const DEFAULT_DISPLAY_WATERFALL_RESPONSE = {
  entityType: EntityType.Unknown,
  mainButtonType: ButtonType.None,
  mainUrl: '',
  secondaryUrl: '',
  showSecondaryButton: false,
  showBrowzineButton: false,
};

/**
 * This Service is responsible for initiating the call to Third Iron article/journal endpoints
 * and processing the response through our 'display waterfall' to determine what type of button
 * we will display
 */
@Injectable({
  providedIn: 'root',
})
export class ButtonInfoService {
  constructor(
    private httpService: HttpService,
    private searchEntityService: SearchEntityService,
    private unpaywallService: UnpaywallService,
    private configService: ConfigService,
    private translationService: TranslationService
  ) {}

  getDisplayInfo(entity: SearchEntity): Observable<DisplayWaterfallResponse> {
    const entityType = this.searchEntityService.getEntityType(entity);

    // make API call for article or journal
    if (entityType) {
      if (entityType === EntityType.Article) {
        const doi = this.searchEntityService.getDoi(entity);
        return this.httpService.getArticle(doi).pipe(
          // first, pass article response into display waterfall to get display object
          map((articleResponse): { response: ApiResult; displayInfo: DisplayWaterfallResponse } =>
            this.displayWaterfall(articleResponse, entityType)
          ),
          // second, the result of map above is passed into mergeMap, and based on displayInfo object, determine if we need to fallback to Unpaywall
          mergeMap(
            ({ response: articleRes, displayInfo }): Observable<DisplayWaterfallResponse> =>
              this.shouldMakeUnpaywallCall(articleRes, entityType, displayInfo.mainButtonType) &&
              doi
                ? // fallback to Unpaywall
                  this.makeUnpaywallCall(articleRes, displayInfo, doi)
                : // no fallback, just return displayInfo from display waterfall
                  of(displayInfo)
          )
        );
      }
      if (entityType === EntityType.Journal) {
        const issn = this.searchEntityService.getIssn(entity);
        return this.httpService.getJournal(issn).pipe(
          map(journalResponse => {
            const waterfallResponse = this.displayWaterfall(journalResponse, entityType);
            return waterfallResponse.displayInfo;
          })
        );
      }
      // if not article or journal, just return empty button info
      // 'of' creates an Observable from the given value
      return of(DEFAULT_DISPLAY_WATERFALL_RESPONSE);
    } else {
      return of(DEFAULT_DISPLAY_WATERFALL_RESPONSE);
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
   *
   * Note: live Unpaywall has a separate waterfall in unpaywall.service.ts - that waterfall
   *       comes into play if we don't find button info from the base article/journal API call
   */
  displayWaterfall(
    response: ApiResult,
    type: EntityType
  ): { response: ApiResult; displayInfo: DisplayWaterfallResponse } {
    const data = this.httpService.getData(response);
    const journal = this.httpService.getIncludedJournal(response);
    const defaultReturn = {
      response,
      displayInfo: DEFAULT_DISPLAY_WATERFALL_RESPONSE,
    };

    // If our response object data isn't an Article and isn't a Journal,
    // we can't proceed, so return the default empty button info
    if (!this.httpService.isArticle(data) && !this.httpService.isJournal(data)) {
      return defaultReturn;
    }

    const browzineWebLink = this.getBrowZineWebLink(data);
    const browzineEnabled = this.getBrowZineEnabled(type, data, journal);
    const directToPDFUrl = this.getDirectToPDFUrl(type, data);
    const articleLinkUrl = this.getArticleLinkUrl(type, data);
    const articleRetractionUrl = this.getArticleRetractionUrl(type, data);
    const articleEocNoticeUrl = this.getArticleEOCNoticeUrl(type, data);
    const problematicJournalArticleNoticeUrl = this.getProblematicJournalArticleNoticeUrl(
      type,
      data
    );
    const documentDeliveryUrl = this.getDocumentDeliveryFulfillmentUrl(type, data);

    let buttonType = ButtonType.None;
    let showBrowzineButton = false;
    let showSecondaryButton = false;
    let secondaryButtonUrl = '';
    let linkUrl = '';

    // Alert type buttons //
    if (
      articleRetractionUrl &&
      type === EntityType.Article &&
      this.configService.showRetractionWatch()
    ) {
      buttonType = ButtonType.Retraction;
      linkUrl = articleRetractionUrl;
    } else if (
      articleEocNoticeUrl &&
      type === EntityType.Article &&
      this.configService.showExpressionOfConcern()
    ) {
      buttonType = ButtonType.ExpressionOfConcern;
      linkUrl = articleEocNoticeUrl;
    } else if (problematicJournalArticleNoticeUrl && type === EntityType.Article) {
      buttonType = ButtonType.ProblematicJournalArticle;
      linkUrl = problematicJournalArticleNoticeUrl;
    }

    // DirectToPDF
    else if (
      directToPDFUrl &&
      type === EntityType.Article &&
      this.configService.showDirectToPDFLink()
    ) {
      buttonType = ButtonType.DirectToPDF;
      linkUrl = directToPDFUrl;
    }

    // ArticleLink
    else if (
      articleLinkUrl &&
      type === EntityType.Article &&
      // this.configService.showDirectToPDFLink() && // can this be removed? Think it might be a bug
      this.configService.showArticleLink()
    ) {
      buttonType = ButtonType.ArticleLink;
      linkUrl = articleLinkUrl;
    }

    // DocumentDelivery
    else if (
      documentDeliveryUrl &&
      type === EntityType.Article &&
      this.configService.showDocumentDeliveryFulfillment()
    ) {
      buttonType = ButtonType.DocumentDelivery;
      linkUrl = documentDeliveryUrl;
    }

    // Secondary button
    if (
      !this.isAlertButton(buttonType) &&
      buttonType !== ButtonType.ArticleLink &&
      this.configService.showFormatChoice() &&
      articleLinkUrl &&
      articleLinkUrl !== ''
    ) {
      // If we don't have an alert type button and we aren't already going to
      // display an Article Link button, then
      // we want to show Article Link button AND Download PDF button
      showSecondaryButton = true;
      secondaryButtonUrl = articleLinkUrl;
    }

    // Browzine Journal link check
    if (
      type === EntityType.Journal &&
      browzineWebLink &&
      browzineEnabled &&
      this.configService.showJournalBrowZineWebLinkText()
    ) {
      showBrowzineButton = true;
    }

    // Browzine Article in context link check
    if (
      type === EntityType.Article &&
      browzineWebLink &&
      browzineEnabled &&
      this.configService.showArticleBrowZineWebLinkText() &&
      (directToPDFUrl || articleLinkUrl)
    ) {
      showBrowzineButton = true;
    }

    // Note: live Unpaywall info could be filled in after this displayInfo object is returned (e.g. if we have a buttonType of 'None' here).
    //       See the unpaywall.service.ts file for that waterfall logic.
    const displayInfo: DisplayWaterfallResponse = {
      mainButtonType: buttonType,
      mainUrl: linkUrl,
      entityType: type,
      browzineUrl: browzineWebLink,
      secondaryUrl: secondaryButtonUrl,
      showSecondaryButton,
      showBrowzineButton,
    };
    return {
      displayInfo,
      response,
    };
  }

  buildStackOptions = (displayInfo: DisplayWaterfallResponse, viewModel: PrimoViewModel) => {
    console.log('ViewModel:', JSON.stringify(viewModel));
    const combinedLinks: CombinedLink[] = [];

    // Handle Third Iron display options
    if (
      displayInfo.entityType !== EntityType.Unknown &&
      displayInfo.mainButtonType !== ButtonType.None
    ) {
      combinedLinks.push({
        source: 'thirdIron',
        entityType: displayInfo.entityType,
        mainButtonType: displayInfo.mainButtonType,
        url: displayInfo.mainUrl,
        ariaLabel: '',
        label: '',
      });
    }

    // If we have a secondary Third Iron button,
    // add Article Link to the combinedLinks array as well
    // Note: the showFormatChoice config check is made in button-info.service.ts
    if (displayInfo.showSecondaryButton && displayInfo.secondaryUrl) {
      combinedLinks.push({
        source: 'thirdIron',
        entityType: displayInfo.entityType,
        url: displayInfo.secondaryUrl,
        showSecondaryButton: true,
      });
    }

    // TODO - for SingleStack view option, we need to add the browzine button to the combinedLinks array as well

    // Handle Primo onlineLinks (array of Link objects)
    if (
      viewModel?.onlineLinks &&
      viewModel.onlineLinks.length > 0 &&
      !this.configService.enableLinkOptimizer()
    ) {
      const primoFullDisplayHTMLText = this.translationService.getTranslatedText(
        'fulldisplay.HTML',
        'Read Online'
      );
      const primoFullDisplayPDFText = this.translationService.getTranslatedText(
        'fulldisplay.PDF',
        'Get PDF'
      );

      viewModel.onlineLinks.forEach((link: OnlineLink) => {
        combinedLinks.push({
          source: link.source,
          entityType: link.type,
          url: link.url,
          ariaLabel: link.ariaLabel || '',
          label: link.type === 'PDF' ? primoFullDisplayPDFText : primoFullDisplayHTMLText,
        });
      });
    }

    // Handle Primo directLink (string) and ariaLabel
    // This anchor tag may change! If the NDE UI site changes, we may need to update this
    const anchor = '&state=#nui.getit.service_viewit';
    if (viewModel.directLink && this.configService.showLinkResolverLink()) {
      const primoOnlineOptionsText = this.translationService.getTranslatedText(
        'nde.delivery.code.otherOnlineOptions',
        'Other online options'
      );
      const primoAvailableOnlineText = this.translationService.getTranslatedText(
        'delivery.code.fulltext',
        'Available Online'
      );

      combinedLinks.push({
        source: 'directLink',
        entityType: 'directLink',
        url: viewModel.directLink.includes('/nde')
          ? `${viewModel.directLink}${anchor}`
          : `/nde${viewModel.directLink}${anchor}`,
        ariaLabel: viewModel.ariaLabel || '',
        label: combinedLinks.length > 0 ? primoOnlineOptionsText : primoAvailableOnlineText,
      });
    }

    console.log('Online links:', combinedLinks);
    return combinedLinks;
  };

  private getBrowZineWebLink(data: ArticleData | JournalData): string {
    return data?.browzineWebLink ? data.browzineWebLink : '';
  }

  private getBrowZineEnabled(
    type: EntityType,
    data: ArticleData | JournalData,
    journal: JournalData | null
  ): boolean {
    let browzineEnabled = false;

    if (type === EntityType.Journal && this.httpService.isJournal(data)) {
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

  private getDirectToPDFUrl(type: EntityType, data: ArticleData | JournalData): string {
    let directToPDFUrl = '';

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
      if (data?.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  }

  private getArticleLinkUrl(type: EntityType, data: ArticleData | JournalData): string {
    let articleLinkUrl = '';

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
      if (data && data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  }

  private getArticleRetractionUrl(type: EntityType, data: ArticleData | JournalData): string {
    let articleRetractionUrl = '';

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
      if (data && data.retractionNoticeUrl) {
        articleRetractionUrl = data.retractionNoticeUrl;
      }
    }

    return articleRetractionUrl;
  }

  private getArticleEOCNoticeUrl(type: EntityType, data: ArticleData | JournalData): string {
    let articleEocNoticeUrl = '';

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
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

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
      if (data && data.problematicJournalArticleNoticeUrl) {
        problematicJournalArticleNoticeUrl = data.problematicJournalArticleNoticeUrl;
      }
    }
    return problematicJournalArticleNoticeUrl;
  }

  private getDocumentDeliveryFulfillmentUrl(
    type: EntityType,
    data: ArticleData | JournalData
  ): string {
    let documentDeliveryUrl = '';

    if (type === EntityType.Article && this.httpService.isArticle(data)) {
      if (data && data.documentDeliveryFulfillmentUrl) {
        documentDeliveryUrl = data.documentDeliveryFulfillmentUrl;
      }
    }
    return documentDeliveryUrl;
  }

  private shouldMakeUnpaywallCall(
    response: ApiResult,
    entityType: EntityType,
    buttonType: ButtonType
  ): boolean {
    const data = this.httpService.getData(response);

    // If we aren't dealing with an Article, don't continue with Unpaywall call
    if (!this.httpService.isArticle(data)) {
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
      (!directToPDFUrl && !articleLinkUrl && !shouldAvoidUnpaywall && isUnpaywallUsable)
    ) {
      return true;
    }
    return false;
  }

  private shouldAvoidUnpaywall(response: ApiResult) {
    if (response.hasOwnProperty('meta') && response?.meta?.hasOwnProperty('avoidUnpaywall')) {
      return response.meta.avoidUnpaywall;
    } else {
      return false;
    }
  }

  private getUnpaywallUsable(type: EntityType, data: ArticleData | JournalData) {
    if (type !== EntityType.Article || this.httpService.isJournal(data)) {
      return false;
    }
    if (!data || (this.httpService.isArticle(data) && !data.hasOwnProperty('unpaywallUsable'))) {
      return true;
    }
    return data.unpaywallUsable;
  }

  private isUnpaywallEnabled() {
    return this.configService.getIsUnpaywallEnabled();
  }

  private makeUnpaywallCall(
    articleResponse: ApiResult,
    displayInfo: DisplayWaterfallResponse,
    doi: string
  ): Observable<DisplayWaterfallResponse> {
    return this.httpService.getUnpaywall(doi).pipe(
      map(unpaywallRes => {
        const data = this.httpService.getData(articleResponse);
        const avoidUnpaywallPublisherLinks = !!(
          this.httpService.isArticle(data) && data?.avoidUnpaywallPublisherLinks
        );

        const unpaywallButtonInfo = this.unpaywallService.unpaywallWaterfall(
          unpaywallRes,
          avoidUnpaywallPublisherLinks
        );

        if (unpaywallButtonInfo.mainUrl && unpaywallButtonInfo.mainUrl !== '') {
          return unpaywallButtonInfo;
        } else {
          // original display info from Article Response
          return displayInfo;
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
}
