import { ClientEvents } from 'discord.js';

export type DescriptorContext<K extends keyof ClientEvents> = [
	...payload: ClientEvents[K],
];
