import type { ClientEvents } from 'discord.js';

import type { LookaheadDesignatorDiscovery } from '../designator/designator.discovery.js';
import type { LookaheadDescriptorDiscovery } from '../descriptor/descriptor.discovery.js';
import type { LookaheadProcessorDiscovery } from '../processor/processor.discovery.js';

export type DescriptorMatcher<K extends keyof ClientEvents> = (
	...args: ClientEvents[K]
) => Promise<boolean> | boolean;

export interface DescriptorReturn<
	K extends keyof ClientEvents = keyof ClientEvents,
> {
	event: K;
	match: DescriptorMatcher<K>;
}

interface DescriptorLookaheads {
	designator: LookaheadDesignatorDiscovery;
	descriptor: LookaheadDescriptorDiscovery;
	processor: LookaheadProcessorDiscovery;
}

interface DescriptorState {
	lifetime: number;
	trigger: ClientEvents[keyof ClientEvents];
}

export interface ActiveDescriptor<
	K extends keyof ClientEvents = keyof ClientEvents,
> extends DescriptorReturn<K> {
	id: string;
	state: DescriptorState;
	references: DescriptorLookaheads;
}
