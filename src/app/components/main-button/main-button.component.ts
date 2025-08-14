import { Component, effect, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private translate: TranslateService) {
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
        text = this.getTranslatedText(
          'LibKey.articleRetractionWatchText',
          'Retracted Article'
        );
        break;
      case ButtonType.ExpressionOfConcern:
        text = this.getTranslatedText(
          'LibKey.articleExpressionOfConcernText',
          'Expression of Concern'
        );
        break;
      case ButtonType.ProblematicJournalArticle:
        text = this.getTranslatedText(
          'LibKey.problematicJournalText',
          'Problematic Journal'
        );
        break;
      case ButtonType.DirectToPDF:
        text = this.getTranslatedText(
          'LibKey.articlePDFDownloadLinkText',
          'Download PDF'
        );
        break;
      case ButtonType.ArticleLink:
        text = this.getTranslatedText('LibKey.articleLinkText', 'Read Article');
        break;
      case ButtonType.DocumentDelivery:
        text = this.getTranslatedText(
          'LibKey.documentDeliveryFulfillmentText',
          'Request PDF'
        );
        break;
      case ButtonType.UnpaywallDirectToPDF:
        text = this.getTranslatedText(
          'LibKey.articlePDFDownloadViaUnpaywallText',
          'Download PDF (via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallArticleLink:
        text = this.getTranslatedText(
          'LibKey.articleLinkViaUnpaywallText',
          'Read Article (via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallManuscriptPDF:
        text = this.getTranslatedText(
          'LibKey.articleAcceptedManuscriptPDFViaUnpaywallText',
          'Download PDF (Accepted Manuscript via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallManuscriptLink:
        text = this.getTranslatedText(
          'LibKey.articleAcceptedManuscriptArticleLinkViaUnpaywallText',
          'Read Article (Accepted Manuscript via Unpaywall)'
        );
        break;
    }

    return text;
  }

  private getTranslatedText(
    translationKey: string,
    fallbackText: string
  ): string {
    const translatedText = this.translate.instant(translationKey);
    return translatedText && translatedText !== translationKey
      ? translatedText
      : fallbackText;
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
