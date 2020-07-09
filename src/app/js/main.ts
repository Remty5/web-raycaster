let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fps = 60;

//* Debug (info...)
let debugActive: { [id: string]: boolean } = {};
let debugTextLine: number;

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

	//* Initialize debug
	debugInit();

	setInterval(tick, 1000 / fps);
	// tick();
};

function debugInit() {
	//* Add toggles
	addDebugToggle('Main');
	addDebugToggle('Text');

	addDebugToggle('HorizontalRayText');
	addDebugToggle('HorizontalRayMapChecks');
	addDebugToggle('HorizontalRayHitMarker');
	addDebugToggle('HorizontalRayLine');
	addDebugToggle('HorizontalRayOffsetLine');

	addDebugToggle('VerticalRayText');
	addDebugToggle('VerticalRayMapChecks');
	addDebugToggle('VerticalRayHitMarker');
	addDebugToggle('VerticalRayLine');
	addDebugToggle('VerticalRayOffsetLine');

	addDebugToggle('RayText');
	addDebugToggle('RayLine');

	//* Init default values
	debugActive['Main'] = true;
	debugActive['RayText'] = true;
	debugActive['RayLine'] = true;
}

function addDebugToggle(buttonID: string) {
	let button = document.getElementById(buttonID) as HTMLButtonElement;
	debugActive[buttonID] = false;
	button.onclick = function () {
		debugActive[buttonID] = !debugActive[buttonID];
		button.innerHTML = `${buttonID}: ${debugActive[buttonID]}`;
	};
}

function tick() {
	resetCounters();
	calculateMovement();
	renderScreen();
}

function resetCounters() {
	debugTextLine = 0;
}

function calculateMovement() {
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
	debugText(`Player: ${Math.round(playerX)}, ${Math.round(playerY)}`, 'Text');
	debugText(`Player direction: ${Math.round((playerDX + Number.EPSILON) * 100) / 100}, ${Math.round((playerDY + Number.EPSILON) * 100) / 100}`, 'Text');
	debugText(`Player angle: ${Math.round((playerA + Number.EPSILON) * 100) / 100}`, 'Text');

	//* Rays
	drawRays3D();

	//* Player
	let playerSize = 10;
	fillCentredRect(playerX, playerY, playerSize, playerSize, 'Green');
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
		maxDof = 30;
		mapX = 0;
		mapY = 0;

		//*
		//*  Horizontal lines
		//*

		// Init for ray distance
		let rayHorizontalDistance = 100000;
		let rayHorizontalX = playerX;
		let rayHorizontalY = playerY;

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

			debugCentredRect(rayX, rayY, 6, 6, 'HorizontalRayHitMarker', 'Red');
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

			debugCentredRect(rayX, rayY, 6, 6, 'HorizontalRayHitMarker', 'Red');
		}
		//* Going straight left or right
		if (rayA === 0 || rayA === Math.PI) {
			rayX = playerX;
			rayY = playerY;
			rayOffsetX = 0;
			rayOffsetY = 0;
			dof = maxDof;
		}

		//* While no wall has been hit
		while (dof < maxDof) {
			// Calculate the ray X hit position on the map
			mapX = Math.floor(rayX / levelCellDimensions.width);
			// Calculate the ray Y position on the map
			// I don't like this, i don't know why it doesn't work but i have to do this terrible thing
			if (Math.sign(rayOffsetY) === -1) {
				// Looking up, offset wall check one up
				mapY = Math.floor(rayY / levelCellDimensions.height) - 1;
			}
			if (Math.sign(rayOffsetY) === 1) {
				// Looking down, no need for offset
				mapY = Math.floor(rayY / levelCellDimensions.height);
			}
			mapPosition = mapY * levelMapDimensions.width + mapX;
			// Check is ray hit a wall
			if (mapPosition > 0 && mapPosition < levelMapDimensions.width * levelMapDimensions.height && levelMap[mapPosition]) {
				// Wall hit, stop while loop
				debugStrokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'HorizontalRayMapChecks',
					'Lime'
				);

				debugCentredRect(rayX, rayY, 6, 6, 'HorizontalRayHitMarker', 'Lime');

				rayHorizontalX = rayX;
				rayHorizontalY = rayY;
				rayHorizontalDistance = calculateDistance(playerX, playerY, rayHorizontalX, rayHorizontalY);
				break;
			} else {
				debugStrokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'HorizontalRayMapChecks',
					'Red'
				);
				debugCentredRect(rayX, rayY, 6, 6, 'HorizontalRayHitMarker', 'Red');
				rayX += rayOffsetX;
				rayY += rayOffsetY;
				dof++;
			}
		}

		debugLine(playerX, playerY, rayX, rayY, 4, 'HorizontalRayLine', 'DeepSkyBlue');
		debugLine(playerX, playerY, rayX + rayOffsetX, rayY + rayOffsetY, 1, 'HorizontalRayOffsetLine', 'Orange');

		debugText(`Horizontal Ray Angle: ${Math.round((rayA + Number.EPSILON) * 100) / 100}`, 'HorizontalRayText');
		debugText(`Horizontal Ray: ${Math.round(rayX)}, ${Math.round(rayY)}`, 'HorizontalRayText');
		debugText(`Horizontal Ray offset: ${Math.round(rayOffsetX)}, ${Math.round(rayOffsetY)}`, 'HorizontalRayText');
		debugText(`Horizontal Current dof: ${dof}`, 'HorizontalRayText');
		debugText(`Horizontal Map: ${mapX}, ${mapY}`, 'HorizontalRayText');
		debugText(`Horizontal Map position: ${mapPosition}`, 'HorizontalRayText');

		// Reinitialize dof
		dof = 0;

		//*
		//*  Vertical lines
		//*

		// Init for ray distance
		let rayVerticalDistance = 100000;
		let rayVerticalX = playerX;
		let rayVerticalY = playerY;

		// Get the negative of tan() for the ray angle
		let negativeTan = -Math.tan(rayA);
		//* Ray going left
		if (rayA > Math.PI / 2 && rayA < (3 * Math.PI) / 2) {
			rayX = Math.floor(playerX / levelCellDimensions.width) * levelCellDimensions.width;
			rayY = (playerX - rayX) * negativeTan + playerY;
			rayOffsetX = -levelCellDimensions.width;
			rayOffsetY = -rayOffsetX * negativeTan;

			debugCentredRect(rayX, rayY, 6, 6, 'VerticalRayHitMarker', 'Red');
		}
		//* Ray going right
		if (rayA < Math.PI / 2 || rayA > (3 * Math.PI) / 2) {
			rayX = (Math.floor(playerX / levelCellDimensions.width) + 1) * levelCellDimensions.width;
			rayY = (playerX - rayX) * negativeTan + playerY;
			rayOffsetX = levelCellDimensions.width;
			rayOffsetY = -rayOffsetX * negativeTan;

			debugCentredRect(rayX, rayY, 6, 6, 'VerticalRayHitMarker', 'Red');
		}
		//* Going straight up or down
		if (rayA === Math.PI / 2 || rayA === (3 * Math.PI) / 2) {
			rayX = playerX;
			rayY = playerY;
			rayOffsetX = 0;
			rayOffsetY = 0;
			dof = maxDof;
		}

		//* While no wall has been hit
		while (dof < maxDof) {
			if (Math.sign(rayOffsetX) === -1) {
				mapX = Math.floor(rayX / levelCellDimensions.width) - 1;
			}
			if (Math.sign(rayOffsetX) === 1) {
				mapX = Math.floor(rayX / levelCellDimensions.width);
			}
			mapY = Math.floor(rayY / levelCellDimensions.height);
			mapPosition = mapY * levelMapDimensions.width + mapX;
			if (mapPosition > 0 && mapPosition < levelMapDimensions.width * levelMapDimensions.height && levelMap[mapPosition]) {
				debugStrokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'VerticalRayMapChecks',
					'Lime'
				);
				debugCentredRect(rayX, rayY, 6, 6, 'VerticalRayHitMarker', 'Lime');

				rayVerticalX = rayX;
				rayVerticalY = rayY;
				rayVerticalDistance = calculateDistance(playerX, playerY, rayVerticalX, rayVerticalY);
				break;
			} else {
				debugStrokeRect(
					mapX * levelCellDimensions.width + 1,
					mapY * levelCellDimensions.height + 1,
					levelCellDimensions.width - 1,
					levelCellDimensions.height - 1,
					2,
					'VerticalRayMapChecks',
					'Red'
				);
				debugCentredRect(rayX, rayY, 6, 6, 'VerticalRayHitMarker', 'Red');

				rayX += rayOffsetX;
				rayY += rayOffsetY;
				dof++;
			}
		}

		debugLine(playerX, playerY, rayX, rayY, 4, 'VerticalRayLine', 'DeepSkyBlue');
		debugLine(playerX, playerY, rayX + rayOffsetX, rayY + rayOffsetY, 1, 'VerticalRayOffsetLine', 'Orange');

		debugText(`Vertical Ray Angle: ${Math.round((rayA + Number.EPSILON) * 100) / 100}`, 'VerticalRayText');
		debugText(`Vertical Ray: ${Math.round(rayX)}, ${Math.round(rayY)}`, 'VerticalRayText');
		debugText(`Vertical Ray offset: ${Math.round(rayOffsetX)}, ${Math.round(rayOffsetY)}`, 'VerticalRayText');
		debugText(`Vertical Current dof: ${dof}`, 'VerticalRayText');
		debugText(`Vertical Map: ${mapX}, ${mapY}`, 'VerticalRayText');
		debugText(`Vertical Map position: ${mapPosition}`, 'VerticalRayText');

		//*
		//* Calculate shortest distance
		//*

		if (rayHorizontalDistance < rayVerticalDistance) {
			rayX = rayHorizontalX;
			rayY = rayHorizontalY;
		} else if (rayHorizontalDistance > rayVerticalDistance) {
			rayX = rayVerticalX;
			rayY = rayVerticalY;
		} else {
			rayX = rayHorizontalX;
			rayY = rayHorizontalY;
		}

		debugLine(playerX, playerY, rayX, rayY, 4, 'RayLine', 'Yellow');

		debugText(`Ray Angle: ${Math.round((rayA + Number.EPSILON) * 100) / 100}`, 'RayText');
		debugText(`Ray: ${Math.round(rayX)}, ${Math.round(rayY)}`, 'RayText');
	}
}

function calculateDistance(aX: number, aY: number, bX: number, bY: number): number {
	return Math.sqrt(Math.pow(bX - aX, 2) * Math.pow(bY - aY, 2));
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

function fillRect(x: number, y: number, width: number, height: number, color: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}
function fillCentredRect(x: number, y: number, width: number, height: number, color: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x - width / 2, y - width / 2, width, height);
}

function strokeRect(x: number, y: number, width: number, height: number, lineWidth: number, color: any) {
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeRect(x, y, width, height);
}

//* Debug renders

function debugRender(type: string): boolean {
	if (!debugActive['Main']) return false;
	return debugActive[type];
}

function debugLine(startX: number, startY: number, endX: number, endY: number, width: number, type: string, color: any) {
	if (!debugRender(type)) return;
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.stroke();
}

function debugStrokeRect(x: number, y: number, width: number, height: number, lineWidth: number, type: string, color: any) {
	if (!debugRender(type)) return;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeRect(x, y, width, height);
}

function debugCentredRect(x: number, y: number, width: number, height: number, type: string, color: any) {
	if (!debugRender(type)) return;
	ctx.fillStyle = color;
	ctx.fillRect(x - width / 2, y - width / 2, width, height);
}

function debugText(text: string, type: string) {
	if (!debugRender('Text')) return;
	if (!debugRender(type)) return;
	let textX = 6;
	let textY = debugTextLine * 32 + 32;

	ctx.fillStyle = 'White';
	ctx.font = '28px sans-serif';
	ctx.fillText(text, textX, textY);

	ctx.lineWidth = 1;
	ctx.strokeStyle = 'Black';
	ctx.strokeText(text, textX, textY);

	debugTextLine++;
}
