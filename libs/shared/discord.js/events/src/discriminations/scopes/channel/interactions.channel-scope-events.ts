import { ClientEvents } from 'discord.js';

export type MessageChannelScopeEvents = Pick<
	ClientEvents,
	'messageCreate' | 'messageUpdate' | 'messageDelete' | 'messageDeleteBulk'
>;

export type ApplicationChannelScopeEvents = Pick<
	ClientEvents,
	'interactionCreate'
>;

export type PresenceChannelScopeEvents = Pick<ClientEvents, 'typingStart'>;

export type VoiceChannelScopeEvents = Pick<
	ClientEvents,
	'voiceStateUpdate' | 'voiceChannelEffectSend'
>;

export type StageChannelScopeEvents = Pick<
	ClientEvents,
	'stageInstanceCreate' | 'stageInstanceUpdate' | 'stageInstanceDelete'
>;

export type ThreadChannelScopeEvents = Pick<
	ClientEvents,
	'threadCreate' | 'threadUpdate' | 'threadDelete'
>;

export type InteractionsChannelScopeEvents = PresenceChannelScopeEvents &
	MessageChannelScopeEvents &
	ApplicationChannelScopeEvents &
	VoiceChannelScopeEvents &
	StageChannelScopeEvents &
	ThreadChannelScopeEvents;
