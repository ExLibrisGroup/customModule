import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OnlineLink } from 'src/app/types/primoViewModel.types';
import { StackedButtonComponent } from './components/stacked-button.component';

@Component({
  selector: 'stacked-dropdown',
  standalone: true,
  imports: [MatButtonModule, MatSelectModule, StackedButtonComponent],
  templateUrl: './stacked-dropdown.component.html',
  encapsulation: ViewEncapsulation.None, // override styles are loaded globally from third-iron-module/mat-select-overrides.scss
})
export class StackedDropdownComponent {
  onlineLinks = input.required<OnlineLink[]>();
}
