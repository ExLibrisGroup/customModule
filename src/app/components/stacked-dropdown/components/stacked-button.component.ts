import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CombinedLink } from 'src/app/types/primoViewModel.types';
import { PrimoPdfIconComponent } from '../../icons/primo-pdf-icon.component';
import { PrimoHtmlIconComponent } from '../../icons/primo-html-icon.component';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';

@Component({
  selector: 'stacked-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    PrimoPdfIconComponent,
    PrimoHtmlIconComponent,
    SvgIconComponent,
  ],
  templateUrl: './stacked-button.component.html',
  encapsulation: ViewEncapsulation.None, // override styles are loaded globally from third-iron-module/mat-select-overrides.scss
})
export class StackedButtonComponent {
  link = input.required<CombinedLink>();
  stackType = input.required<'dropdown' | 'main'>();

  openLink() {
    if (this.link() && this.link().url) {
      const target = this.link().source === 'directLink' ? '_self' : '_blank';
      window.open(this.link().url, target);
    }
  }
}
