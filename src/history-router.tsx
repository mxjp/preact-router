import { Component, ComponentChildren } from "preact";
import { combinePath, normalizePath } from "./paths";
import { Router, routerContext } from "./router";
import { routedContext } from "./routed-context";

interface Props {
	children?: ComponentChildren;
}

interface State {
	path: string;
	params: URLSearchParams;
	rawParams: string;
}

const routers = new Set<HistoryRouter>();

function getState(): State {
	const rawParams = location.search.slice(1);
	return {
		path: normalizePath(location.pathname),
		params: new URLSearchParams(rawParams),
		rawParams,
	};
}

export class HistoryRouter extends Component<Props, State> {
	public constructor() {
		super();
		this.state = getState();
	}

	public readonly onUpdatePath = () => {
		this.setState(getState());
	};

	public componentWillMount() {
		routers.add(this);
		window.addEventListener("popstate", this.onUpdatePath, { capture: true, passive: true });
	}

	public componentWillUnmount() {
		routers.delete(this);
		window.removeEventListener("popstate", this.onUpdatePath, { capture: true });
	}

	public render(props: Props, state: State) {
		return <routerContext.Provider value={historyRouter}>
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

export const historyRouter: Router = {
	push(path: string | string[]) {
		path = typeof path === "string" ? normalizePath(path) : combinePath.apply(null, path);
		if (location.pathname !== path) {
			history.pushState(history.state, document.title, path);
			routers.forEach(router => router.onUpdatePath());
		}
	},

	replace(path: string | string[]) {
		path = typeof path === "string" ? normalizePath(path) : combinePath.apply(null, path);
		if (location.pathname !== path) {
			history.replaceState(history.state, document.title, path);
			routers.forEach(router => router.onUpdatePath());
		}
	}
};
