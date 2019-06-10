let Snap;
export default class Canvas {
	constructor(_Snap, selector) {
		if (typeof selector === "string") {
			selector = document.querySelector(selector);
		}

		Snap = _Snap;
		return wrap(selector);
	}
}

const DEFAULTS = {
	width: 300,
	height: 300
};
const xmlns = "http://www.w3.org/2000/svg";
function wrap(dom) {
	let wrapped;
	if (dom instanceof Element) {
		if (dom.tagName.toLowerCase() == "svg") {
			wrapped = Snap(dom);
		} else {
			wrapped = Snap(createSvgElement(dom));
		}
	} else {
		wrapped = Snap(DEFAULTS.width, DEFAULTS.height);
	}
	const { w, h } = getWidthAndHeight(dom);
	wrapped.width = w;
	wrapped.height = h;
	return wrapped;
}
function createSvgElement(dom) {
	let svg = document.createElementNS(xmlns, "svg");
	const { w, h } = getWidthAndHeight(dom);
	svg.setAttributeNS(xmlns, "width", w);
	svg.setAttributeNS(xmlns, "height", h);
	dom.appendChild(svg);
	return svg;
}

function getStyles(dom) {
	return window.getComputedStyle(dom);
}
function getStyleWidth(dom) {
	return parseInt(getStyles(dom).getPropertyValue("width"));
}
function getStyleHeight(dom) {
	return parseInt(getStyles(dom).getPropertyValue("height"));
}
function getWidthAndHeight(dom){
	if(!dom){
		return {
			w: DEFAULTS.width,
			h: DEFAULTS.height
		}
	}
	return {
		w: getStyleWidth(dom) || DEFAULTS.width,
		h: getStyleHeight(dom) || DEFAULTS.height
	}
}