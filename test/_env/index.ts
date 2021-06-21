import { polyfillDom } from "./dom";
import { polyfillAnimationFrames } from "./frames";
import { polyfillHistory, polyfillLocation } from "./location";

polyfillAnimationFrames();
polyfillLocation();
polyfillHistory();
polyfillDom();
