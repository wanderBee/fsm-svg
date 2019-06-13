/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
"use strict";

import Canvas from "../src/canvas";
import State from "../src/state";
import Link from "../src/link";
import Point from "../src/point";

describe("Link", () => {
	var c, lk;
	beforeEach(function() {
		// Set up our document body
		document.body.innerHTML = `
        <svg id='demo' width='400' height='400'></svg>
        `;
		c = new Canvas("#demo").canvas;

		// Link tow states
		// var st1 = new State({ canvas: c, cx: 30, cy: 30 });
		// var st2 = new State({ canvas: c });
		var p1 = new Point(311.868, 286.863);
		var p2 = new Point(488.137, 286.863);
		lk = new Link(p1, p2, { markerSize: 5, curv: -0.8 });
	});

	it("should has source/target", () => {
		expect(lk).toBeDefined();
		expect(lk.source instanceof Point).toBeTruthy();
		expect(lk.target instanceof Point).toBeTruthy();
	});
});
