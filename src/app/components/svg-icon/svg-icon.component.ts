import { Component, input } from '@angular/core';
import { OpenBookIconComponent } from '../icons/open-book-icon.component';
import { PdfDownloadIconComponent } from '../icons/pdf-download-icon.component';

// :: Note - Adding a new icon ::
// To add new icons, a new icon component needs to be created and imported here.
// A new case for the switch statement in this component's template file (svg-icon.component.html)
// also needs to be added.
// Also, for icon positioning, make sure to add a class to this component's style file specific
// to the new icon or extend existing style classes
@Component({
  selector: 'custom-svg-icon',
  standalone: true,
  imports: [OpenBookIconComponent, PdfDownloadIconComponent],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss',
})
export class SvgIconComponent {
  name = input.required<string>();
  color = input<string>('sys-primary');
}
