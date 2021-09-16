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
	this.type = config.type;
	this.planeLength = typeof config.planeLength === "number" ? config.planeLength : 1;

	this.nearClippingPlane = typeof config.nearClippingPlane === "number" ? config.nearClippingPlane : 0;
	this.farClippingPlane = typeof config.farClippingPlane === "number" ? config.farClippingPlane : Infinity;

	config.rotation = typeof config.rotation === "number" ? config.rotation : 0;
	var angleRad = config.rotation * (Math.PI / 180);
	this.direction.x = Math.cos(angleRad);
	this.direction.y = Math.sin(angleRad);

	// angle the camera is currently rotated in radians.
	this.angle = angleRad;

	this.plane = new Pseudo3D.Math.Vector(this.direction.y, -this.direction.x).scale(this.planeLength);

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
				0,
				width,
				height
			);
		}
		renderer.drawingContext.drawImage(
			scene.skybox.texture.html,
			x - width,
			0, width,
			height
		);
	} else {
		renderer.drawingContext.save();
		renderer.drawingContext.fillStyle = `rgb(${scene.skybox.texture.rgbArray[0]}, ${scene.skybox.texture.rgbArray[1]}, ${scene.skybox.texture.rgbArray[2]})`;
		renderer.drawingContext.fillRect(0, 0, renderer.renderWidth, renderer.renderHeight);
		renderer.drawingContext.restore();
	}
	return this;
};

Pseudo3D.Camera.prototype.renderFloorCeiling = function(scene, renderer) {
	// local refferences for better performance
	var isNaNLocal = Number.isNaN;
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
	var floorPixels = floor.texture.pixels;
	var ceilingPixels = ceiling.texture.pixels;
	var floorTexWidth = floor.texture.width;
	var floorTexHeight = floor.texture.height;
	var ceilingTexWidth = ceiling.texture.width;
	var ceilingTexHeight = ceiling.texture.height;
	var floorAllowClipping = floor.allowClipping;
	var ceilingAllowClipping = ceiling.allowClipping;
	// using individual x and y components instead of creating new vector instances for faster performance

	// rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
	// width / height is camera aspect ratio fix
	var rayDirX0 = this.direction.x - this.plane.x * renderer.aspectRatio;
	var rayDirY0 = this.direction.y - this.plane.y * renderer.aspectRatio;
	var rayDirX1 = this.direction.x + this.plane.x * renderer.aspectRatio;
	var rayDirY1 = this.direction.y + this.plane.y * renderer.aspectRatio;

	for (var y = 0; y < height; y++) {
		if (!floor.provided && y > halfHeight) continue;
		if (!ceiling.provided && y < halfHeight) continue;
		// Current y position compared to the center of the screen (the horizon)
		// multiplied by the length of our plane to match our raycasting FOV
		var p = (y - halfHeight) * this.planeLength * 2;
		// Vertical position of the camera.
		var posZ = 0.5 * height;

		// Horizontal distance from the camera to the floor for the current row.
		// 0.5 is the z position exactly in the middle between floor and ceiling.
		var rowDistance = absLocal(posZ / p);
		if (rowDistance > this.farClippingPlane) continue;
		else if (rowDistance < this.nearClippingPlane) continue;

		var floorStepX = rowDistance * (rayDirX1 - rayDirX0) / width;
		var floorStepY = rowDistance * (rayDirY1 - rayDirY0) / width;

		var floorX = this.position.x + rowDistance * rayDirX0;
		var floorY = this.position.y + rowDistance * rayDirY0;

		for (var x = 0; x < width; ++x) {
			floorX += floorStepX;
			floorY += floorStepY;
			if (depthBuffer[x][y] < rowDistance) continue;

			// the cell coord is simply got from the integer parts of floorX and floorY
			var cellX = ~~floorX;
			var cellY = ~~floorY;

			// get the texture coordinate from the fractional part
			if (isNaNLocal(floorX)) floorX = 0;
			if (isNaNLocal(floorY)) floorY = 0;
			var position = (x + y * width) * 4;

			if (y > halfHeight) {
				// draw floor
				if (floorPixels) {
					var tx = ~~(floorTexWidth * absLocal(floorX - cellX));
					var ty = ~~(floorTexHeight * absLocal(floorY - cellY));

					// get texture pixel information
					var colorPosition = (tx + ty * floorTexWidth) * 4;

					// draw the pixel
					pixels[position] = floorPixels[colorPosition];
					pixels[position + 1] = floorPixels[colorPosition + 1];
					pixels[position + 2] = floorPixels[colorPosition + 2];
					pixels[position + 3] = 255;
					if (floorAllowClipping) depthBuffer[x][y] = rowDistance;
				} else {

					// draw the pixel
					pixels[position] = floorTex.rgbArray[0];
					pixels[position + 1] = floorTex.rgbArray[1];
					pixels[position + 2] = floorTex.rgbArray[2];
					pixels[position + 3] = 255;
					if (floorAllowClipping) depthBuffer[x][y] = rowDistance;
				}
			} else {
				// draw ceiling
				if (ceilingPixels) {
					var tx = ~~(ceilingTexWidth * absLocal(floorX - cellX));
					var ty = ~~(ceilingTexHeight * absLocal(floorY - cellY));

					// get texture pixel information
					var colorPosition = (tx + ty * ceilingTexWidth) * 4;

					// draw the pixel
					pixels[position] = ceilingPixels[colorPosition];
					pixels[position + 1] = ceilingPixels[colorPosition + 1];
					pixels[position + 2] = ceilingPixels[colorPosition + 2];
					pixels[position + 3] = 255;
					if (ceilingAllowClipping) depthBuffer[x][y] = rowDistance;
				} else {
					// draw the pixel
					pixels[position] = ceilingTex.rgbArray[0];
					pixels[position + 1] = ceilingTex.rgbArray[1];
					pixels[position + 2] = ceilingTex.rgbArray[2];
					pixels[position + 3] = 255;
					if (ceilingAllowClipping) depthBuffer[x][y] = rowDistance;
				}
			}
		}
	}
	return this;
};

Pseudo3D.Camera.prototype.renderWalls = function(scene, renderer) {
	var remapLocal = Pseudo3D.Math.remap;
	var constrainLocal = Pseudo3D.Math.constrain;
	var width = renderer.renderWidth;
	var height = renderer.renderHeight;
	var aspectRatio = renderer.aspectRatio;
	var depthBuffer = renderer.depthBuffer;
	var pixels = renderer.pixels;

	for (var x = 0; x < width; x++) {

		// cameraX is our camera plane in camera space (width / height to fix streachting when changing aspect ratio of screen)
		this.rayAngle = remapLocal(x, 0, width, -aspectRatio, aspectRatio);
		if (this.ray) {
			this.ray.reset(this);
		}
		else {
			this.ray = new Pseudo3D.Ray(this); 
		}

		this.ray.cast(scene);
		var perpWallDist = this.ray.perpendicular;
		var side = this.ray.side;
		if (perpWallDist > this.farClippingPlane) continue;
		if (perpWallDist < this.nearClippingPlane) continue;
		if (!this.ray.hit) continue;
		// calculate line height according to screen, remap to a range of 0 - 1
		var drawStart = ~~((-0.5 / perpWallDist + this.planeLength) / (this.planeLength * 2) * height);
		/*
		draw end could be height - drawStart, but im keeping this for future pruposes when the 
		user can specify the height of the wall, and the vertical location of the wall
		*/
		var drawEnd = ~~((0.5 / perpWallDist + this.planeLength) / (this.planeLength * 2) * height);
		var lineHeight = ~~(drawEnd - drawStart);
		var cell = scene.cellPrefabs[this.ray.hit];
		if(!cell) continue;
		var texWidth = cell.texture.width;
		var texHeight = cell.texture.height;
		var texPixels = cell.texture.pixels;
		var sideLight= scene.lighting.sideLight;

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
				if(texY < 0) {
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
	}
	return this;
};

Pseudo3D.Camera.prototype.renderSprites = function(scene, renderer) {

};

Pseudo3D.Camera.prototype.renderTerrain = function(scene, renderer) {

};

Pseudo3D.Camera.prototype.renderScene = function(scene, renderer) {

};