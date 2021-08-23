var Pseudo3D = Pseudo3D || {};
var Resources = Pseudo3D.Resources || {};

// a image container that holds basic information about images, gets several atributes filled durring loading process
Resources.ImageContainer = function(name, tempColor, width, height) {
	if (!(this instanceof Resources.ImageContainer)) return new Resources.ImageContainer(name, tempColor, width, height);
	if (Resources.Color && tempColor) {
		Resources.Color.call(this, tempColor[0], tempColor[1], tempColor[2], tempColor[3]);
	} else if (!tempColor) {
		Resources.Color.call(this, 0, 0, 0, 255);
	} else {
		console.log("Pseudo3D.Resources.Color does not exist, temporary color of image set to undefined");
		this.colorArray = undefined;
	}
	this.name = name;
	this.htmlImage;
	this.pixelBuffer;
	this.width = width;
	this.height = height;
}