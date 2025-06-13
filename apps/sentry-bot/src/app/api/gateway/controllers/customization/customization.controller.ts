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

import { Exception } from '@~shared/exceptions';

import { CustomizationFeatureSchema } from '#config/schema/features/index.js';
import { DeferReplyGuard } from '#guards/defer-reply.guard.js';
import { CustomizationKind } from '#lib/customization/index.js';
import { convertMessageCreateOptionsToInteractionEditReplyOptions } from '#lib/message.js';
import { Messages } from '#lib/ui/messages.js';

import {
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
} from '#services/index.js';

import type {
	SchemaFor,
	SelectionFor,
	ServiceFor,
} from '#lib/customization/index.js';

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

	@StringSelect('customization/:type')
	@UseGuards(DeferReplyGuard)
	public async onCustomizationSelect<T extends CustomizationKind>(
		@ComponentParam('type') kind: CustomizationKind,
		@Context() [interaction]: [StringSelectMenuInteraction],
		@SelectedStrings() selection: SelectionFor<T>,
	) {
		if (!selection || !(interaction?.member instanceof GuildMember))
			return void (await interaction
				.editReply({ content: 'Interaction not-acceptable.' })
				.catch());

		const service = this.getServiceByCustomizationRequestKind(kind);

		const choices = service.getChoicesSchema();

		const selections = service.getChoicesForSelection(
			interaction.member,
			selection,
			/** @ts-expect-error: typescript is dumb and doesnt properly narrow the union */
			choices,
		);

		try {
			if (selection[0] === 'CLEAR_OPTIONS') {
				await service.deselectChoices(
					interaction.member,
					/** @ts-expect-error: typescript is dumb and doesnt properly narrow the union */
					selections,
				);

				return void (await interaction.editReply(
					Messages.Customization.Actions.Deselected(selections),
				));
			}

			await service.spliceChoices(
				interaction.member,
				/** @ts-expect-error: typescript is dumb and doesnt properly narrow the union */
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
	): SchemaFor<T> {
		const map = {
			[CustomizationKind.Color]: this.config.colors,
			[CustomizationKind.Gender]: this.config.genders,
			[CustomizationKind.Country]: this.config.countries,
			[CustomizationKind.Notification]: this.config.notifications,
		} as const;

		return map[kind] as unknown as SchemaFor<T>;
	}

	private getServiceByCustomizationRequestKind<T extends CustomizationKind>(
		kind: T,
	): ServiceFor<T> {
		const map = {
			[CustomizationKind.Color]: this.colors,
			[CustomizationKind.Gender]: this.genders,
			[CustomizationKind.Country]: this.countries,
			[CustomizationKind.Notification]: this.notifications,
		} as const;

		return map[kind] as unknown as ServiceFor<T>;
	}
}
