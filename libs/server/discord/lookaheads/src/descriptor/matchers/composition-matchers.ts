import { ClientEvents } from 'discord.js';

import { DescriptorMatcher } from '../descriptor.type.js';

const andParallel =
	<K extends keyof ClientEvents>(
		...matchers: DescriptorMatcher<K>[]
	): DescriptorMatcher<K> =>
	async (...args) =>
		(await Promise.all(matchers.map((matcher) => matcher(...args)))).every(
			(v) => v === true,
		);

const andSequential =
	<K extends keyof ClientEvents>(
		...matchers: DescriptorMatcher<K>[]
	): DescriptorMatcher<K> =>
	async (...args) => {
		for (const matcher of matchers) {
			if (!(await matcher(...args))) return false;
		}

		return true;
	};

const orParallel =
	<K extends keyof ClientEvents>(
		...matchers: DescriptorMatcher<K>[]
	): DescriptorMatcher<K> =>
	async (...args) =>
		(await Promise.all(matchers.map((matcher) => matcher(...args)))).some(
			(v) => v === true,
		);

const orSequential =
	<K extends keyof ClientEvents>(
		...matchers: DescriptorMatcher<K>[]
	): DescriptorMatcher<K> =>
	async (...args) => {
		for (const matcher of matchers) {
			if (await matcher(...args)) return true;
		}

		return false;
	};

export const Or = {
	Parallel: orParallel,
	Sequential: orSequential,
} as const;

export const And = {
	Parallel: andParallel,
	Sequential: andSequential,
} as const;
