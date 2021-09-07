var Pseudo3D = Pseudo3D || {};

Pseudo3D.Texture = (function() {
	function pathConstructor(path, tempColor, width, height) {
		tempColor = tempColor instanceof Array || tempColor instanceof Pseudo3D.Color ? tempColor : [0, 0, 0, 0];
		width = typeof width === "number" ? width : undefined;
		height = typeof height === "number" ? height : undefined;
		this.path = path;
		this.html = new Image(width, height);
		this.pixels = undefined;
		this.width = width;
		this.height = height;
		this.tempColor = tempColor instanceof Array ? new Pseudo3D.Color(tempColor, tempColor[4]) : tempColor;
		this.loaded = false;

		this.html.addEventListener("load", function() {
			this.loaded = true;
			if (!width) this.width = this.html.width;
			if (!height) this.height = this.html.height;
			this.pixels = Pseudo3D.Texture.getPixelData(this.html);
		}.bind(this));

		this.html.addEventListener("error", function() {
			console.log("error loading texture with path: " + this.src);
		});
		this.html.src = this.path;
	}

	function pixelsConstructor(pixels, width, height) {
		width = typeof width === "number" ? width : undefined;
		height = typeof height === "number" ? height : pixels.length / (width * 4);
		if(width * height * 4 !== pixels.length) {
			console.log("cannot create Pseudo3D.Texture because (width * height * 4) does not match the length of the Uint8ClampedArray");
			return;
		}
		this.pixels = pixels;
		this.width = width;
		this.height = height;
		this.loaded = true; // will always be true, done to bypass the loaded check while rendering sprites
	}

	function Texture(x, y, z, w) {
		if (!(this instanceof Pseudo3D.Texture)) return new Pseudo3D.Texture(x, y, z, w);
		if(typeof x === "string") {
			pathConstructor.call(this, x, y, z, w);
		} else if(x instanceof Uint8ClampedArray) {
			pixelsConstructor.call(this, x, y, z);
		} else {
			console.log("Pseudo3D.Texture expects at least 1 argument of typeof string or Uint8ClampedArray, but did not receive one");
			return;
		}
	}
	return Texture;
})();


Pseudo3D.Texture.getPixelData = function(image, x, y, w, h) {
	if(!(image instanceof HTMLImageElement)) {
		console.log("Pseudo3D.Texture.getPixelData expects a HTMLImageElement, but did not receive one");
		return;
	}
	x = typeof x === "number" ? x : 0;
	y = typeof y === "number" ? y : 0;
	w = typeof w === "number" ? w : image.width;
	h = typeof h === "number" ? h : image.height;
	let tempCanvas = document.createElement("canvas");
	let ctx = tempCanvas.getContext("2d");

	tempCanvas.width = image.width;
	tempCanvas.height = image.height;

	ctx.drawImage(image, 0, 0, image.width, image.height);
	return ctx.getImageData(x, y, w, h).data;
}