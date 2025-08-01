import { Component, effect, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  buttonText: string = '';
  EntityTypeEnum = EntityType;
  IconType = IconType;

  constructor(private translate: TranslateService) {
    effect(() => {
      this.buttonText = this.getButtonText();
    });
  }

  private getButtonText(): string {
    const articleLinkText = this.translate.instant('LibKey.articleLinkText');
    return articleLinkText && articleLinkText !== 'LibKey.articleLinkText'
      ? articleLinkText
      : 'Read Article';
  }
}
