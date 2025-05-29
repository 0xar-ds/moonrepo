import type {
	CustomizationChoices,
	CustomizationDefinition,
} from '../customization.js';

export type GenderDefinition = CustomizationDefinition;

export type GenderChoices = CustomizationChoices<GenderDefinition>;
