var Pseudo3D = Pseudo3D || {};

Pseudo3D.SpriteSheet = function(path, tempColor, cellWidth, cellHeight, width, height) {
	if (!(this instanceof Pseudo3D.SpriteSheet)) return new Pseudo3D.SpriteSheet(path, tempColor, cellWidth, cellHeight, width, height);
	cellWidth = typeof cellWidth === "number" ? cellWidth : 0;
	cellHeight = typeof cellHeight === "number" ? cellHeight : 0;
	this.source = new Pseudo3D.Texture(path, tempColor, width, height);
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.cellCount = undefined;
	this.textures = [];

	this.source.html.addEventListener("load", function() {
		if (this.cellWidth === 0) this.cellWidth = this.source.width;
		if (this.cellHeight === 0) this.cellHeight = this.source.height;
		var horizontalCells = this.source.width / this.cellWidth;
		var verticalCells = this.source.height / this.cellHeight;
		if (horizontalCells % 1 !== 0 || verticalCells % 1 !== 0) {
			console.log("cannot create spritesheet because the cell size provided cannot divide the source with path: " + this.source.html.src + " into whole parts");
			return;
		}
		for (var i = 0; i < this.source.width; i += this.cellWidth) {
			for (var j = 0; j < this.source.height; j += this.cellHeight) {
				this.textures.push(new Pseudo3D.Texture(
					Pseudo3D.Texture.getPixelData(
						this.source.html,
						i,
						j,
						this.cellWidth,
						this.cellHeight
					),
					this.cellWidth
				));
			}
		}
		this.cellCount = this.textures.length;
	}.bind(this));
}