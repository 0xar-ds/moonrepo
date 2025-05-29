import type {
	CustomizationChoices,
	CustomizationDefinition,
} from '../customization.js';

export type ColorDefinition = CustomizationDefinition & { hex: string };

export type ColorChoices = CustomizationChoices<ColorDefinition>;
