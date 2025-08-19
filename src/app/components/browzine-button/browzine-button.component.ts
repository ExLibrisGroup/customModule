import { Component, computed, input } from '@angular/core';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { TranslationService } from '../../services/translation.service';
import { CombinedLink } from 'src/app/types/primoViewModel.types';
import { StackedButtonComponent } from '../stacked-dropdown/components/stacked-button.component';

@Component({
  selector: 'custom-browzine-button',
  standalone: true,
  imports: [BaseButtonComponent, StackedButtonComponent],
  templateUrl: './browzine-button.component.html',
  styleUrl: './browzine-button.component.scss',
})
export class BrowzineButtonComponent {
  url = input.required<string>();
  entityType = input.required<EntityType>();
  stack = input<boolean>(false);
  stackType = input<'main' | 'dropdown'>('dropdown');
  link = input<CombinedLink>({
    entityType: EntityType.Unknown,
    url: '',
    label: '',
  });

  EntityType = EntityType;
  IconType = IconType;

  buttonText = computed<string>(() => this.getButtonText(this.entityType()));

  updatedLink = computed(() => {
    const originalLink = this.link();
    const label = this.buttonText() || originalLink.label;
    return {
      ...originalLink,
      label,
      icon: IconType.BrowZine,
      source: originalLink.source ?? 'thirdIron',
    };
  });

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
