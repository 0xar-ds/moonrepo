import { ClientEvents } from 'discord.js';

import { DescriptorMatcher } from '../descriptor.type.js';

export const not =
	<K extends keyof ClientEvents>(
		matcher: DescriptorMatcher<K>,
	): DescriptorMatcher<K> =>
	async (...args) =>
		!(await matcher(...args));
