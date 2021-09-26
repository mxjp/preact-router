
export interface RoutePathMatch {
	/**
	 * The matched normalized path.
	 */
	matched: string;

	/**
	 * The unmatched normalized rest path.
	 *
	 * If the rest path is empty, trailing slashes from the previously matched path must be preserved.
	 */
	rest: string;
}

export interface RouteMatch extends RoutePathMatch {
	/**
	 * The route parameters.
	 */
	params: string[];
}

export interface Route {
	/**
	 * Format and normalize the route path.
	 */
	format(...params: string[]): string;

	/**
	 * Test if the specified normalized path matches this route.
	 */
	match(path: string): RouteMatch | null;
}
