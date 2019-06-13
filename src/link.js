import { assert } from "./util";
import Point from "./point";

export default class Link {
	/**
	 * source { x, y }
	 * target { x, y }
	 */
	constructor(source, target, options = {}) {
		if (process.env.NODE_ENV !== "production") {
			assert(source instanceof Point, `argument[0] should be a point.`);
			assert(target instanceof Point, `argument[1] should be a point.`);
		}

		this.source = source;
		this.target = target;

		const { curv = 0, markerSize = 4 } = options;
		this.markerSize = markerSize;

		genLinkPath(this, source, target, curv, markerSize);
	}
}

function genLinkPath(link, source, target, curv, markerSize) {
	link.path = svgPathCubicCurve(source.x, source.y, target.x, target.y, curv);
	link.marker = svgTriangleMarker(markerSize);
}

function svgTriangleMarker(size) {
	return {
		path: `M2,2 L2,${2 + size} L${2 + (size / 2) * 3},${size / 2 + 2} L2,2 Z`,
		x: 0,
		y: 0,
		width: 2 * size,
		height: 2 * size,
		refX: 2 + (size / 2) * 3,
		refY: size / 2 + 2
	};
}

function svgPathCubicCurve(x1, y1, x2, y2, curv) {
	/**
	 * Cubic Bezeir Curve
	 * curv is between [-2, 2]
	 */
	curv = curv >= -2 && curv <= 2 ? curv : 0;
	let cf = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;
	let innerCurv = 0.27;
	let s,
		k2,
		controX1,
		controY1,
		controX2,
		controY2,
		q,
		l,
		path = "";
	s = "M" + x1 + "," + y1 + " ";

	k2 = -(x2 - x1) / (y2 - y1);

	if (k2 < 2 && k2 > -2) {
		controX1 = x2 * innerCurv + x1 * (1 - innerCurv) + curv * cf;
		controX1 = controX1 < 0 ? -controX1 : controX1;
		controY1 =
			k2 * (controX1 - (x2 * innerCurv + x1 * (1 - innerCurv))) +
			(y2 * innerCurv + y1 * (1 - innerCurv));
		controY1 = controY1 < 0 ? -controY1 : controY1;

		controX2 = x1 * innerCurv + x2 * (1 - innerCurv) + curv * cf;
		controX2 = controX2 < 0 ? -controX2 : controX2;
		controY2 =
			k2 * (controX2 - (x1 * innerCurv + x2 * (1 - innerCurv))) +
			(y1 * innerCurv + y2 * (1 - innerCurv));
		controY2 = controY2 < 0 ? -controY2 : controY2;
	} else {
		k2 = -(y2 - y1) / (x2 - x1);
		controY1 = y2 * innerCurv + y1 * (1 - innerCurv) + curv * cf;
		controY1 = controY1 < 0 ? -controY1 : controY1;
		controX1 =
			k2 * (controY1 - (y2 * innerCurv + y1 * (1 - innerCurv))) +
			x2 * innerCurv +
			x1 * (1 - innerCurv);
		controX1 = controX1 < 0 ? -controX1 : controX1;

		controY2 = y1 * innerCurv + y2 * (1 - innerCurv) + curv * cf;
		controY2 = controY2 < 0 ? -controY2 : controY2;
		controX2 =
			k2 * (controY2 - (y1 * innerCurv + y2 * (1 - innerCurv))) +
			x1 * innerCurv +
			x2 * (1 - innerCurv);
		controX2 = controX2 < 0 ? -controX2 : controX2;
	}

	q = "C" + controX1 + "," + controY1 + " " + controX2 + "," + controY2 + " ";
	//l=lineto
	l = x2 + "," + y2 + " ";
	//eg: M30,30 Q65,65 100,100
	path = s + q + l;
	return path;
}

function svgPathCurv(x1, y1, x2, y2, curv) {
	/*
	 * Quadratic Bezier Curve
	 * curv is between [-2, 2]
	 */
	curv = curv >= -2 && curv <= 2 ? curv : 0;
	let cf = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;
	let s,
		k2,
		controX,
		controY,
		q,
		l,
		path = "";
	s = "M" + x1 + "," + y1 + " ";

	k2 = -(x2 - x1) / (y2 - y1);

	if (k2 < 2 && k2 > -2) {
		controX = (x2 + x1) / 2 + curv * cf;
		controX = controX < 0 ? -controX : controX;
		controY = k2 * (controX - (x1 + x2) / 2) + (y1 + y2) / 2;
		controY = controY < 0 ? -controY : controY;
	} else {
		controY = (y2 + y1) / 2 + curv * cf;
		controY = controY < 0 ? -controY : controY;
		controX = (controY - (y1 + y2) / 2) / k2 + (x1 + x2) / 2;
		controX = controX < 0 ? -controX : controX;
	}

	q = "Q" + controX + "," + controY + " ";
	//l=lineto
	l = x2 + "," + y2 + " ";
	//eg: M30,30 Q65,65 100,100
	path = s + q + l;
	return path;
}
