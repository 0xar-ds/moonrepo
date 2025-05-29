import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Collection, GuildMember } from 'discord.js';

import { CountriesCustomizationSchema } from '#config/schema/features/index.js';

import { CountryChoices, CountryDefinition } from '#lib/customization/index.js';

import {
	DiscordGatewayService,
	CustomizationService,
} from '#services/index.js';

@Injectable()
export class CountryCustomizationService extends CustomizationService<
	CountryDefinition,
	CountryChoices
> {
	constructor(
		@OgmaLogger(CountryCustomizationService)
		logger: OgmaService,
		context: DiscordGatewayService,

		private readonly config: CountriesCustomizationSchema,
	) {
		super(logger, context);
	}

	public override async assignChoice(
		member: GuildMember,
		choice: CountryDefinition,
		choices?: CountryChoices,
	): Promise<GuildMember> {
		const result = await super.assignChoice(member, choice, choices);

		await super.spliceChoices(
			member,
			new Collection([[choice.value, choice]]),
			choices,
		);

		return result;
	}

	override getChoices(): CountryChoices {
		return this.config.choices;
	}
}
