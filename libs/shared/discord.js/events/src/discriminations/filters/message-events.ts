import { ClientEvents, Message, PartialMessage } from 'discord.js';

export type IsMessageEvent<T extends unknown[]> = T[number] extends
	| Message
	| PartialMessage
	? true
	: false;

export type MessageClientEvents = {
	[K in keyof ClientEvents as IsMessageEvent<ClientEvents[K]> extends true
		? K
		: never]: ClientEvents[K];
};
