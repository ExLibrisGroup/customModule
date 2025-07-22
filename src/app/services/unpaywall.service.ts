import { Injectable, Inject } from '@angular/core';
import { EntityType } from '../shared/entity-type.enum';
import { UnpaywallData } from '../types/unpaywall.types';
import { ButtonType } from '../shared/button-type.enum';
import { DisplayWaterfallResponse } from '../types/displayWaterfallResponse.types';
import { DEFAULT_DISPLAY_WATERFALL_RESPONSE } from './button-info.service';

/**
 * This Service is responsible for initiating the call to the Unpaywall endpoint
 * and processing the response through our 'unpaywall waterfall' to determine
 * what type of button we will display
 */
@Injectable({
  providedIn: 'root',
})
export class UnpaywallService {
  constructor(@Inject('MODULE_PARAMETERS') public moduleParameters: any) {}

  unpaywallWaterfall(
    unpaywallResponse: any,
    avoidUnpaywallPublisherLinks: boolean
  ): DisplayWaterfallResponse {
    let buttonType: ButtonType = ButtonType.None;
    let unpaywallUrl = '';
    let entityType: EntityType = EntityType.Unknown;

    if (unpaywallResponse.status == 200) {
      const data: UnpaywallData = unpaywallResponse.body;

      if (
        this.shouldIgnoreUnpaywallResponse(data, avoidUnpaywallPublisherLinks)
      ) {
        return DEFAULT_DISPLAY_WATERFALL_RESPONSE;
      }

      const unpaywallArticlePDFUrl = this.getUnpaywallArticlePDFUrl(data);
      const unpaywallArticleLinkUrl = this.getUnpaywallArticleLinkUrl(data);
      const unpaywallManuscriptArticlePDFUrl =
        this.getUnpaywallManuscriptArticlePDFUrl(data);
      const unpaywallManuscriptArticleLinkUrl =
        this.getUnpaywallManuscriptArticleLinkUrl(data);

      if (
        unpaywallArticlePDFUrl &&
        this.moduleParameters.articlePDFDownloadViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallDirectToPDF;
        unpaywallUrl = unpaywallArticlePDFUrl;
        entityType = EntityType.Article;
      } else if (
        unpaywallArticleLinkUrl &&
        this.moduleParameters.articleLinkViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallArticleLink;
        unpaywallUrl = unpaywallArticleLinkUrl;
        entityType = EntityType.Article;
      } else if (
        unpaywallManuscriptArticlePDFUrl &&
        this.moduleParameters.articleAcceptedManuscriptPDFViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallManuscriptPDF;
        unpaywallUrl = unpaywallManuscriptArticlePDFUrl;
        entityType = EntityType.Article;
      } else if (
        unpaywallManuscriptArticleLinkUrl &&
        this.moduleParameters
          .articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallManuscriptLink;
        unpaywallUrl = unpaywallManuscriptArticleLinkUrl;
        entityType = EntityType.Article;
      }

      return {
        mainButtonType: buttonType,
        entityType: entityType,
        mainUrl: unpaywallUrl,
      };
    }
    return DEFAULT_DISPLAY_WATERFALL_RESPONSE;
  }

  private shouldIgnoreUnpaywallResponse(
    response: UnpaywallData,
    avoidUnpaywallPublisherLinks: boolean
  ): boolean {
    if (avoidUnpaywallPublisherLinks) {
      if (response.best_oa_location?.host_type === 'publisher') {
        return true;
      }
    }
    return false;
  }

  private getUnpaywallArticlePDFUrl(data: UnpaywallData) {
    var url;

    if (data.best_oa_location) {
      if (
        data.best_oa_location.host_type === 'publisher' ||
        data.best_oa_location.host_type === 'repository'
      ) {
        if (
          data.best_oa_location.version === 'publishedVersion' ||
          (this.isUnknownVersion(data) && this.isTrustedRepository(data))
        ) {
          if (data.best_oa_location.url_for_pdf) {
            url = data.best_oa_location.url_for_pdf;
          }
        }
      }
    }

    return url;
  }

  private getUnpaywallArticleLinkUrl(data: UnpaywallData) {
    var url;

    if (data.best_oa_location) {
      if (
        data.best_oa_location.host_type === 'publisher' ||
        data.best_oa_location.host_type === 'repository'
      ) {
        if (data.best_oa_location.version === 'publishedVersion') {
          if (!data.best_oa_location.url_for_pdf) {
            url = data.best_oa_location.url_for_landing_page;
          }
        }
      }
    }

    return url;
  }

  private getUnpaywallManuscriptArticlePDFUrl(data: UnpaywallData) {
    var url;

    if (data.best_oa_location) {
      if (data.best_oa_location.host_type === 'repository') {
        if (
          data.best_oa_location.version === 'acceptedVersion' ||
          (this.isUnknownVersion(data) && !this.isTrustedRepository(data))
        ) {
          if (data.best_oa_location.url_for_pdf) {
            url = data.best_oa_location.url_for_pdf;
          }
        }
      }
    }

    return url;
  }

  private getUnpaywallManuscriptArticleLinkUrl(data: UnpaywallData) {
    var url;

    if (data.best_oa_location) {
      if (data.best_oa_location.host_type === 'repository') {
        if (data.best_oa_location.version === 'acceptedVersion') {
          if (!data.best_oa_location.url_for_pdf) {
            url = data.best_oa_location.url_for_landing_page;
          }
        }
      }
    }

    return url;
  }

  private isUnknownVersion(data: UnpaywallData) {
    var validation = false;

    if (data.best_oa_location) {
      if (
        !data.best_oa_location.version ||
        data.best_oa_location.version === ''
      ) {
        validation = true;
      }
    }

    return validation;
  }

  private isTrustedRepository(data: UnpaywallData) {
    var validation = false;

    if (data.best_oa_location && data.best_oa_location.url_for_pdf) {
      if (
        data.best_oa_location.url_for_pdf.indexOf('nih.gov') > -1 ||
        data.best_oa_location.url_for_pdf.indexOf('europepmc.org') > -1
      ) {
        validation = true;
      }
    }

    return validation;
  }
}
