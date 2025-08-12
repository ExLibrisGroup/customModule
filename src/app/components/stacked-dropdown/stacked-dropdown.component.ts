import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OnlineService } from 'src/app/types/primoViewModel.types';
import { PrimoPdfIconComponent } from '../icons/primo-pdf-icon.component';
import { PrimoHtmlIconComponent } from '../icons/primo-html-icon.component';

@Component({
  selector: 'stacked-dropdown',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule,
    PrimoPdfIconComponent,
    PrimoHtmlIconComponent,
  ],
  templateUrl: './stacked-dropdown.component.html',
  encapsulation: ViewEncapsulation.None, // override styles are loaded globally from third-iron-module/mat-select-overrides.scss
})
export class StackedDropdownComponent {
  onlineServices = input.required<OnlineService[]>();

  openService(service: OnlineService) {
    if (service && service.url) {
      window.open(service.url, '_blank');
    }
  }
}
