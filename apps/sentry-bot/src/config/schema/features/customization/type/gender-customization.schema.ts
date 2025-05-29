import { Transform, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { transformCustomizationDefinitionsToCollection } from '#lib/class-transfomer.js';

import { CustomizationDefinitionSchema } from '../customization-definition.schema.js';

import type {
	GenderDefinition,
	GenderChoices,
} from '#lib/customization/index.js';

export class GenderDefinitionSchema
	extends CustomizationDefinitionSchema
	implements GenderDefinition {}

export class GendersCustomizationSchema {
	@ValidateNested({ each: true })
	@Type(() => GenderDefinitionSchema)
	@Transform(transformCustomizationDefinitionsToCollection)
	public readonly choices!: GenderChoices;

	@IsString()
	public readonly panel_banner!: string;
}
