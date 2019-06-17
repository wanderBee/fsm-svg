/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
"use strict";

import { assert, forEachValue, getCenterOfElement, ellipse2path } from "./util";
import Snap from "./snap";
import Canvas from "./canvas";
import anime from "animejs";
import State from "./state";
import Point from "./point";
import Link from "./link";

let __initialized = false;
const ANIME_DURATION = 1600;
const ANIME_EASING_BEZIER = "cubicBezier(.5, .05, .1, .3)";

export default class Fsm {
	constructor(canvas) {
		assert(__initialized, "please call Fsm.init instead of new operator.");

		this.canvas = canvas;
	}

	static init(selector) {
		let ___c__ = new Canvas(selector);

		__initialized = true;
		return new Fsm(___c__.canvas);
	}

	setOption(options = {}) {
		assert(__initialized, `fsm.init must be called first.`);

		if (process.env.NODE_ENV !== "production") {
			assert(this instanceof Fsm, `fsm must be called with the new operator.`);
		}

		const { plugins = [], states = [], links = [] } = options;

		this._states = [];

		this._links = links; // Array of [source-state-index, target-state-index]

		this.links = []; // SnapSvgElement: store link

		// apply plugins
		plugins.forEach(plugin => plugin(this));

		registerStates(this, states);

		registerLinks(this, this._links);
	}

	resetState(index, options = {}) {
		assert(__initialized, `fsm.init must be called first.`);

		let oldState = this._states[index];
		let { circleR } = Object.assign({}, oldState, options);

		if (circleR != oldState.circleR) {
			animeCircleR(oldState.g.circle.node, circleR);
			animeTranslateX(
				oldState.g.label.node,
				oldState.position === "right"
					? circleR - oldState.g.circle.r
					: oldState.g.circle.r - circleR
			);
			oldState.circleR = circleR;
			this._states[index] = oldState;
		}

		// repaint links
		let tLinks = this.links.filter(link => {
			return link.t === index || link.s === index;
		});
		forEachValue(tLinks, tlink => {
			const tPath = tlink.path;
			const linkPoint = calcLinkPoint(this, tlink.s, tlink.t);
			const p1 = new Point(linkPoint.x1, linkPoint.y1);
			const p2 = new Point(linkPoint.x2, linkPoint.y2);
			const link = new Link(p1, p2, { curv: linkPoint.curv });

			let nlinkPath = link.path;
			animePath(tlink.snap.node, nlinkPath);
		});
	}

	scale(index, ratio) {
		this.resetState(index, {
			circleR: this._states[index].g.circle.r * (ratio < 0 ? 1 : ratio)
		});
	}
}

function animeCircleR(node, newR) {
	anime({
		targets: node,
		r: newR,
		easing: ANIME_EASING_BEZIER,
		duration: ANIME_DURATION
	});
}
function animeTranslateX(node, offsetX) {
	anime({
		targets: node,
		translateX: offsetX,
		easing: ANIME_EASING_BEZIER,
		duration: ANIME_DURATION
	});
}
function animePath(node, newPath) {
	anime({
		targets: node,
		d: newPath,
		easing: ANIME_EASING_BEZIER,
		duration: ANIME_DURATION
	});
}

function registerStates(fsm, states) {
	const statesCount = states.length;
	const links = [].concat(fsm._links);
	forEachValue(states, (stateOpts, index) => {
		const option = getTransformOption(fsm, statesCount, index);
		option.color = getColor(fsm);
		option.index = parseInt(index);
		const newState = new State(
			Object.assign(option, stateOpts, { canvas: fsm.canvas })
		);

		if (!links.length) {
			if (Object.prototype.toString.call(option.linkTo) !== "[object Array]") {
				option.linkTo = [option.linkTo];
			}
			forEachValue(option.linkTo, lto => {
				if (lto > -1) {
					fsm._links.push([option.index, lto]);
					newState.out = (newState.out || 0) + 1;
				}
			});
		}
		fsm._states.push(newState);
	});
}

function registerLinks(fsm, links) {
	let sIndex, tIndex;
	forEachValue(links, linkIndex => {
		sIndex = linkIndex[0];
		tIndex = linkIndex[1];
		link(fsm, sIndex, tIndex);
	});
}

/**
 *
 * @param { Fsm } FSM intance
 * @param { source state's index } sIndex
 * @param { target state's index } tIndex
 */
function link(fsm, sIndex, tIndex) {
	const stateS = fsm._states[sIndex];
	const stateT = fsm._states[tIndex];
	if (!stateS || !stateT) {
		return;
	}
	const linkPoint = calcLinkPoint(fsm, sIndex, tIndex);

	const p1 = new Point(linkPoint.x1, linkPoint.y1);
	const p2 = new Point(linkPoint.x2, linkPoint.y2);
	const link = new Link(p1, p2, { curv: linkPoint.curv });

	// line gradient
	const gradi = fsm.canvas.paper.gradient(
		`L(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y})${stateS.g.circle.stroke}-${
			stateT.g.circle.stroke
		}`
	);
	// line marker-end : triangle
	const triangleSvg = fsm.canvas.paper.path(link.marker.path).attr({
		fill: stateT.g.circle.stroke
	});
	let tmarker;
	{
		let { x, y, width, height, refX, refY } = link.marker;
		tmarker = triangleSvg.marker(x, y, width, height, refX, refY);
	}
	// line bezier
	const lpSvg = fsm.canvas.paper
		.path(link.path)
		.attr({
			stroke: gradi,
			strokeWidth: 2,
			"marker-end": tmarker,
			fill: "none"
		})
		.addClass("beziermorph");
	// fsm.canvas.paper.g().add(lpSvg);
	lpSvg.insertBefore(fsm._states[0].g);
	fsm.links.push({
		snap: lpSvg,
		path: link.path,
		curv: linkPoint.curv,
		s: sIndex,
		t: tIndex,
		bbox: link.bbox
	});
}

// calc curve
function calcLinkPoint(fsm, sIndex, tIndex) {
	const stateS = fsm._states[sIndex];
	const stateT = fsm._states[tIndex];
	const theta1 = stateS.theta;
	const theta2 = stateT.theta;
	const tranformAngle = 360 / fsm._states.length;
	const curvQuot = tranformAngle / 90;
	const curv1 = -0.58 * curvQuot;
	const curv2 = 0.58 * curvQuot;
	const offsetRad = 18;
	const inArea = inWhichArea(theta1, theta2);

	// calc curve
	let calcCurve = 0;
	if (Math.abs(tIndex - sIndex) > 1) {
		calcCurve = 0;
	} else if (
		(inArea == "top" && sIndex < tIndex) ||
		(inArea == "right" && sIndex > tIndex) ||
		(inArea == "bottom" && sIndex > tIndex) ||
		(inArea == "left" && sIndex > tIndex)
	) {
		calcCurve = curv1;
	} else if (
		(inArea == "top" && sIndex > tIndex) ||
		(inArea == "right" && sIndex < tIndex) ||
		(inArea == "bottom" && sIndex < tIndex) ||
		(inArea == "left" && sIndex < tIndex)
	) {
		calcCurve = curv2;
	}

	// calc link-point
	let x1, y1, x2, y2, rad1, rad2;

	if (calcCurve == 0) {
		rad1 = theta1 + 180 + offsetRad;
		rad2 = theta2 + 180 - offsetRad;
	} else if (
		(inArea == "top" && calcCurve > 0) ||
		(inArea == "right" && calcCurve < 0) ||
		(inArea == "bottom" && calcCurve < 0) ||
		(inArea == "left" && calcCurve > 0)
	) {
		rad1 = theta1 + 180 + offsetRad;
		rad2 = theta2 + 180 - offsetRad;
	} else {
		rad1 = theta1 + offsetRad;
		rad2 = theta2 - offsetRad;
	}

	x1 = stateS.g.circle.cx + stateS.circleR * Math.cos((rad1 / 180) * Math.PI);
	y1 =
		stateS.g.circle.cy + stateS.circleR * Math.sin((rad1 / 180) * Math.PI) - 1;

	x2 = stateT.g.circle.cx + stateT.circleR * Math.cos((rad2 / 180) * Math.PI);
	y2 =
		stateT.g.circle.cy + stateT.circleR * Math.sin((rad2 / 180) * Math.PI) - 1;

	return {
		x1,
		y1,
		x2,
		y2,
		curv: calcCurve
	};
}

function inWhichArea(theta1, theta2) {
	return inRightArea(theta1, theta2)
		? "right"
		: inTopArea(theta1, theta2)
		? "top"
		: inBottomArea(theta1, theta2)
		? "bottom"
		: inLeftArea(theta1, theta2)
		? "left"
		: "";
}
function inTopArea(theta1, theta2) {
	return theta1 >= -180 && theta1 <= 0 && theta2 >= -180 && theta2 <= 0;
}
function inRightArea(theta1, theta2) {
	return theta1 >= -90 && theta1 <= 90 && theta2 >= -90 && theta2 <= 90;
}
function inBottomArea(theta1, theta2) {
	return theta1 >= 0 && theta1 <= 180 && theta2 >= 0 && theta2 <= 180;
}
function inLeftArea(theta1, theta2) {
	return;
	((theta1 >= -180 && theta1 <= 90) || (theta1 >= 90 && theta1 <= 180)) &&
		((theta2 >= -180 && theta2 <= 90) || (theta2 >= 90 && theta2 <= 180));
}

function getColor(fsm) {
	const Default_Colors = ["#8FBC8F", "#EC0000", "#A64EA6"];
	return Default_Colors[fsm._states.length] || "#fff";
}

function getTransformOption(fsm, statesCount, stateIndex) {
	let transformByStartAngle = getTransformFunc(fsm, statesCount, stateIndex);
	if (statesCount == 0 || statesCount == 1) {
		return getCenterOfElement(fsm.canvas.node);
	} else if (statesCount == 2) {
		return transformByStartAngle(-180);
	} else if (statesCount == 3) {
		return transformByStartAngle(-90);
	} else if (statesCount == 4) {
		return transformByStartAngle(-135);
	} else {
		return transformByStartAngle(180 / statesCount - 180);
	}
}

function getTransformFunc(fsm, statesCount, stateIndex) {
	return function(startAngle) {
		const tranformAngle = 360 / statesCount;
		const displayCircleR =
			Math.max(Math.min(fsm.canvas.width, fsm.canvas.height, 320), 40) / 2;

		const theta = startAngle + tranformAngle * stateIndex;
		const thetaFPi = (theta / 180) * Math.PI;
		let { cx, cy } = getCenterOfElement(fsm.canvas.node);
		return {
			theta: theta,
			cx: cx + displayCircleR * Math.cos(thetaFPi),
			cy: cy + displayCircleR * Math.sin(thetaFPi),
			position: theta > -90 && theta < 90 ? "right" : "left"
		};
	};
}
