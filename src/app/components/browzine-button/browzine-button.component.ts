import { Component, effect, input } from '@angular/core';
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
  url = input.required<string>();
  entityType = input.required<EntityType>();

  buttonText: string = '';
  EntityType = EntityType;
  IconType = IconType;

  constructor() {
    effect(() => {
      // TODO - use possible config label
      this.buttonText =
        this.entityType() === this.EntityType.Journal
          ? 'View Journal Contents'
          : 'View Issue Contents';
    });
  }
}
