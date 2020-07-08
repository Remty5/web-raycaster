let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fps = 60;
let playerX: number = 60;
let playerY: number = 60;
let playerMovementSpeed: number = 2;
let playerRotationSpeed: number = 0.05;
let playerA: number = Math.PI / 4;
let playerDX: number = Math.cos(playerA) * playerMovementSpeed;
let playerDY: number = Math.sin(playerA) * playerMovementSpeed;

let keysDown = {
	z: false,
	q: false,
	s: false,
	d: false,
};
let levelCanvasDimensions = { width: 600, height: 600 };
let levelMapDimensions = { width: 24, height: 24 };
// prettier-ignore
let levelMap = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 5, 5, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 5, 5, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 7, 7, 0, 8, 8, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 7, 7, 0, 8, 8, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]

window.onload = function () {
	console.log('Hello world!');
	canvas = document.getElementById('raycaster-canvas') as HTMLCanvasElement;
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

	document.addEventListener('keydown', e => handleInput(e.key, true));
	document.addEventListener('keyup', e => handleInput(e.key, false));
	// canvas.addEventListener('keydown', e => {
	// 	if (e.key == 'z') keysDown.z = true;
	// 	if (e.key == 'q') keysDown.q = true;
	// 	if (e.key == 's') keysDown.s = true;
	// 	if (e.key == 'd') keysDown.d = true;
	// });
	// canvas.addEventListener('keyup', e => {
	// 	if (e.key == 'z') keysDown.z = false;
	// 	if (e.key == 'q') keysDown.q = false;
	// 	if (e.key == 's') keysDown.s = false;
	// 	if (e.key == 'd') keysDown.d = false;
	// });

	setInterval(tick, 1000 / fps);
	// tick();
};

function handleInput(key: string, currentStatus: boolean) {
	switch (key) {
		case 'z':
			keysDown.z = currentStatus;
			break;
		case 'q':
			keysDown.q = currentStatus;
			break;
		case 's':
			keysDown.s = currentStatus;
			break;
		case 'd':
			keysDown.d = currentStatus;
			break;
		default:
			break;
	}
}
function tick() {
	calculateMovement();
	renderScreen();
}

function calculateMovement() {
	// if (keysDown.z && playerY - 5 > 0) playerY -= 5;
	// if (keysDown.s && playerY + 5 < canvas.height) playerY += 5;
	// if (keysDown.q && playerX - 5 > 0) playerX -= 5;
	// if (keysDown.d && playerX + 5 < canvas.width / 2) playerX += 5;
	if (keysDown.z) {
		if (playerX + playerDX > 0 && playerX + playerDX < canvas.width / 2) playerX += playerDX;
		if (playerY + playerDY > 0 && playerY + playerDY < canvas.height) playerY += playerDY;
	}
	if (keysDown.q) {
		playerA -= playerRotationSpeed;
		if (playerA < 0) {
			playerA += Math.PI * 2;
		}
		playerDX = Math.cos(playerA) * playerMovementSpeed;
		playerDY = Math.sin(playerA) * playerMovementSpeed;
	}
	if (keysDown.s) {
		if (playerX - playerDX > 0 && playerX - playerDX < canvas.width / 2) playerX -= playerDX;
		if (playerY - playerDY > 0 && playerY - playerDY < canvas.height) playerY -= playerDY;
	}
	if (keysDown.d) {
		playerA += playerRotationSpeed;
		if (playerA > Math.PI * 2) {
			playerA -= Math.PI * 2;
		}
		playerDX = Math.cos(playerA) * playerMovementSpeed;
		playerDY = Math.sin(playerA) * playerMovementSpeed;
	}
}

function renderScreen() {
	// Background
	fillRect(0, 0, canvas.width, canvas.height, 'DarkGray');

	// Level
	drawLevel();

	// Player direction
	fillLine(playerX, playerY, playerX + playerDX * 10, playerY + playerDY * 10, 2, 'red');

	let playerSize = 10;
	fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, 'Green');
	// Debug
	fillText(playerX, 3, 10, 'Black');
	fillText(playerY, 3, 20, 'Black');
	fillText(playerDX, 3, 30, 'Black');
	fillText(playerDY, 3, 40, 'Black');
	fillText(playerA, 3, 50, 'Black');
}

function drawLevel() {
	levelMap.forEach((n, i) => {
		// console.log(n, i);
		let c = i % levelMapDimensions.width;
		let l = Math.floor(i / levelMapDimensions.height);
		let width: number = levelCanvasDimensions.width / levelMapDimensions.width;
		let height: number = levelCanvasDimensions.height / levelMapDimensions.height;
		let color;
		switch (n) {
			case 0:
				color = 'Black';
				break;
			case 1:
				color = 'White';
				break;
			case 2:
				color = 'Blue';
				break;
			case 3:
				color = 'Red';
				break;
			case 4:
				color = 'Green';
				break;
			case 5:
				color = 'Coral';
				break;
			case 6:
				color = 'LimeGreen';
				break;
			case 7:
				color = 'DeepSkyBlue';
				break;
			case 8:
				color = 'Gold';
				break;
			default:
				color = 'Black';
				break;
		}
		// Offset:
		fillRect(width * c + 1, height * l + 1, width - 1, height - 1, color);
		// No offset:
		// fillRect(width * c, height * l, width, height, color);
	});
}

function fillLine(startX: number, startY: number, endX: number, endY: number, width: number, color: any) {
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.stroke();
}

function fillText(text: any, x: number, y: number, color: any, maxWidth?: number) {
	ctx.fillStyle = color;
	ctx.fillText(text, x, y, maxWidth);
}

function fillRect(x: number, y: number, width: number, height: number, color: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}
