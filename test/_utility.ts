import { ExecutionContext } from "ava";

export function macro<T extends any[]>(
	title: (...args: T) => string,
	fn: (t: ExecutionContext, ...args: T) => void | Promise<void>
) {
	return Object.assign(fn, {
		title: (_: any, ...args: T) => title(...args)
	}) as (t: ExecutionContext, ...args: T) => void | Promise<void>;
}
