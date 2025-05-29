import { Module } from '@nestjs/common';
import { OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';

import { ServerConfigSchema } from '../../config/server-config.schema.js';

@Module({
	imports: [
		OgmaModule.forRootAsync({
			useClass: ServerLoggingModule,
		}),
	],
})
export class ServerLoggingModule {
	constructor(private readonly config: ServerConfigSchema) {}

	createModuleConfig(): OgmaModuleOptions {
		return {
			logLevel: this.config.context.log_level,
			color: this.config.context.environment === 'development',
			application: this.config.context.name,
		};
	}
}
