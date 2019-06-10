/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
/* global document */

"use strict";

import Snap from "../src/snap";
import Canvas from "../src/canvas";
const $ = require("jquery");

describe("Canvas", () => {
	var doc;
	beforeEach(function() {
		// Set up our document body
		document.body.innerHTML = `
            <svg id='demo' width='100' height='100'></svg>
            <div id='demo2' style='width:200px; height:200px;'></div>
        `;
		doc = document;
	});

	it("create a canvas by no arguments, has default width/height", () => {
		var c = new Canvas(Snap);
		expect(c).toBeDefined();
		expect(c.node).toBeTruthy();
		expect(c.node.getAttribute("width")).toBe("300");
		expect(c.node.getAttribute("height")).toBe("300");
	});

	it("create a canvas by a svgElement", () => {
		var c = new Canvas(Snap, "#demo");
		expect(c).toBeDefined();
		expect(c.node).toBeTruthy();
		expect(c.node.getAttribute("width")).toBe("100");
		expect(c.node.getAttribute("height")).toBe("100");
	});

	it("create a canvas by a normal Element", () => {
		var c = new Canvas(Snap, "#demo2");

		expect(c).toBeDefined();
		expect(c.node).toBeTruthy();
		// 父节点是demo2
		expect(c.node.parentNode.id).toEqual("demo2");
		expect(c.node.getAttribute("width")).toBe("200");
		expect(c.node.getAttribute("height")).toBe("200");
	});
});
