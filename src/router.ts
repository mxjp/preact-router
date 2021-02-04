import { createContext } from "preact";

export interface Router {
	push(path: string | string[]): void;
	replace(path: string | string[]): void;
}

export const routerContext = createContext<Router | undefined>(undefined);
