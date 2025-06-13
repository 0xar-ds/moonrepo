import { AppStatus, HttpStatus, StatusDescription } from '@~server/core-api';

export class Exception<T> extends Error {
	public readonly code: HttpStatus | AppStatus;

	public readonly data: Nullable<T>;

	constructor(
		description: StatusDescription,
		overrideMessage?: string,
		data?: T,
	) {
		super();

		this.name = this.constructor.name;

		this.code = description.code;
		this.data = data ?? null;
		this.message = overrideMessage || description.message;

		Error.captureStackTrace(this, this.constructor);
	}
}
