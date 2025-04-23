import { Component, input } from '@angular/core';
import { ButtonInfo } from 'src/app/types/buttonInfo.types';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
  selector: 'custom-browzine-button',
  standalone: true,
  imports: [BaseButtonComponent],
  templateUrl: './browzine-button.component.html',
  styleUrl: './browzine-button.component.scss',
})
export class BrowzineButtonComponent {
  buttonInfo = input.required<ButtonInfo>();

  entityType = EntityType;
  iconType = IconType;
}
