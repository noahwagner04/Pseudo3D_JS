var Pseudo3D = Pseudo3D || {};

// class used to render scenes
Pseudo3D.Camera = function(config) {
	if (!(this instanceof Pseudo3D.Camera)) return new Pseudo3D.Camera(config);
	if (!Pseudo3D.Entity) {
		console.log("cannot create Pseudo3D.Camera properly because Pseudo3D.Entity class does not exist");
		return;
	}
	Pseudo3D.Entity.call(this, config.x, config.y);
	// this.direction.rotate(config.rotation);
}

if (!Pseudo3D.Entity) {
	console.log("Pseudo3D.Camera cannot inherit properly from Pseudo3D.Entity since it does not exist");
} else {
	Pseudo3D.Camera.prototype = Object.create(Pseudo3D.Entity.prototype);
	Object.defineProperty(Pseudo3D.Camera.prototype, 'constructor', {
		value: Pseudo3D.Camera,
		enumerable: false,
		writable: true
	});
}