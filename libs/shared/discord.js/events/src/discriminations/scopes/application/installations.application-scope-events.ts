import { ClientEvents } from 'discord.js';

export type GuildInstallationsApplicationScopeEvents = Pick<
	ClientEvents,
	'guildCreate' | 'guildDelete'
>;

export type MonetizationApplicationScopeEvents = Pick<
	ClientEvents,
	| 'entitlementCreate'
	| 'entitlementUpdate'
	| 'entitlementDelete'
	| 'subscriptionCreate'
	| 'subscriptionUpdate'
	| 'subscriptionDelete'
>;

export type InstallationsApplicationScopeEvents =
	MonetizationApplicationScopeEvents & GuildInstallationsApplicationScopeEvents;
