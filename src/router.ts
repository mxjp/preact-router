import { createContext } from "preact";

export interface Router {
	/**
	 * Navigate to the specified path.
	 *
	 * @param path The new path or an array of paths that will be combined using `combinePath(..)`.
	 */
	push(path: string | string[]): void;

	/**
	 * Replace the current path. If no replacement api is available, `push(..)` is used instead.
	 *
	 * @param path The new path or an array of paths that will be combined using `combinePath(..)`.
	 */
	replace(path: string | string[]): void;

	/**
	 * Register a global event listener to be called when the route path or search params change.
	 *
	 * @param listener The listener.
	 * @returns A function that can be called to remove the listener.
	 */
	onNavigate(listener: () => void): () => void;
}

export const routerContext = createContext<Router | undefined>(undefined);
