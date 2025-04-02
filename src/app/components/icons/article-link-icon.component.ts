import { Component, input } from '@angular/core';

@Component({
  selector: 'article-link-icon',
  standalone: true,
  imports: [],
  templateUrl: '../../../assets/icons/article-link-icon.svg',
  styleUrl: './icon.component.scss',
})
export class ArticleLinkIconComponent {
  color = input.required<string>();
}
