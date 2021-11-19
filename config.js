var blueStoneColor = new Pseudo3D.Color([20, 20, 150]);
var bluestone = new Pseudo3D.Texture("/pics/bluestone.png", blueStoneColor);
var colorstone = new Pseudo3D.Texture("/pics/colorstone.png", [100, 100, 100]);
var eagle = new Pseudo3D.Texture("/pics/eagle.png", [168, 0, 0], 64, 64);
var sky = new Pseudo3D.Texture("/pics/skybox2.png", [109, 210, 255], 512, 1000);
var barrel = new Pseudo3D.Texture("/pics/barrel.png", [65, 26, 6]);
var wood = new Pseudo3D.Texture("/pics/wood.png", [110, 74, 29]);
var peewee = new Pseudo3D.Texture("/pics/peewee.jpeg", [110, 74, 29]);
var smile = new Pseudo3D.Texture("/pics/smile.png", [110, 74, 29]);
var dora = new Pseudo3D.Texture("/pics/latest.png", [110, 74, 29], 200);
var test = new Pseudo3D.Texture("/pics/raceTrack.png");

var config = {
	floor: {
		texture: test,
		cellSize: [24, 24]
	},
	// ceiling: {
	// 	texture: dora,
	// 	cellSize: [10, 10]
	// },
	skybox: {
		texture: sky,
		repeatAfterAngle: 180,
	},
	lighting: {
		sideLight: 0.6,
	}
};

config.worldMap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, undefined, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 7, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

config.cellPrefabs = {
	1: {
		texture: colorstone,
		start: 0,
		end: 1
	},
	3: {
		texture: eagle,
		end: 1
	},
	7: {
		texture: wood,
		end: 0.3
	}
};

config.gameObjects = {
	list: [
		// new Pseudo3D.Sprite(new Pseudo3D.Color([244, 442, 23]), [10.5, 12], [], 1, 200, 200),
	],
	resolution: [64, 64]
};