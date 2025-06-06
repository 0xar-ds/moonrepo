import { Reflector } from '@nestjs/core';

import { LookaheadType } from '../lookahead.discovery.js';

import { LookaheadDesignatorDiscovery } from '../designator/designator.discovery.js';
import { LookaheadDescriptorDiscovery } from '../descriptor/descriptor.discovery.js';
import { LookaheadProcessorDiscovery } from '../processor/processor.discovery.js';

import type { LookaheadDiscovery, LookaheadMeta } from '../lookahead.type.js';
import type { LookaheadModuleOptions } from '../lookahead.module-options.js';

export const Lookahead = Reflector.createDecorator<LookaheadDecoratorOpts>({
	transform: (options) => options,
});

export type LookaheadDecoratorOpts =
	| string
	| ({ id: string } & LookaheadModuleOptions);

export const LookaheadMethod = Reflector.createDecorator<
	LookaheadMeta,
	LookaheadDiscovery
>({
	transform: (options) => {
		switch (options.type) {
			case LookaheadType.DESIGNATOR:
				return new LookaheadDesignatorDiscovery(options);
			case LookaheadType.DESCRIPTOR:
				return new LookaheadDescriptorDiscovery(options);
			case LookaheadType.PROCESSOR:
				return new LookaheadProcessorDiscovery(options);
		}
	},
});
