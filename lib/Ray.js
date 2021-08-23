var Pseudo3D = Pseudo3D || {};

Pseudo3D.Ray = function(x, y, eX, eY) {
	if (!(this instanceof Pseudo3D.Ray)) return new Pseudo3D.Ray(x, y, eX, eY);
	if(!Pseudo3D.Entity) {
		console.log("cannot create Pseudo3D.Ray because Pseudo3D.Entity class does not exist");
		return;
	}
	Pseudo3D.Entity.call(this);
	if (x instanceof Pseudo3D.Camera) {

	} else {

	}
}

window.addEventListener('load', function() {
	if (!Pseudo3D.Entity) {
		console.log("Pseudo3D.Entity does not exist, cannot create Pseudo3D.Ray objects properly")
	}
	Pseudo3D.Ray.prototype = Object.create(Pseudo3D.Entity.prototype);
	Object.defineProperty(Pseudo3D.Ray.prototype, 'constructor', {
		value: Pseudo3D.Ray,
		enumerable: false,
		writable: true
	});
});