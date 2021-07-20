import { Route, RoutedContext, StaticRoute } from "../src";

export interface RoutePair {
	readonly parent: RoutedContext;
	readonly child: RoutedContext;
	readonly route: Route;
}

function staticPair(parent: RoutedContext, route: string, child: RoutedContext): RoutePair {
	return { parent, child, route: new StaticRoute(route, true) };
}

export const noParams = {
	params: new URLSearchParams(),
	rawParams: "",
};

export const routePairs: RoutePair[] = [
	staticPair({ path: "", rest: "/", ...noParams }, "/", { path: "/", rest: "/", ...noParams }),
	staticPair({ path: "/", rest: "/", ...noParams }, "/", { path: "/", rest: "/", ...noParams }),
	staticPair({ path: "", rest: "/foo", ...noParams }, "/", { path: "/", rest: "/foo", ...noParams }),
	staticPair({ path: "", rest: "/bar/baz", ...noParams }, "/bar", { path: "/bar", rest: "/baz", ...noParams }),
	staticPair({ path: "/foo", rest: "/bar/baz", ...noParams }, "/bar", { path: "/foo/bar", rest: "/baz", ...noParams }),
];
