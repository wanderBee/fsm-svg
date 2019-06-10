import "babel-polyfill";
import fsmsvg from "../../dist/fsm-svg.esm";
console.log(">>> fsmsvg:", fsmsvg);

var fsm = fsmsvg({
	container: "#demo",
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
	]
});

console.log('>>fsm:', fsm, fsm.states);