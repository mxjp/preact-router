import { normalizePath } from "./paths";
import { Route, RouteMatch } from "./route";

function unsupportedFormat(): string {
	throw new Error("not supported");
}

/**
 * A route with a dynamic path that uses capture groups as route parameters.
 *
 * Route parameters are not URI-decoded automatically.
 */
export class RegExpRoute implements Route {
	private readonly _regexp: RegExp;

	public readonly format: Route["format"];

	/**
	 * @param regexp The regular expression to match.
	 * @param format The route's format function. If not specified, formatting this route will throw an error.
	 */
	public constructor(regexp: RegExp, format: Route["format"] = unsupportedFormat) {
		this._regexp = regexp;
		this.format = format;
	}

	public match(path: string): RouteMatch | null {
		const match = this._regexp.exec(path);
		if (match !== null) {
			const rest = path.slice(match.index + match[0].length);
			return {
				matched: match[0],
				params: match.slice(1),
				rest: (rest === "" && path.endsWith("/")) ? "/" : normalizePath(rest)
			};
		}
		return null;
	}
}
