import { Component, input } from '@angular/core';

@Component({
  selector: 'open-book-icon',
  standalone: true,
  imports: [],
  templateUrl: '../../../assets/icons/open-book-icon.svg',
  styleUrl: './icon.component.scss',
})
export class OpenBookIconComponent {
  color = input.required<string>();
}
