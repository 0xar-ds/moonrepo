import { ClientEvents } from 'discord.js';

export type StateClientScopeEvents = Pick<
	ClientEvents,
	'ready' | 'debug' | 'error' | 'warn'
>;

export type UserClientScopeEvents = Pick<ClientEvents, 'userUpdate'>;

export type ShardClientScopeEvents = Pick<
	ClientEvents,
	| 'shardReady'
	| 'shardError'
	| 'shardResume'
	| 'shardDisconnect'
	| 'shardReconnecting'
>;

export type CacheClientScopeEvents = Pick<
	ClientEvents,
	'invalidated' | 'cacheSweep'
>;

export type GuildClientScopeEvents = Pick<
	ClientEvents,
	| 'guildAvailable'
	| 'guildUnavailable'
	| 'guildMemberAvailable'
	| 'guildMembersChunk'
>;

export type ThreadClientScopeEvents = Pick<
	ClientEvents,
	'threadMemberUpdate' | 'threadListSync'
>;

export type ClientApplicationScopeEvents = (StateClientScopeEvents &
	ShardClientScopeEvents &
	CacheClientScopeEvents) &
	(UserClientScopeEvents & GuildClientScopeEvents & ThreadClientScopeEvents);
