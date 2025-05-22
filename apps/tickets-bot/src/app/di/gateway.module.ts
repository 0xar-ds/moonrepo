import { Module } from '@nestjs/common';

import { NecordModule, NecordModuleOptions } from 'necord';

import { SetupController } from '../api/gateway/controller/setup.controller.js';

import { ServerConfigSchema } from '../config/server-config.schema.js';
import { TicketsService } from '../api/gateway/tickets.service.js';
import { StateController } from '../api/gateway/controller/state.controller.js';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
	imports: [
		OgmaModule.forFeatures([TicketsService, SetupController, StateController]),
		NecordModule.forRootAsync({
			useClass: GatewayModule,
		}),
	],
	providers: [TicketsService, SetupController, StateController],
})
export class GatewayModule {
	constructor(private readonly config: ServerConfigSchema) {}

	createNecordOptions(): NecordModuleOptions {
		return {
			intents: [],
			token: this.config.application.token,
			development: [this.config.application.guild],
		};
	}
}
