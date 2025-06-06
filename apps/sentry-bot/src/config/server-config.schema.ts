import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ServerContextSchema } from '@~server/config-schemas';

import {
	ServerApplicationFeaturesSchema,
	ServerApplicationSchema,
} from './schema/server-application.schema.js';

export class ServerConfigSchema {
	@ValidateNested()
	@Type(() => ServerContextSchema)
	public readonly context!: ServerContextSchema;

	@ValidateNested()
	@Type(() => ServerApplicationSchema)
	public readonly application!: ServerApplicationSchema;

	@ValidateNested()
	@Type(() => ServerApplicationFeaturesSchema)
	public readonly features!: ServerApplicationFeaturesSchema;
}
