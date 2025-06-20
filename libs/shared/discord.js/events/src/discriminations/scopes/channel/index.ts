export * from './interactions.channel-scope-events.js';
export * from './settings.channel-scope-events.js';

import { InteractionsChannelScopeEvents } from './interactions.channel-scope-events.js';
import { SettingsChannelScopeEvents } from './settings.channel-scope-events.js';

export type ChannelScopeEvents = InteractionsChannelScopeEvents &
	SettingsChannelScopeEvents;
