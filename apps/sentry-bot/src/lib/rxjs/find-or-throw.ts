import { Collection } from 'discord.js';
import { of, throwError } from 'rxjs';

export function findInCollectionOrThrow<T, Err extends Error>(
	collection: Collection<string, T>,
	predicate: (item: T) => boolean,
	error: () => Err,
) {
	const found = collection.find(predicate);

	return found ? of(found) : throwError(error);
}
