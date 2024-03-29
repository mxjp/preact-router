import { Component, ComponentChildren } from "preact";
import { combinePath, normalizePath } from "./paths";
import { routedContext } from "./routed-context";
import { Router, routerContext } from "./router";

interface Props {
	children?: ComponentChildren;
}

interface State {
	path: string;
	params: URLSearchParams;
	rawParams: string;
}

function getState(): State {
	const path = location.hash.slice(1) || "/";
	const searchStart = path.indexOf("?");
	if (searchStart < 0) {
		return {
			path: normalizePath(path),
			params: new URLSearchParams(),
			rawParams: "",
		};
	} else {
		const rawParams = path.slice(searchStart + 1);
		return {
			path: normalizePath(path.slice(0, searchStart)),
			params: new URLSearchParams(rawParams),
			rawParams
		};
	}
}

export class HashRouter extends Component<Props, State> {
	public constructor() {
		super();
		this.state = getState();
	}

	public readonly onUpdatePath = () => {
		this.setState(getState());
	};

	public componentDidMount() {
		window.addEventListener("hashchange", this.onUpdatePath, { capture: true, passive: true });
	}

	public componentWillUnmount() {
		window.removeEventListener("hashchange", this.onUpdatePath, { capture: true });
	}

	public render(props: Props, state: State) {
		return <routerContext.Provider value={hashRouter}>
			<routedContext.Provider value={{
				path: "",
				rest: state.path,
				params: state.params,
				rawParams: state.rawParams,
			}}>
				{props.children}
			</routedContext.Provider>
		</routerContext.Provider>;
	}
}

export const hashRouter: Router = {
	push(path: string | string[]) {
		path = typeof path === "string" ? normalizePath(path) : combinePath.apply(null, path);
		if (location.hash.slice(1) !== path) {
			location.hash = "#" + path.slice(1);
		}
	},

	replace(path: string | string[]) {
		return hashRouter.push(path);
	},

	onNavigate(listener) {
		const wrapper = () => listener();
		window.addEventListener("hashchange", wrapper, { capture: true, passive: true });
		return () => {
			window.removeEventListener("hashchange", wrapper, { capture: true });
		};
	}
};
