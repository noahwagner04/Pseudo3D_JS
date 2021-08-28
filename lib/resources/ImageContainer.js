var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};
// FIX THESE DATA TYPES KIND OF JANKY AT THE MOMENT

// a image container that holds basic information about images, gets several atributes filled durring loading process
Pseudo3D.Resources.ImageContainer = function(name, tempColor, width, height) {
	if (!(this instanceof Pseudo3D.Resources.ImageContainer)) return new Pseudo3D.Resources.ImageContainer(name, tempColor, width, height);
	name = typeof name === "string" ? name : "";
	tempColor = tempColor instanceof Array || tempColor instanceof Pseudo3D.Resources.Color ? tempColor : [0, 0, 0, 0];
	width = typeof width === "number" ? width : 0;
	height = typeof height === "number" ? height : 0;
	this.name = name;
	this.htmlImage = undefined;
	this.pixelBuffer = undefined;
	this.width = width;
	this.height = height;
	this.tempColor = tempColor instanceof Array ? new Pseudo3D.Resources.Color(tempColor[0], tempColor[1], tempColor[2], tempColor[3]) : tempColor;
}