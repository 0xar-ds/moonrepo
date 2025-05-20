import { ClientEvents } from 'discord.js';

export type DesignatorContext<K extends keyof ClientEvents> = [
	...payload: ClientEvents[K],
];
