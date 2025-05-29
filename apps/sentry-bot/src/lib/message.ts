import {
	BitField,
	BitFieldResolvable,
	InteractionEditReplyOptions,
	MessageCreateOptions,
	MessageFlags,
	MessageFlagsString,
} from 'discord.js';

export function convertMessageCreateOptionsToInteractionEditReplyOptions(
	options: MessageCreateOptions,
	overrides: InteractionEditReplyOptions = {},
): InteractionEditReplyOptions {
	const editReplyOptions: InteractionEditReplyOptions = {
		poll: options.poll,
		files: options.files,
		embeds: options.embeds,
		content: options.content,
		components: options.components,
		allowedMentions: options.allowedMentions,
	};

	if (options.flags) {
		const flags: BitFieldResolvable<
			Extract<MessageFlagsString, 'SuppressEmbeds' | 'IsComponentsV2'>,
			MessageFlags.SuppressEmbeds | MessageFlags.IsComponentsV2
		> = new BitField(options.flags).bitfield &
		(MessageFlags.SuppressEmbeds | MessageFlags.IsComponentsV2);

		if (flags) editReplyOptions.flags = flags;
	}

	return { ...editReplyOptions, ...overrides };
}

export function convertInteractionEditReplyOptionsToMessageCreateOptions(
	options: InteractionEditReplyOptions,
	overrides: MessageCreateOptions = {},
): MessageCreateOptions {
	const messageCreateOptions: MessageCreateOptions = {
		poll: options.poll,
		files: options.files,
		embeds: options.embeds,
		content: options.content ?? undefined,
		components: options.components,
		allowedMentions: options.allowedMentions,
	};

	if (options.flags) {
		const flags: BitFieldResolvable<
			Extract<
				MessageFlagsString,
				'SuppressEmbeds' | 'SuppressNotifications' | 'IsComponentsV2'
			>,
			| MessageFlags.SuppressEmbeds
			| MessageFlags.SuppressNotifications
			| MessageFlags.IsComponentsV2
		> = new BitField(options.flags).bitfield &
		(MessageFlags.SuppressEmbeds |
			MessageFlags.SuppressNotifications |
			MessageFlags.IsComponentsV2);

		if (flags) messageCreateOptions.flags = flags;
	}

	return { ...messageCreateOptions, ...overrides };
}
