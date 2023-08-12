import { ValidationError } from '../errors';

export function validateIsNotNullOrUndefined(
	varName: string,
	varValue: unknown
): void | never {
	if (varValue === undefined) {
		throw new ValidationError(`Expected ${varName} to not be undefined.`);
	}
	if (varValue == null) {
		throw new ValidationError(`Expected ${varName} to not be null.`);
	}
}

export function validateIsString(
	varName: string,
	varValue: unknown,
	allowNull = false
): void | never {
	if (allowNull && varValue == null) {
		return;
	}
	validateIsNotNullOrUndefined(varName, varValue);
	if (typeof varValue !== 'string' && !(varValue instanceof String)) {
		throw new ValidationError(
			`Expected ${varName} to be a string but was a ${typeof varValue} (${varValue}).`
		);
	}
}

export function validateIsNotEmptyString(
	varName: string,
	varValue: unknown,
	allowNull = false
): void | never {
	if (allowNull && varValue == null) {
		return;
	}
	validateIsString(varName, varValue);
	if ((varValue as string).length === 0) {
		throw new ValidationError(`Expected ${varName} to not be an empty string.`);
	}
}

export function validateIsInteger(
	varName: string,
	varValue: unknown,
	allowNull = false
): void | never {
	if (allowNull && varValue == null) {
		return;
	}
	validateIsNotNullOrUndefined(varName, varValue);
	if (!Number.isInteger(varValue)) {
		throw new ValidationError(
			`Expected ${varName} to be an integer but was a ${typeof varValue} (${varValue}).`
		);
	}
}
