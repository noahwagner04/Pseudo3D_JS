var Pseudo3D = Pseudo3D || {};
// class used to render scenes
Pseudo3D.Camera = function(config) {
	if (!(this instanceof Pseudo3D.Camera)) return new Pseudo3D.Camera(config);
	if (!config) {
		console.log("cannot create Pseudo3D.Camera because no config object was provided");
		return;
	} else if (config.type !== Pseudo3D.RenderTypes.RAY && config.type !== Pseudo3D.RenderTypes.VOXEL) {
		console.log("cannot create Pseudo3D.Camera because type was not provided, options include either Pseudo3D.RenderTypes.RAY or Pseudo3D.RenderTypes.VOXEL");
		return;
	}
	Pseudo3D.Entity.call(this, config.x, config.y);
	this.position.z = typeof config.z === "number" ? config.z : 0.5;
	this.pitch = typeof config.pitch === "number" ? config.pitch : 0;
	this.type = config.type;
	this.planeLength = typeof config.planeLength === "number" ? config.planeLength : 1;

	this.nearClippingPlane = typeof config.nearClippingPlane === "number" ? config.nearClippingPlane : 0;
	this.farClippingPlane = typeof config.farClippingPlane === "number" ? config.farClippingPlane : Infinity;

	this.spriteSettings = typeof config.spriteSettings === "object" ? config.spriteSettings : {};

	this.setRotation(config.rotation)

	this.rayAngle = 0;
	this.ray; // gets initialized in renderWalls
}

Pseudo3D.Camera.prototype = Object.create(Pseudo3D.Entity.prototype);
Object.defineProperty(Pseudo3D.Camera.prototype, 'constructor', {
	value: Pseudo3D.Camera,
	enumerable: false,
	writable: true
});

// depends on the direction vector to be normalized, returns in radians
Pseudo3D.Camera.prototype.computeAngle = function() {
	var angle = Math.acos(Math.max(Math.min(this.direction.x, 1), -1));
	if (this.direction.y >= 0) {
		this.angle = angle;
	} else {
		this.angle = 2 * Math.PI - angle;
	}
	return this;
};

Pseudo3D.Camera.prototype.rotate = function(angle) {
	this.direction.rotate(angle);
	this.plane.rotate(angle);
	return this;
};

Pseudo3D.Camera.prototype.setRotation = function(angle) {
	angle = typeof angle === "number" ? angle : 0;

	var angleRad = angle * (Math.PI / 180);
	this.direction.x = Math.cos(angleRad);
	this.direction.y = Math.sin(angleRad);

	// angle the camera is currently rotated in radians.
	this.angle = angleRad;

	this.plane = new Pseudo3D.Math.Vector(this.direction.y, -this.direction.x).scale(this.planeLength);
	return this;
};

Pseudo3D.Camera.prototype.renderLight = function(scene, renderer) {
	var min = Math.min;
	var max = Math.max;
	var width = renderer.renderWidth;
	var pixels = renderer.pixels;
	var intensity = scene.lighting.cameraLight.intensity;
	var capLight = scene.lighting.cameraLight.maxBrightness;
	var ambient = scene.lighting.cameraLight.ambient;
	var r = scene.lighting.cameraLight.colorBias[0];
	var g = scene.lighting.cameraLight.colorBias[1];
	var b = scene.lighting.cameraLight.colorBias[2];
	var depthBuffer = renderer.depthBuffer;

	for (var x = width - 1; x >= 0; x--) {
		for (var y = renderer.renderHeight - 1; y >= 0; y--) {
			let position = (x + y * width) * 4;
			let color = [
				pixels[position],
				pixels[position + 1],
				pixels[position + 2],
				pixels[position + 3]
			];
			let light = intensity / depthBuffer[x][y];
			pixels[position] = max(min(color[0] * light, color[0] * capLight), color[0] * ambient) * r;
			pixels[position + 1] = max(min(color[1] * light, color[1] * capLight), color[1] * ambient) * g;
			pixels[position + 2] = max(min(color[2] * light, color[2] * capLight), color[2] * ambient) * b;
			pixels[position + 3] = 255;
		}
	}
};

Pseudo3D.Camera.prototype.renderSkyBox = function(scene, renderer) {
	var repeatAfterAngle = scene.skybox.repeatAfterAngle;
	var widthScalar = repeatAfterAngle / 360 * 4;
	var width = renderer.renderWidth * widthScalar;
	var height = renderer.renderHeight / 2;
	var x = Pseudo3D.Math.remap(
		this.angle * (180 / Math.PI) % repeatAfterAngle,
		0,
		repeatAfterAngle,
		0,
		width
	);
	// if(Number.isNaN(x)) console.log(x, this.angle * (180 / Math.PI) % repeatAfterAngle, repeatAfterAngle, this.angle)
	if (scene.skybox.texture instanceof Pseudo3D.Texture) {
		if (x < renderer.renderWidth) {
			renderer.drawingContext.drawImage(
				scene.skybox.texture.html,
				x,
				height + this.pitch - scene.skybox.texture.height,
				width,
				scene.skybox.texture.height
			);
		}
		renderer.drawingContext.drawImage(
			scene.skybox.texture.html,
			x - width,
			height + this.pitch - scene.skybox.texture.height,
			width,
			scene.skybox.texture.height
		);
	} else {
		renderer.drawingContext.save();
		renderer.drawingContext.fillStyle = `rgb(${scene.skybox.texture.rgbArray[0]}, ${scene.skybox.texture.rgbArray[1]}, ${scene.skybox.texture.rgbArray[2]})`;
		renderer.drawingContext.fillRect(0, 0, renderer.renderWidth, renderer.renderHeight / 2);
		renderer.drawingContext.restore();
	}
	return this;
};

Pseudo3D.Camera.prototype.renderFloorCeiling = function(scene, renderer) {
	// local refferences for better performance
	var absLocal = Math.abs;
	var width = renderer.renderWidth;
	var height = renderer.renderHeight;
	var halfHeight = height / 2;
	var pixels = renderer.pixels;
	var depthBuffer = renderer.depthBuffer;
	var floor = scene.floor;
	var ceiling = scene.ceiling;
	var floorTex = floor.texture;
	var ceilingTex = ceiling.texture;
	var floorIsTexture = floorTex instanceof Pseudo3D.Texture;
	var ceilingIsTexture = ceilingTex instanceof Pseudo3D.Texture;

	if (floorIsTexture) {
		var floorPixels = floor.texture.pixels;
		var floorTexWidth = floor.texture.width;
		var floorTexHeight = floor.texture.height;
	}
	if (ceilingIsTexture) {
		var ceilingPixels = ceiling.texture.pixels;
		var ceilingTexWidth = ceiling.texture.width;
		var ceilingTexHeight = ceiling.texture.height;
	}
	// using individual x and y components instead of creating new vector instances for faster performance

	// rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
	// width / height is camera aspect ratio fix
	var rayDirX0 = this.direction.x - this.plane.x * renderer.aspectRatio;
	var rayDirY0 = this.direction.y - this.plane.y * renderer.aspectRatio;
	var rayDirX1 = this.direction.x + this.plane.x * renderer.aspectRatio;
	var rayDirY1 = this.direction.y + this.plane.y * renderer.aspectRatio;

	for (var y = 0; y < height; y++) {
		if (!floorTex && y >= halfHeight + this.pitch) continue;
		if (!ceilingTex && y <= halfHeight + this.pitch) continue;
		// Current y position compared to the center of the screen (the horizon)
		// multiplied by the length of our plane to match our raycasting FOV
		var p = (y - halfHeight - this.pitch) * this.planeLength * 2;
		// Vertical position of the camera.
		var posZ = this.position.z * height;

		// Horizontal distance from the camera to the floor for the current row.
		// 0.5 is the z position exactly in the middle between floor and ceiling.
		var rowDistance = absLocal(posZ / p);
		if (rowDistance > this.farClippingPlane) continue;
		else if (rowDistance < this.nearClippingPlane) continue;
		if (rowDistance === Infinity) continue;
		var scalar = rowDistance / width;
		var floorStepX = 0;
		var floorStepY = 0;

		var floorX = 0;
		var floorY = 0;
		// only do the following if the floor / ceiling is a texture
		if ((y > halfHeight + this.pitch && floorIsTexture) || (y < halfHeight + this.pitch && ceilingIsTexture)) {
			floorStepX = (rayDirX1 - rayDirX0) * scalar;
			floorStepY = (rayDirY1 - rayDirY0) * scalar;

			floorX = this.position.x + rowDistance * rayDirX0;
			floorY = this.position.y + rowDistance * rayDirY0;
		}
		for (var x = 0; x < width; ++x) {
			floorX += floorStepX;
			floorY += floorStepY;
			if (depthBuffer[x][y] < rowDistance) continue;

			// the cell coord is simply got from the integer parts of floorX and floorY
			var cellX = ~~floorX;
			var cellY = ~~floorY;

			var position = (x + y * width) * 4;

			if (y > halfHeight + this.pitch) {
				// draw floor
				if (floorIsTexture) {
					// if the provided texture is an image, do texture mapping

					var tx = ~~(floorTexWidth * absLocal(floorX - cellX));
					var ty = ~~(floorTexHeight * absLocal(floorY - cellY));

					// get texture pixel information
					var colorPosition = (tx + ty * floorTexWidth) * 4;
					// if(y === 250 && Math.random() < 0.0001) console.log(tx, ty)

					// draw the pixel
					pixels[position] = floorPixels[colorPosition];
					pixels[position + 1] = floorPixels[colorPosition + 1];
					pixels[position + 2] = floorPixels[colorPosition + 2];
					pixels[position + 3] = 255;
					depthBuffer[x][y] = rowDistance;
				} else {
					// if the provided texture is an color, just draw the pixel

					// draw the pixel
					pixels[position] = floorTex.rgbArray[0];
					pixels[position + 1] = floorTex.rgbArray[1];
					pixels[position + 2] = floorTex.rgbArray[2];
					pixels[position + 3] = 255;
					depthBuffer[x][y] = rowDistance;
				}
			} else {
				// draw ceiling
				if (ceilingIsTexture) {
					// if the provided texture is an image, do texture mapping

					var tx = ~~(ceilingTexWidth * absLocal(floorX - cellX));
					var ty = ~~(ceilingTexHeight * absLocal(floorY - cellY));

					// get texture pixel information
					var colorPosition = (tx + ty * ceilingTexWidth) * 4;

					// draw the pixel
					pixels[position] = ceilingPixels[colorPosition];
					pixels[position + 1] = ceilingPixels[colorPosition + 1];
					pixels[position + 2] = ceilingPixels[colorPosition + 2];
					pixels[position + 3] = 255;
					depthBuffer[x][y] = rowDistance;
				} else {
					// if the provided texture is an color, just draw the pixel

					// draw the pixel
					pixels[position] = ceilingTex.rgbArray[0];
					pixels[position + 1] = ceilingTex.rgbArray[1];
					pixels[position + 2] = ceilingTex.rgbArray[2];
					pixels[position + 3] = 255;
					depthBuffer[x][y] = rowDistance;
				}
			}
		}
	}
	return this;
};

Pseudo3D.Camera.prototype.renderWalls = function(scene, renderer) {
	var constrainLocal = Pseudo3D.Math.constrain;
	var width = renderer.renderWidth;
	var height = renderer.renderHeight;
	var aspectRatio = renderer.aspectRatio;
	var depthBuffer = renderer.depthBuffer;
	var pixels = renderer.pixels;
	var sideLight = scene.lighting.sideLight;

	for (var x = 0; x < width; x++) {

		// cameraX is our camera plane in camera space (width / height to fix streachting when changing aspect ratio of screen)
		this.rayAngle = x * 2 * aspectRatio / width - aspectRatio;
		if (this.ray) {
			this.ray.reset(this);
		} else {
			this.ray = new Pseudo3D.Ray(this);
		}

		this.ray.cast(scene);
		var lastDrawStart = 0;
		var done = false;

		// keep casting the ray until it hits the edge of the worldMap or it hits the heighest wall
		while (!done && this.ray.hit !== undefined) {

			var cell = scene.cellPrefabs[this.ray.hit];
			// if the cell hit isn't defined in cellPrefabs OR it's texture is an invalid input, dont render
			if (!cell || !cell.texture) {
				this.ray.hit = 0;
				this.ray.cast(scene);
				continue;
			}

			if (cell.end === scene.heighestWall) done = true;
			var perpWallDist = this.ray.perpendicular;
			var side = this.ray.side;
			// continue if we are further or closer than the clipping planes
			if (perpWallDist > this.farClippingPlane) break;
			if (perpWallDist < this.nearClippingPlane) break;
			// if we hit an undefined block, continue

			// calculate line height according to screen, remap from a range of -planeLength - planeLength to a range of 0 - 1
			var drawStart = ~~(((this.position.z - cell.end) / perpWallDist + this.planeLength) / (this.planeLength * 2) * height + this.pitch);
			/*
			drawEnd can either be height - drawStart, or the equation below.
			NOTE: drawEnd = height - drawStart only works for walls of default height (0.5)
			var drawEnd = ~~((0.5 / perpWallDist + this.planeLength) / (this.planeLength * 2) * height);
			*/
			var drawEnd = ~~(((this.position.z - cell.start) / perpWallDist + this.planeLength) / (this.planeLength * 2) * height + this.pitch);
			var lineHeight = ~~(drawEnd - drawStart);

			var texWidth = cell.texture.width;
			var texHeight = cell.texture.height;
			var texPixels = cell.texture.pixels;

			if (texPixels) {
				var wallX; //where exactly the wall was hit
				if (side === 0) wallX = this.position.y + perpWallDist * this.ray.direction.y;
				else wallX = this.position.x + perpWallDist * this.ray.direction.x;
				wallX -= ~~((wallX));

				//x coordinate on the texture
				var texX = ~~(wallX * texWidth);
				if (side === 0 && this.ray.direction.x > 0) texX = texWidth - texX - 1;
				if (side === 1 && this.ray.direction.y < 0) texX = texWidth - texX - 1;

				var step = texHeight / lineHeight;

				var texPos = -drawStart > 0 ? -drawStart * step : 0;
				var yStart = constrainLocal(drawStart, 0, height);
				var yEnd = constrainLocal(drawEnd, 0, height);
				for (var y = yStart; y < yEnd; y++) {
					texPos += step;
					if (depthBuffer[x][y] < perpWallDist) continue;
					var texY;
					if (texY < 0) {
						texY = ~~(height + texPos);
					} else {
						texY = ~~texPos;
					}
					var texPosition = (texX + texY * texWidth) * 4;
					var position = (x + y * width) * 4;
					if (side === 0 || !sideLight) {
						pixels[position] = texPixels[texPosition];
						pixels[position + 1] = texPixels[texPosition + 1];
						pixels[position + 2] = texPixels[texPosition + 2];
						pixels[position + 3] = 255;
					} else {
						pixels[position] = texPixels[texPosition] * (1 + sideLight);
						pixels[position + 1] = texPixels[texPosition + 1] * (1 + sideLight);
						pixels[position + 2] = texPixels[texPosition + 2] * (1 + sideLight);
						pixels[position + 3] = 255;
					}
					depthBuffer[x][y] = perpWallDist;
				}
			} else {
				var yStart = constrainLocal(drawStart, 0, height);
				var yEnd = constrainLocal(drawEnd, 0, height);
				var color = cell.texture.rgbArray;
				for (var y = yStart; y < yEnd; y++) {
					if (depthBuffer[x][y] < perpWallDist) continue;
					var position = (x + y * width) * 4;
					if (side === 0 || !sideLight) {
						pixels[position] = color[0];
						pixels[position + 1] = color[1];
						pixels[position + 2] = color[2];
						pixels[position + 3] = 255;
					} else {
						pixels[position] = color[0] * (1 + sideLight);
						pixels[position + 1] = color[1] * (1 + sideLight);
						pixels[position + 2] = color[2] * (1 + sideLight);
						pixels[position + 3] = 255;
					}
					depthBuffer[x][y] = perpWallDist;
				}
			}
			this.ray.hit = 0;
			this.ray.cast(scene);
		}
	}
	return this;
};

// havent implemented the tint feature yet. Also havent implemented spriteSheet compatibility
Pseudo3D.Camera.prototype.renderSprites = function(scene, renderer) {
	var width = renderer.renderWidth;
	var height = renderer.renderHeight;
	var sprites = scene.gameObjects.list;
	var constrainLocal = Pseudo3D.Math.constrain;
	var aspectRatio = renderer.aspectRatio;
	var depthBuffer = renderer.depthBuffer;
	var pixels = renderer.pixels;
	var resolution = scene.gameObjects.resolution;
	var thisPartialAlpha = this.spriteSettings.partialAlpha;

	for (var i = sprites.length - 1; i >= 0; i--) {
		var sprite = sprites[i];
		var spriteWidth = sprite.width;
		var spriteHeight = sprite.height;
		var partialAlpha = sprite.partialAlpha;
		if (sprite.invisible) {
			sprite.isVisible = false;
			continue;
		}
		var spriteTexture = sprite.texture;
		var spritePixels = spriteTexture.pixels;
		var spriteX = sprite.position.x - this.position.x;
		var spriteY = sprite.position.y - this.position.y;

		var invDet = 1.0 / (this.plane.x * this.direction.y - this.direction.x * this.plane.y);

		var transformX = invDet * (this.direction.y * spriteX - this.direction.x * spriteY);
		var transformY = invDet * (-this.plane.y * spriteX + this.plane.x * spriteY);
		var far = this.spriteSettings.farClippingPlane === undefined ? this.farClippingPlane : this.spriteSettings.farClippingPlane;
		var near = this.spriteSettings.nearClippingPlane === undefined ? this.nearClippingPlane : this.spriteSettings.nearClippingPlane;
		if (transformY > far || transformY < near) {
			sprite.isVisible = false;
			continue;
		}

		// var spriteScreenX = ((transformX / transformY + 1) / 2) * width;

		// var spriteHeight = (1 / transformY) * height;
		// divide by planeLength to keep square ratio, since the sprite is a square, 
		// go up the same amount of camera space units as we go horizontally
		var denominator = this.planeLength * transformY;
		var halfWorldHeight = spriteHeight / (resolution[1] * 2) * sprite.size;
		/*
		the sprites starting and ending y position on the screen, these are equivalent to 
		drawStartY = ~~(remapLocal((-worldHeight - sprite.position.z) / denominator, -1, 1, 0, height));
		drawStartX = ~~(remapLocal((-worldHeight - sprite.position.z) / denominator, -1, 1, 0, height));
		*/
		var drawStartY = ~~(height * ((-halfWorldHeight - sprite.position.z + (this.position.z - 0.5)) + denominator) / (denominator * 2) + this.pitch);
		var drawEndY = ~~(height * ((halfWorldHeight - sprite.position.z + (this.position.z - 0.5)) + denominator) / (denominator * 2) + this.pitch);

		// divide by planeLength to bring 0.5 units from world space to camera space
		var halfWorldWidth = spriteWidth / (resolution[0] * 2) * sprite.size;
		/*
		the sprites starting and ending y position on the screen, these are equivalent to 
		drawStartX = ~~(remapLocal((transformX - worldWidth) / denominator, -aspectRatio, aspectRatio, 0, width));
		drawEndX = ~~(remapLocal((transformX + worldWidth) / denominator, -aspectRatio, aspectRatio, 0, width));
		*/
		var scalar = width / (2 * aspectRatio);
		var drawStartX = ~~(((this.planeLength * transformX - halfWorldWidth) / denominator + aspectRatio) * scalar);
		var drawEndX = ~~(((this.planeLength * transformX + halfWorldWidth) / denominator + aspectRatio) * scalar);

		var stripeStart = constrainLocal(drawStartX, 0, width);
		var stripeEnd = constrainLocal(drawEndX, 0, width);
		var drawn = false;

		if (spritePixels) {
			for (var stripe = stripeStart; stripe < stripeEnd; stripe++) {
				var texX = ~~((stripe - drawStartX) * spriteWidth / (drawEndX - drawStartX));

				if (transformY > 0 && stripe > 0 && stripe < width) {
					var yStart = constrainLocal(drawStartY, 0, height);
					var yEnd = constrainLocal(drawEndY, 0, height);
					for (var y = yStart; y < yEnd; y++) {
						if (depthBuffer[stripe][y] < transformY) continue;
						var texY = ~~((y - drawStartY) * spriteHeight / (drawEndY - drawStartY));

						var colorPosition = ~~(spriteWidth * texY + texX) * 4;
						var position = (stripe + y * width) * 4;

						var drawPartialAlpha = thisPartialAlpha === undefined ? partialAlpha : thisPartialAlpha;
						// interpolate the current screens rgb value to the color of the sprite depeding on the alpha of the sprites pixel
						if (drawPartialAlpha) {
							var bias1 = spritePixels[colorPosition + 3] / 255;
							var bias2 = 1 - bias1;
							var red = bias2 * pixels[position] + bias1 * spritePixels[colorPosition];
							var blue = bias2 * pixels[position + 1] + bias1 * spritePixels[colorPosition + 1];
							var green = bias2 * pixels[position + 2] + bias1 * spritePixels[colorPosition + 2];
							pixels[position] = red;
							pixels[position + 1] = blue;
							pixels[position + 2] = green;
							pixels[position + 3] = 255;
							if (bias1 === 1) depthBuffer[stripe][y] = transformY;
							drawn = true;
						} else if (spritePixels[colorPosition + 3] === 255) {
							pixels[position] = spritePixels[colorPosition];
							pixels[position + 1] = spritePixels[colorPosition + 1];
							pixels[position + 2] = spritePixels[colorPosition + 2];
							pixels[position + 3] = 255;
							depthBuffer[stripe][y] = transformY;
							drawn = true;
						}
					}
				}
			}
		} else {
			for (var stripe = stripeStart; stripe < stripeEnd; stripe++) {
				if (transformY > 0 && stripe > 0 && stripe < width) {
					var yStart = constrainLocal(drawStartY, 0, height);
					var yEnd = constrainLocal(drawEndY, 0, height);
					for (var y = yStart; y < yEnd; y++) {
						if (depthBuffer[stripe][y] < transformY) continue;
						var color = spriteTexture.rgbArray;
						var position = (stripe + y * width) * 4;

						// interpolate the current screens rgb value to the color of the sprite depeding on the alpha of the sprites pixel
						if (partialAlpha) {
							var bias1 = color[3] / 255;
							var bias2 = 1 - bias1;
							var red = bias2 * pixels[position] + bias1 * color[0];
							var blue = bias2 * pixels[position + 1] + bias1 * color[1];
							var green = bias2 * pixels[position + 2] + bias1 * color[2];
							pixels[position] = red;
							pixels[position + 1] = blue;
							pixels[position + 2] = green;
							pixels[position + 3] = 255;
							if (bias1 === 1) depthBuffer[stripe][y] = transformY;
							drawn = true;
						} else if (color[3] === 255) {
							pixels[position] = color[0];
							pixels[position + 1] = color[1];
							pixels[position + 2] = color[2];
							pixels[position + 3] = 255;
							if (bias1 === 1) depthBuffer[stripe][y] = transformY;
							drawn = true;
						} else {
							break;
						}
					}
				}
			}
		}
		if (!drawn) sprite.isVisible = false;
		else sprite.isVisible = true;
	}
	return this;
};

// voxel space renderer, for later
Pseudo3D.Camera.prototype.renderTerrain = function(scene, renderer) {

};
// have to make compatable with voxel rendering
Pseudo3D.Camera.prototype.renderScene = function(scene, renderer) {
	camera.direction.normalize();
	if (scene.skybox.texture) {
		camera.computeAngle();
		this.renderSkyBox(scene, renderer);
	}
	renderer.pixels = renderer.drawingContext.getImageData(0, 0, renderer.renderWidth, renderer.renderHeight).data;
	if (scene.worldMap && scene.cellPrefabs) {
		this.renderWalls(scene, renderer);
	}
	if (scene.gameObjects.list.length > 0) {
		this.renderSprites(scene, renderer);
	}
	// only render if either the ceiling or the floor have provided textures
	if (scene.floor.texture || scene.ceiling.texture) {
		this.renderFloorCeiling(scene, renderer);
	}

	if (scene.lighting.cameraLight) {
		this.renderLight(scene, renderer);
	}
	return this;
};