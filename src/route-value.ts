import { Inputs, useContext, useMemo } from "preact/hooks";
import { Route, RouteMatch } from "./route";
import { routedContext } from "./routed-context";

/**
 * A route with a value.
 */
export type ValueRoute<T> = [Route, T];

export interface RouteValueMatch<T> extends RouteMatch {
	/**
	 * The value of the route.
	 */
	value: T;
}

/**
 * Select and cache a routed value based on the current context.
 *
 * @param routes The routes to test.
 * @param inputs The routing is evaluated when any of this inputs, the path or the routes change.
 */
export function routeValue<T>(routes: ValueRoute<T>[], inputs?: Inputs) {
	const context = useContext(routedContext);
	if (context === undefined) {
		throw new Error("routeValue must be used in a routed context");
	}
	const allInputs: any[] = [context.rest, routes];
	if (inputs) {
		allInputs.push.apply(allInputs, inputs as any[]);
	}
	return useMemo<RouteValueMatch<T> | null>(() => {
		for (const [route, value] of routes) {
			const match = route.match(context.rest);
			if (match !== null) {
				return {
					matched: match.matched,
					params: match.params,
					rest: match.rest,
					value
				};
			}
		}
		return null;
	}, allInputs);
}
