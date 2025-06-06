import { ClientEvents } from 'discord.js';
import {
	LookaheadDiscoveryAbstract,
	LookaheadType,
} from '../lookahead.discovery.js';

import type { LookaheadAbstractMeta } from '../lookahead.discovery.js';
import type { ProcessorContext } from './processor.context.js';

export interface LookaheadProcessorMeta
	extends LookaheadAbstractMeta<LookaheadType.PROCESSOR> {
	type: LookaheadType.PROCESSOR;
}

export class LookaheadProcessorDiscovery extends LookaheadDiscoveryAbstract<LookaheadProcessorMeta> {
	override execute(
		args: ProcessorContext<keyof ClientEvents, keyof ClientEvents>,
	) {
		super.execute(args);
	}
}
