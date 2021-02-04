import test from "ava";
import { RegExpRoute, RouteMatch } from "../src";
import { macro } from "./_utility";

test("format", t => {
	const route = new RegExpRoute(/ /, (a, b) => `/${a}/${b}`);
	t.is(route.format("1", "2"), "/1/2");
});

const match = macro(
	(regexp: RegExp, test: string, match: RouteMatch | null) => `"${regexp}", match("${test}") => ${JSON.stringify(match)}`,
	(t, regexp, test, match) => {
		t.deepEqual(new RegExpRoute(regexp).match(test), match);
	}
);

test(match, /^$/, "", { matched: "", params: [], rest: "" });
test(match, /^\/foo\//, "/foo/bar", { matched: "/foo/", params: [], rest: "/bar" });
test(match, /^\/foo(?:\/|$)/, "/foo", { matched: "/foo", params: [], rest: "" });
test(match, /^\/foo(?:\/|$)/, "/foo/", { matched: "/foo/", params: [], rest: "/" });
test(match, /^\/foo(?:\/|$)/, "/foo/bar", { matched: "/foo/", params: [], rest: "/bar" });
test(match, /^\/foo(?:\/|$)/, "/foo/bar/", { matched: "/foo/", params: [], rest: "/bar/" });
test(match, /^\/foo(?=\/|$)/, "/foo", { matched: "/foo", params: [], rest: "" });
test(match, /^\/foo(?=\/|$)/, "/foo/", { matched: "/foo", params: [], rest: "/" });
test(match, /^\/foo(?=\/|$)/, "/foo/bar", { matched: "/foo", params: [], rest: "/bar" });
test(match, /^\/foo(?=\/|$)/, "/foo/bar/", { matched: "/foo", params: [], rest: "/bar/" });

test(match, /^$/, "/", null);
test(match, /^$/, "/foo", null);
test(match, /^\/foo(?=\/)/, "/foo", null);
