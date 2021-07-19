import test from "ava";
import { HistoryRouter, historyRouter, routerContext, routedContext } from "../src";
import { historyEntries } from "./_env/location";
import { ContextReader, useRender, waitFrame } from "./_utility";

const params = new URLSearchParams();

test.serial("updates context on history change", async t => {
	const reader = new ContextReader(routedContext);
	await useRender(() => <>
		<HistoryRouter>
			<reader.read />
		</HistoryRouter>
	</>, async () => {
		t.deepEqual(reader.value, { path: "", rest: "/", params });

		historyRouter.push("/foo");
		await waitFrame();
		t.is(historyEntries.length, 1);
		t.deepEqual(reader.value, { path: "", rest: "/foo", params });

		history.back();
		await waitFrame();
		t.is(historyEntries.length, 0);
		t.deepEqual(reader.value, { path: "", rest: "/", params });

		historyRouter.replace("/bar");
		await waitFrame();
		t.is(historyEntries.length, 0);
		t.deepEqual(reader.value, { path: "", rest: "/bar", params });
	});
});

test.serial("parses search params if present", async t => {
	location.search = "?bar=baz";
	const reader = new ContextReader(routedContext);
	await useRender(() => <>
		<HistoryRouter>
			<reader.read />
		</HistoryRouter>
	</>, async () => {
		t.is(reader.value!.params.get("bar"), "baz");
	});
});

test.serial("provides router implementation", async t => {
	const reader = new ContextReader(routerContext);
	await useRender(() => <>
		<HistoryRouter>
			<reader.read />
		</HistoryRouter>
	</>);
	t.is(reader.value, historyRouter);
});
