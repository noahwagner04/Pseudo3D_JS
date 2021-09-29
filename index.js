var scene = new Pseudo3D.Scene(config);
var renderer = new Pseudo3D.Renderer(900, 600, 0.444);
document.body.appendChild(renderer.canvas);
renderer.canvas.style.border = "8px solid rgb(210, 210, 210)";
var camera = new Pseudo3D.Camera({
	type: Pseudo3D.RenderTypes.RAY,
	farClippingPlane: 12,
	nearClippingPlane: 0.2,
	planeLength: 0.75,
	x: 10,
	y: 12,
	spriteSettings: {
		nearClippingPlane: 0.2,
		farClippingPlane: 7,
		partialAlpha: false
	},
});

renderer.canvas.requestPointerLock = renderer.canvas.requestPointerLock ||
	renderer.canvas.mozRequestPointerLock;

renderer.canvas.onclick = function() {
	renderer.canvas.requestPointerLock();
}

function test(amount) {
	for (var i = 0; i < amount; i++) {
		scene.add(new Pseudo3D.Sprite(barrel, [Math.random() * 24, Math.random() * 24]))
	}
}

var stop = false;
var frameCount = 0;
var fps = 60, // can only be a factor of 60 when below 30, and when above 30 can only be 60 - fps factor of 60 to work.
	frameCount = 0,
	skipFrames,
	frameRate = 0,
	f = 0,
	fc = 0;
// list of valid values for fps are: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 40, 45, 48, 50, 54, 55, 56, 57, 58, 59, 60

if (fps > 30) {
	skipFrames = 60 / (60 - fps);
} else if (fps <= 30) {
	skipFrames = 60 / fps;
}

var q = 0;

function animate() {
	if (stop) {
		return;
	}


	// request another frame

	requestAnimationFrame(animate);

	// if enough time has elapsed, draw the next frame
	if ((fps >= 30 && frameCount % skipFrames !== 0) || (fps < 30 && frameCount % skipFrames === 0)) {
		// if(frameCount === 0) stop = true
		if (keysDown["a"]) {
			camera.position.subtract(camera.plane.clone().scale(4 / fps));
		}
		if (keysDown["d"]) {
			camera.position.add(camera.plane.clone().scale(4 / fps));
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
		// if (frameRate() < 37) {
		// 	console.log("low frameRate");
		// } 
		// else {
		renderer.drawingContext.fillRect(0, 0, 900, 600);
		renderer.render(scene, camera);
		// }
		fc++;
	}
	frameCount++;
}

// setInterval(() => {
// 	console.log(fc - f);
// 	f = fc;
// }, 1000);

var keysDown = {};
window.addEventListener("keydown", (e) => {
	keysDown[e.key] = "a";
});

window.addEventListener("keyup", (e) => {
	delete keysDown[e.key];
});

var mouseX = 0;
var mouseY = 0;
window.addEventListener("mousemove", (e) => {
	mouseX += e.movementX;
	mouseY += e.movementY;
	var angle = Pseudo3D.Math.remap(mouseX, 0, 900, 180, -180);
	camera.setRotation(angle);
	camera.pitch = 300 - mouseY;
});
animate();