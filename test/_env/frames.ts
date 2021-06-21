
const animationFrames = new Set();
let nextAnimationFrameHandle = 0;

export function polyfillAnimationFrames() {
	Object.defineProperty(global, "requestAnimationFrame", {
		configurable: false,
		enumerable: true,
		value: (callback: () => void) => {
			const handle = nextAnimationFrameHandle++;
			animationFrames.add(handle);
			queueMicrotask(() => {
				if (animationFrames.delete(handle)) {
					callback();
				}
			});
			return handle;
		},
	});

	Object.defineProperty(global, "cancelAnimationFrame", {
		configurable: false,
		enumerable: true,
		value: (handle: number) => {
			animationFrames.delete(handle);
		}
	});
}
