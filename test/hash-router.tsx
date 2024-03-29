import test from "ava";
import { hashRouter, HashRouter, routedContext, routerContext } from "../src";
import { noParams } from "./_route-pairs";
import { ContextReader, withRenderer, waitFrame } from "./_utility";

test.serial("updates context when on hash change", async t => {
	const reader = new ContextReader(routedContext);
	await withRenderer(() => <>
		<HashRouter>
			<reader.read />
		</HashRouter>
	</>, async () => {
		t.deepEqual(reader.value, { path: "", rest: "/", ...noParams });

		location.hash = "#foo";
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/foo", ...noParams });

		hashRouter.push("/bar");
		t.is(location.hash, "#bar");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/bar", ...noParams });

		hashRouter.push("baz");
		t.is(location.hash, "#baz");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/baz", ...noParams });

		hashRouter.push("/");
		t.is(location.hash, "");
		await waitFrame();
		t.deepEqual(reader.value, { path: "", rest: "/", ...noParams });
	});
});

test.serial("parses search params if present", async t => {
	const reader = new ContextReader(routedContext);
	await withRenderer(() => <>
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
	await withRenderer(() => <>
		<HashRouter>
			<reader.read />
		</HashRouter>
	</>);
	t.is(reader.value, hashRouter);
});

test.serial("invokes onNavigate listeners on hashchange", async t => {
	let calls = 0;
	const remove = hashRouter.onNavigate(() => calls++);
	location.hash = "#foo";
	t.is(calls, 1);
	remove();
	location.hash = "#bar";
	t.is(calls, 1);
});
