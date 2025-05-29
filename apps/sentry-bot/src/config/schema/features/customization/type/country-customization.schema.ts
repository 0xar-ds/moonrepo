import { Transform, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { transformCustomizationDefinitionsToCollection } from '#lib/class-transfomer.js';

import { CustomizationDefinitionSchema } from '../customization-definition.schema.js';

import type {
	CountryDefinition,
	CountryChoices,
} from '#lib/customization/index.js';

export class CountryDefinitionSchema
	extends CustomizationDefinitionSchema
	implements CountryDefinition {}

export class CountriesCustomizationSchema {
	@ValidateNested({ each: true })
	@Type(() => CountryDefinitionSchema)
	@Transform(transformCustomizationDefinitionsToCollection)
	public readonly choices!: CountryChoices;

	@IsString()
	public readonly panel_banner!: string;
}
