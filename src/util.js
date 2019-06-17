/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
	// just return if obj is immutable value
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	// if obj is hit, it is in circular structure
	const hit = find(cache, c => c.original === obj);
	if (hit) {
		return hit.copy;
	}

	const copy = Array.isArray(obj) ? [] : {};
	// put the copy into cache at first
	// because we want to refer it in recursive deepCopy
	cache.push({
		original: obj,
		copy
	});

	Object.keys(obj).forEach(key => {
		copy[key] = deepCopy(obj[key], cache);
	});

	return copy;
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
	Object.keys(obj).forEach(key => fn(obj[key], key));
}

export function assert(condition, msg) {
	if (!condition) throw new Error(`[fsm.svg] ${msg}`);
}

export function getStyles(dom) {
	return window.getComputedStyle(dom);
}

export function getStyleWidth(dom) {
	return parseInt(getStyles(dom).getPropertyValue("width"));
}

export function getStyleHeight(dom) {
	return parseInt(getStyles(dom).getPropertyValue("height"));
}

export function getCenterOfElement(elem) {
	let w = getStyleWidth(elem) || elem.getAttribute("width");
	let h = getStyleHeight(elem) || elem.getAttribute("height");
	return {
		cx: w / 2,
		cy: h / 2
	};
}

export function ellipse2path(cx, cy, rx, ry) {
	//非数值单位计算，如当宽度像100%则移除
	if (isNaN(cx - cy + rx - ry)) return;
	var path =
		"M" +
		(cx - rx) +
		" " +
		cy +
		"a" +
		rx +
		" " +
		ry +
		" 0 1 0 " +
		2 * rx +
		" 0" +
		"a" +
		rx +
		" " +
		ry +
		" 0 1 0 " +
		-2 * rx +
		" 0" +
		"z";
	return path;
}
