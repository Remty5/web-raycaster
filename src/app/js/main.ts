let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fps = 60;

//* Debug (info...)
let debugActive: boolean = true;
let debugLine: number;

//* Player starting position
let playerX: number = 413;
let playerY: number = 287;

//* Player rotation and movement speed
let playerMovementSpeed: number = 2;
let playerRotationSpeed: number = 0.05;

//* Initial player direction
let playerA: number = (3 * Math.PI) / 2;
let playerDX: number;
let playerDY: number;
function calculatePlayerDirections() {
	playerDX = Math.cos(playerA) * playerMovementSpeed;
	playerDY = Math.sin(playerA) * playerMovementSpeed;
}
calculatePlayerDirections();

let keysDown = {
	z: false,
	q: false,
	s: false,
	d: false,
};
//* Level dimensions for later use
let levelCanvasDimensions = { width: 600, height: 600 };
let levelMapDimensions = { width: 24, height: 24 };
let levelCellDimensions = {
	width: levelCanvasDimensions.width / levelMapDimensions.width,
	height: levelCanvasDimensions.height / levelMapDimensions.height,
};
//* Level map
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

function tick() {
	resetCounters();
	calculateMovement();
	renderScreen();
}

function resetCounters() {
	debugLine = 0;
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
		calculatePlayerDirections();
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
		calculatePlayerDirections();
	}
}

function renderScreen() {
	//* Background
	fillRect(0, 0, canvas.width, canvas.height, 'DarkGray');

	//* Level
	drawLevel();

	//* Player direction
	fillLine(playerX, playerY, playerX + playerDX * 10, playerY + playerDY * 10, 6, 'Red');

	//* Debug
	debugText(`Player: ${Math.round(playerX)}, ${Math.round(playerY)}`);
	debugText(`Player direction: ${Math.round((playerDX + Number.EPSILON) * 100) / 100}, ${Math.round((playerDY + Number.EPSILON) * 100) / 100}`);
	debugText(`Player angle: ${Math.round((playerA + Number.EPSILON) * 100) / 100}`);

	//* Rays
	drawRays3D();

	//* Player
	let playerSize = 10;
	fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, 'Green');
}

function drawRays3D() {
	// Create needed variables
	let ray, mapX, mapY, mapPosition, dof, maxDof, rayX, rayY, rayA, rayOffsetX, rayOffsetY: number;
	// Set ray angle to player angle
	rayA = playerA;
	// Cast one ray for now
	for (ray = 0; ray < 1; ray++) {
		// Initialize values
		rayX = 0;
		rayY = 0;
		rayOffsetX = 0;
		rayOffsetY = 0;
		dof = 0;
		maxDof = 10;
		// Get the negative inverse of tan() for the ray angle
		let negativeInverseTan = -1 / Math.tan(rayA);
		//* Ray angle greater than PI means it's going up
		if (rayA > Math.PI) {
			// Ray Y position is the player position floored to the above horizontal grid line
			rayY = Math.floor(playerY / levelCellDimensions.height) * levelCellDimensions.height;
			// Ray X position is the difference between the player Y position and
			// the ray Y position times the negative inverse of tan() for the ray's angle
			// plus the player X position so that it's relative to the player
			rayX = (playerY - rayY) * negativeInverseTan + playerX;
			// Next Y offset is simply the above horizontal line
			rayOffsetY = -levelCellDimensions.height;
			// Next X offset is the negative of the Y offset (so that it's positive)
			// times the negative inverse of tan() for the ray's angle
			rayOffsetX = -rayOffsetY * negativeInverseTan;
		}
		//* Ray angle smaller than PI means it's going down
		if (rayA < Math.PI) {
			// Ray Y position is the player position floored to the below (+1) horizontal grid line
			rayY = (Math.floor(playerY / levelCellDimensions.height) + 1) * levelCellDimensions.height;
			// Ray X position is the difference between the player Y position and
			// the ray Y position times the negative inverse of tan() for the ray's angle
			// plus the player X position so that it's relative to the player
			rayX = (playerY - rayY) * negativeInverseTan + playerX;
			// Next Y offset is simply the above horizontal line
			rayOffsetY = levelCellDimensions.height;
			// Next X offset is the Y offset times the negative inverse of tan() for the ray's angle
			rayOffsetX = -rayOffsetY * negativeInverseTan;
		}
		//* Looking straight left or right
		if (rayA === 0 || rayA === Math.PI) {
			rayX = playerX;
			rayY = playerY;
			dof = maxDof;
		}

		//* While no wall has been hit
		while (dof < maxDof) {
			mapX = Math.floor(rayX / levelCellDimensions.width);
			mapY = Math.floor(rayY / levelCellDimensions.height);
			mapPosition = mapY * levelMapDimensions.width + mapX;
			// Check is ray hit a wall
			if (mapPosition < levelMapDimensions.width * levelMapDimensions.height && levelMap[mapPosition]) {
				// Wall hit, stop while loop
				strokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'lime'
				);
				break;
			} else {
				strokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'red'
				);
				rayX += rayOffsetX;
				rayY += rayOffsetY;
				dof++;
			}
		}

		// fillLine(playerX, playerY, rayX, rayY, 4, 'DeepSkyBlue');
		// fillLine(playerX, playerY, rayX + rayOffsetX, rayY + rayOffsetY, 1, 'Orange');
		fillRect(rayX - 3, rayY - 3, 6, 6, 'Yellow');

		debugText(`Ray Angle: ${Math.round((rayX + Number.EPSILON) * 100) / 100}`);
		debugText(`Ray: ${Math.round(rayX)}, ${Math.round(rayY)}`);
		debugText(`Ray offset: ${Math.round(rayOffsetX)}, ${Math.round(rayOffsetY)}`);
		debugText(`Current dof: ${dof}`);
		debugText(`Map: ${mapX}, ${mapY}`);
		debugText(`Map position: ${mapPosition}`);
	}
}

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
		case 'ArrowUp':
			playerA = (Math.PI * 3) / 2;
			calculatePlayerDirections();
			break;
		case 'ArrowLeft':
			playerA = Math.PI;
			calculatePlayerDirections();
			break;
		case 'ArrowDown':
			playerA = Math.PI / 2;
			calculatePlayerDirections();
			break;
		case 'ArrowRight':
			playerA = 0;
			calculatePlayerDirections();
			break;
		default:
			break;
	}
}

function drawLevel() {
	levelMap.forEach((n, i) => {
		// console.log(n, i);
		let c = i % levelMapDimensions.width;
		let l = Math.floor(i / levelMapDimensions.height);
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
		// Offset (grid pattern):
		fillRect(levelCellDimensions.width * c + 1, levelCellDimensions.height * l + 1, levelCellDimensions.width - 1, levelCellDimensions.height - 1, color);
		// No offset (no grid pattern):
		// fillRect(levelCellDimensions.width * c, levelCellDimensions.height * l, levelCellDimensions.width, levelCellDimensions.height, color);
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

function debugText(text: string) {
	if (debugActive) {
		let textX = 6;
		let textY = debugLine * 32 + 32;

		ctx.fillStyle = 'White';
		ctx.font = '28px sans-serif';
		ctx.fillText(text, textX, textY);

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'Black';
		ctx.strokeText(text, textX, textY);

		debugLine++;
	}
}

function fillRect(x: number, y: number, width: number, height: number, color: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function strokeRect(x: number, y: number, width: number, height: number, lineWidth: number, color: any) {
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeRect(x, y, width, height);
}
