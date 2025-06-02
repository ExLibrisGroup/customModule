import { Injectable } from '@angular/core';
// import {LookupService}

/**
 * This Service is responsible for getting config values from the corresponding
 * configuration dataset associated with the account.
 */

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {} //private lookupService: LookupService

  // TODO - load config values from LookupService //
  showDirectToPDFLink(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // TODO - load from LookupService:
    // const config = this.lookupService.getModuleParam('articlePDFDownloadLinkEnabled')
    // const prefixConfig = this.lookupService.getModuleParam('primoArticlePDFDownloadLinkEnabled')

    //// - old way -
    // var config = browzine.articlePDFDownloadLinkEnabled;
    // var prefixConfig = browzine.primoArticlePDFDownloadLinkEnabled;
    ////

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

  // TODO - load config values from LookupService //
  showArticleLink(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // let config = browzine.articleLinkEnabled;

    // if (typeof config === "undefined" || config === null || config === true) {
    //   featureEnabled = true;
    // }

    return featureEnabled;
  }

  // TODO - load config values from LookupService //
  showFormatChoice(): boolean {
    let featureEnabled = true; // set back to false once implemented
    // var config = browzine.showFormatChoice;

    // if (config === true) {
    //   featureEnabled = true;
    // }

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
}
