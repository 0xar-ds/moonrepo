import {
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';

import { Client } from 'discord.js';
import { ExplorerService } from 'necord';

import {
	ConfigurableModuleClass,
	LOOKAHEAD_MODULE_OPTIONS,
} from './lookahead.module-definition.js';

import type { LookaheadModuleOptions } from './lookahead.module-options.js';

import {
	Lookahead,
	LookaheadDecoratorOpts,
	LookaheadMethod,
} from './decorators/lookahead.decorator.js';

import { LookaheadService } from './lookahead.service.js';

import type { LookaheadDiscovery } from './lookahead.type.js';

@Module({
	providers: [
		LookaheadService,
		{
			provide: LookaheadService,
			useFactory: (client: Client) => new LookaheadService(client),
			inject: [Client],
		},
	],
})
export class LookaheadModule
	extends ConfigurableModuleClass
	implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy
{
	private readonly logger = new Logger(LookaheadModule.name);

	constructor(
		@Inject(LOOKAHEAD_MODULE_OPTIONS)
		private readonly options: LookaheadModuleOptions,

		private readonly client: Client,
		private readonly explorer: ExplorerService<LookaheadDiscovery>,
		private readonly service: LookaheadService,
	) {
		super();
	}

	onModuleInit() {
		this.logger.verbose('Registering lookaheads...');

		this.explorer.explore(LookaheadMethod.KEY).forEach((item) => {
			const lookahead = this.explorer.get<LookaheadDecoratorOpts>(
				Lookahead,
				item.getClass(),
			);

			const id = typeof lookahead === 'string' ? lookahead : lookahead?.id;

			if (!id)
				throw new Error(`Missing @Lookahead() ID on class: ${item.getClass()}`);

			this.logger.debug(`Registering @${item.getType()} for @Lookahead(${id})`);

			this.service.addLookahead(item.setId(id));
		});

		this.logger.verbose('Finished registering lookaheads.');
	}

	onModuleDestroy() {
		this.service.unhookDescriptorEvents();
	}

	onApplicationBootstrap() {
		for (const event of this.service.getDesignators().keys()) {
			this.client.on(event, (...args) =>
				this.service.triggerDesignator(event, ...args),
			);
		}
	}
}
