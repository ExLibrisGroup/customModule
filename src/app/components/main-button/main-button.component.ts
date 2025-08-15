import { Component, effect, input, computed, signal } from '@angular/core';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { TranslationService } from '../../services/translation.service';
import { CombinedLink } from 'src/app/types/primoViewModel.types';
import { StackedButtonComponent } from '../stacked-dropdown/components/stacked-button.component';

@Component({
  selector: 'main-button',
  standalone: true,
  imports: [BaseButtonComponent, StackedButtonComponent],
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.scss',
})
export class MainButtonComponent {
  IconType = IconType;
  url = input.required<string>();
  buttonType = input.required<ButtonType>();
  stack = input<boolean>(false);
  stackType = input<'main' | 'dropdown'>('main');
  link = input<CombinedLink>({
    entityType: EntityType.Unknown,
    url: '',
    label: '',
  });

  // Derived values from inputs
  buttonText = computed<string>(() => this.getButtonText(this.buttonType()));
  buttonIcon = computed<IconType>(() => this.getButtonIcon(this.buttonType()));

  updatedLink = computed(() => {
    const originalLink = this.link();
    const computedLabel = this.buttonText() || originalLink.label;
    const defaultIcon = IconType.None;
    const computedIcon = this.buttonIcon() || originalLink.icon || defaultIcon;

    return {
      ...originalLink,
      label: computedLabel,
      icon: computedIcon,
      source: originalLink.source ?? 'thirdIron',
    };
  });

  constructor(private translationService: TranslationService) {}

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
        text = this.translationService.getTranslatedText(
          'LibKey.articleRetractionWatchText',
          'Retracted Article'
        );
        break;
      case ButtonType.ExpressionOfConcern:
        text = this.translationService.getTranslatedText(
          'LibKey.articleExpressionOfConcernText',
          'Expression of Concern'
        );
        break;
      case ButtonType.ProblematicJournalArticle:
        text = this.translationService.getTranslatedText(
          'LibKey.problematicJournalText',
          'Problematic Journal'
        );
        break;
      case ButtonType.DirectToPDF:
        text = this.translationService.getTranslatedText(
          'LibKey.articlePDFDownloadLinkText',
          'Download PDF'
        );
        break;
      case ButtonType.ArticleLink:
        text = this.translationService.getTranslatedText('LibKey.articleLinkText', 'Read Article');
        break;
      case ButtonType.DocumentDelivery:
        text = this.translationService.getTranslatedText(
          'LibKey.documentDeliveryFulfillmentText',
          'Request PDF'
        );
        break;
      case ButtonType.UnpaywallDirectToPDF:
        text = this.translationService.getTranslatedText(
          'LibKey.articlePDFDownloadViaUnpaywallText',
          'Download PDF (via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallArticleLink:
        text = this.translationService.getTranslatedText(
          'LibKey.articleLinkViaUnpaywallText',
          'Read Article (via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallManuscriptPDF:
        text = this.translationService.getTranslatedText(
          'LibKey.articleAcceptedManuscriptPDFViaUnpaywallText',
          'Download PDF (Accepted Manuscript via Unpaywall)'
        );
        break;
      case ButtonType.UnpaywallManuscriptLink:
        text = this.translationService.getTranslatedText(
          'LibKey.articleAcceptedManuscriptArticleLinkViaUnpaywallText',
          'Read Article (Accepted Manuscript via Unpaywall)'
        );
        break;
    }

    return text;
  }

  getButtonIcon(buttonType: ButtonType): IconType {
    let icon = IconType.None;
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
