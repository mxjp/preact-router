
/**
 * Normalize a path.
 * + Non empty paths always start with a slash.
 * + A trailing slash indicates that the path represents a directory.
 * + Normalization for components of zero length is not defined for performance reasons.
 */
export function normalizePath(path: string) {
	return (path === "" || path.startsWith("/")) ? path : "/" + path;
}

/**
 * Combine multiple paths into a normalized path.
 */
export function combinePath(...components: string[]) {
	let path = "";
	for (let i = 0; i < components.length; i++) {
		const component = components[i];
		if (component !== "") {
			if (!path.endsWith("/")) {
				path += "/";
			}
			if (component !== "/") {
				path += component.startsWith("/") ? component.slice(1) : component;
			}
		}
	}
	return path;
}

/**
 * Split a path by separators and ignore empty segments.
 */
export function splitPath(path: string) {
	const segments: string[] = [];
	for (let i = 0; i < path.length; ) {
		const endIndex = path.indexOf("/", i);
		if (endIndex < 0) {
			segments.push(path.slice(i));
			break;
		} else {
			if (endIndex > i) {
				segments.push(path.slice(i, endIndex));
			}
			i = endIndex + 1;
		}
	}
	return segments;
}

/**
 * Check if the specified path represents a directory.
 */
export function isDirectory(path: string) {
	return path.endsWith("/");
}
