import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	roleMention,
	SeparatorBuilder,
	SeparatorSpacingSize,
	spoiler,
	TextDisplayBuilder,
	userMention,
	type Snowflake,
	type InteractionEditReplyOptions,
	type MessageCreateOptions,
	type PrivateThreadChannel,
} from 'discord.js';

import { TicketKind, TicketKindToSpeechMap } from './tickets.js';

export const Messages = {
	Panel: {
		InterfaceMessage: (bannerImageURL: string): MessageCreateOptions => {
			const container = new ContainerBuilder(),
				separator = new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Large);

			{
				container.addSeparatorComponents(separator);

				container.addMediaGalleryComponents((gallery) =>
					gallery.addItems((image) =>
						image.setURL(bannerImageURL).setDescription('SOS GAMER?'),
					),
				);

				container.addSeparatorComponents(separator);
			}

			for (const kind of Object.values(TicketKind)) {
				const speech = TicketKindToSpeechMap[kind];

				container.addSectionComponents((section) =>
					section
						.addTextDisplayComponents((text) =>
							text.setContent(
								[speech.label, `-# ${speech.description}`].join('\n'),
							),
						)
						.setButtonAccessory((button) =>
							button
								.setLabel('📩')
								.setStyle(ButtonStyle.Primary)
								.setCustomId(`tickets_create/${kind}`),
						),
				);
			}

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	} as const,
	Ticket: {
		InitialMessage: (
			actor: Exclude<ButtonInteraction['member'], null>,
			thread: PrivateThreadChannel,
		): MessageCreateOptions => {
			const content: string[] = [],
				row = new ActionRowBuilder<ButtonBuilder>();

			content.push(
				`${userMention(actor.user.id)} Tu ticket ha sido creado.`,
				'',
				'Por favor, proporcione cualquier información adicional que considere relevante para ayudarnos a responder más rápido.',
			);

			const lockButton = new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setEmoji('🔒')
					.setLabel('Cerrar ticket')
					.setCustomId(`tickets_close/${thread.id}`),
				unlockButton = new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setEmoji('🔓')
					.setLabel('Abrir ticket')
					.setCustomId(`tickets_open/${thread.id}`);

			row.addComponents(lockButton, unlockButton);

			return {
				content: content.join('\n'),
				components: [row],
			};
		},

		NotificationMessage: (
			actor: Exclude<ButtonInteraction['member'], null>,
			notifications: Snowflake[],
			thread: PrivateThreadChannel,
			kind: TicketKind,
		): MessageCreateOptions => {
			const container = new ContainerBuilder(),
				separator = new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Large);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('🔑')
					.setLabel('Unirse al ticket')
					.setCustomId(`tickets_join/${thread.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setEmoji('🔒')
					.setLabel('Cerrar ticket')
					.setCustomId(`tickets_close/${thread.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setEmoji('🔓')
					.setLabel('Abrir ticket')
					.setCustomId(`tickets_open/${thread.id}`),
			);

			{
				container.addTextDisplayComponents((text) =>
					text.setContent(
						`${spoiler(notifications.map((id) => roleMention(id)).join(' '))}, un ticket ha sido creado.`,
					),
				);

				container.addSeparatorComponents(separator);
			}

			{
				container.addTextDisplayComponents(
					(text) => text.setContent(`Id: ${thread.id}`),
					(text) => text.setContent(`Tipo: ${kind}`),
					(text) =>
						text.setContent(
							`Creado por: ${actor.user.username} (${actor.user.id})`,
						),
				);
			}

			return {
				components: [container, row],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		JoinMessage: (
			actor: Exclude<ButtonInteraction['member'], null>,
		): MessageCreateOptions => ({
			content: `${userMention(actor.user.id)} se unió al ticket.`,
		}),

		LockingMessage: (
			actor: Exclude<ButtonInteraction['member'], null>,
		): MessageCreateOptions => ({
			content: `${userMention(actor.user.id)} cerró el ticket.`,
		}),

		UnlockingMessage: (
			actor: Exclude<ButtonInteraction['member'], null>,
		): MessageCreateOptions => ({
			content: `${userMention(actor.user.id)} abrió el ticket.`,
		}),
	} as const,
	Actions: {
		Created: (thread: PrivateThreadChannel): InteractionEditReplyOptions => {
			const container = new ContainerBuilder();

			const header = new TextDisplayBuilder().setContent(
				`-# Tu [ticket](${thread.url}) ha sido creado correctamente.`,
			);

			const row = new ActionRowBuilder<ButtonBuilder>(),
				button = new ButtonBuilder()
					.setURL(thread.url)
					.setStyle(ButtonStyle.Link)
					.setLabel('Ir al ticket');

			container.addTextDisplayComponents(header);

			return {
				components: [container, row.addComponents(button)],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Joined: (
			ticket: PrivateThreadChannel,
			notificationMessageId: Snowflake,
		): InteractionEditReplyOptions => {
			const container = new ContainerBuilder();

			const header = new TextDisplayBuilder().setContent(
				'-# Has sido agregado correctamente al ticket.',
			);

			const row = new ActionRowBuilder<ButtonBuilder>(),
				button = new ButtonBuilder()
					.setURL(`${ticket.url}/${notificationMessageId}`)
					.setStyle(ButtonStyle.Link)
					.setLabel('Ir al ticket');

			container.addTextDisplayComponents(header);

			return {
				components: [container, row.addComponents(button)],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Locked: (): InteractionEditReplyOptions => {
			const container = new ContainerBuilder();

			const header = new TextDisplayBuilder().setContent(
				'-# El ticket ha sido cerrado correctamente.',
			);

			container.addTextDisplayComponents(header);

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Unlocked: (): InteractionEditReplyOptions => {
			const container = new ContainerBuilder();

			const header = new TextDisplayBuilder().setContent(
				'-# El ticket ha sido abierto correctamente.',
			);

			container.addTextDisplayComponents(header);

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	},
} as const;
