var Pseudo3D = Pseudo3D || {};

Pseudo3D.Ray = function(x, y, eX, eY) {
	if (!(this instanceof Pseudo3D.Ray)) return new Pseudo3D.Ray(x, y, eX, eY);
	Pseudo3D.Entity.call(this);
	if (x instanceof Pseudo3D.Camera) {

	} else {

	}
}

Pseudo3D.Ray.prototype = Object.create(Pseudo3D.Entity.prototype);
Object.defineProperty(Pseudo3D.Ray.prototype, 'constructor', {
	value: Pseudo3D.Ray,
	enumerable: false,
	writable: true
});