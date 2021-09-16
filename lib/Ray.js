var Pseudo3D = Pseudo3D || {};

Pseudo3D.Ray = (function() {
	/*
	If a camera is passed, the ray is assumed to be used for rendering purposes, calculating
	attributes faster and running cast function faster, but is more limited and relies on
	initial conditions defined by the camera to run so fast.
	If individual coordinates are passed then it is assumed to be used for game logic 
	(used by the user, not the engine). This is a little slower than a ray being used
	for rendering but can do more, is less restricted, and is nicer to use.
	*/
	function Ray(posX, posY, dirX, dirY) {
		if (!(this instanceof Pseudo3D.Ray)) return new Pseudo3D.Ray(posX, posY, dirX, dirY);
		if (posX instanceof Pseudo3D.Camera) {
			this.camera = posX;
			Pseudo3D.Entity.call(
				this,
				this.camera.position.x,
				this.camera.position.y,
				this.camera.direction.x,
				this.camera.direction.y
			);

			this.direction.add(camera.plane.clone().scale(camera.rayAngle));
			this.deltaDistX = Math.abs(1 / this.direction.x);
			this.deltaDistY = Math.abs(1 / this.direction.y);
			this.perpendicular = 0;
		} else {
			Pseudo3D.Entity.call(this, posX, posY, dirX, dirY);
			this.direction.normalize();
			this.length = 1;
			this.deltaDistX = Math.abs(this.length / this.direction.x);
			this.deltaDistY = Math.abs(this.length / this.direction.y);
		}

		this.mapPosition = this.position.clone();
		this.mapPosition.x = ~~(this.mapPosition.x);
		this.mapPosition.y = ~~(this.mapPosition.y);

		this.sideDistX = 0;
		this.sideDistY = 0;

		this.stepX = 0;
		this.stepY = 0;

		this.hit = 0;
		this.side = 0;

		init.call(this);
	}

	// inherit from Pseudo3D.Entity class
	Ray.prototype = Object.create(Pseudo3D.Entity.prototype);
	Object.defineProperty(Ray.prototype, 'constructor', {
		value: Ray,
		enumerable: false,
		writable: true
	});

	// add a callback argument when implementing higher walls, as we would need to do things between each increment.
	function renderCast(scene) {
		// for now, 0 means floor, so no wall, but later make while loop stop if hit.type === wall.
		while (this.hit === 0) {
			if (this.sideDistX < this.sideDistY) {
				this.sideDistX += this.deltaDistX;
				this.mapPosition.x += this.stepX;
				this.side = 0;
			} else {
				this.sideDistY += this.deltaDistY;
				this.mapPosition.y += this.stepY;
				this.side = 1;
			}
			// check if we are outside the world map array to avoid throwing an error
			if (scene.worldMap[this.mapPosition.x] === undefined || scene.worldMap[this.mapPosition.x][this.mapPosition.y] === undefined) {
				this.hit = undefined;
			} else if (scene.worldMap[this.mapPosition.x][this.mapPosition.y] > 0) {
				this.hit = scene.worldMap[this.mapPosition.x][this.mapPosition.y];
			}
		}
		// not multiplying by camera.focalLength for faster performance
		if (this.side === 0) {
			this.perpendicular = (this.sideDistX - this.deltaDistX);
		} else {
			this.perpendicular = (this.sideDistY - this.deltaDistY);
		}
	}

	// later add sprite collision capabilities (maybe even move this to a Pseudo3D.physics.Ray class)
	function gameCast(scene) {
		while (this.hit === 0) {
			if (this.sideDistX < this.sideDistY) {
				this.sideDistX += this.deltaDistX;
				this.mapPosition.x += this.stepX;
				this.side = 0;
			} else {
				this.sideDistY += this.deltaDistY;
				this.mapPosition.y += this.stepY;
				this.side = 1;
			}
			// check if we are outside the world map array to avoid throwing an error
			if (scene.worldMap[this.mapPosition.x] === undefined || scene.worldMap[this.mapPosition.x][this.mapPosition.y] === undefined) {
				this.hit = undefined;
			} else if (scene.worldMap[this.mapPosition.x][this.mapPosition.y] > 0) {
				this.hit = scene.worldMap[this.mapPosition.x][this.mapPosition.y];
			}
		}
		if (this.side === 0) {
			this.length = this.sideDistX - this.deltaDistX;
		} else {
			this.length = this.sideDistY - this.deltaDistY;
		}
	}

	function init() {
		if (this.direction.x < 0) {
			this.stepX = -1;
			this.sideDistX = (this.position.x - this.mapPosition.x) * this.deltaDistX;
		} else {
			this.stepX = 1;
			this.sideDistX = (this.mapPosition.x + 1.0 - this.position.x) * this.deltaDistX;
		}
		if (this.direction.y < 0) {
			this.stepY = -1;
			this.sideDistY = (this.position.y - this.mapPosition.y) * this.deltaDistY;
		} else {
			this.stepY = 1;
			this.sideDistY = (this.mapPosition.y + 1.0 - this.position.y) * this.deltaDistY;
		}
	}

	// this is the only cast function, but can be used in several different ways
	Ray.prototype.cast = function(scene) {
		if (this.camera) {
			renderCast.call(this, scene);
		} else {
			if (!(scene instanceof Pseudo3D.Scene)) {
				console.log("cannot cast ray because first argument was not a Pseudo3D.Scene");
				return;
			}
			gameCast.call(this, scene);
		}

		return this;
	};

	Ray.prototype.reset = function(posX, posY, dirX, dirY) {
		Ray.call(this, posX, posY, dirX, dirY);
		return this;
	};
	return Ray;
})();