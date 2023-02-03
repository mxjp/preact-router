import { ComponentChildren, Context, render, RenderableProps } from "preact";
import { useContext, useEffect, useLayoutEffect, useMemo, useReducer } from "preact/hooks";

export function waitFrame() {
	return new Promise(resolve => setTimeout(resolve, 0));
}

export interface RenderContext {
	html(): string;
}

export async function withRenderer(
	children: () => ComponentChildren,
	action?: (context: RenderContext) => void | Promise<void>
) {
	let currentTeardown: () => void;
	let resolveRendered: () => void;
	const rendered = new Promise<void>(resolve => resolveRendered = resolve);

	function Wrapper() {
		const [enabled, teardown] = useReducer<boolean, void>(() => false, true);
		currentTeardown = teardown;
		useEffect(resolveRendered, []);
		return <>{enabled ? children() : undefined}</>;
	}

	const host = document.createElement("div");
	render(<Wrapper />, host);

	try {
		await rendered;
		await action?.({
			html() {
				return host.innerHTML;
			}
		});
	} finally {
		currentTeardown!();
		await waitFrame();
	}
}

export class ContextReader<T> {
	public constructor(public readonly context: Context<T>) {}

	public value: T | undefined = undefined;

	public readonly read = () => {
		this.value = useContext(this.context);
		return <></>;
	};
}

export class ContextWriter<T> {
	public constructor(
		public readonly context: Context<T>,
		initialValue: T,
	) {
		this._value = initialValue;
	}

	private _value: T;
	private _updates = new Set<() => void>();

	public get value() { return this._value; }
	public set value(value: T) {
		this._value = value;
		this._updates.forEach(update => update());
	}

	public readonly write = (props: RenderableProps<{}>) => {
		const [, update] = useReducer<number, void>(i => i + 1, 0);

		const updateMemo = useMemo(() => {
			this._updates.add(update);
			return update;
		}, []);

		useLayoutEffect(() => {
			return () => this._updates.delete(updateMemo);
		}, [updateMemo]);

		return <this.context.Provider value={this._value}>
			{props.children}
		</this.context.Provider>;
	};
}
