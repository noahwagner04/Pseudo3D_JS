var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};
// FIX THESE DATA TYPES KIND OF JANKY AT THE MOMENT

// a container who gets loaded by the loader, images array gets filled durring loading process with a specified cellWidth and cellHeight
Pseudo3D.Resources.SpriteSheet = function(name, tempColor, cellWidth, cellHeight, width, height) {
	if (!(this instanceof Pseudo3D.Resources.SpriteSheet)) return new Pseudo3D.Resources.SpriteSheet(name, tempColor, cellWidth, cellHeight, width, height);
	cellWidth = typeof cellWidth === "number" ? cellWidth : 0;
	cellHeight = typeof cellHeight === "number" ? cellHeight : 0;
	this.source = new Pseudo3D.Resources.ImageContainer(name, tempColor, width, height);
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	// maybe each image container has a modified name like "name_1" "name_2" etc.
	this.images = [];
}