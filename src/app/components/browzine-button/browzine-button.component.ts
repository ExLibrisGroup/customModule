import { Component, effect, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
  selector: 'custom-browzine-button',
  standalone: true,
  imports: [BaseButtonComponent],
  templateUrl: './browzine-button.component.html',
  styleUrl: './browzine-button.component.scss',
})
export class BrowzineButtonComponent {
  url = input.required<string>();
  entityType = input.required<EntityType>();

  buttonText: string = '';
  EntityType = EntityType;
  IconType = IconType;

  constructor(private translate: TranslateService) {
    effect(() => {
      this.buttonText = this.getButtonText(this.entityType());
    });
  }

  private getButtonText(entityType: EntityType): string {
    if (entityType === EntityType.Journal) {
      return this.getTranslatedText(
        'LibKey.journalBrowZineWebLinkText',
        'View Journal Contents'
      );
    } else {
      return this.getTranslatedText(
        'LibKey.articleBrowZineWebLinkText',
        'View Issue Contents'
      );
    }
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
}
