import { ButtonType } from '../shared/button-type.enum';
import { EntityType } from '../shared/entity-type.enum';

export type ButtonInfo = {
  ariaLabel: string;
  buttonText: string;
  buttonType: ButtonType;
  color: string;
  entityType: EntityType;
  icon: string;
  url: string;
  browzineUrl?: string;
  showBrowzineButton?: boolean;
};
