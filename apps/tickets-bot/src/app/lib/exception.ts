import { HttpStatus } from '@nestjs/common';

export interface StatusCodeDescription {
	code: HttpStatus;
	message: string;
}

export class Exception<T = undefined> extends Error {
	public readonly code: HttpStatus;

	public readonly data: T | undefined;

	constructor(
		description: StatusCodeDescription,
		overrideMessage?: string,
		data?: T,
	) {
		super();

		this.name = this.constructor.name;

		this.code = description.code;
		this.data = data;
		this.message = overrideMessage || description.message;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class StatusCode {
	public static UNPROCESSABLE_ENTITY: StatusCodeDescription = {
		code: HttpStatus.UNPROCESSABLE_ENTITY,
		message:
			'Entity accessed or specified is not within the schemas of the application.',
	};
}
