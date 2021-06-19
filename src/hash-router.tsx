import { Component, ComponentChildren } from "preact";
import { combinePath, normalizePath } from "./paths";
import { routedContext } from "./routed-context";
import { Router, routerContext } from "./router";

interface Props {
	children?: ComponentChildren;
}

interface State {
	path: string;
}

export class HashRouter extends Component<Props, State> {
	public constructor() {
		super();
		this.state = {
			path: normalizePath(location.hash.slice(1))
		};
	}

	public readonly onUpdatePath = () => {
		this.setState({
			path: normalizePath(location.hash.slice(1))
		});
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
				rest: state.path
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
			location.hash = "#" + path;
		}
	},

	replace(path: string | string[]) {
		return hashRouter.push(path);
	}
};
