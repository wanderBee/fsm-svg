/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
"use strict";

import FsmSvg from "../src/fsm";

describe("Link", () => {
	var fsm;
	beforeEach(function() {
		// Set up our document body
		document.body.innerHTML = `
        <svg id='demo' width='400' height='400'></svg>
		`;

		fsm = FsmSvg.init("#demo");
		fsm.setOption({
			container: "#demo",
			states: [
				{
					label: "Normal",
					linkTo: 1
				},
				{
					label: "Warning"
				},
				{
					label: "Problematic"
				},
				{
					label: "Exit"
				}
			]
		});
	});

	it("should exists", () => {
		expect(fsm).toBeDefined();
	});
});
