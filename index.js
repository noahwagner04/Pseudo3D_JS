"use strict";
var blueStone = new Pseudo3D.Color([20, 20, 150]);
var bluestone = new Pseudo3D.Texture("/pics/bluestone.png", blueStone);
var colorstone = new Pseudo3D.Texture("/pics/colorstone.png", [100, 100, 100]);
var eagle = new Pseudo3D.Texture("/pics/eagle.png", [168, 0, 0], 64, 64);
var sky = new Pseudo3D.Texture("/pics/skybox2.png", [109, 210, 255]);
var barrel = new Pseudo3D.Texture("/pics/barrel.png", [65, 26, 6], 64, 64);

// barrel.source.html.onload = test;
console.log(barrel);
console.log(bluestone);
console.log(colorstone);
console.log(eagle);
var sprite = new Pseudo3D.Sprite(blueStone);
console.log(sprite.visible);
console.log(sprite.texture)

async function test() {
	var c = document.createElement("canvas");
	var ctx = c.getContext("2d");
	document.body.appendChild(c);
	var x = 0;
	var y = 0;
	for (var i = 0; i < barrel.textures.length; i++) {
		await new Promise(r => setTimeout(r, 100));
		var texture = barrel.textures[i];
		var imageData = new ImageData(texture.pixels, barrel.cellWidth);
		if (y >= barrel.source.height) {
			y = 0;
			x += barrel.cellWidth;
		}
		ctx.putImageData(imageData, x, y);
		y += barrel.cellHeight;
	}
}

var scene = {
	floor: {
		render: true,
		texture: bluestone.isLoaded ? bluestone.pixels : bluestone.tempColor
	},
	ceiling: {
		render: true,
		texture: colorstone.isLoaded ? colorstone.pixels : colorstone.tempColor
	},
	skybox: {
		texture: sky.isLoaded ? sky.pixels : sky.tempColor,
		repeatAfterAngle: 180,
	},
	lighting: {
		sideLight: 0.4
	}
};

scene.worldMap = [
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

scene.cellPrefabs = {
	1: {
		texture: colorstone.isLoaded ? colorstone : colorstone.tempColor
	},
	3: {
		texture: eagle.isLoaded ? eagle : eagle.tempColor
	},
};

scene.gameObjects = {
	list: [
		new Pseudo3D.Sprite(barrel, [10.5, 12]),
	],
	resolution: [64, 64]
};

sky.html.onload = () => {
	scene.skybox.texture = sky;
};
bluestone.html.onload = () => {
	scene.floor.texture = bluestone;
};
colorstone.html.onload = () => {
	scene.ceiling.texture = colorstone;
	scene.cellPrefabs[1].texture = colorstone;
};
eagle.html.onload = () => {
	scene.cellPrefabs[3].texture = eagle;
	// scene.gameObjects[0].texture = eagle;
};

var renderer = new Pseudo3D.Renderer(900, 600, 0.6);
document.body.appendChild(renderer.canvas);
var camera = new Pseudo3D.Camera({
	type: Pseudo3D.RenderTypes.RAY,
	farClippingPlane: 12,
	nearClippingPlane: 0,
	planeLength: 0.75,
	x: 10,
	y: 12,
});

var stop = false;
var frameCount = 0;
var fps = 50,
	fpsInterval, startTime, now, then, elapsed, frameCount = 0;


// initialize the timer variables and start the animation

function startAnimating() {
	fpsInterval = 1000 / fps;
	then = performance.now();
	startTime = then;
	animate();
}
var q = 0;

function animate() {
	if (stop) {
		return;
	}


	// request another frame

	requestAnimationFrame(animate);

	// calc elapsed time since last loop

	now = performance.now();
	elapsed = now - then;

	// if enough time has elapsed, draw the next frame

	if (elapsed > fpsInterval) {
		// if(frameCount === 0) stop = true
		frameCount++;
		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);

		if (keysDown["a"]) {
			camera.rotate(270 / fps);
		}
		if (keysDown["d"]) {
			camera.rotate(-270 / fps);
		}
		if (keysDown["w"]) {
			camera.position.add(camera.direction.clone().scale(4 / fps));
		}
		if (keysDown["s"]) {
			camera.position.subtract(camera.direction.clone().scale(4 / fps));
		}
		if (keysDown["h"]) {
			q += 0.01;
			q = Pseudo3D.Math.constrain(q, 0, 1);
			renderer.resize(900, 600, q)
		}
		if (keysDown["l"]) {
			q -= 0.01;
			q = Pseudo3D.Math.constrain(q, 0, 1);
			renderer.resize(900, 600, q)
		}
		renderer.render(scene, camera);
	}
}
var keysDown = {};
window.addEventListener("keydown", (e) => {
	keysDown[e.key] = "a";
});

window.addEventListener("keyup", (e) => {
	delete keysDown[e.key];
});
startAnimating();