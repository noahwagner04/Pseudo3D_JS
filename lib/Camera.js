var Pseudo3D = Pseudo3D || {};

// class used to render scenes
Pseudo3D.Camera = function(config) {
	if (!(this instanceof Pseudo3D.Camera)) return new Pseudo3D.Camera(config);
	Pseudo3D.Entity.call(this, config.x, config.y);
}

Pseudo3D.Camera.prototype = Object.create(Pseudo3D.Entity.prototype);
Object.defineProperty(Pseudo3D.Camera.prototype, 'constructor', {
	value: Pseudo3D.Camera,
	enumerable: false,
	writable: true
});