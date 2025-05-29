import {
	GuildMember,
	VoiceChannel,
	MessageCreateOptions,
	TextDisplayBuilder,
	ContainerBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	formatEmoji,
	spoiler,
	userMention,
	SeparatorSpacingSize,
	MessageFlags,
	StringSelectMenuBuilder,
	InteractionEditReplyOptions,
	subtext,
	ButtonStyle,
	MediaGalleryBuilder,
	SeparatorBuilder,
} from 'discord.js';

import { Mutable } from '#lib/mutable.js';

import { formatComponentEmojiResolvable } from '#lib/emoji.js';

import {
	CustomizationKind,
	CustomizationSchemaMap,
	CustomizationChoices,
	CustomizationDefinition,
} from '#lib/customization/index.js';

import { Components } from './components.js';

export const Messages = {
	Onboarding: {
		WelcomeMessage: (
			member: GuildMember,
			activeVoiceChannel: VoiceChannel | undefined = undefined,
			colorsChannelURL = 'https://discord.com/channels/1285051244871946243/1372850097854873601',
			rolesChannelURL = 'https://discord.com/channels/1285051244871946243/1372850142507569244',
		): MessageCreateOptions => {
			const components = [],
				header = new TextDisplayBuilder(),
				container = new ContainerBuilder().setAccentColor(7405431),
				row = new ActionRowBuilder<ButtonBuilder>();

			header.setContent(
				`${formatEmoji('1376751476415926384')} ${spoiler(userMention(member.user.id))}`,
			);

			{
				container.addTextDisplayComponents((text) =>
					text.setContent(
						`¡Bienvenido a la comunidad, ${member.user.displayName}!`,
					),
				);

				container.addSeparatorComponents((separator) =>
					separator.setSpacing(SeparatorSpacingSize.Small).setDivider(false),
				);
			}

			container.addActionRowComponents((row) =>
				row.addComponents(
					Components.Onboarding.WelcomeMessage.Buttons.ColorsChannel(
						colorsChannelURL,
					),
					Components.Onboarding.WelcomeMessage.Buttons.RolesChannel(
						rolesChannelURL,
					),
				),
			);

			components.push(header, container);

			if (activeVoiceChannel)
				components.push(
					row.addComponents(
						Components.Buttons.VoiceChannel.JoinSome(activeVoiceChannel.url),
					),
				);

			return {
				components: components,
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	} as const,

	Customization: {
		InterfaceMessage: <T extends CustomizationKind>(
			kind: T,
			config: CustomizationSchemaMap[T],
		): MessageCreateOptions => {
			const components: Mutable<MessageCreateOptions['components']> = [];

			const row = new ActionRowBuilder<StringSelectMenuBuilder>(),
				menu = new StringSelectMenuBuilder({
					customId: `customization/${kind}`,
				}),
				gallery = new MediaGalleryBuilder(),
				separator = new SeparatorBuilder({
					divider: true,
					spacing: SeparatorSpacingSize.Large,
				});

			const container = new ContainerBuilder();

			let banner: string;

			switch (kind) {
				case CustomizationKind.Notification: {
					components.push(gallery, row);

					banner = config.panel_banner;

					menu.setMinValues(1);
					menu.setMaxValues(config.choices.size);

					menu.setOptions(...config.choices.values());

					break;
				}
				case CustomizationKind.Country: {
					components.push(gallery, row);

					banner = config.panel_banner;

					menu.setMinValues(1);
					menu.setMaxValues(1);

					menu.setOptions(...config.choices.values(), {
						value: 'CLEAR_OPTIONS',
						label: 'Quitar país',
						emoji: '1376751550621286440',
					});

					break;
				}
				case CustomizationKind.Gender: {
					components.push(gallery, row);

					banner = config.panel_banner;

					menu.setMinValues(1);
					menu.setMaxValues(1);

					menu.setOptions(...config.choices.values(), {
						value: 'CLEAR_OPTIONS',
						label: 'Quitar género',
						emoji: '1376751550621286440',
					});

					break;
				}
				case CustomizationKind.Color: {
					components.push(container, row);

					banner = config.panel_banner;

					container.addMediaGalleryComponents(gallery);
					container.addSeparatorComponents(separator);

					for (const [index, display] of (
						config as CustomizationSchemaMap[CustomizationKind.Color]
					).panel_options_banners.entries()) {
						container.addMediaGalleryComponents((gallery) =>
							gallery.addItems((picture) => picture.setURL(display)),
						);

						if (
							index !==
							(config as CustomizationSchemaMap[CustomizationKind.Color])
								.panel_options_banners.length -
								1
						)
							container.addSeparatorComponents((separator) =>
								separator
									.setDivider(false)
									.setSpacing(SeparatorSpacingSize.Small),
							);
					}

					menu.setMinValues(1);
					menu.setMaxValues(1);

					menu.setOptions(...config.choices.values(), {
						value: 'CLEAR_OPTIONS',
						label: 'Quitar color',
						emoji: '1376751550621286440',
					});

					break;
				}
			}

			gallery.addItems((picture) => picture.setURL(banner));

			row.addComponents(menu);

			return {
				components,
				flags: [MessageFlags.IsComponentsV2],
			};
		},

		Actions: {
			Selected: (
				choices: CustomizationChoices<CustomizationDefinition>,
			): InteractionEditReplyOptions => {
				const components: Mutable<InteractionEditReplyOptions['components']> =
					[];

				const container = new ContainerBuilder();

				container.addTextDisplayComponents((text) =>
					text.setContent(
						[
							'Has elegido las siguientes opciones: ',
							[...choices.values()]
								.map((choice) =>
									choice.emoji
										? `${formatComponentEmojiResolvable(choice.emoji)}・${choice.label}`
										: choice.label,
								)
								.join('\n'),
						].join('\n'),
					),
				);

				components.push(container);

				return {
					components,
					flags: [MessageFlags.IsComponentsV2],
				};
			},
			Deselected: (
				choices: CustomizationChoices<CustomizationDefinition>,
			): InteractionEditReplyOptions => {
				const components: Mutable<InteractionEditReplyOptions['components']> =
					[];

				const container = new ContainerBuilder();

				container.addTextDisplayComponents((text) =>
					text.setContent(
						[
							'Se te han removido las siguientes opciones: ',
							[...choices.values()]
								.map((choice) =>
									choice.emoji
										? `${formatComponentEmojiResolvable(choice.emoji)}・${choice.label}`
										: choice.label,
								)
								.join('\n'),
						].join('\n'),
					),
				);

				components.push(container);

				return {
					components,
					flags: [MessageFlags.IsComponentsV2],
				};
			},
		} as const,

		Overview: (
			banner = 'https://i.imgur.com/krAEQR1.png',
		): MessageCreateOptions => {
			const container = new ContainerBuilder();

			{
				container.addMediaGalleryComponents((gallery) =>
					gallery.addItems((picture) => picture.setURL(banner)),
				);

				container.addSeparatorComponents((separator) =>
					separator.setDivider(true).setSpacing(SeparatorSpacingSize.Large),
				);
			}

			container.addSectionComponents((section) =>
				section
					.addTextDisplayComponents((text) =>
						text.setContent(
							[
								'Género o sexo',
								subtext('¿Te identificas como hombre, mujer, no binario...?'),
							].join('\n'),
						),
					)
					.setButtonAccessory((button) =>
						button
							.setStyle(ButtonStyle.Secondary)
							.setEmoji({ id: '1376752164004696096' })
							.setCustomId(`customize/${CustomizationKind.Gender}`),
					),
			);

			container.addSectionComponents((section) =>
				section
					.addTextDisplayComponents((text) =>
						text.setContent(
							[
								'País o región',
								subtext(
									'¿Sos de Argentina, Chile, España, Colombia, América, Europa...?',
								),
							].join('\n'),
						),
					)
					.setButtonAccessory((button) =>
						button
							.setStyle(ButtonStyle.Secondary)
							.setEmoji({ id: '1376752164004696096' })
							.setCustomId(`customize/${CustomizationKind.Country}`),
					),
			);

			container.addSectionComponents((section) =>
				section
					.addTextDisplayComponents((text) =>
						text.setContent(
							[
								'Notificaciones o menciones',
								subtext(
									'¿Querés enterarte de eventos, anuncios, sorteos, actividades...?',
								),
							].join('\n'),
						),
					)
					.setButtonAccessory((button) =>
						button
							.setStyle(ButtonStyle.Secondary)
							.setEmoji({ id: '1376752164004696096' })
							.setCustomId(`customize/${CustomizationKind.Notification}`),
					),
			);

			return {
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
			};
		},
	} as const,
} as const;
