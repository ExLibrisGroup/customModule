import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  // TODO - load from config //
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
