var Pseudo3D = Pseudo3D || {};

// change this class to manage its own loading so the user is supposed to instantiate it. (going to have to change some inputs and atributes and add functions)
Pseudo3D.Image = function(path, tempColor, width, height) {
	if (!(this instanceof Pseudo3D.Image)) return new Pseudo3D.Image(path, tempColor, width, height);
	path = typeof path === "string" ? path : "";
	tempColor = tempColor instanceof Array || tempColor instanceof Pseudo3D.Color ? tempColor : [0, 0, 0, 0];
	width = typeof width === "number" ? width : 0;
	height = typeof height === "number" ? height : 0;
	this.path = path;
	this.html = new Image();
	this.pixelBuffer = undefined;
	this.width = width;
	this.height = height;
	this.tempColor = tempColor instanceof Array ? new Pseudo3D.Color(tempColor[0], tempColor[1], tempColor[2], tempColor[3]) : tempColor;
	this.isLoaded = false;
}