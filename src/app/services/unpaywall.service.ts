import { Injectable } from '@angular/core';
import { EntityType } from '../shared/entity-type.enum';
import { UnpaywallData } from '../types/unpaywall.types';
import { ButtonType } from '../shared/button-type.enum';
import { IconType } from '../shared/icon-type.enum';
import { ButtonInfo } from '../types/buttonInfo.types';
import { DEFAULT_BUTTON_INFO } from './button-info.service';

@Injectable({
  providedIn: 'root',
})
export class UnpaywallService {
  constructor() {}

  unpaywallWaterfall(
    unpaywallResponse: any,
    avoidUnpaywallPublisherLinks: boolean
  ): ButtonInfo {
    let buttonType: ButtonType = ButtonType.None;
    let unpaywallUrl = '';
    let buttonText = '';
    let icon = '';

    if (unpaywallResponse.status == 200) {
      const data: UnpaywallData = unpaywallResponse.body;

      if (
        this.shouldIgnoreUnpaywallResponse(data, avoidUnpaywallPublisherLinks)
      ) {
        return DEFAULT_BUTTON_INFO;
      }

      const unpaywallArticlePDFUrl = this.getUnpaywallArticlePDFUrl(data);
      const unpaywallArticleLinkUrl = this.getUnpaywallArticleLinkUrl(data);
      const unpaywallManuscriptArticlePDFUrl =
        this.getUnpaywallManuscriptArticlePDFUrl(data);
      const unpaywallManuscriptArticleLinkUrl =
        this.getUnpaywallManuscriptArticleLinkUrl(data);

      if (
        unpaywallArticlePDFUrl
        // TODO load config: && browzine.articlePDFDownloadViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallDirectToPDF;
        buttonText = 'Download PDF (via Unpaywall)';
        unpaywallUrl = unpaywallArticlePDFUrl;
        icon = IconType.DownloadPDF;
      } else if (
        unpaywallArticleLinkUrl
        // TODO load config: && browzine.articleLinkViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallArticleLink;
        buttonText = 'Read Article (via Unpaywall)';
        unpaywallUrl = unpaywallArticleLinkUrl;
        icon = IconType.ArticleLink;
      } else if (
        unpaywallManuscriptArticlePDFUrl
        // TODO load config: && browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallManuscriptPDF;
        buttonText = 'Download PDF (Accepted Manuscript via Unpaywall)';
        unpaywallUrl = unpaywallManuscriptArticlePDFUrl;
        icon = IconType.DownloadPDF;
      } else if (
        unpaywallManuscriptArticleLinkUrl
        // TODO load config: && browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled
      ) {
        buttonType = ButtonType.UnpaywallManuscriptLink;
        unpaywallUrl = unpaywallManuscriptArticleLinkUrl;
        buttonText = 'Read Article (Accepted Manuscript via Unpaywall)';
        icon = IconType.ArticleLink;
      }

      console.log('buttonType', buttonType);
      console.log('url', unpaywallUrl);

      return {
        ariaLabel: buttonText,
        buttonText: buttonText,
        buttonType,
        color: 'sys-primary',
        entityType: EntityType.Article,
        icon: icon,
        url: unpaywallUrl,
      };
    }
    return DEFAULT_BUTTON_INFO;
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
