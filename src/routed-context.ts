import { createContext } from "preact";

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
