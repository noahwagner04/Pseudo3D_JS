var Pseudo3D = Pseudo3D || {};
var Resources = Pseudo3D.Resources || {};

// a container who gets loaded by the loader, images array gets filled durring loading process with a specified cellWidth and cellHeight
Resources.SpriteSheet = function(name, tempColor, width, height) {
	if (!(this instanceof Resources.SpriteSheet)) return new Resources.SpriteSheet(name, tempColor, cellWidth, cellHeight);
	if (!Resources.ImageContainer) {
		console.log("Pseudo3D.Resources.ImageContainer does not exist, cannot create spritesheet");
		return;
	}
	Resources.ImageContainer.call(this, name, tempColor, width, height);
	// maybe each image container has a modified name like "name_1" "name_2" etc.
	this.images = [];
}