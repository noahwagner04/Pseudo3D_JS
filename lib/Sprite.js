var Pseudo3D = Pseudo3D || {};

Pseudo3D.Sprite = function(config) {
	if (!(this instanceof Pseudo3D.Sprite)) return new Pseudo3D.Sprite(config);
	if (!Pseudo3D.Entity) {
		console.log("cannot create Pseudo3D.Sprite properly because Pseudo3D.Entity class does not exist");
		return;
	}
	Pseudo3D.Entity.call(this, config.x, config.y);
	// this.direction.rotate(config.rotation);
}

if (!Pseudo3D.Entity) {
	console.log("Pseudo3D.Sprite cannot inherit properly from Pseudo3D.Entity since it does not exist");
} else {
	Pseudo3D.Sprite.prototype = Object.create(Pseudo3D.Entity.prototype);
	Object.defineProperty(Pseudo3D.Sprite.prototype, 'constructor', {
		value: Pseudo3D.Sprite,
		enumerable: false,
		writable: true
	});
}