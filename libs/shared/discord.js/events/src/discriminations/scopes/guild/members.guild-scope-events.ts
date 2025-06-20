import { ClientEvents } from 'discord.js';

export type MembershipGuildScopeEvents = Pick<
	ClientEvents,
	'guildMemberAdd' | 'guildMemberRemove' | 'guildMemberUpdate'
	// | 'guildMemberAvailable'
	// | 'guildMembersChunk'
>;

export type PresenceGuildScopeEvents = Pick<ClientEvents, 'presenceUpdate'>;

export type SanctionGuildScopeEvents = Pick<
	ClientEvents,
	'guildBanAdd' | 'guildBanRemove'
>;

export type MembersGuildScopeEvents = MembershipGuildScopeEvents &
	PresenceGuildScopeEvents &
	SanctionGuildScopeEvents;
