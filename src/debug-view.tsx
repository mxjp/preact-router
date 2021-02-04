import { useContext } from "preact/hooks";
import { routedContext } from "./routed-context";

export function DebugView() {
	const context = useContext(routedContext);
	if (context === undefined) {
		return <code>no context</code>;
	}
	return <code>
		path="{context.path}" rest="{context.rest}"
	</code>;
}
