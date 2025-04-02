import { Component, input } from '@angular/core';

@Component({
  selector: 'article-alert-icon',
  standalone: true,
  imports: [],
  templateUrl: '../../../assets/icons/article-alert-icon.svg',
  styleUrl: './icon.component.scss',
})
export class ArticleAlertIconComponent {
  color = input.required<string>();
}
