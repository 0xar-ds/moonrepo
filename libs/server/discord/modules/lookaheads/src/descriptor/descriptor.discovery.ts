import {
	LookaheadDiscoveryAbstract,
	LookaheadType,
} from '../lookahead.discovery.js';

import type { LookaheadAbstractMeta } from '../lookahead.discovery.js';

import type { DescriptorReturn } from './descriptor.type.js';

export interface LookaheadDescriptorMeta
	extends LookaheadAbstractMeta<LookaheadType.DESCRIPTOR> {
	type: LookaheadType.DESCRIPTOR;
	lifetime: number;
}

export class LookaheadDescriptorDiscovery extends LookaheadDiscoveryAbstract<LookaheadDescriptorMeta> {
	getDecayLimit() {
		return this.meta.lifetime;
	}

	override execute(...args: unknown[]): DescriptorReturn {
		return super.execute(...args);
	}
}
