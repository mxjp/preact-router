import { JSDOM } from "jsdom";
import test from "ava";

export function polyfillDom() {
	const dom = new JSDOM("");

	global.window = dom.window as any;

	for (const key of Object.getOwnPropertyNames(dom.window)) {
		if (!(key in global) && !/^\_/.test(key)) {
			Object.defineProperty(global, key, {
				configurable: false,
				enumerable: true,
				get: () => dom.window[key],
			});
		}
	}

	test.afterEach(t => {
		if (document.body.childNodes.length > 0) {
			t.fail("document body is not cleaned");
		}
	});
}
