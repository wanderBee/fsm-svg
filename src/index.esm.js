/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author pengfei.wang
*/
"use strict";

import Snap from "./snap";
import { Fsm, install } from "./fsm";

export default function fsm(options) {
	install(Snap);
	return new Fsm(options);
}
