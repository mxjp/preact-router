import { RenderableProps, ComponentType } from "preact";
import { Inputs, useContext, useMemo } from "preact/hooks";
import { combinePath } from "./paths";
import { Route } from "./route";
import { routedContext } from "./routed-context";

export type RoutedComponentType = ComponentType<{
	/**
	 * The route parameters.
	 */
	params: string[];
}>;

/**
 * A route with a component to render.
 */
export type ComponentRoute = [Route, RoutedComponentType];

/**
 * Component for rendering one of the specified routes. If no route
 * matches, an optional fallback component will be rendered instead.
 *
 * @example
 * function Foo() {
 *   return <>Foo!</>;
 * }
 *
 * function Bar() {
 *   return <>Bar!</>;
 * }
 *
 * function Fallback() {
 *   return <>Not found :(</>;
 * }
 *
 * function ExampleApp() {
 *   const routes = useMemo<ComponentRoute[]>(() => [
 *     [new StaticRoute("/foo"), Foo],
 *     [new StaticRoute("/bar"), Bar]
 *   ], []);
 *
 *   return <Router>
 *     <RouterView routes={routes} fallback={Fallback} />
 *   </Router>;
 * }
 */
export function RouterView(props: RenderableProps<{
	children?: never;

	/**
	 * The routes to render.
	 */
	routes: ComponentRoute[];

	/**
	 * If no route matches, the fallback component is rendered instead.
	 */
	fallback?: ComponentType<{}>;

	/**
	 * The routing is evaluated when any of this inputs, the path, the routes or the fallback changes.
	 */
	inputs?: Inputs;
}>) {
	const context = useContext(routedContext);
	if (context === undefined) {
		throw new Error("RouterView must be used in a routed context");
	}
	const allInputs: any[] = [context.rest, props.routes, props.fallback];
	if (props.inputs) {
		allInputs.push.apply(allInputs, props.inputs as any[]);
	}
	return useMemo(() => {
		for (const [route, RoutedComponent] of props.routes) {
			const match = route.match(context.rest);
			if (match !== null) {
				return <routedContext.Provider value={{
					path: combinePath(context.path, match.matched),
					rest: match.rest,
					params: context.params,
				}}>
					<RoutedComponent params={match.params} />
				</routedContext.Provider>;
			}
		}
		return props.fallback ? <props.fallback /> : <></>;
	}, allInputs);
}
