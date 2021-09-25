var scene = new Pseudo3D.Scene(config);
var renderer = new Pseudo3D.Renderer(900, 600, 0.666);
document.body.appendChild(renderer.canvas);
renderer.canvas.style.border = "8px solid rgb(210, 210, 210)";
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
var fps = 60, // can only be a factor of 60 when below 30, and when above 30 can only be 60 - fps factor of 60 to work.
	fpsInterval, startTime, now, then, elapsed, frameCount = 0, skipFrames, frameRate = 0, f = 0, fc = 0;
// list of valid values for fps are: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 40, 45, 48, 50, 54, 55, 56, 57, 58, 59, 60

if(fps > 30) {
	skipFrames = 60 / (60 - fps);
} else if(fps <= 30){
	skipFrames = 60 / fps;
}
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
	if ((fps >= 30 && frameCount % skipFrames !== 0) || (fps < 30 && frameCount % skipFrames === 0)) {
		// if(frameCount === 0) stop = true
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

setInterval(() => {
	console.log(fc - f);
	f = fc;
}, 1000);

var keysDown = {};
window.addEventListener("keydown", (e) => {
	keysDown[e.key] = "a";
});

window.addEventListener("keyup", (e) => {
	delete keysDown[e.key];
});
startAnimating();