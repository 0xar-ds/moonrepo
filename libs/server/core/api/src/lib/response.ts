import { Status, StatusDescription } from './status-code.js';

export class Response<T> {
	constructor(
		public readonly status: StatusDescription,
		public readonly data: Nullable<T>,
		public readonly timestamp: number = Date.now(),
	) {}

	public static success<T>(message?: string, data?: T): Response<T> {
		const status: StatusDescription = {
			code: Status.SUCCESS.code,
			message: message || Status.SUCCESS.message,
		};

		return new Response(status, data ?? null);
	}

	public static error<T>(message?: string, data?: T): Response<T> {
		const status: StatusDescription = {
			code: Status.INTERNAL_ERROR.code,
			message: message || Status.INTERNAL_ERROR.message,
		};

		return new Response(status, data ?? null);
	}
}
