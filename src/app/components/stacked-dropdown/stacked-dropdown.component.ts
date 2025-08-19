import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CombinedLink } from 'src/app/types/primoViewModel.types';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { StackedButtonComponent } from './components/stacked-button.component';
import { MainButtonComponent } from '../main-button/main-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { ArticleLinkButtonComponent } from '../article-link-button/article-link-button.component';
import { BrowzineButtonComponent } from '../browzine-button/browzine-button.component';

@Component({
  selector: 'stacked-dropdown',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    StackedButtonComponent,
    MainButtonComponent,
    ArticleLinkButtonComponent,
    BrowzineButtonComponent,
  ],
  templateUrl: './stacked-dropdown.component.html',
  styleUrls: ['../../third-iron-module/mat-select-overrides.scss'],
  encapsulation: ViewEncapsulation.None, // override styles are loaded globally from third-iron-module/mat-select-overrides.scss
})
export class StackedDropdownComponent {
  ButtonType = ButtonType;
  EntityType = EntityType;
  combinedLinks = input.required<CombinedLink[]>();

  toEntityType(value: unknown): EntityType {
    // Accept enum values or string literals and coerce to EntityType
    if (value === EntityType.Article || value === 'Article') {
      return EntityType.Article;
    }
    if (value === EntityType.Journal || value === 'Journal') {
      return EntityType.Journal;
    }
    // Default to Article when ambiguous (only used for BrowZine context)
    return EntityType.Article;
  }
}
