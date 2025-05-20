import { ClientEvents } from 'discord.js';

export type ProcessorContext<
	DesignedBy extends keyof ClientEvents,
	MatchedBy extends keyof ClientEvents,
> = readonly [
	designatorEvent: ClientEvents[DesignedBy],
	descriptorEvent: ClientEvents[MatchedBy],
];
