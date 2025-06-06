declare global {
	type Mutable<T> = {
		-readonly [P in keyof T]: T[P];
	};

	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
}

export {};
