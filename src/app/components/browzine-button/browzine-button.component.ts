import { Component, computed, input } from '@angular/core';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { TranslationService } from '../../services/translation.service';

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

  buttonText = computed<string>(() => this.getButtonText(this.entityType()));
  EntityType = EntityType;
  IconType = IconType;

  constructor(private translationService: TranslationService) {}

  private getButtonText(entityType: EntityType): string {
    if (entityType === EntityType.Journal) {
      return this.translationService.getTranslatedText(
        'LibKey.journalBrowZineWebLinkText',
        'View Journal Contents'
      );
    } else {
      return this.translationService.getTranslatedText(
        'LibKey.articleBrowZineWebLinkText',
        'View Issue Contents'
      );
    }
  }
}
