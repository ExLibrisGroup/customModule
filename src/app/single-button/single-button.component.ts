import { Component, input } from '@angular/core';
import { ButtonInfo } from '../third-iron-adapter/third-iron-adapter.component';

@Component({
  selector: 'custom-single-button',
  standalone: true,
  imports: [],
  templateUrl: './single-button.component.html',
  styleUrl: './single-button.component.scss',
})
export class SingleButtonComponent {
  buttonInfo = input.required<ButtonInfo>();

  // ariaLabel = input.required<string>();
  // buttonText = input.required<string>();
  // url = input.required<string>();
  // icon = input<string>();
}
