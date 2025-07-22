import { Injectable, Inject } from '@angular/core';
// import {LookupService}

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

  // TODO - load config values from LookupService //
  showDirectToPDFLink(): boolean {
    let featureEnabled = false;
    // TODO - load from LookupService:
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

  // TODO - load config values from LookupService //
  showRetractionWatch(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleRetractionWatchEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showExpressionOfConcern(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleExpressionOfConcernEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showJournalBrowZineWebLinkText() {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.journalBrowZineWebLinkTextEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showArticleBrowZineWebLinkText() {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleBrowZineWebLinkTextEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showDocumentDeliveryFulfillment() {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.documentDeliveryFulfillmentEnabled;

    // if (typeof config === 'undefined' || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showLinkResolverLink() {
    let featureEnabled = false;
    // let config = browzine.showLinkResolverLink;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }
}
