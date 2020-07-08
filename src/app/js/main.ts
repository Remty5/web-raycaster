let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fps = 60;
let playerX: number = 55;
let playerY: number = 55;
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
// prettier-ignore
let level = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1,
	1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1,
	1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1,
	1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]

function handleInput(key: string, down: boolean) {
	switch (key) {
		case 'z':
			keysDown.z = down;
			break;
		case 'q':
			keysDown.q = down;
			break;
		case 's':
			keysDown.s = down;
			break;
		case 'd':
			keysDown.d = down;
			break;
		default:
			break;
	}
}

window.onload = function () {
	console.log('Hello world!');
	canvas = document.getElementById('raycaster-canvas') as HTMLCanvasElement;
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

	addEventListener('keydown', e => handleInput(e.key, true));
	addEventListener('keyup', e => handleInput(e.key, false));

	setInterval(tick, 1000 / fps);
	// tick();
};

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
	fillRect(0, 0, canvas.width, canvas.height, 'black');

	// Level
	level.forEach((n, i) => {
		// console.log(n, i);
		let l = Math.floor(i / 12);
		let c = i % 12;
		// Fun
		// n = Math.round(Math.random());
		if (n) fillRect(c * 50, l * 50, 50, 50, 'White');
		else fillRect(c * 50, l * 50, 50, 50, 'DarkGray');
	});

	// Player
	let playerSize = 10;
	fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, 'Green');
	// Debug
	fillText(playerX, 3, 10, 'Black');
	fillText(playerY, 3, 20, 'Black');
	fillText(playerDX, 3, 30, 'Black');
	fillText(playerDY, 3, 40, 'Black');
	fillText(playerA, 3, 50, 'Black');
}

function fillText(text: any, x: number, y: number, color: any, maxWidth?: number) {
	ctx.fillStyle = color;
	ctx.fillText(text, x, y, maxWidth);
}

function fillRect(x: number, y: number, width: number, height: number, color: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}
