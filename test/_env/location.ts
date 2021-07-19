import test from "ava";

let currentURL: Readonly<URL>;
let currentData: any = undefined;

export interface HistoryEntry {
	readonly data: any;
	readonly title: string;
	readonly url: Readonly<URL>;
}

export const historyEntries: HistoryEntry[] = [];

export function polyfillLocation() {
	Object.defineProperty(global, "location", {
		configurable: false,
		enumerable: true,
		value: {
			get pathname() { return currentURL.pathname; },
			set pathname(pathname: string) {
				currentURL = Object.assign(new URL(currentURL.toString()), { pathname });
			},

			get hash() { return currentURL.hash; },
			set hash(hash: string) {
				const url = new URL(currentURL.toString());
				url.hash = hash;
				if (currentURL.hash !== url.hash) {
					currentURL = url;
					window.dispatchEvent(new HashChangeEvent("hashchange"));
				}
			},

			get search() { return currentURL.search },
			set search(search: string) {
				currentURL = Object.assign(new URL(currentURL.toString()), { search });
			},
		} as Location
	});
}

export function polyfillHistory() {
	Object.defineProperty(global, "history", {
		configurable: false,
		enumerable: true,
		value: {
			get state() {
				return currentData;
			},

			pushState(data, title, url) {
				historyEntries.push({
					data: currentData,
					title: document.title,
					url: currentURL
				});
				if (title) {
					document.title = title;
				}
				if (url) {
					currentURL = new URL(url, currentURL);
				}
				currentData = data;
			},

			replaceState(data, title, url) {
				if (title) {
					document.title = title;
				}
				if (url) {
					currentURL = new URL(url, currentURL);
				}
				currentData = data;
			},

			back() {
				const entry = historyEntries.pop();
				if (entry) {
					currentURL = entry.url;
					currentData = entry.data;
					document.title = entry.title;

					window.dispatchEvent(new PopStateEvent("popstate"));
				}
			},
		} as History
	});
}

test.beforeEach(() => {
	currentURL = new URL("http://localhost/");
	currentData = undefined;
	historyEntries.splice(0);
});
