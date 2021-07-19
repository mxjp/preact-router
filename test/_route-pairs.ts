import { Route, RoutedContext, StaticRoute } from "../src";

export interface RoutePair {
	readonly parent: RoutedContext;
	readonly child: RoutedContext;
	readonly route: Route;
}

function staticPair(parent: RoutedContext, route: string, child: RoutedContext): RoutePair {
	return { parent, child, route: new StaticRoute(route, true) };
}

const params = new URLSearchParams();

export const routePairs: RoutePair[] = [
	staticPair({ path: "", rest: "/", params }, "/", { path: "/", rest: "/", params }),
	staticPair({ path: "/", rest: "/", params }, "/", { path: "/", rest: "/", params }),
	staticPair({ path: "", rest: "/foo", params }, "/", { path: "/", rest: "/foo", params }),
	staticPair({ path: "", rest: "/bar/baz", params }, "/bar", { path: "/bar", rest: "/baz", params }),
	staticPair({ path: "/foo", rest: "/bar/baz", params }, "/bar", { path: "/foo/bar", rest: "/baz", params }),
];
