import { Transform, Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { transformCustomizationDefinitionsToCollection } from '#lib/class-transfomer.js';

import { CustomizationDefinitionSchema } from '../customization-definition.schema.js';

import type {
	ColorDefinition,
	ColorChoices,
} from '#lib/customization/index.js';

export class ColorDefinitionSchema
	extends CustomizationDefinitionSchema
	implements ColorDefinition
{
	@IsString()
	public readonly hex!: string;
}

export class ColorsCustomizationSchema {
	@ValidateNested({ each: true })
	@Type(() => ColorDefinitionSchema)
	@Transform(transformCustomizationDefinitionsToCollection)
	public readonly choices!: ColorChoices;

	@IsArray()
	@IsString({ each: true })
	public readonly panel_options_banners!: string[];

	@IsString()
	public readonly panel_banner!: string;
}
