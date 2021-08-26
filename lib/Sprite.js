var Pseudo3D = Pseudo3D || {};

Pseudo3D.Sprite = function(config) {
	if (!(this instanceof Pseudo3D.Sprite)) return new Pseudo3D.Sprite(config);
	Pseudo3D.Entity.call(this, config.x, config.y);
}

Pseudo3D.Sprite.prototype = Object.create(Pseudo3D.Entity.prototype);
Object.defineProperty(Pseudo3D.Sprite.prototype, 'constructor', {
	value: Pseudo3D.Sprite,
	enumerable: false,
	writable: true
});