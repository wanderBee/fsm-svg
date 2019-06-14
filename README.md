# flowchart.svg

[![NPM Version](https://img.shields.io/npm/v/fsm.svg.svg)](https://www.npmjs.com/package/fsm.svg)

[![NPM Badge](https://nodei.co/npm/fsm.svg.png?downloads=true)](https://www.npmjs.com/package/fsm.svg)

## Install

```bash
$ git clone https://github.com/wanderBee/fsm.svg
```

```bash
$ yarn
```

## build

```bash
$ yarn build
```

## Load

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/fsm.svg/dist/fsm-svg.common.min.js"></script>
```

### ES6

```js
import FsmSvg from "fsm.svg";
```

## usage

> dependencies

[snap.svg](http://snapsvg.io)

> in your file

```javascript
var svg = FlowchartSvg.init("#flow");
svg.setOption({
	// type: 'polar', // 默认值'polar'
	r: 22, // polar图的圆半径
	data: [
		{
			source: "开始",
			target: "中间",
			value: "a>5"
		},
		{
			source: "中间",
			target: "结束",
			value: "b>0"
		}
	],
	style: {
		color: "#6c89d5"
	}
});
```

## License

[MIT](LICENSE)
