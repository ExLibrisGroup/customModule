import { Component, input } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ButtonInfo } from 'src/app/types/buttonInfo.types';

@Component({
  selector: 'custom-single-button',
  standalone: true,
  imports: [SvgIconComponent],
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
