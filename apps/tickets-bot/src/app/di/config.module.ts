import { Module } from '@nestjs/common';

import { TypedConfigModule, fileLoader } from 'nest-typed-config';

import { ServerConfigSchema } from '../config/server-config.schema.js';

@Module({
	imports: [
		TypedConfigModule.forRoot({
			schema: ServerConfigSchema,
			load: fileLoader(),
			isGlobal: true,
		}),
	],
})
export class ServerConfigModule {}
