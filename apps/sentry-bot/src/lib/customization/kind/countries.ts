import type {
	CustomizationChoices,
	CustomizationDefinition,
} from '../customization.js';

export type CountryDefinition = CustomizationDefinition;

export type CountryChoices = CustomizationChoices<CountryDefinition>;
