import { Injectable, Inject } from '@angular/core';

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
      return JSON.parse(this.moduleParameters[paramName]);
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
    const result = this.getBooleanParam('articlePDFDownloadLinkEnabled');
    console.log('showDirectToPDFLink:', result);
    return result;
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
    const result = this.getBooleanParam('articleBrowZineWebLinkTextEnabled');
    console.log('showArticleBrowZineWebLinkText:', result);
    return result;
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
    return this.moduleParameters.apiUrl;
  }

  getApiKey(): string {
    return this.moduleParameters.apiKey;
  }

  getEmailAddressKey(): string {
    return this.moduleParameters.unpaywallEmailAddressKey;
  }
}
