import { Component, effect, input } from '@angular/core';
import { DisplayWaterfallResponse } from 'src/app/types/displayWaterfallResponse.types';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
  selector: 'article-link-button',
  standalone: true,
  imports: [BaseButtonComponent],
  templateUrl: './article-link-button.component.html',
  styleUrl: './article-link-button.component.scss',
})
export class ArticleLinkButtonComponent {
  url = input.required<string>();
  entityType = input.required<EntityType>();

  buttonText: string = '';
  EntityTypeEnum = EntityType;
  IconType = IconType;

  constructor() {
    effect(() => {
      this.buttonText = 'Read Article'; // TODO - add config: browzine.articleLinkText
    });
  }
}
