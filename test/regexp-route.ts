import test from "ava";
import { RegExpRoute, RouteMatch } from "../src";

test("format", t => {
	const route = new RegExpRoute(/unrelated/, (a, b) => `/${a}/${b}`);
	t.is(route.format("1", "2"), "/1/2");
});

const matchTest = test.macro({
	exec(t, regexp: RegExp, test: string, match: RouteMatch | null) {
		t.deepEqual(new RegExpRoute(regexp).match(test), match);
	},
	title(_, regexp: RegExp, test: string) {
		return `match ${regexp.source}, ${JSON.stringify(test)}`;
	},
});

test(matchTest, /^$/, "", { matched: "", params: [], rest: "" });
test(matchTest, /^\/foo\//, "/foo/bar", { matched: "/foo/", params: [], rest: "/bar" });
test(matchTest, /^\/foo(?:\/|$)/, "/foo", { matched: "/foo", params: [], rest: "" });
test(matchTest, /^\/foo(?:\/|$)/, "/foo/", { matched: "/foo/", params: [], rest: "/" });
test(matchTest, /^\/foo(?:\/|$)/, "/foo/bar", { matched: "/foo/", params: [], rest: "/bar" });
test(matchTest, /^\/foo(?:\/|$)/, "/foo/bar/", { matched: "/foo/", params: [], rest: "/bar/" });
test(matchTest, /^\/foo(?=\/|$)/, "/foo", { matched: "/foo", params: [], rest: "" });
test(matchTest, /^\/foo(?=\/|$)/, "/foo/", { matched: "/foo", params: [], rest: "/" });
test(matchTest, /^\/foo(?=\/|$)/, "/foo/bar", { matched: "/foo", params: [], rest: "/bar" });
test(matchTest, /^\/foo(?=\/|$)/, "/foo/bar/", { matched: "/foo", params: [], rest: "/bar/" });

test(matchTest, /^$/, "/", null);
test(matchTest, /^$/, "/foo", null);
test(matchTest, /^\/foo(?=\/)/, "/foo", null);
