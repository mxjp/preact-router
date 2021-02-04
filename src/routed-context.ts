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
}

export const routedContext = createContext<RoutedContext | undefined>(undefined);
