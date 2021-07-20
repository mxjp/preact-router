import test from "ava";
import { ComponentRoute, routedContext, RouterView, StaticRoute } from "../src";
import { noParams, routePairs } from "./_route-pairs";
import { ContextReader, ContextWriter, useRender, waitFrame } from "./_utility";

test("update routes on context changes", async t => {
	const writer = new ContextWriter(routedContext, { path: "", rest: "/", ...noParams });
	const reader = new ContextReader(routedContext);

	const routes: ComponentRoute[] = [
		[new StaticRoute("/"), () => <>root</>],
		[new StaticRoute("/foo"), () => <>foo<reader.read /></>],
	];

	await useRender(() => <>
		<writer.write>
			<RouterView routes={routes} />
		</writer.write>
	</>, async ctx => {
		t.is(ctx.html(), "root");
		writer.value = { path: "", rest: "/foo", ...noParams };
		await waitFrame();
		t.is(ctx.html(), "foo");
		t.is(reader.value!.params.get("bar"), null);

		writer.value = { path: "", rest: "/foo", params: new URLSearchParams("bar=baz"), rawParams: "bar=baz" };
		await waitFrame();
		t.is(ctx.html(), "foo");
		t.is(reader.value!.params.get("bar"), "baz");
	});
});

for (const p of routePairs) {
	test(`provide child context: ${JSON.stringify(p.parent)}, ${JSON.stringify(p.route.format)} => ${JSON.stringify(p.child)}`, async t => {
		const reader = new ContextReader(routedContext);
		await useRender(() => <>
			<routedContext.Provider value={p.parent}>
				<RouterView routes={[[p.route, () => <reader.read />]]} />
			</routedContext.Provider>
		</>);
		t.deepEqual(reader.value, p.child);
	});
}

test("fallback", async t => {
	const reader = new ContextReader(routedContext);
	await useRender(() => <>
		<routedContext.Provider value={{ path: "/foo", rest: "/bar", ...noParams }}>
			<RouterView routes={[]} fallback={() => <reader.read />} />
		</routedContext.Provider>
	</>);
	t.deepEqual(reader.value, { path: "/foo", rest: "/bar", ...noParams });
});
