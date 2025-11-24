import * as z from "zod";

export type FormErrors = Record<string, string | string[]>;

export function createFormValidator<S extends z.ZodType>(schema: S) {
	return async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const result = await schema.safeParseAsync(
			Object.fromEntries(formData.entries()),
		);

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return {
				data: undefined,
				errors: fieldErrors,
			};
		}
		return {
			data: result.data,
			errors: {},
		};
	};
}
