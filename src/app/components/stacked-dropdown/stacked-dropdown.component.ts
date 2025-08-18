import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CombinedLink } from 'src/app/types/primoViewModel.types';
import { StackedButtonComponent } from './components/stacked-button.component';
import { MainButtonComponent } from '../main-button/main-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { ArticleLinkButtonComponent } from '../article-link-button/article-link-button.component';

@Component({
  selector: 'stacked-dropdown',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    StackedButtonComponent,
    MainButtonComponent,
    ArticleLinkButtonComponent,
  ],
  templateUrl: './stacked-dropdown.component.html',
  styleUrls: ['../../third-iron-module/mat-select-overrides.scss'],
  encapsulation: ViewEncapsulation.None, // override styles are loaded globally from third-iron-module/mat-select-overrides.scss
})
export class StackedDropdownComponent {
  ButtonType = ButtonType;
  combinedLinks = input.required<CombinedLink[]>();
}
