import { ClientEvents } from 'discord.js';

export type PinnedChannelScopeEvents = Pick<ClientEvents, 'channelPinsUpdate'>;

export type ConfigurationChannelScopeEvents = Pick<
	ClientEvents,
	'channelUpdate'
>;

export type WebhookChannelScopeEvents = Pick<ClientEvents, 'webhooksUpdate'>;

export type SettingsChannelScopeEvents = PinnedChannelScopeEvents &
	WebhookChannelScopeEvents &
	ConfigurationChannelScopeEvents;
