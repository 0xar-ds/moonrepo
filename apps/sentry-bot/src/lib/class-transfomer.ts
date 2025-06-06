import { Collection } from 'discord.js';

import type { TransformFnParams } from 'class-transformer';

import type { CustomizationDefinition } from './customization/customization.js';

/**
 * Transforms an array of CustomizationDefinition objects into a Collection
 * keyed by the 'value' property of each definition.
 *
 * @param params - The TransformFnParams object containing the value to transform.
 * @returns A Discord.js Collection or the original value if it's not an array.
 */
export function transformCustomizationDefinitionsToCollection<
	T extends CustomizationDefinition,
>(
	params: Omit<TransformFnParams, 'value'> & { value: T[] },
): Collection<string, T> | unknown {
	const value = params.value;

	if (!Array.isArray(value)) return value;

	const collection = new Collection<string, T>();

	value.forEach((definition) => collection.set(definition.value, definition));

	return collection;
}
