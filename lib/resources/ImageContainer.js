var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};
// FIX THESE DATA TYPES KIND OF JANKY AT THE MOMENT

// a image container that holds basic information about images, gets several atributes filled durring loading process
Pseudo3D.Resources.ImageContainer = function(name, tempColor, width, height) {
	name = typeof name === "string" ? name : "";
	tempColor = typeof tempColor === "array" ? tempColor : [0, 0, 0, 0];
	width = typeof width === "number" ? width : 0;
	height = typeof height === "number" ? height : 0;
	if (!(this instanceof Pseudo3D.Resources.ImageContainer)) return new Pseudo3D.Resources.ImageContainer(name, tempColor, width, height);
	this.name = name;
	this.htmlImage = undefined;
	this.pixelBuffer = undefined;
	this.width = width;
	this.height = height;
	this.tempColor = new Pseudo3D.Resources.Color(tempColor[0], tempColor[1], tempColor[2], tempColor[3]);
}