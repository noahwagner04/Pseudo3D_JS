var Pseudo3D = Pseudo3D || {};

Pseudo3D.Scene = (function() {
	function initCellPrefabs() {
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
				cell.texture = {};
			}
		}
	}

	function Scene(config) {
		if (!(this instanceof Pseudo3D.Scene)) return new Pseudo3D.Scene(config);

		this.worldMap = config.worldMap || [];
		this.cellPrefabs = config.cellPrefabs || {};
		initCellPrefabs.call(this);

		this.floor = config.floor || {};
		if (this.floor.texture instanceof Pseudo3D.Texture) {
			var floorTexture = this.floor.texture;
			this.floor.render = true;
			if (!this.floor.texture.loaded) {
				this.floor.texture = this.floor.texture.tempColor;
				floorTexture.html.addEventListener("load", function() {
					this.floor.texture = floorTexture;
				}.bind(this));
			}
		} else if (this.floor.texture instanceof Pseudo3D.Color) {
			this.floor.render = true;
		} else {
			this.floor.render = false;
			this.floor.texture = {};
		}
		this.ceiling = config.ceiling || {};
		if (this.ceiling.texture instanceof Pseudo3D.Texture) {
			var ceilingTexture = this.ceiling.texture;
			this.ceiling.render = true;
			if (!this.ceiling.texture.loaded) {
				this.ceiling.texture = this.ceiling.texture.tempColor;
				ceilingTexture.html.addEventListener("load", function() {
					this.ceiling.texture = ceilingTexture;
				}.bind(this));
			}
		} else if (this.ceiling.texture instanceof Pseudo3D.Color) {
			this.ceiling.render = true;
		} else {
			this.ceiling.render = false;
			this.ceiling.texture = {};
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
		} else if(!(this.skybox.texture instanceof Pseudo3D.Color)) {
			this.skybox.texture = undefined;
		}

		if (typeof this.skybox.repeatAfterAngle === "number") {
			this.skybox.repeatAfterAngle = Math.max(this.skybox.repeatAfterAngle, 90);
		} else {
			this.skybox.repeatAfterAngle = 360;
		}

		this.lighting = config.lighting || {};
		if (!this.lighting.sideLight) {
			this.lighting.sideLight = 0;
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