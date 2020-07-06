window.onload = function () {
	console.log('Hello world!');
};

var draw = SVG().addTo('#svgTest').size(300, 300);
var rect = draw.rect(100, 100).attr({ fill: '#f06' });

console.log(rect.type);
