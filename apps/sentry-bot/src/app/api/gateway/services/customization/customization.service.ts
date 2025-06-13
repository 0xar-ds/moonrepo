import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';
import { Collection, GuildMember, Role, Snowflake } from 'discord.js';
import { map, shareReplay, tap } from 'rxjs';

import { Status } from '@~server/core-api';
import { Exception } from '@~shared/exceptions';

import {
	CustomizationChoices,
	CustomizationDefinition,
	CustomizationKind,
	SelectionFor,
} from '#lib/customization/index.js';

import { SharedRefresh } from '#lib/rxjs/index.js';
import { RolesGatewayService } from '#services/index.js';

@Injectable()
export abstract class CustomizationService<
	T extends CustomizationDefinition,
	C extends CustomizationChoices<T>,
> {
	private readonly roles$: SharedRefresh<Collection<string, Role>>;

	public get roles() {
		return this.roles$;
	}

	constructor(
		@OgmaLogger(CustomizationService.name)
		protected readonly logger: OgmaService,

		@Inject(RolesGatewayService)
		protected readonly gateway: RolesGatewayService,
	) {
		this.roles$ = this.gateway.roles.pipe(
			tap((roles) =>
				this.logger.verbose(
					style.bYellow.apply(`Filtering ${roles.size} roles...`),
				),
			),

			map((roles) => {
				const schema = this.getChoicesSchema();

				return roles.filter((role) => schema.has(role.id));
			}),

			tap((roles) =>
				this.logger.verbose(
					style.bGreen.apply(`Filtered to ${roles.size} roles.`),
				),
			),

			shareReplay({ refCount: false, bufferSize: 1 }),
		);
	}

	public abstract getChoicesSchema(): C;

	public async selectChoices(
		target: GuildMember,
		choices: C = this.getChoicesSchema(),
	): Promise<void> {
		this.logger.log(
			style.bYellow.apply(
				`Adding choices ${Array.from(choices)
					.map(([id, choice]) => `${choice.label} (${id})`)
					.join(
						', ',
					)} to member ${target.user.username} (${target.user.id})...`,
			),
		);

		try {
			for (const [, choice] of choices) await this.applyChoice(target, choice);

			return void this.logger.fine(
				style.bGreen.apply(`Successfully added all choices to member.`),
			);
		} catch (e) {
			this.logger.error(`Failed to add a choice to member.`);

			throw e;
		}
	}

	public async deselectChoices(
		target: GuildMember,
		choices: C = this.getChoicesSchema(),
	): Promise<void> {
		this.logger.log(
			style.bYellow.apply(
				`Removing choices ${Array.from(choices)
					.map(([id, choice]) => `${choice.label} (${id})`)
					.join(
						', ',
					)} from member ${target.user.username} (${target.user.id})...`,
			),
		);

		try {
			for (const [, choice] of choices) await this.removeChoice(target, choice);

			return void this.logger.fine(
				style.bGreen.apply(`Successfully removed all choices from member.`),
			);
		} catch (e) {
			this.logger.error(`Failed to remove a choice from member.`);

			throw e;
		}
	}

	public async spliceChoices(
		target: GuildMember,
		selection: C,
		choices: C = this.getChoicesSchema(),
	): Promise<void> {
		this.logger.log(
			style.bMagenta.apply(
				`Synchronizing choices to selection ${Array.from(selection)
					.map(([id, choice]) => `${choice.label} (${id})`)
					.join(', ')}...`,
			),
		);

		const remove = choices.filter(
			(option) => !selection.has(option.value),
		) as C;

		// TODO: try catch a bunch of shit on this service.
		// so we do proper exception-raising at public levels of this service

		await this.deselectChoices(target, remove);

		await this.selectChoices(target, selection);

		return void this.logger.fine(
			style.bCyan.apply(`Synchronized choices to selection.`),
		);
	}

	public getChoiceForId(
		snowflake: Snowflake,
		choices: C = this.getChoicesSchema(),
	): T {
		for (const [id, choice] of choices) {
			if (id === snowflake) return choice;
		}

		throw new Exception(Status.UNPROCESSABLE_ENTITY);
	}

	public getChoicesForSelection(
		actor: GuildMember,
		selection: SelectionFor<CustomizationKind>,
		choices: C = this.getChoicesSchema(),
	): C {
		if (selection.length === 0 || selection[0] === 'CLEAR_OPTIONS')
			return choices.filter((choice) =>
				actor.roles.cache.has(choice.value),
			) as C;

		return this.filterChoicesByIds(selection, choices);
	}

	protected filterChoicesByIds(
		ids: Snowflake[],
		choices: C = this.getChoicesSchema(),
	): C {
		return choices.filter((choice) =>
			ids.some((id) => id === choice.value),
		) as C;
	}

	private async applyChoice(
		target: GuildMember,
		choice: T,
	): Promise<GuildMember> {
		this.logger.log(
			style.bYellow.apply(
				`Applying choice ${choice.label} (${choice.value}) to member...`,
			),
		);

		if (target.roles.cache.has(choice.value)) {
			this.logger.fine(
				style.bGreen.apply(
					`Choice ${choice.label} (${choice.value}) is already assigned to member, skipping addition.`,
				),
			);

			return target;
		}

		try {
			const result = await target.roles.add(choice.value);

			this.logger.fine(
				style.bGreen.apply(
					`Applied choice ${choice.label} (${choice.value}) to member.`,
				),
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
		this.logger.log(
			style.bYellow.apply(
				`Removing choice ${choice.label} (${choice.value}) to member...`,
			),
		);

		if (!target.roles.cache.has(choice.value)) {
			this.logger.fine(
				style.bGreen.apply(
					`Choice ${choice.label} (${choice.value}) is not assigned to member, skipping removal.`,
				),
			);

			return target;
		}

		try {
			const result = await target.roles.remove(choice.value);

			this.logger.fine(
				style.bGreen.apply(
					`Removed choice ${choice.label} (${choice.value}) to member.`,
				),
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
		choices: C = this.getChoicesSchema(),
	): C {
		this.logger.log(
			`Validating choice selection ${choice.label} (${choice.value})...`,
		);

		if (!choices.has(choice.value)) {
			const message = `Choice ${choice.label} (${choice.value}) is not within the schemas of this service`;

			this.logger.error(message);

			throw new Exception(Status.UNPROCESSABLE_ENTITY, message);
		}

		return choices;
	}
}
