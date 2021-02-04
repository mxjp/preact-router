import { isDirectory, normalizePath } from "./paths";
import { Route, RouteMatch } from "./route";

/**
 * A route with a static path without any parameters.
 */
export class StaticRoute implements Route {
	private readonly _path: string;
	private readonly _isDirectory: boolean;
	private readonly _children: boolean;

	/**
	 * @param path The path.
	 * @param children If true, the route also matches child paths. Default is false.
	 */
	public constructor(path: string, children = false) {
		this._path = normalizePath(path);
		this._isDirectory = isDirectory(this._path);
		this._children = children;
	}

	public format() {
		return this._path;
	}

	public match(path: string): RouteMatch | null {
		if (path === this._path) {
			return {
				matched: this._path,
				params: [],
				rest: this._isDirectory ? "/" : ""
			};
		}
		if (this._children) {
			const parent = this._isDirectory ? this._path : this._path + "/";
			if (path.length > parent.length && path.startsWith(parent)) {
				return {
					matched: this._path,
					params: [],
					rest: path.slice(parent.length - 1)
				};
			}
		}
		return null;
	}
}
