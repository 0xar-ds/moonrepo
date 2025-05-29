import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Collection, GuildMember } from 'discord.js';

import { GendersCustomizationSchema } from '#config/schema/features/index.js';

import { GenderDefinition, GenderChoices } from '#lib/customization/index.js';

import {
	DiscordGatewayService,
	CustomizationService,
} from '#services/index.js';

@Injectable()
export class GenderCustomizationService extends CustomizationService<
	GenderDefinition,
	GenderChoices
> {
	constructor(
		@OgmaLogger(GenderCustomizationService)
		logger: OgmaService,
		context: DiscordGatewayService,

		private readonly config: GendersCustomizationSchema,
	) {
		super(logger, context);
	}

	public override async assignChoice(
		member: GuildMember,
		choice: GenderDefinition,
		choices?: GenderChoices,
	): Promise<GuildMember> {
		const result = await super.assignChoice(member, choice, choices);

		await super.spliceChoices(
			member,
			new Collection([[choice.value, choice]]),
			choices,
		);

		return result;
	}

	override getChoices(): GenderChoices {
		return this.config.choices;
	}
}
