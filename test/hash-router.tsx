import test from "ava";
import { hashRouter, HashRouter, routedContext, routerContext } from "../src";
import { ContextReader, useRender, waitFrame } from "./_utility";

const params = new URLSearchParams();

test.serial("updates context when on hash change", async t => {
	const reader = new ContextReader(routedContext);
	await useRender(() => <>
		<HashRouter>
			<reader.read />
		</HashRouter>
	</>, async () => {
		t.deepEqual(reader.value, { path: "", rest: "/", params });

		location.hash = "#foo";
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/foo", params });

		hashRouter.push("/bar");
		t.is(location.hash, "#bar");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/bar", params });

		hashRouter.push("baz");
		t.is(location.hash, "#baz");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/baz", params });

		hashRouter.push("/");
		t.is(location.hash, "");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/", params });
	});
});

test.serial("parses search params if present", async t => {
	const reader = new ContextReader(routedContext);
	await useRender(() => <>
		<HashRouter>
			<reader.read />
		</HashRouter>
	</>, async () => {
		location.hash = "#foo?bar=baz";
		await waitFrame();
		t.is(reader.value!.params.get("bar"), "baz");
	});
});

test.serial("provides router implementation", async t => {
	const reader = new ContextReader(routerContext);
	await useRender(() => <>
		<HashRouter>
			<reader.read />
		</HashRouter>
	</>);
	t.is(reader.value, hashRouter);
});
