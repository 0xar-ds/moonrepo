import { HttpStatus, Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Collection, GuildMember, Role, Snowflake } from 'discord.js';

import {
	CustomizationChoices,
	CustomizationDefinition,
	CustomizationKind,
	CustomizationKindToSelectionType,
} from '#lib/customization/index.js';

import { Exception, StatusCode } from '#lib/exception.js';

import { DiscordGatewayService } from '#services/index.js';

@Injectable()
export abstract class CustomizationService<
	T extends CustomizationDefinition,
	C extends CustomizationChoices<T>,
> {
	constructor(
		@OgmaLogger(CustomizationService.name)
		protected readonly logger: OgmaService,

		protected readonly context: DiscordGatewayService,
	) {}

	public abstract getChoices(): C;

	// TODO: consider deprecating
	public async assignChoice(
		member: GuildMember,
		choice: T,
		choices: C = this.getChoices(),
	) {
		this.logger.info(`Setting choice ${choice.label} (${choice.value})...`);

		this.validateChoiceSelection(choice, choices);

		const result = await this.applyChoice(member, choice);

		this.logger.info(
			`Successfully set choice ${choice.label} (${choice.value}) for member ${member.user.username} (${member.user.id}).`,
		);

		return result;
	}

	public async selectChoices(
		target: GuildMember,
		choices: C = this.getChoices(),
	): Promise<void> {
		this.logger.info(
			`Adding choices ${Array.from(choices)
				.map(([id, choice]) => `${choice.label} (${id})`)
				.join(', ')} to member ${target.user.username} (${target.user.id})...`,
		);

		try {
			for (const [, choice] of choices) await this.applyChoice(target, choice);

			return void this.logger.info(`Successfully added all choices to member.`);
		} catch (e) {
			this.logger.error(`Failed to add a choice to member.`);

			throw e;
		}
	}

	public async deselectChoices(
		target: GuildMember,
		choices: C = this.getChoices(),
	): Promise<void> {
		this.logger.info(
			`Removing choices ${Array.from(choices)
				.map(([id, choice]) => `${choice.label} (${id})`)
				.join(
					', ',
				)} from member ${target.user.username} (${target.user.id})...`,
		);

		try {
			for (const [, choice] of choices) await this.removeChoice(target, choice);

			return void this.logger.info(
				`Successfully removed all choices from member.`,
			);
		} catch (e) {
			this.logger.error(`Failed to remove a choice from member.`);

			throw e;
		}
	}

	public async spliceChoices(
		target: GuildMember,
		selection: C,
		choices: C = this.getChoices(),
	) {
		this.logger.info(
			`Synchronizing choices to selection ${Array.from(selection)
				.map(([id, choice]) => `${choice.label} (${id})`)
				.join(', ')}...`,
		);

		const remove = choices.filter(
			(option) => !selection.has(option.value),
		) as C;

		// TODO: try catch a bunch of shit on this service.
		// so we do proper exception-raising at public levels of this service

		await this.deselectChoices(target, remove);

		return await this.selectChoices(target, selection);
	}

	public getChoiceForId(
		snowflake: Snowflake,
		choices: C = this.getChoices(),
	): T {
		for (const [id, choice] of choices) {
			if (id === snowflake) return choice;
		}

		throw new Exception(StatusCode.UNPROCESSABLE_ENTITY);
	}

	public filterChoicesByIds(
		ids: Snowflake[],
		choices: C = this.getChoices(),
	): C {
		return choices.filter((choice) =>
			ids.some((id) => id === choice.value),
		) as C;
	}

	public getChoicesForSelection(
		actor: GuildMember,
		selection: CustomizationKindToSelectionType[CustomizationKind],
		choices: C = this.getChoices(),
	): C {
		if (selection[0] === 'CLEAR_OPTIONS')
			return choices.filter((choice) =>
				actor.roles.cache.has(choice.value),
			) as C;

		return this.filterChoicesByIds(selection, choices);
	}

	private async applyChoice(
		target: GuildMember,
		choice: T,
	): Promise<GuildMember> {
		this.logger.verbose(
			`Applying choice ${choice.label} (${choice.value}) to member...`,
		);

		if (target.roles.cache.has(choice.value)) {
			this.logger.verbose(
				`Choice ${choice.label} (${choice.value}) is already assigned to member, skipping addition.`,
			);

			return target;
		}

		try {
			const result = await target.roles.add(choice.value);

			this.logger.verbose(
				`Applied choice ${choice.label} (${choice.value}) to member.`,
			);

			return result;
		} catch (e) {
			this.logger.error(
				`Failed to apply choice ${choice.label} (${choice.value}) to member.`,
			);

			throw e;
		}
	}

	private async removeChoice(
		target: GuildMember,
		choice: T,
	): Promise<GuildMember> {
		this.logger.verbose(
			`Removing choice ${choice.label} (${choice.value}) to member...`,
		);

		if (!target.roles.cache.has(choice.value)) {
			this.logger.verbose(
				`Choice ${choice.label} (${choice.value}) is not assigned to member, skipping removal.`,
			);

			return target;
		}

		try {
			const result = await target.roles.remove(choice.value);

			this.logger.verbose(
				`Removed choice ${choice.label} (${choice.value}) to member.`,
			);

			return result;
		} catch (e) {
			this.logger.error(
				`Failed to remove choice ${choice.label} (${choice.value}) to member.`,
			);

			throw e;
		}
	}

	private findChoiceRole(roles: Collection<string, Role>, choice: T) {
		this.logger.verbose('Retrieving choice-role within found roles...');

		const role = roles.find((item) => item.id === choice.value);

		if (!role) {
			const message = `Choice ${choice.label} (${choice.value}) matches to no role within context.`;

			this.logger.error(message);

			throw new Exception({ code: HttpStatus.NOT_FOUND, message });
		}

		return role;
	}

	private validateChoiceSelection(
		choice: T,
		choices: C = this.getChoices(),
	): C {
		this.logger.verbose(
			`Validating choice selection ${choice.label} (${choice.value})...`,
		);

		if (!choices.has(choice.value)) {
			const message = `Choice ${choice.label} (${choice.value}) is not within the schemas of this service`;

			this.logger.error(message);

			throw new Exception(StatusCode.UNPROCESSABLE_ENTITY, message);
		}

		return choices;
	}
}
