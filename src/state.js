import { forEachValue, assert, getCenterOfElement } from "./util";
import Canvas from "../src/canvas";

// Base state data struct for state-machine, package with some attribute and method
export default class State {
	constructor(options = {}) {
		if (process.env.NODE_ENV !== "production") {
			assert(options.canvas, `state must have a Canvas for rendering.`);
			assert(
				options.canvas.node instanceof SVGElement,
				`state must have a svg canvas for rendering.`
			);
		}

		this._canvas = options.canvas;
		this.g = this._canvas.paper.g();
		this._pid = this._canvas.id;
		this.color = options.color || "#ffffff";
		this.labelText = options.label || "Default";
		this.theta = options.theta; // The angle between the state's center and the canvas's center

		let { cx, cy, circleR = 24, position = "left" } = Object.assign(
			{},
			getCenterOfElement(this._canvas.node),
			options
		);
		this.cx = cx;
		this.cy = cy;
		this.circleR = circleR;
		this.position = position;

		// a circle to mark a state
		this.renderCircle(cx, cy, circleR);

		// a label to show a state's info
		this.renderLabel(cx, cy, position);
	}

	renderCircle(cx, cy, r) {
		let circle = this._canvas.paper.circle(cx, cy, r, this.color);
		circle.r = r;
		circle.cx = cx;
		circle.cy = cy;
		this.g.add(circle);
		this.g.circle = circle;
	}

	renderLabel(cx, cy, pos) {
		let labelOffset = 10,
			circle = this.g.circle,
			label,
			x =
				pos === "left"
					? cx - circle.r - labelOffset
					: cx + circle.r + labelOffset,
			y = cy,
			option = {
				color: this.color,
				text: this.labelText,
				position: pos
			};

		label = this._canvas.paper.label(x, y, option);
		label.text = this.labelText;
		label.position = pos;
		this.g.add(label);
		this.g.label = label;
	}
}
