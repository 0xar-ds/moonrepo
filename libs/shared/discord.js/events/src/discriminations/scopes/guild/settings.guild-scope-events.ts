import { ClientEvents } from 'discord.js';

export type IntegrationGuildScopeEvents = Pick<
	ClientEvents,
	'guildIntegrationsUpdate' | 'applicationCommandPermissionsUpdate'
>;

export type ConfigurationGuildScopeEvents = Pick<ClientEvents, 'guildUpdate'>;

export type AutomodGuildScopeEvents = Pick<
	ClientEvents,
	| 'autoModerationRuleCreate'
	| 'autoModerationRuleUpdate'
	| 'autoModerationRuleDelete'
	| 'autoModerationActionExecution'
>;

export type SettingsGuildScopeEvents = IntegrationGuildScopeEvents &
	AutomodGuildScopeEvents &
	ConfigurationGuildScopeEvents;
