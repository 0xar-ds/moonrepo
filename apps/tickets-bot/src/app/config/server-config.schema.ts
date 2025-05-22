import { ServerContextSchema } from '@server/config-schemas';

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ServerApplicationSchema } from './schema/server-application.schema.js';

export class ServerConfigSchema {
	@Type(() => ServerContextSchema)
	@ValidateNested()
	public readonly context!: ServerContextSchema;

	@Type(() => ServerApplicationSchema)
	@ValidateNested()
	public readonly application!: ServerApplicationSchema;
}
