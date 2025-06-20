import { ClientEvents } from 'discord.js';

export type ChannelGuildScopeEvents = Pick<
	ClientEvents,
	'channelCreate' | 'channelUpdate' | 'channelDelete'
>;

export type RoleGuildScopeEvents = Pick<
	ClientEvents,
	'roleCreate' | 'roleUpdate' | 'roleDelete'
>;

export type EventGuildScopeEvents = Pick<
	ClientEvents,
	| 'guildScheduledEventCreate'
	| 'guildScheduledEventUpdate'
	| 'guildScheduledEventDelete'
	| 'guildScheduledEventUserAdd'
	| 'guildScheduledEventUserRemove'
>;

export type AuditGuildScopeEvents = Pick<
	ClientEvents,
	'guildAuditLogEntryCreate'
>;

export type InviteGuildScopeEvents = Pick<
	ClientEvents,
	'inviteCreate' | 'inviteDelete'
>;

export type ResourcesGuildScopeEvents = ChannelGuildScopeEvents &
	AuditGuildScopeEvents &
	RoleGuildScopeEvents &
	InviteGuildScopeEvents &
	EventGuildScopeEvents;
