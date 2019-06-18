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
					label: "Warning",
					circleR: 20
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

	it("test method scale(), resetState()", () => {
		let animeIndex = 1; // label Warning
		let ocr = fsm._states[animeIndex].circleR;

		expect(ocr).toEqual(20);

		// scale big
		fsm.scale(animeIndex, 1.4);
		expect(fsm._states[animeIndex].circleR).toEqual(ocr * 1.4);

		// restore
		fsm.scale(animeIndex, 1);
		expect(fsm._states[animeIndex].circleR).toEqual(ocr);

		// resetState
		fsm.resetState(animeIndex, {
			circleR: 22
		});
		expect(fsm._states[animeIndex].circleR).toEqual(22);
	});
});
