import { Type } from 'class-transformer';

import {
	IsOptional,
	IsString,
	IsBoolean,
	IsNumberString,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
	ValidationOptions,
	validateSync,
	ValidationError,
} from 'class-validator';

import type {
	APIMessageComponentEmoji,
	ComponentEmojiResolvable,
	Snowflake,
} from 'discord.js';

import { CustomizationDefinition } from '#lib/customization/index.js';

class APIMessageComponentEmojiClass implements APIMessageComponentEmoji {
	@IsOptional()
	@IsString()
	public readonly id?: Snowflake;

	@IsOptional()
	@IsString()
	public readonly name?: string;

	@IsOptional()
	@IsBoolean()
	public readonly animated?: boolean;
}

@ValidatorConstraint({ async: false })
class IsComponentEmojiResolvableConstraint
	implements ValidatorConstraintInterface
{
	private nestedErrors: ValidationError[] = [];

	validate(emoji: unknown) {
		if (typeof emoji === 'string') {
			return true;
		}

		if (typeof emoji === 'object' && emoji !== null) {
			const emojiObject = new APIMessageComponentEmojiClass();
			Object.assign(emojiObject, emoji);

			this.nestedErrors = validateSync(emojiObject, {
				forbidUnknownValues: true,
			});

			return this.nestedErrors.length === 0;
		}

		return false;
	}

	defaultMessage() {
		if (this.nestedErrors.length > 0) {
			const messages = this.nestedErrors
				.map((error) => {
					const constraints = Object.values(error.constraints || {}).join(', ');

					return `- property "${error.property}": ${constraints}`;
				})
				.join('\n');

			return `Nested emoji object validation failed:\n${messages}`;
		}

		return 'Emoji must be a string (Snowflake) or an APIMessageComponentEmoji object.';
	}
}

function IsComponentEmojiResolvable(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsComponentEmojiResolvableConstraint,
		});
	};
}

export abstract class CustomizationDefinitionSchema
	implements CustomizationDefinition
{
	@IsString()
	public readonly label!: string;

	@IsString()
	@IsNumberString()
	public readonly value!: string;

	@IsString()
	@IsOptional()
	public readonly description?: string;

	@IsOptional()
	@IsComponentEmojiResolvable()
	@Type(() => APIMessageComponentEmojiClass)
	public readonly emoji?: ComponentEmojiResolvable;
}
