var Pseudo3D = Pseudo3D || {};
/*
when rendering textures, the camera assumes they are already loaded, its the scenes 
job to set the texture attributes when the texture is actually loaded (if its not currently loaded, 
use the temp color as the texture)
*/

Pseudo3D.Scene = (function() {
	function initCellPrefabs() {
		this.heighestWall = 0;
		// cell and texture must be defined using the let keyword
		for (const property in this.cellPrefabs) {
			let cell = this.cellPrefabs[property];
			if (cell.texture instanceof Pseudo3D.Texture) {
				let texture = cell.texture;
				if (!cell.texture.loaded) {
					cell.texture = cell.texture.tempColor;
					texture.html.addEventListener("load", function() {
						cell.texture = texture;
					});
				}
			} else if (!(cell.texture instanceof Pseudo3D.Color)) {
				cell.texture = undefined;
			}

			if(typeof cell.end !== "number") {
				cell.end = 1;
			}
			if(typeof cell.start !== "number") {
				cell.start = 0;
			}

			if(cell.end > this.heighestWall) {
				this.heighestWall = cell.end;
			}
		}
	}

	function Scene(config) {
		if (!(this instanceof Pseudo3D.Scene)) return new Pseudo3D.Scene(config);
		if (!(typeof config === "object")) {
			config = {};
		}
		this.worldMap = config.worldMap || [];
		this.cellPrefabs = config.cellPrefabs || {};
		initCellPrefabs.call(this);

		this.floor = config.floor || {};
		if (this.floor.texture instanceof Pseudo3D.Texture) {
			var floorTexture = this.floor.texture;
			if (!this.floor.texture.loaded) {
				this.floor.texture = this.floor.texture.tempColor;
				floorTexture.html.addEventListener("load", function() {
					this.floor.texture = floorTexture;
				}.bind(this));
			}
		} else if (!(this.floor.texture instanceof Pseudo3D.Color)) {
			this.floor.texture = undefined;
		}
		this.ceiling = config.ceiling || {};
		if (this.ceiling.texture instanceof Pseudo3D.Texture) {
			var ceilingTexture = this.ceiling.texture;
			if (!this.ceiling.texture.loaded) {
				this.ceiling.texture = this.ceiling.texture.tempColor;
				ceilingTexture.html.addEventListener("load", function() {
					this.ceiling.texture = ceilingTexture;
				}.bind(this));
			}
		} else if (!(this.ceiling.texture instanceof Pseudo3D.Color)) {
			this.ceiling.texture = undefined;
		}

		this.gameObjects = config.gameObjects || {};
		if (!(this.gameObjects.list instanceof Array)) {
			this.gameObjects.list = [];
		}
		if (!(this.gameObjects.resolution instanceof Array)) {
			this.gameObjects.resolution = [64, 64];
		}
		// for no warping and repeat after 360 degrees, image dimentions must be canvas width * 4 and canvas height / 2
		this.skybox = config.skybox || {};

		if (this.skybox.texture instanceof Pseudo3D.Texture) {
			var skyboxTexture = this.skybox.texture;
			this.skybox.render = true;
			if (!this.skybox.texture.loaded) {
				this.skybox.texture = this.skybox.texture.tempColor;
				skyboxTexture.html.addEventListener("load", function() {
					this.skybox.texture = skyboxTexture;
				}.bind(this));
			}
		} else if (!(this.skybox.texture instanceof Pseudo3D.Color)) {
			this.skybox.texture = undefined;
		}

		if (typeof this.skybox.repeatAfterAngle === "number") {
			this.skybox.repeatAfterAngle = Math.max(this.skybox.repeatAfterAngle, 90);
		} else {
			this.skybox.repeatAfterAngle = 360;
		}

		this.lighting = typeof config.lighting === "object" ? config.lighting : {};
		this.lighting.sideLight = typeof this.lighting.sideLight === "number" ? this.lighting.sideLight : 0;

		this.lighting.cameraLight = typeof this.lighting.cameraLight === "object" ? this.lighting.cameraLight : undefined;
		if (this.lighting.cameraLight) {
			this.lighting.cameraLight.intensity = typeof this.lighting.cameraLight.intensity === "number" ? this.lighting.cameraLight.intensity : 1;

			this.lighting.cameraLight.colorBias = this.lighting.cameraLight.colorBias instanceof Array ? this.lighting.cameraLight.colorBias : [1, 1, 1];
			this.lighting.cameraLight.colorBias[0] = this.lighting.cameraLight.colorBias[0] || 1;
			this.lighting.cameraLight.colorBias[1] = this.lighting.cameraLight.colorBias[1] || 1;
			this.lighting.cameraLight.colorBias[2] = this.lighting.cameraLight.colorBias[2] || 1;

			this.lighting.cameraLight.maxBrightness = typeof this.lighting.cameraLight.maxBrightness === "number" ? this.lighting.cameraLight.maxBrightness : Infinity;

			this.lighting.cameraLight.ambient = typeof this.lighting.cameraLight.ambient === "number" ? this.lighting.cameraLight.ambient : 1;
		}
	}
	return Scene;
})();

// for now this function is used to add game objects to the scene (sprites), but later it will be used for adding cellPrefabs, lighting options, fog, and more.
Pseudo3D.Scene.prototype.add = function(object) {
	if (object instanceof Pseudo3D.Sprite) {
		this.gameObjects.list.push(object);
	}
	return this;
};

Pseudo3D.Scene.prototype.remove = function(object) {
	if (object instanceof Pseudo3D.Sprite) {
		var index = this.gameObjects.list.findIndex((sprite) => object === sprite);
		this.gameObjects.list.splice(index, 1)
	}
	return this;
};