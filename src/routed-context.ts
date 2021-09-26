import { createContext } from "preact";
import { combinePath, RoutePathMatch } from ".";

export interface RoutedContext {
	/**
	 * The full normalized routed path.
	 */
	readonly path: string;

	/**
	 * The normalized rest path to be routed in this context.
	 */
	readonly rest: string;

	/**
	 * An object with search params.
	 */
	readonly params: URLSearchParams;

	/**
	 * The raw search params without questionmark.
	 */
	readonly rawParams: string;
}

export const routedContext = createContext<RoutedContext | undefined>(undefined);

/**
 * Derive a routed context value to be used as the value in the routed context provider.
 */
export function deriveRoutedContext(base: RoutedContext, match: RoutePathMatch): RoutedContext {
	return {
		path: combinePath(base.path, match.matched),
		rest: match.rest,
		params: base.params,
		rawParams: base.rawParams,
	};
}
