import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { OgmaModule } from '@ogma/nestjs-module';

import { NecordModule, NecordModuleOptions } from 'necord';

import { ServerConfigSchema } from '../config/server-config.schema.js';

import { TicketsNotificationService } from '../api/gateway/service/notification/tickets-notifications.service.js';
import { DiscordResourceService } from '../api/gateway/service/discord.service.js';
import { TicketsThreadService } from '../api/gateway/service/thread/tickets-thread.service.js';
import { TicketsPanelService } from '../api/gateway/service/panel/tickets-panel.service.js';
import { TicketsPanelsController } from '../api/gateway/controller/panel.controller.js';
import { TicketsThreadsController } from '../api/gateway/controller/thread.controller.js';

import { DiscordExceptionFilter } from '../api/gateway/exception-filter/necord.exception-filter.js';

const PROVIDERS = [
	DiscordResourceService,
	TicketsNotificationService,
	TicketsPanelService,
	TicketsThreadService,
	TicketsPanelsController,
	TicketsThreadsController,
];

@Module({
	imports: [
		OgmaModule.forFeatures(PROVIDERS),
		NecordModule.forRootAsync({
			useClass: GatewayModule,
		}),
	],
	providers: [
		{ provide: APP_FILTER, useClass: DiscordExceptionFilter },
		...PROVIDERS,
	],
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
