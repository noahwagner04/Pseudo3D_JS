var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};

// a container who gets loaded by the loader, images array gets filled durring loading process with a specified cellWidth and cellHeight
Pseudo3D.Resources.SpriteSheet = function(name, tempColor, width, height) {
	if (!(this instanceof Pseudo3D.Resources.SpriteSheet)) return new Pseudo3D.Resources.SpriteSheet(name, tempColor, cellWidth, cellHeight);
	if (!Pseudo3D.Resources.ImageContainer) {
		console.log("cannot create Pseudo3D.Resources.SpriteSheet properly because Pseudo3D.Resources.ImageContainer class does not exist");
		return;
	}
	Pseudo3D.Resources.ImageContainer.call(this, name, tempColor, width, height);
	// maybe each image container has a modified name like "name_1" "name_2" etc.
	this.images = [];
}