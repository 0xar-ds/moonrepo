import { ChannelType } from 'discord.js';

import { MappedChannels, MappedChannelType } from './channel-type.interface.js';
import { ChannelTypeMap } from './channel-type.js';

export function getChannelTypeKey(
	value: ChannelType,
): keyof typeof ChannelType {
	return ChannelType[value] as keyof typeof ChannelType;
}

export function isChannelOfType<T extends MappedChannelType>(
	type: T,
	channel: MappedChannels,
): channel is ChannelTypeMap[T] {
	return channel.type === type;
}
