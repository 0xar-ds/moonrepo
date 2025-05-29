import type {
	CustomizationChoices,
	CustomizationDefinition,
} from '../customization.js';

export type NotificationDefinition = CustomizationDefinition;

export type NotificationChoices = CustomizationChoices<NotificationDefinition>;
