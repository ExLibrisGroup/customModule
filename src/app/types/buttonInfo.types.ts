import { EntityType } from '../shared/entity-type.enum';

export type ButtonInfo = {
  ariaLabel: string;
  buttonText: string;
  color: string;
  entityType: EntityType;
  icon: string;
  url: string;
  browzineUrl?: string;
  showBrowzineButton: boolean;
};
