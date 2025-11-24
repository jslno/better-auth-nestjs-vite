"use client";

import { Form as FormPrimitive } from "@base-ui-components/react/form";

import { cn } from "@/lib/utils";

function Form<FormValues extends Record<string, any> = Record<string, any>>({
	className,
	...props
}: FormPrimitive.Props<FormValues>) {
	return (
		<FormPrimitive
			className={cn("flex w-full flex-col gap-4", className)}
			data-slot="form"
			{...props}
		/>
	);
}

export { Form };
