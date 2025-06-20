import { ClientEvents } from 'discord.js';

export type StateMessageScopeEvents = Pick<
	ClientEvents,
	'messageUpdate' | 'messageDelete'
>;

export type ReactionMessageScopeEvents = Pick<
	ClientEvents,
	| 'messageReactionAdd'
	| 'messageReactionRemove'
	| 'messageReactionRemoveAll'
	| 'messageReactionRemoveEmoji'
>;

export type PollMessageScopeEvents = Pick<
	ClientEvents,
	'messagePollVoteAdd' | 'messagePollVoteRemove'
>;

export type InteractionsMessageScopeEvents = StateMessageScopeEvents &
	ReactionMessageScopeEvents &
	PollMessageScopeEvents;
