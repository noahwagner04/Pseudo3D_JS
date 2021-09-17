var Pseudo3D = Pseudo3D || {};

Pseudo3D.Sprite = function(texture, pos, dir, size, width, height) {
	if (!(this instanceof Pseudo3D.Sprite)) return new Pseudo3D.Sprite(texture, pos, dir, size);
	if (!(texture instanceof Pseudo3D.Texture) && !(texture instanceof Pseudo3D.Color)) {
		console.log("Pseudo3D.Sprite expects at least one argument typeof Pseudo3D.Texture or Pseudo3D.Color, but did not receive one");
		return;
	}
	var image = texture instanceof Pseudo3D.Texture;
	var color = texture instanceof Pseudo3D.Color;
	pos = pos instanceof Array ? pos : [];
	dir = dir instanceof Array ? dir : [];
	size = typeof size === "number" ? size : 1;
	width = typeof width === "number" ? width : 0;
	height = typeof height === "number" ? height : 0;
	Pseudo3D.Entity.call(this, pos[0], pos[1], dir[0], dir[1]);
	this.position.z = pos[2] || 0;
	this.direction.normalize();
	if (image) {
		this.texture = texture.loaded ? texture : texture.tempColor;
		this.width = texture.width || 0;
		this.height = texture.height || 0;
	} else {
		this.texture = texture;
		this.width = width;
		this.height = height;
	}
	this.tint = undefined;
	this.invisible = false;
	this.isVisible = false;
	this.partialAlpha = true;
	this.size = size;

	if (image) {
		texture.html.addEventListener("load", function() {
			this.texture = texture;
			this.width = texture.width;
			this.height = texture.height;
		}.bind(this));
	}
}

// inherit from Pseudo3D.Entity class
Pseudo3D.Sprite.prototype = Object.create(Pseudo3D.Entity.prototype);
Object.defineProperty(Pseudo3D.Sprite.prototype, 'constructor', {
	value: Pseudo3D.Sprite,
	enumerable: false,
	writable: true
});

Pseudo3D.Sprite.prototype.tint = function(color) {
	if (color instanceof Array) {
		color = new Pseudo3D.Color(color[0], color[1], color[2], color[3], color[4]);
	} else if (!(color instanceof Pseudo3D.Color)) {
		return;
	}
	this.tint = color;
};

Pseudo3D.Sprite.prototype.untint = function() {
	this.tint = undefined;
};

Pseudo3D.Sprite.prototype.makeInvisible = function() {
	this.visible = false;
};

Pseudo3D.Sprite.prototype.setTexture = function(texture) {

};