import { SVG } from '@svgdotjs/svg.js';

window.onload = function () {
	let toggle1 = false;
	console.log('Hello world!');
	let draw = SVG().addTo('#svgTest').size(300, 300);
	let rect = draw.rect(100, 100).attr({ fill: '#ff0000' });
	rect.click(function () {
		if (!toggle1) {
			rect.animate(750).move(50, 50).attr({ fill: '#00ff00' });
		} else {
			rect.animate(750).move(0, 0).attr({ fill: '#ff0000' });
		}
		toggle1 = !toggle1;
	});
};
