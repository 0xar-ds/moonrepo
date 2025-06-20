import { ClientEvents } from 'discord.js';

export type SoundGuildScopeEvents = Pick<
	ClientEvents,
	| 'guildSoundboardSoundCreate'
	| 'guildSoundboardSoundUpdate'
	| 'guildSoundboardSoundDelete'
>;

export type EmojiGuildScopeEvents = Pick<
	ClientEvents,
	'emojiCreate' | 'emojiUpdate' | 'emojiDelete'
>;

export type StickerGuildScopeEvents = Pick<
	ClientEvents,
	'stickerCreate' | 'stickerUpdate' | 'stickerDelete'
>;

export type ExpressionsGuildScopeEvents = EmojiGuildScopeEvents &
	StickerGuildScopeEvents &
	SoundGuildScopeEvents;
