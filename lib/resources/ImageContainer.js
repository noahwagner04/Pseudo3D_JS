var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};

// a image container that holds basic information about images, gets several atributes filled durring loading process
Pseudo3D.Resources.ImageContainer = function(name, tempColor, width, height) {
	if (!(this instanceof Pseudo3D.Resources.ImageContainer)) return new Pseudo3D.Resources.ImageContainer(name, tempColor, width, height);
	if (Pseudo3D.Resources.Color && tempColor) {
		Pseudo3D.Resources.Color.call(this, tempColor[0], tempColor[1], tempColor[2], tempColor[3]);
	} else if (!tempColor) {
		Pseudo3D.Resources.Color.call(this, 0, 0, 0, 255);
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