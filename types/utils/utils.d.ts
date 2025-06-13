declare global {
	type Mutable<T> = {
		-readonly [P in keyof T]: T[P];
	};

	type Prettify<T> = {
		[P in keyof T]: T[P];
	} & {};

	type Nullable<T> = T | null;
}

export {};
