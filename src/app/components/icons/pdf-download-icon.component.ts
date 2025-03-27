import { Component, input } from '@angular/core';

@Component({
  selector: 'pdf-download-icon',
  standalone: true,
  imports: [],
  templateUrl: '../../../assets/icons/pdf-download-icon.svg',
  styleUrl: './icon.component.scss',
})
export class PdfDownloadIconComponent {
  color = input.required<string>();
}
