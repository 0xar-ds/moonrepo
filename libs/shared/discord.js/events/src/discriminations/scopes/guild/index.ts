export * from './expressions.guild-scope-events.js';
export * from './resources.guild-scope-events.js';
export * from './settings.guild-scope-events.js';
export * from './members.guild-scope-events.js';

import { ExpressionsGuildScopeEvents } from './expressions.guild-scope-events.js';
import { MembersGuildScopeEvents } from './members.guild-scope-events.js';
import { ResourcesGuildScopeEvents } from './resources.guild-scope-events.js';
import { SettingsGuildScopeEvents } from './settings.guild-scope-events.js';

export type GuildScopeEvents = ExpressionsGuildScopeEvents &
	ResourcesGuildScopeEvents &
	MembersGuildScopeEvents &
	SettingsGuildScopeEvents;
