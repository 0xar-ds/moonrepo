import { Injectable, UseGuards } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import {
	ButtonInteraction,
	GuildMember,
	StringSelectMenuInteraction,
} from 'discord.js';

import {
	Button,
	ComponentParam,
	Context,
	SelectedStrings,
	StringSelect,
} from 'necord';

import { CustomizationFeatureSchema } from '#config/schema/features/index.js';
import { DeferReplyGuard } from '#guards/defer-reply.guard.js';

import {
	CustomizationKind,
	CustomizationKindToSelectionType,
} from '#lib/customization/index.js';

import { Exception } from '#lib/exception.js';
import { convertMessageCreateOptionsToInteractionEditReplyOptions } from '#lib/message.js';
import { Messages } from '#lib/ui/messages.js';

import {
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
} from '#services/index.js';

@Injectable()
export class CustomizationController {
	constructor(
		@OgmaLogger(CustomizationController)
		private readonly logger: OgmaService,

		private readonly notifications: NotificationCustomizationService,
		private readonly countries: CountryCustomizationService,
		private readonly genders: GenderCustomizationService,
		private readonly colors: ColorCustomizationService,

		private readonly config: CustomizationFeatureSchema,
	) {}

	@StringSelect('customization/color')
	@UseGuards(DeferReplyGuard)
	public async onColorSelect<T extends CustomizationKind.Color>(
		@Context() [interaction]: [StringSelectMenuInteraction],
		@SelectedStrings() selection: CustomizationKindToSelectionType[T],
	) {
		if (!selection || !(interaction?.member instanceof GuildMember))
			return void (await interaction
				.editReply({ content: 'Interaction not-acceptable.' })
				.catch());

		const choices = this.colors.getChoicesSchema(),
			selections = this.colors.getChoicesForSelection(
				interaction.member,
				selection,
				choices,
			);

		try {
			if (selection[0] === 'CLEAR_OPTIONS') {
				await this.colors.deselectChoices(interaction.member, selections);

				return void (await interaction.editReply(
					Messages.Customization.Actions.Deselected(selections),
				));
			}

			await this.colors.spliceChoices(interaction.member, selections, choices);

			return void (await interaction.editReply(
				Messages.Customization.Actions.Selected(selections),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@StringSelect('customization/gender')
	@UseGuards(DeferReplyGuard)
	public async onGenderSelect<T extends CustomizationKind.Gender>(
		@Context() [interaction]: [StringSelectMenuInteraction],
		@SelectedStrings() selection: CustomizationKindToSelectionType[T],
	) {
		if (!selection || !(interaction?.member instanceof GuildMember))
			return void (await interaction
				.editReply({ content: 'Interaction not-acceptable.' })
				.catch());

		const choices = this.genders.getChoicesSchema(),
			selections = this.genders.getChoicesForSelection(
				interaction.member,
				selection,
				choices,
			);

		try {
			if (selection[0] === 'CLEAR_OPTIONS') {
				await this.genders.deselectChoices(interaction.member, selections);

				return void (await interaction.editReply(
					Messages.Customization.Actions.Deselected(selections),
				));
			}

			await this.genders.spliceChoices(interaction.member, selections, choices);

			return void (await interaction.editReply(
				Messages.Customization.Actions.Selected(selections),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@StringSelect('customization/country')
	@UseGuards(DeferReplyGuard)
	public async onCountrySelect<T extends CustomizationKind.Country>(
		@Context() [interaction]: [StringSelectMenuInteraction],
		@SelectedStrings() selection: CustomizationKindToSelectionType[T],
	) {
		if (!selection || !(interaction?.member instanceof GuildMember))
			return void (await interaction
				.editReply({ content: 'Interaction not-acceptable.' })
				.catch());

		const choices = this.countries.getChoicesSchema(),
			selections = this.countries.getChoicesForSelection(
				interaction.member,
				selection,
				choices,
			);

		try {
			if (selection[0] === 'CLEAR_OPTIONS') {
				await this.countries.deselectChoices(interaction.member, selections);

				return void (await interaction.editReply(
					Messages.Customization.Actions.Deselected(selections),
				));
			}

			await this.countries.spliceChoices(
				interaction.member,
				selections,
				choices,
			);

			return void (await interaction.editReply(
				Messages.Customization.Actions.Selected(selections),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@StringSelect('customization/notifications')
	@UseGuards(DeferReplyGuard)
	public async onNotificationsSelect<T extends CustomizationKind.Notification>(
		@Context() [interaction]: [StringSelectMenuInteraction],
		@SelectedStrings() selection: CustomizationKindToSelectionType[T],
	) {
		if (!selection || !(interaction?.member instanceof GuildMember))
			return void (await interaction
				.editReply({ content: 'Interaction not-acceptable.' })
				.catch());

		const choices = this.notifications.getChoicesSchema(),
			selections = this.notifications.getChoicesForSelection(
				interaction.member,
				selection,
				choices,
			);

		try {
			if (selection.length === 0 || selection[0] === 'CLEAR_OPTIONS') {
				await this.notifications.deselectChoices(
					interaction.member,
					selections,
				);

				return void (await interaction.editReply(
					Messages.Customization.Actions.Deselected(selections),
				));
			}

			await this.notifications.spliceChoices(
				interaction.member,
				selections,
				choices,
			);

			return void (await interaction.editReply(
				Messages.Customization.Actions.Selected(selections),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@Button('customize/:type')
	@UseGuards(DeferReplyGuard)
	public async onCustomizeRequest(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('type') type: CustomizationKind,
	) {
		try {
			return void (await interaction.editReply(
				convertMessageCreateOptionsToInteractionEditReplyOptions(
					Messages.Customization.InterfaceMessage(
						type,
						this.getSchemaByCustomizationRequestKind(type),
					),
				),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	private getSchemaByCustomizationRequestKind<T extends CustomizationKind>(
		kind: T,
	) {
		return (
			{
				[CustomizationKind.Color]: this.config.colors,
				[CustomizationKind.Gender]: this.config.genders,
				[CustomizationKind.Country]: this.config.countries,
				[CustomizationKind.Notification]: this.config.notifications,
			} as const
		)[kind];
	}
}
