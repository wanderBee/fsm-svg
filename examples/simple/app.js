import FsmSvg from "fsm.svg";
import { ellipse2path } from "../../src/util";
import { filter, forEach } from "lodash";

var fsm = FsmSvg.init("#demo");
fsm.setOption({
	states: [
		{
			label: "Normal"
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
	],
	links: [[0, 1], [1, 0], [1, 2], [2, 1], [0, 2], [2, 0]]
});

// animation
var animeIndex = 1;
var duration = 1600; // default anime duration

fsm.scale(animeIndex, 1.35);
setTimeout(() => {
	// restore
	fsm.scale(animeIndex, 1);
}, duration);
