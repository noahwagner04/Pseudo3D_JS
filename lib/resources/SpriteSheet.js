var Pseudo3D = Pseudo3D || {};

// change this class to manage its own loading so the user is supposed to instantiate it. (going to have to change some inputs and atributes and add functions)
Pseudo3D.SpriteSheet = function(name, tempColor, cellWidth, cellHeight, width, height) {
	if (!(this instanceof Pseudo3D.SpriteSheet)) return new Pseudo3D.SpriteSheet(name, tempColor, cellWidth, cellHeight, width, height);
	cellWidth = typeof cellWidth === "number" ? cellWidth : 0;
	cellHeight = typeof cellHeight === "number" ? cellHeight : 0;
	this.source = new Pseudo3D.Image(name, tempColor, width, height);
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	// maybe each image container has a modified name like "name_1" "name_2" etc.
	this.images = [];
}