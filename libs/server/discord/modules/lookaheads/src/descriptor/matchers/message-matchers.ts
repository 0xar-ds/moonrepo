import { ClientEvents, Message, PartialMessage } from 'discord.js';

import { DescriptorMatcher } from '../descriptor.type.js';

type IsMessageEvent<T extends unknown[]> = T[0] extends Message | PartialMessage
	? true
	: false;

export type MessageClientEvents = {
	[K in keyof ClientEvents as IsMessageEvent<ClientEvents[K]> extends true
		? K
		: never]: ClientEvents[K];
};

export const matchesMessageId =
	<K extends keyof MessageClientEvents>(
		expectedId: string,
	): DescriptorMatcher<K> =>
	async (...[message]) =>
		'id' in message && message.id === expectedId;

export const matchesContent =
	<K extends keyof MessageClientEvents>(
		expectedContent: string,
	): DescriptorMatcher<K> =>
	async (...[message]) =>
		message.content !== null && message.content === expectedContent;

export const matchesRegex =
	<K extends keyof MessageClientEvents>(regex: RegExp): DescriptorMatcher<K> =>
	async (...[message]) =>
		message.content !== null && regex.test(message.content);

export const matchesAuthorId =
	<K extends keyof MessageClientEvents>(
		expectedAuthorId: string,
	): DescriptorMatcher<K> =>
	async (...[message]) =>
		message?.author?.id === expectedAuthorId;
