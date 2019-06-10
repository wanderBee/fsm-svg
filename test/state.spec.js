/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
/* global document */

"use strict";

import Snap from "../src/snap";
import Canvas from "../src/canvas";
import State from "../src/state";
const $ = require("jquery");

describe("State", () => {
	var c;
	beforeEach(function() {
		// Set up our document body
		document.body.innerHTML = `
        <svg id='demo' width='400' height='400'></svg>
        `;
		c = new Canvas(Snap, "#demo");
	});

	it("create a state in demo, should has a circle", () => {
		var st = new State({ canvas: c, color: "red" });
		expect(st).toBeDefined();

		var cr = st.g.circle.node;
		expect(cr).not.toBeNull();
		expect(cr instanceof SVGElement).toBeTruthy();
		expect(cr.parentNode.parentNode.id).toEqual("demo");
		// first circle is generated in the center
		console.log('cr;;;', cr.outerHTML)
		// expect(cr.getAttribute("cx")).toEqual("200");
		// expect(cr.getAttribute("cy")).toEqual("200");
		// expect(cr.getAttribute("r")).toEqual("25");
	});

	it("create a state in demo,should has a label box", () => {
		var st = new State({ canvas: c, color: "red", label: "hello" });
		expect(st).toBeDefined();
		expect(st.g.label).toBeDefined();
		expect(st.g.label.text).toEqual("hello");

		var lb = st.g.label.node;
		expect(lb).not.toBeNull();
		expect(lb instanceof SVGElement).toBeTruthy();
		expect(lb.parentNode.parentNode.id).toEqual("demo");
	});
});
