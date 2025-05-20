import {
	LookaheadDiscoveryAbstract,
	LookaheadType,
} from '../lookahead.discovery.js';

import type { ClientEvents } from 'discord.js';
import type { LookaheadAbstractMeta } from '../lookahead.discovery.js';

export interface LookaheadDesignatorMeta
	extends LookaheadAbstractMeta<LookaheadType.DESIGNATOR> {
	type: LookaheadType.DESIGNATOR;
	event: keyof ClientEvents;
}

export class LookaheadDesignatorDiscovery extends LookaheadDiscoveryAbstract<LookaheadDesignatorMeta> {
	getEvent() {
		return this.meta.event;
	}
}
