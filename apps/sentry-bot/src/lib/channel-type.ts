import {
	CategoryChannel,
	TextChannel,
	NewsChannel,
	ThreadChannel,
	ForumChannel,
	MediaChannel,
	VoiceChannel,
	StageChannel,
	ChannelType,
} from 'discord.js';

export function isChannelOfType<T extends ChannelType & keyof ChannelTypeMap>(
	channel: MappedChannels,
	type: T,
): channel is ChannelTypeMap[T] {
	return channel.type === type;
}

export function getChannelTypeKey(
	value: ChannelType,
): keyof typeof ChannelType {
	return ChannelType[value] as keyof typeof ChannelType;
}

export type MappedChannels =
	| CategoryChannel
	| TextChannel
	| NewsChannel
	| ThreadChannel
	| ForumChannel
	| MediaChannel
	| VoiceChannel
	| StageChannel;

export interface ChannelTypeMap {
	/**
	 * Meta channel types
	 */

	[ChannelType.GuildCategory]: CategoryChannel;

	/**
	 * Text channel types
	 */

	[ChannelType.GuildText]: TextChannel;
	[ChannelType.GuildAnnouncement]: NewsChannel;

	/**
	 * Threads/embedded channel types
	 */

	[ChannelType.PublicThread]: ThreadChannel;
	[ChannelType.PrivateThread]: ThreadChannel;
	[ChannelType.AnnouncementThread]: ThreadChannel;

	/**
	 * Extensions of threads/embedded channel types
	 */

	[ChannelType.GuildForum]: ForumChannel;
	[ChannelType.GuildMedia]: MediaChannel;

	/**
	 * Voice channel types
	 */

	[ChannelType.GuildVoice]: VoiceChannel;
	[ChannelType.GuildStageVoice]: StageChannel;
}
