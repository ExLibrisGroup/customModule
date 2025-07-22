import { Injectable, Inject } from '@angular/core';

/**
 * This Service is responsible for getting config values from the corresponding
 * configuration dataset associated with the account.
 */

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(@Inject('MODULE_PARAMETERS') public moduleParameters: any) {
    console.log(
      'Module parameters TestBottomComponent:',
      this.moduleParameters
    );
  }

  showDirectToPDFLink(): boolean {
    let featureEnabled = false;
    const config = this.moduleParameters.articlePDFDownloadLinkEnabled;
    const prefixConfig =
      this.moduleParameters.primoArticlePDFDownloadLinkEnabled;

    console.log('showDirectToPDFLink config', config);

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    if (
      typeof prefixConfig !== 'undefined' &&
      prefixConfig !== null &&
      prefixConfig === false
    ) {
      featureEnabled = false;
    }

    return featureEnabled;
  }

  showArticleLink(): boolean {
    let featureEnabled = false;
    let config = this.moduleParameters.articleLinkEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showFormatChoice(): boolean {
    let featureEnabled = false;
    let config = this.moduleParameters.showFormatChoice;

    if (config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showRetractionWatch(): boolean {
    let featureEnabled = false;
    let config = this.moduleParameters.articleRetractionWatchEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showExpressionOfConcern(): boolean {
    let featureEnabled = false;
    let config = this.moduleParameters.articleExpressionOfConcernEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showJournalBrowZineWebLinkText() {
    let featureEnabled = false;
    let config = this.moduleParameters.journalBrowZineWebLinkTextEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showArticleBrowZineWebLinkText() {
    let featureEnabled = false;
    let config = this.moduleParameters.articleBrowZineWebLinkTextEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showDocumentDeliveryFulfillment() {
    let featureEnabled = false;
    let config = this.moduleParameters.documentDeliveryFulfillmentEnabled;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  showLinkResolverLink() {
    let featureEnabled = false;
    let config = this.moduleParameters.showLinkResolverLink;

    if (typeof config === 'undefined' || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }
}
