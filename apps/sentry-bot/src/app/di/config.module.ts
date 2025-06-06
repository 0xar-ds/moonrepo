import { Module } from '@nestjs/common';
import { fileLoader, TypedConfigModule } from 'nest-typed-config';

import { ServerConfigSchema } from '#config/server-config.schema.js';

@Module({
	imports: [
		TypedConfigModule.forRoot({
			schema: ServerConfigSchema,
			load: fileLoader(),
			isGlobal: true,
			validationOptions: {
				skipMissingProperties: false,
				skipUndefinedProperties: false,
				skipNullProperties: false,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
			},
		}),
	],
})
export class ServerConfigModule {}
