import { HttpStatus } from '@nestjs/common';

import { AppStatus } from '@~shared/status';

export { AppStatus, HttpStatus };

export interface StatusDescription {
	code: HttpStatus | AppStatus;
	message: string;
}

export class Status {
	public static SUCCESS: StatusDescription = {
		code: HttpStatus.OK,
		message: 'Success.',
	};

	public static BAD_REQUEST_ERROR: StatusDescription = {
		code: HttpStatus.BAD_REQUEST,
		message: 'Bad request.',
	};

	public static UNAHOTIRZED_ERROR: StatusDescription = {
		code: HttpStatus.UNAUTHORIZED,
		message: 'Unauthorized.',
	};

	public static ACCESS_DENIED_ERROR: StatusDescription = {
		code: HttpStatus.FORBIDDEN,
		message: 'Forbidden.',
	};

	public static SERVICE_UNAVAILABLE = {
		code: HttpStatus.SERVICE_UNAVAILABLE,
		message: 'Service accessed or depended-on is not available.',
	};

	public static UNPROCESSABLE_ENTITY = {
		code: HttpStatus.UNPROCESSABLE_ENTITY,
		message:
			'Entity accessed or specified is not within the schemas of the application.',
	};

	public static INTERNAL_ERROR: StatusDescription = {
		code: HttpStatus.INTERNAL_SERVER_ERROR,
		message: 'Internal error.',
	};

	public static NOT_FOUND_ERROR: StatusDescription = {
		code: HttpStatus.NOT_FOUND,
		message: 'Not found.',
	};
}
