import FsmSvg from "fsm.svg";
import anime from "animejs/lib/anime.es.js";

var fsm = FsmSvg.init("#demo");
fsm.setOption({
	states: [
		{
			label: "Normal",
			linkTo: [1, 2]
		},
		{
			label: "Warning",
			linkTo: [0, 2]
		},
		{
			label: "Problematic",
			linkTo: [1, 0]
		},
		{
			label: "Exit"
		}
	]
});
