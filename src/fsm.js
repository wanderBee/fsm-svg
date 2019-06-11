/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
"use strict";

import { assert, forEachValue, getStyleWidth, getStyleHeight } from "./util";
import Canvas from "./canvas";
import State from "./state";

let Snap;
export class Fsm {
	constructor(options = {}) {
		if (process.env.NODE_ENV !== "production") {
			assert(this instanceof Fsm, `fsm must be called with the new operator.`);
		}

		const { plugins = [], states = [], container } = options;

		this._canvas = new Canvas(Snap, container);
		this._states = [];

		// apply plugins
		plugins.forEach(plugin => plugin(this));

		registerStates(this, states);
	}

	get states() {
		return this._states;
	}

	set states(v) {
		if (process.env.NODE_ENV !== "production") {
			assert(false, `use fsm.replaceState() to explicit replace state.`);
		}
	}
}

function registerStates(fsm, states) {
	const statesCount = states.length;
	forEachValue(states, (stateOpts, index) => {
		const option = getTransformOption(fsm, statesCount, index);
		option.color = getColor(fsm);
		const newState = new State(
			Object.assign(option, stateOpts, { canvas: fsm._canvas })
		);
		fsm._states.push(newState);
	});
}

function getColor(fsm) {
	const Default_Colors = ["#8FBC8F", "#EC0000", "#A64EA6"];
	return Default_Colors[fsm._states.length] || "#fff";
}

function getTransformOption(fsm, statesCount, stateIndex) {
	if (statesCount == 0 || statesCount == 1) {
		return getCenterOfSvgElement(fsm._canvas.node);
	} else if (statesCount == 2) {
		return transformByStartAngle(fsm, statesCount, stateIndex, -180);
	} else if (statesCount == 3) {
		return transformByStartAngle(fsm, statesCount, stateIndex, -90);
	} else if (statesCount == 4) {
		return transformByStartAngle(fsm, statesCount, stateIndex, -135);
	} else {
		return transformByStartAngle(fsm, statesCount, stateIndex, -180);
	}
}

function transformByStartAngle(fsm, statesCount, stateIndex, startAngle) {
	const tranformAngle = 360 / statesCount;
	const displayCircleR =
		Math.max(Math.min(fsm._canvas.width, fsm._canvas.height, 320), 40) / 2;

	const theta = startAngle + tranformAngle * stateIndex;
	const thetaFPi = (theta / 180) * Math.PI;
	let { cx, cy } = getCenterOfSvgElement(fsm._canvas.node);
	return {
		cx: cx + displayCircleR * Math.cos(thetaFPi),
		cy: cy + displayCircleR * Math.sin(thetaFPi),
		position: theta > -90 && theta < 90 ? "right" : "left"
	};
}

function getCenterOfSvgElement(elem) {
	let w = getStyleWidth(elem);
	let h = getStyleHeight(elem);
	return {
		cx: w / 2,
		cy: h / 2
	};
}

export function install(_Snap) {
	Snap = _Snap;
}
