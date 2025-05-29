import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Collection, GuildMember } from 'discord.js';

import { ColorsCustomizationSchema } from '#config/schema/features/index.js';

import { ColorDefinition, ColorChoices } from '#lib/customization/index.js';

import {
	DiscordGatewayService,
	CustomizationService,
} from '#services/index.js';

@Injectable()
export class ColorCustomizationService extends CustomizationService<
	ColorDefinition,
	ColorChoices
> {
	constructor(
		@OgmaLogger(ColorCustomizationService)
		logger: OgmaService,
		context: DiscordGatewayService,

		private readonly config: ColorsCustomizationSchema,
	) {
		super(logger, context);
	}

	public override async assignChoice(
		member: GuildMember,
		choice: ColorDefinition,
		choices?: ColorChoices,
	): Promise<GuildMember> {
		const result = await super.assignChoice(member, choice, choices);

		await super.spliceChoices(
			member,
			new Collection([[choice.value, choice]]),
			choices,
		);

		return result;
	}

	override getChoices(): ColorChoices {
		return this.config.choices;
	}
}
