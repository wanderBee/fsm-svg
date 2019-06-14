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

> in your file

```javascript
var svg = FsmSvg.init("#flow");
svg.setOption({
	states: [
		{
			label: "Normal",
			color: "#8FBC8F"
		},
		{
			label: "Warning",
			color: "#EC0000"
		},
		{
			label: "Problematic",
			color: "#A64EA6"
		},
		{
			label: "Exit"
		}
	],
	links: [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]
});
```

## License

[MIT](LICENSE)
