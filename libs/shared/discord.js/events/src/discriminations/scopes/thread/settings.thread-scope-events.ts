import { ClientEvents } from 'discord.js';

export type MembershipThreadScopeEvents = Pick<
	ClientEvents,
	'threadMembersUpdate'
>;

export type ConfigurationThreadScopeEvents = Pick<ClientEvents, 'threadUpdate'>;

export type SettingsThreadScopeEvents = ConfigurationThreadScopeEvents &
	MembershipThreadScopeEvents;
