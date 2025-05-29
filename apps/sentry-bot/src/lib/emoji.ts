import { ComponentEmojiResolvable, formatEmoji } from 'discord.js';

export function formatComponentEmojiResolvable(emoji: undefined): null;
export function formatComponentEmojiResolvable(
	emoji: ComponentEmojiResolvable,
): string;
export function formatComponentEmojiResolvable(
	emoji: ComponentEmojiResolvable | undefined,
): string | null {
	if (!emoji) return null;

	if ('string' === typeof emoji) {
		if (/\p{Extended_Pictographic}/u.test(emoji)) return emoji;

		return formatEmoji(emoji);
	}

	return formatEmoji(
		emoji.id ?? '1376752197983010876',
		emoji.animated ?? false,
	);
}
