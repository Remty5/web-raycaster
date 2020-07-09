let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fps = 60;
let renderLineNumber: number;

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
//* Render area dimensions and position
let renderCanvasDimensions = {
	width: 600,
	height: 535,
};
let renderCanvasPosition = {
	xOffset: 600,
	yOffset: 600 / 2 - renderCanvasDimensions.height / 2,
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
	1, 0, 0, 5, 5, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 5, 5, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 7, 7, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 7, 7, 0, 8, 8, 0, 0, 5, 0, 0, 6, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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
	renderLineNumber = 0;
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

	//* Debug
	debugText(`Player: ${Math.round(playerX)}, ${Math.round(playerY)}`, 'Text');
	debugText(`Player direction: ${Math.round((playerDX + Number.EPSILON) * 100) / 100}, ${Math.round((playerDY + Number.EPSILON) * 100) / 100}`, 'Text');
	debugText(`Player angle: ${Math.round((playerA + Number.EPSILON) * 100) / 100}`, 'Text');

	//* Rays
	drawRenderAreaBackground();
	drawRays3D();

	//* Player direction
	fillLine(playerX, playerY, playerX + playerDX * 6, playerY + playerDY * 6, 6, 'Red');

	//* Player
	let playerSize = 10;
	fillCentredRect(playerX, playerY, playerSize, playerSize, 'Green');
}

function drawRenderAreaBackground() {
	let floorColor = getCellColor(0);
	fillRect(
		renderCanvasPosition.xOffset,
		renderCanvasPosition.yOffset + renderCanvasDimensions.height / 2,
		renderCanvasDimensions.width,
		renderCanvasDimensions.height / 2,
		floorColor
	);
	let ceilingColor = 'Gray';
	fillRect(renderCanvasPosition.xOffset, renderCanvasPosition.yOffset, renderCanvasDimensions.width, renderCanvasDimensions.height / 2, ceilingColor);
}

function drawRays3D() {
	// Create needed variables
	let ray, mapX, mapY, mapPosition, dof, maxDof, rayX, rayY, rayA, rayOffsetX, rayOffsetY, distanceToRay: number;
	// Set number of rays and resolution
	let rayNumber = 120;
	// Ray resolution in degrees, will be converted to radians
	let rayResolution = 0.5;
	// Set ray angle
	rayA = playerA - (Math.PI / ((1 / rayResolution) * 180)) * (rayNumber / 2);

	if (rayA < 0) {
		rayA += Math.PI * 2;
	}
	if (rayA > Math.PI * 2) {
		rayA -= Math.PI * 2;
	}
	for (ray = 0; ray < rayNumber; ray++) {
		// Initialize values
		rayX = 0;
		rayY = 0;
		rayOffsetX = 0;
		rayOffsetY = 0;
		dof = 0;
		maxDof = 60;
		mapX = 0;
		mapY = 0;
		distanceToRay = 0;

		//*
		//*  Horizontal lines
		//*

		// Init for ray distance
		let rayHorizontalDistance = 100000;
		let rayHorizontalX = playerX;
		let rayHorizontalY = playerY;
		let rayHorizontalColor: string = 'Violet';

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
				rayHorizontalColor = getCellColor(levelMap[mapPosition]);
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
		let rayVerticalColor: string = 'Violet';

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
				rayVerticalColor = getCellColor(levelMap[mapPosition]);
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

		let rayColor: string = 'Violet';

		if (rayHorizontalDistance < rayVerticalDistance) {
			rayX = rayHorizontalX;
			rayY = rayHorizontalY;
			distanceToRay = rayHorizontalDistance;
			rayColor = rayHorizontalColor;
		} else if (rayHorizontalDistance > rayVerticalDistance) {
			rayX = rayVerticalX;
			rayY = rayVerticalY;
			distanceToRay = rayVerticalDistance;
			rayColor = rayVerticalColor;
		}
		debugLine(playerX, playerY, rayX, rayY, 2, 'RayLine', 'Yellow');

		debugText(`Ray Angle: ${Math.round((rayA + Number.EPSILON) * 100) / 100}`, 'RayText');
		debugText(`Ray: ${Math.round(rayX)}, ${Math.round(rayY)}`, 'RayText');

		//*
		//* Draw 3D Render
		//*

		let cosA = playerA - rayA;
		if (cosA < 0) {
			cosA += Math.PI * 2;
		}
		if (cosA > Math.PI * 2) {
			cosA -= Math.PI * 2;
		}
		distanceToRay = distanceToRay * Math.cos(cosA);

		let renderLineHeight = (levelCellDimensions.height * renderCanvasDimensions.height) / distanceToRay;
		if (renderLineHeight > renderCanvasDimensions.height) {
			renderLineHeight = renderCanvasDimensions.height;
		}
		let renderLineWidth = renderCanvasDimensions.width / rayNumber;
		fillRect(
			renderCanvasPosition.xOffset + renderLineNumber * renderLineWidth,
			renderCanvasPosition.yOffset + renderCanvasDimensions.height / 2 - renderLineHeight / 2,
			renderLineWidth,
			renderLineHeight,
			rayColor
		);
		renderLineNumber++;

		//* Add one degree to ray angle
		rayA += Math.PI / ((1 / rayResolution) * 180);
		if (rayA < 0) {
			rayA += Math.PI * 2;
		}
		if (rayA > Math.PI * 2) {
			rayA -= Math.PI * 2;
		}
	}
}

function calculateDistance(aX: number, aY: number, bX: number, bY: number): number {
	return Math.sqrt(Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2));
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
		let c = i % levelMapDimensions.width;
		let l = Math.floor(i / levelMapDimensions.height);
		let color = getCellColor(n);
		// Offset (1px grid pattern):
		fillRect(levelCellDimensions.width * c + 1, levelCellDimensions.height * l + 1, levelCellDimensions.width - 1, levelCellDimensions.height - 1, color);
		// Offset (2px grid pattern):
		// fillRect(levelCellDimensions.width * c + 1, levelCellDimensions.height * l + 1, levelCellDimensions.width - 2, levelCellDimensions.height - 2, color);
		// No offset (no grid pattern):
		// fillRect(levelCellDimensions.width * c, levelCellDimensions.height * l, levelCellDimensions.width, levelCellDimensions.height, color);
	});
}

function getCellColor(number: number): string {
	switch (number) {
		case 0:
			return 'Black';
		case 1:
			return 'White';
		case 2:
			return 'Blue';
		case 3:
			return 'Red';
		case 4:
			return 'Green';
		case 5:
			return 'Coral';
		case 6:
			return 'LimeGreen';
		case 7:
			return 'DeepSkyBlue';
		case 8:
			return 'Gold';
		default:
			return 'Violet';
	}
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
