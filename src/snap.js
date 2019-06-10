import Snap from "snapsvg";
import Color from "color";

/**
 * extend Snap
 *
 */
const darkenRatio = 0.15;
Snap.plugin(function(Snap, Element, Paper) {
	//  get all circles
	Paper.prototype.getCircles = function() {
		return this.selectAll("circle") || [];
	};

	// override circel
	var __paper_proto_circle = Paper.prototype.circle;
	Paper.prototype.circle = function(cx, cy, r, color) {
		var circle = __paper_proto_circle.call(this, cx, cy, r);
		if (color) {
			circle.node.setAttribute("fill", color);
			circle.node.setAttribute(
				"stroke",
				Color(color)
					.darken(darkenRatio)
					.hex()
			);
			circle.node.setAttribute("stroke-width", 2);
		}

		return circle;
	};

	// create a label
	Paper.prototype.label = function(x, y, options) {
		let {
			color = "#fff",
			position = "left",
			text = "",
			textSize = 14
		} = options;

		let arrowW = 18,
			labelWidth = 120,
			labelHeight = 30,
			tailWidth = 6;
		let labelPath = `M${x},${y} L${x - arrowW},${y - labelHeight / 2} L${x -
			labelWidth},${y - labelHeight / 2} L${x - labelWidth},${y +
			labelHeight / 2} L${x - arrowW},${y + labelHeight / 2} L${x},${y}`;
		let tailPath = `M${x - labelWidth},${y - labelHeight / 2} L${x -
			labelWidth -
			tailWidth},${y - labelHeight / 2}
			L${x - labelWidth - tailWidth},${y + labelHeight / 2} L${x - labelWidth},${y +
			labelHeight / 2}`;

		if (position === "right") {
			labelPath = `M${x},${y} L${x + arrowW},${y - labelHeight / 2} L${x +
				labelWidth},${y - labelHeight / 2} L${x + labelWidth},${y +
				labelHeight / 2} L${x + arrowW},${y + labelHeight / 2} L${x},${y}`;
			tailPath = `M${x + labelWidth},${y - labelHeight / 2} L${x +
				labelWidth +
				tailWidth},${y - labelHeight / 2}
					L${x + labelWidth + tailWidth},${y + labelHeight / 2} L${x + labelWidth},${y +
				labelHeight / 2}`;
		}

		/* create label box */
		var labelBox = this.path(labelPath);
		labelBox.node.setAttribute("fill", "#fff");
		labelBox.node.setAttribute("stroke", "#dedede");
		labelBox.node.setAttribute("stroke-width", 1);
		var labelBBox = Snap.path.getBBox(labelPath);

		/* create label text */
		var labelText = this.text(
			labelBBox.x + (position === "right" ? arrowW : 0) + 8,
			labelBBox.y + (labelBBox.height + textSize) / 2 - 2,
			text
		);
		labelText.attr("font-size", `${textSize}px`);

		/* create tail rect, filled with darken-color */
		var tailRect = this.path(tailPath);
		tailRect.node.setAttribute(
			"fill",
			Color(color)
				.darken(darkenRatio)
				.hex()
		);

		var g = this.g();
		g.add(labelBox, labelText, tailRect);
		let shadowF = this.filter(Snap.filter.shadow(1, 2, 2, "#999", 0.5));
		g.node.setAttribute("filter", `url('#${shadowF.node.id}')`);

		return g;
	};
});

export default Snap;
