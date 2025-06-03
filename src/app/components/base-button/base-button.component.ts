import { Component, input } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'custom-base-button',
  standalone: true,
  imports: [SvgIconComponent, MatButtonModule],
  templateUrl: './base-button.component.html',
  styleUrl: './base-button.component.scss',
})
export class BaseButtonComponent {
  ariaLabel = input.required<string>();
  buttonText = input.required<string>();
  color = input.required<string>();
  icon = input.required<string>();
  url = input.required<string>();

  onClick(event: MouseEvent) {
    // We’ve seen some discovery services intercept basic a href links, and have
    // been encouraged to intercept clicks more closely. We should continue
    // intercepting clicks like this unless we hear feedback from discovery
    // service vendors that this is no longer desired or necessary.
    event.preventDefault();
    event.stopPropagation();

    window.open(this.url(), '_blank');

    return false;
  }
}
