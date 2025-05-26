import {
	ActionRowBuilder,
	ButtonBuilder,
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
	TextBasedChannel,
	subtext,
	unorderedList,
	hyperlink,
	formatEmoji,
	User,
} from 'discord.js';

import { TicketKind, TicketKindToSpeechMap } from '../tickets.js';

import { Buttons } from './button.js';
import { ButtonActor } from '../button.js';

export const Messages = {
	Panel: {
		InterfaceMessage: (
			channel: TextBasedChannel,
			allowedTypes: Set<TicketKind>,
			bannerImageURL: string,
		): MessageCreateOptions => {
			const container = new ContainerBuilder(),
				separator = new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Large);

			container.addMediaGalleryComponents((gallery) =>
				gallery.addItems((image) =>
					image.setURL(bannerImageURL).setDescription('SOS GAMER?'),
				),
			);

			container.addSeparatorComponents(separator);

			for (const kind of allowedTypes) {
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
								.setCustomId(`tickets_create/${channel.id}/${kind}`),
						),
				);

				if (kind === TicketKind.Application) {
					container
						.addSeparatorComponents((separator) =>
							separator.setSpacing(SeparatorSpacingSize.Large).setDivider(true),
						)
						.addTextDisplayComponents((text) =>
							text.setContent('Requisitos para ser staff'),
						)
						.addTextDisplayComponents(
							(text) =>
								text.setContent(
									unorderedList([
										'Edad mínima de 15 años',
										'Alta disponibilidad horaria (3 a 6 horas diarias)',
										'Intención de aportar a que crezca la comunidad',
										'Habilidades comunicacionales básicas',
									]),
								),
							(text) =>
								text.setContent(
									subtext(
										`Toda persona con la intención de ser integrante del Staff, se compromete a cumplir con las ${formatEmoji('1285056215977824366')} ${hyperlink('Community Guidelines de Discord', 'https://discord.com/guidelines')} inclusive afuera de nuestro servidor.`,
									),
								),
						);
				}
			}

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	} as const,
	Ticket: {
		InitialMessage: (
			actor: ButtonActor,
			thread: PrivateThreadChannel,
		): MessageCreateOptions => {
			const content: string[] = [],
				row = new ActionRowBuilder<ButtonBuilder>();

			content.push(
				`${userMention(actor.id)} Tu ticket ha sido creado.`,
				'',
				'Por favor, proporcione cualquier información adicional que considere relevante para ayudarnos a responder más rápido.',
			);

			return {
				content: content.join('\n'),
				components: [
					row.addComponents(
						Buttons.Ticket.Lock(thread, actor.id),
						Buttons.Ticket.Unlock(thread, actor.id),
					),
				],
			};
		},

		NotificationMessage: (
			targets: Snowflake[],
			actor: ButtonActor,
			thread: PrivateThreadChannel,
			kind: TicketKind,
		): MessageCreateOptions => {
			const container = new ContainerBuilder(),
				row = new ActionRowBuilder<ButtonBuilder>(),
				separator = new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Large);

			container.addTextDisplayComponents((text) =>
				text.setContent(
					`${spoiler(targets.map((id) => roleMention(id)).join(' '))}, un ticket ha sido creado.`,
				),
			);

			container.addSeparatorComponents(separator);

			container.addTextDisplayComponents(
				(text) => text.setContent(`Id: ${thread.id}`),
				(text) => text.setContent(`Tipo: ${kind}`),
				(text) =>
					text.setContent(`Creado por: ${actor.username} (${actor.id})`),
			);

			return {
				components: [
					container,
					row.addComponents(
						Buttons.Ticket.Join(thread),
						Buttons.Ticket.Lock(thread, actor.id),
						Buttons.Ticket.Unlock(thread, actor.id),
					),
				],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		JoinMessage: (actor: ButtonActor): MessageCreateOptions => ({
			content: `${userMention(actor.id)} se unió al ticket.`,
		}),

		LockingMessage: (actor: ButtonActor): MessageCreateOptions => ({
			content: `${userMention(actor.id)} cerró el ticket.`,
		}),

		LockedNotification: (
			actor: ButtonActor,
			owner: User,
			thread: PrivateThreadChannel,
			kind: TicketKind,
		): MessageCreateOptions => {
			const container = new ContainerBuilder(),
				row = new ActionRowBuilder<ButtonBuilder>();

			const header = new TextDisplayBuilder().setContent(
				subtext(
					`Tu ${hyperlink('ticket', thread.url)} (${kind.toLowerCase()}) ha sido cerrado por ${userMention(actor.id)}.`,
				),
			);

			container.addTextDisplayComponents(header);

			return {
				components: [
					container,
					row.addComponents(
						Buttons.Ticket.View(thread),
						Buttons.Ticket.Unlock(thread, owner.id),
					),
				],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		UnlockingMessage: (actor: ButtonActor): MessageCreateOptions => ({
			content: `${userMention(actor.id)} abrió el ticket.`,
		}),
	} as const,
	Actions: {
		Created: (thread: PrivateThreadChannel): InteractionEditReplyOptions => {
			const container = new ContainerBuilder(),
				row = new ActionRowBuilder<ButtonBuilder>();

			const header = new TextDisplayBuilder().setContent(
				subtext(
					`Tu ${hyperlink('ticket', thread.url)} ha sido creado correctamente.`,
				),
			);

			container.addTextDisplayComponents(header);

			return {
				components: [container, row.addComponents(Buttons.Ticket.View(thread))],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Joined: (thread: PrivateThreadChannel): InteractionEditReplyOptions => {
			const container = new ContainerBuilder(),
				row = new ActionRowBuilder<ButtonBuilder>();

			const header = new TextDisplayBuilder().setContent(
				subtext('Has sido agregado correctamente al ticket.'),
			);

			container.addTextDisplayComponents(header);

			return {
				components: [container, row.addComponents(Buttons.Ticket.View(thread))],
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Locked: (): InteractionEditReplyOptions => {
			const container = new ContainerBuilder();

			const header = new TextDisplayBuilder().setContent(
				subtext('El ticket ha sido cerrado correctamente.'),
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
				subtext('El ticket ha sido abierto correctamente.'),
			);

			container.addTextDisplayComponents(header);

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	},
} as const;
