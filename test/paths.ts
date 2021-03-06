import test from "ava";
import { combinePath, isDirectory, normalizePath } from "../src";
import { macro } from "./_utility";

const norm = macro(
	(input: string, output: string) => `normalizePath "${input}" => "${output}"`,
	(t, input, output) => {
		t.is(normalizePath(input), output);
	}
);

test(norm, "", "");
test(norm, "/", "/");
test(norm, "foo", "/foo");
test(norm, "foo/", "/foo/");
test(norm, "/foo", "/foo");
test(norm, "/foo/", "/foo/");

const combine = macro(
	(input: string[], output: string) => `combinePath ${JSON.stringify(input)} => "${output}"`,
	(t, input, output) => {
		t.is(combinePath(...input), output);
	}
);

test(combine, [], "");
test(combine, [""], "");
test(combine, ["", ""], "");
test(combine, ["/", ""], "/");
test(combine, ["", "/"], "/");
test(combine, ["/", "/"], "/");
test(combine, ["foo"], "/foo");
test(combine, ["foo/"], "/foo/");
test(combine, ["/foo"], "/foo");
test(combine, ["/foo/"], "/foo/");
test(combine, ["", "foo"], "/foo");
test(combine, ["/", "foo"], "/foo");
test(combine, ["", "/foo"], "/foo");
test(combine, ["/", "/foo"], "/foo");
test(combine, ["foo", "bar"], "/foo/bar");
test(combine, ["foo/", "bar"], "/foo/bar");
test(combine, ["foo", "/bar"], "/foo/bar");
test(combine, ["foo/", "/bar"], "/foo/bar");
test(combine, ["foo", "bar/"], "/foo/bar/");

const dir = macro(
	(input: string, output: boolean) => `isDirectory "${input}" => ${output}`,
	(t, input, output) => {
		t.is(isDirectory(input), output);
	}
);

test(dir, "", false);
test(dir, "/foo", false);
test(dir, "/", true);
test(dir, "/foo/", true);
test(dir, "foo/", true);
