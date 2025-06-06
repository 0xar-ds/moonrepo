import { from, of, switchMap, throwError } from 'rxjs';

export function fetchOrThrow<T, Err extends () => Error>(
	promise: Promise<T | (null | undefined)>,
	error: Err,
) {
	return from(promise).pipe(
		switchMap((result) => (result ? of(result) : throwError(error))),
	);
}
