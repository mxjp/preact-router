import { Route, RoutedContext, StaticRoute } from "../src";

export interface RoutePair {
	readonly parent: RoutedContext;
	readonly child: RoutedContext;
	readonly route: Route;
}

function staticPair(parent: RoutedContext, route: string, child: RoutedContext): RoutePair {
	return { parent, child, route: new StaticRoute(route, true) };
}

export const routePairs: RoutePair[] = [
	staticPair({ path: "", rest: "/" }, "/", { path: "/", rest: "/" }),
	staticPair({ path: "/", rest: "/" }, "/", { path: "/", rest: "/" }),
	staticPair({ path: "", rest: "/foo" }, "/", { path: "/", rest: "/foo" }),
	staticPair({ path: "", rest: "/bar/baz" }, "/bar", { path: "/bar", rest: "/baz" }),
	staticPair({ path: "/foo", rest: "/bar/baz" }, "/bar", { path: "/foo/bar", rest: "/baz" }),
];
