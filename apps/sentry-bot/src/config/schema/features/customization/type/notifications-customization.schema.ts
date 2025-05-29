import { Transform, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { transformCustomizationDefinitionsToCollection } from '#lib/class-transfomer.js';

import { CustomizationDefinitionSchema } from '../customization-definition.schema.js';

import type {
	NotificationDefinition,
	NotificationChoices,
} from '#lib/customization/index.js';

export class NotificationDefinitionSchema
	extends CustomizationDefinitionSchema
	implements NotificationDefinition {}

export class NotificationsCustomizationSchema {
	@ValidateNested({ each: true })
	@Type(() => NotificationDefinitionSchema)
	@Transform(transformCustomizationDefinitionsToCollection)
	public readonly choices!: NotificationChoices;

	@IsString()
	public readonly panel_banner!: string;
}
