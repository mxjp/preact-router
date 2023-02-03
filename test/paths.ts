import test from "ava";
import { combinePath, isDirectory, normalizePath, splitPath } from "../src";

const normalizePathTest = test.macro({
	exec(t, input: string, output: string) {
		t.is(normalizePath(input), output);
	},
	title(_, input) {
		return `${normalizePath.name} ${JSON.stringify(input)}`;
	},
});

test(normalizePathTest, "", "");
test(normalizePathTest, "/", "/");
test(normalizePathTest, "foo", "/foo");
test(normalizePathTest, "foo/", "/foo/");
test(normalizePathTest, "/foo", "/foo");
test(normalizePathTest, "/foo/", "/foo/");

const combinePathTest = test.macro({
	exec(t, input: string[], output: string) {
		t.is(combinePath(...input), output);
	},
	title(_, input) {
		return `${combinePath.name} ${JSON.stringify(input)}`;
	},
});

test(combinePathTest, [], "");
test(combinePathTest, [""], "");
test(combinePathTest, ["", ""], "");
test(combinePathTest, ["/", ""], "/");
test(combinePathTest, ["", "/"], "/");
test(combinePathTest, ["/", "/"], "/");
test(combinePathTest, ["foo"], "/foo");
test(combinePathTest, ["foo/"], "/foo/");
test(combinePathTest, ["/foo"], "/foo");
test(combinePathTest, ["/foo/"], "/foo/");
test(combinePathTest, ["", "foo"], "/foo");
test(combinePathTest, ["/", "foo"], "/foo");
test(combinePathTest, ["", "/foo"], "/foo");
test(combinePathTest, ["/", "/foo"], "/foo");
test(combinePathTest, ["foo", "bar"], "/foo/bar");
test(combinePathTest, ["foo/", "bar"], "/foo/bar");
test(combinePathTest, ["foo", "/bar"], "/foo/bar");
test(combinePathTest, ["foo/", "/bar"], "/foo/bar");
test(combinePathTest, ["foo", "bar/"], "/foo/bar/");

const isDirectoryTest = test.macro({
	exec(t, input: string, output: boolean) {
		t.is(isDirectory(input), output);
	},
	title(_, input) {
		return `${isDirectory.name} ${JSON.stringify(input)}`;
	},
});

test(isDirectoryTest, "", false);
test(isDirectoryTest, "/foo", false);
test(isDirectoryTest, "/", true);
test(isDirectoryTest, "/foo/", true);
test(isDirectoryTest, "foo/", true);

const splitPathTest = test.macro({
	exec(t, input: string, output: string[]) {
		t.deepEqual(splitPath(input), output);
	},
	title(_, input) {
		return `${splitPath.name} ${JSON.stringify(input)}`;
	},
});

test(splitPathTest, "", []);
test(splitPathTest, "/", []);
test(splitPathTest, "//", []);
test(splitPathTest, "foo", ["foo"]);
test(splitPathTest, "/foo", ["foo"]);
test(splitPathTest, "foo/", ["foo"]);
test(splitPathTest, "foo/bar", ["foo", "bar"]);
test(splitPathTest, "foo//bar", ["foo", "bar"]);
test(splitPathTest, "/foo/bar", ["foo", "bar"]);
test(splitPathTest, "foo/bar/", ["foo", "bar"]);
