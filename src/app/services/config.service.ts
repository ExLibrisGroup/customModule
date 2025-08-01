import { Injectable, Inject } from '@angular/core';
import { ViewOptionType } from '../shared/view-option.enum';

/**
 * This Service is responsible for getting config values from the corresponding
 * configuration dataset associated with the account.
 */

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(@Inject('MODULE_PARAMETERS') public moduleParameters: any) {}

  private getBooleanParam(paramName: string): boolean {
    try {
      const parsedValue = JSON.parse(this.moduleParameters[paramName]);
      return parsedValue === true;
    } catch {
      return false;
    }
  }

  getIsUnpaywallEnabled(): boolean {
    return (
      this.getBooleanParam('articlePDFDownloadViaUnpaywallEnabled') ||
      this.getBooleanParam('articleLinkViaUnpaywallEnabled') ||
      this.getBooleanParam('articleAcceptedManuscriptPDFViaUnpaywallEnabled') ||
      this.getBooleanParam(
        'articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled'
      )
    );
  }
  showDirectToPDFLink(): boolean {
    return this.getBooleanParam('articlePDFDownloadLinkEnabled');
  }

  showArticleLink(): boolean {
    return this.getBooleanParam('articleLinkEnabled');
  }

  showFormatChoice(): boolean {
    return this.getBooleanParam('showFormatChoice');
  }

  showRetractionWatch(): boolean {
    return this.getBooleanParam('articleRetractionWatchEnabled');
  }

  showExpressionOfConcern(): boolean {
    return this.getBooleanParam('articleExpressionOfConcernEnabled');
  }

  showUnpaywallDirectToPDFLink(): boolean {
    return this.getBooleanParam('articlePDFDownloadViaUnpaywallEnabled');
  }

  showUnpaywallArticleLink(): boolean {
    return this.getBooleanParam('articleLinkViaUnpaywallEnabled');
  }

  showUnpaywallManuscriptPDFLink(): boolean {
    return this.getBooleanParam(
      'articleAcceptedManuscriptPDFViaUnpaywallEnabled'
    );
  }

  showUnpaywallManuscriptArticleLink(): boolean {
    return this.getBooleanParam(
      'articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled'
    );
  }

  showJournalBrowZineWebLinkText() {
    return this.getBooleanParam('journalBrowZineWebLinkTextEnabled');
  }

  showArticleBrowZineWebLinkText() {
    return this.getBooleanParam('articleBrowZineWebLinkTextEnabled');
  }

  showJournalCoverImages() {
    return this.getBooleanParam('journalCoverImagesEnabled');
  }

  showDocumentDeliveryFulfillment() {
    return this.getBooleanParam('documentDeliveryFulfillmentEnabled');
  }

  showLinkResolverLink() {
    return this.getBooleanParam('showLinkResolverLink');
  }

  getApiUrl(): string {
    const libraryId = this.moduleParameters.libraryId;
    return `https://public-api.thirdiron.com/public/v1/libraries/${libraryId}`;
  }

  getApiKey(): string {
    return this.moduleParameters.apiKey;
  }

  getEmailAddressKey(): string {
    return this.moduleParameters.unpaywallEmailAddressKey;
  }

  getViewOption(): ViewOptionType {
    const viewOption = this.moduleParameters.viewOption;
    return Object.values(ViewOptionType).includes(viewOption)
      ? viewOption
      : ViewOptionType.NoStack;
  }
}
