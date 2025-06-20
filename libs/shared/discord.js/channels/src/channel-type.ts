import type {
	CategoryChannel,
	ChannelType,
	DirectoryChannel,
	DMChannel,
	ForumChannel,
	MediaChannel,
	NewsChannel,
	StageChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel,
} from 'discord.js';

export interface ChannelTypeMap {
	/**
	 * Meta channels
	 */

	[ChannelType.GuildCategory]: CategoryChannel;

	/**
	 * Text channels
	 */

	[ChannelType.GuildText]: TextChannel;
	[ChannelType.GuildAnnouncement]: NewsChannel;

	/**
	 * Feature channels
	 */

	[ChannelType.GuildForum]: ForumChannel;
	[ChannelType.GuildMedia]: MediaChannel;
	[ChannelType.GuildDirectory]: DirectoryChannel;

	/**
	 * Threads/nested channels
	 */

	[ChannelType.PublicThread]: ThreadChannel;
	[ChannelType.PrivateThread]: ThreadChannel;
	[ChannelType.AnnouncementThread]: ThreadChannel;

	/**
	 * Voice channels
	 */

	[ChannelType.GuildVoice]: VoiceChannel;
	[ChannelType.GuildStageVoice]: StageChannel;

	/**
	 * User channels
	 */

	[ChannelType.DM]: DMChannel;
	[ChannelType.GroupDM]: DMChannel;
}
