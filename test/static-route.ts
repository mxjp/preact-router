import test from "ava";
import { RouteMatch, StaticRoute } from "../src";
import { macro } from "./_utility";

const format = macro(
	(path: string, format: string) => `format "${path}" => "${format}"`,
	(t, path, format) => {
		t.is(new StaticRoute(path).format(), format);
	}
);

test(format, "", "");
test(format, "/", "/");
test(format, "foo", "/foo");
test(format, "foo/", "/foo/");

const match = macro(
	(path: string, children: boolean, test: string, match: RouteMatch | null) => `"${path}", ${children}, match("${test}") => ${JSON.stringify(match)}`,
	(t, path, children, test, match) => {
		t.deepEqual(new StaticRoute(path, children).match(test), match);
	}
);

test(match, "", false, "", { matched: "", params: [], rest: "" });
test(match, "/", false, "/", { matched: "/", params: [], rest: "/" });
test(match, "/foo", false, "/foo", { matched: "/foo", params: [], rest: "" });

test(match, "/foo", true, "/foo/bar", { matched: "/foo", params: [], rest: "/bar" });
test(match, "/foo", true, "/foo/bar/", { matched: "/foo", params: [], rest: "/bar/" });

test(match, "", false, "/", null);
test(match, "", false, "/foo", null);
test(match, "/", false, "", null);
test(match, "/foo/", false, "/foo", null);
test(match, "/foo", false, "/foo/", null);
test(match, "/foo", false, "/foo/bar", null);

test(match, "/", true, "", null);
test(match, "", true, "/", null);
test(match, "/foo/", true, "/foo", null);
test(match, "/foo", true, "/foo/", null);
