var Pseudo3D = Pseudo3D || {};

Pseudo3D.Renderer = function(width, height, quality) {
	if (!(this instanceof Pseudo3D.Renderer)) return new Pseudo3D.Renderer(width, height, quality);
	if (typeof width !== "number" || typeof height !== "number" || width === 0 || height === 0) {
		console.log("renderer width and height must both be a number that is not 0");
		return;
	}
	this.canvas = document.createElement("canvas");
	this.drawingContext = this.canvas.getContext("2d");
	this.quality = typeof quality === "number" && quality > 0 && quality <= 1 ? quality : 1;
	this.renderWidth = ~~(width * this.quality);
	this.renderHeight = ~~(height * this.quality);
	this.canvas.width = this.renderWidth;
	this.canvas.height = this.renderHeight;
	this.canvas.style = "width: " + width + "px; height: " + height + "px;";
	this.pixels = this.drawingContext.getImageData(0, 0, this.renderWidth, this.renderHeight).data;
	this.depthBuffer = Array(this.renderWidth).fill().map(() => Array(this.renderHeight).fill(Infinity));
	this.aspectRatio = this.renderWidth / this.renderHeight;
}

Pseudo3D.Renderer.prototype.render = function(scene, camera) {
	if (!(scene instanceof Pseudo3D.Scene) || !(camera instanceof Pseudo3D.Camera)) {
		console.log("cannot execute function Renderer.render because it did not recieve either a Pseudo3D.Scene or Pseudo3D.Camera");
		return;
	}
	this.depthBuffer = Array(this.renderWidth).fill().map(() => Array(this.renderHeight).fill(Infinity));
	camera.renderScene(scene, this);
	var imageData = new ImageData(this.pixels, this.renderWidth)
	this.drawingContext.putImageData(imageData, 0, 0);
	return this;
};

Pseudo3D.Renderer.prototype.resize = function(width, height, quality) {
	if (typeof width !== "number" || typeof height !== "number" || width === 0 || height === 0) {
		console.log("failed to execute Renderer.resize, width and height must both be a number that isn't 0");
		return;
	}
	quality = typeof quality === "number" && quality > 0 && quality <= 1 ? quality : 1;
	this.renderWidth = ~~(width * quality);
	this.renderHeight = ~~(height * quality);
	this.canvas.width = this.renderWidth;
	this.canvas.height = this.renderHeight;
	this.canvas.style.width = width + "px;";
	this.canvas.style.height = height + "px;";
	this.aspectRatio = this.renderWidth / this.renderHeight;
};