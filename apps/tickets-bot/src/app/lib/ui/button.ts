import {
	ButtonBuilder,
	ButtonStyle,
	Snowflake,
	type PrivateThreadChannel,
} from 'discord.js';

export const Buttons = {
	Ticket: {
		Lock: (thread: PrivateThreadChannel, ownerId: Snowflake) =>
			new ButtonBuilder()
				.setStyle(ButtonStyle.Danger)
				.setEmoji('🔒')
				.setLabel('Cerrar ticket')
				.setCustomId(
					`tickets_close/${thread.parentId}/${ownerId}/${thread.id}`,
				),
		Unlock: (thread: PrivateThreadChannel, ownerId: Snowflake) =>
			new ButtonBuilder()
				.setStyle(ButtonStyle.Success)
				.setEmoji('🔓')
				.setLabel('Abrir ticket')
				.setCustomId(`tickets_open/${thread.parentId}/${ownerId}/${thread.id}`),
		Join: (thread: PrivateThreadChannel) =>
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🔑')
				.setLabel('Unirse al ticket')
				.setCustomId(`tickets_join/${thread.parentId}/${thread.id}`),
		View: (thread: PrivateThreadChannel) =>
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Ir al ticket')
				.setURL(thread.url),
	} as const,
} as const;
