import {
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

import { ChannelTypeMap } from './channel-type.js';

export type MappedChannels =
	| CategoryChannel
	| DirectoryChannel
	| DMChannel
	| ForumChannel
	| MediaChannel
	| NewsChannel
	| StageChannel
	| TextChannel
	| ThreadChannel
	| VoiceChannel;

export type MappedChannelType = ChannelType & keyof ChannelTypeMap;
