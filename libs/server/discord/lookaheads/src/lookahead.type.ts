import type {
	LookaheadDesignatorDiscovery,
	LookaheadDesignatorMeta,
} from './designator/designator.discovery.js';

import type {
	LookaheadDescriptorDiscovery,
	LookaheadDescriptorMeta,
} from './descriptor/descriptor.discovery.js';

import type {
	LookaheadProcessorDiscovery,
	LookaheadProcessorMeta,
} from './processor/processor.discovery.js';

export type LookaheadMeta =
	| LookaheadDesignatorMeta
	| LookaheadDescriptorMeta
	| LookaheadProcessorMeta;

export type LookaheadDiscovery =
	| LookaheadDesignatorDiscovery
	| LookaheadDescriptorDiscovery
	| LookaheadProcessorDiscovery;
