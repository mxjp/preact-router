import test from "ava";
import { RouteMatch, StaticRoute } from "../src";

const formatTest = test.macro({
	exec(t, path: string, format: string) {
		t.is(new StaticRoute(path).format(), format);
	},
	title(_, path) {
		return `format ${JSON.stringify(path)}`;
	},
});

test(formatTest, "", "");
test(formatTest, "/", "/");
test(formatTest, "foo", "/foo");
test(formatTest, "foo/", "/foo/");

const matchTest = test.macro({
	exec(t, path: string, children: boolean, test: string, match: RouteMatch | null) {
		t.deepEqual(new StaticRoute(path, children).match(test), match);
	},
	title(_, path, children, test, match) {
		return `match ${JSON.stringify(path)}, ${JSON.stringify(children)}, ${JSON.stringify(test)}`;
	},
});

test(matchTest, "", false, "", { matched: "", params: [], rest: "" });
test(matchTest, "/", false, "/", { matched: "/", params: [], rest: "/" });
test(matchTest, "/foo", false, "/foo", { matched: "/foo", params: [], rest: "" });

test(matchTest, "/foo", true, "/foo/bar", { matched: "/foo", params: [], rest: "/bar" });
test(matchTest, "/foo", true, "/foo/bar/", { matched: "/foo", params: [], rest: "/bar/" });

test(matchTest, "", false, "/", null);
test(matchTest, "", false, "/foo", null);
test(matchTest, "/", false, "", null);
test(matchTest, "/foo/", false, "/foo", null);
test(matchTest, "/foo", false, "/foo/", null);
test(matchTest, "/foo", false, "/foo/bar", null);

test(matchTest, "/", true, "", null);
test(matchTest, "", true, "/", null);
test(matchTest, "/foo/", true, "/foo", null);
test(matchTest, "/foo", true, "/foo/", null);
