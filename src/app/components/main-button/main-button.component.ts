import { Component, effect, input } from '@angular/core';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';

@Component({
  selector: 'main-button',
  standalone: true,
  imports: [BaseButtonComponent],
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.scss',
})
export class MainButtonComponent {
  url = input.required<string>();
  buttonType = input.required<ButtonType>();

  buttonText: string = '';
  buttonIcon: string = '';
  IconType = IconType;

  constructor() {
    effect(() => {
      this.buttonText = this.getButtonText(this.buttonType());
      this.buttonIcon = this.getButtonIcon(this.buttonType());
    });
  }

  onClick(event: MouseEvent) {
    // We’ve seen some discovery services intercept basic a href links, and have
    // been encouraged to intercept clicks more closely. We should continue
    // intercepting clicks like this unless we hear feedback from discovery
    // service vendors that this is no longer desired or necessary.
    event.preventDefault();
    event.stopPropagation();

    window.open(this.url(), '_blank');

    return false;
  }

  getButtonText(buttonType: ButtonType): string {
    let text = '';
    switch (buttonType) {
      case ButtonType.Retraction:
        text = 'Retracted Article'; // TODO - add config: browzine.articleRetractionWatchText;
        break;
      case ButtonType.ExpressionOfConcern:
        text = 'Expression of Concern'; // TODO - add config: browzine.articleExpressionOfConcernText
        break;
      case ButtonType.ProblematicJournalArticle:
        text = 'Problematic Journal'; // TODO - add config: browzine.problematicJournalText
        break;
      case ButtonType.DirectToPDF:
        text = 'Download PDF'; // TODO - add config: browzine.articlePDFDownloadLinkText || browzine.primoArticlePDFDownloadLinkText
        break;
      case ButtonType.ArticleLink:
        text = 'Read Article'; // TODO - add config: browzine.articleLinkText
        break;
      case ButtonType.DocumentDelivery:
        text = 'Request PDF'; // TODO - add config: browzine.documentDeliveryFulfillmentText
        break;
      case ButtonType.UnpaywallDirectToPDF:
        text = 'Download PDF (via Unpaywall)'; // TODO load config: && browzine.articlePDFDownloadViaUnpaywallText
        break;
      case ButtonType.UnpaywallArticleLink:
        text = 'Read Article (via Unpaywall)'; // TODO - add config: browzine.articleLinkViaUnpaywallText
        break;
      case ButtonType.UnpaywallManuscriptPDF:
        text = 'Download PDF (Accepted Manuscript via Unpaywall)'; // TODO - add config: browzine.articleAcceptedManuscriptPDFViaUnpaywallText
        break;
      case ButtonType.UnpaywallManuscriptLink:
        text = 'Read Article (Accepted Manuscript via Unpaywall)'; // TODO - add config: browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText
        break;
    }

    return text;
  }

  getButtonIcon(buttonType: ButtonType): string {
    let icon = '';
    switch (buttonType) {
      case ButtonType.Retraction:
        icon = IconType.ArticleAlert;
        break;
      case ButtonType.ExpressionOfConcern:
        icon = IconType.ArticleAlert;
        break;
      case ButtonType.ProblematicJournalArticle:
        icon = IconType.ArticleAlert;
        break;
      case ButtonType.DirectToPDF:
        icon = IconType.DownloadPDF;
        break;
      case ButtonType.ArticleLink:
        icon = IconType.ArticleLink;
        break;
      case ButtonType.DocumentDelivery:
        icon = IconType.DownloadPDF;
        break;
      case ButtonType.UnpaywallDirectToPDF:
        icon = IconType.DownloadPDF;
        break;
      case ButtonType.UnpaywallArticleLink:
        icon = IconType.ArticleLink;
        break;
      case ButtonType.UnpaywallManuscriptPDF:
        icon = IconType.DownloadPDF;
        break;
      case ButtonType.UnpaywallManuscriptLink:
        icon = IconType.ArticleLink;
        break;
    }

    return icon;
  }
}
