var Pseudo3D = Pseudo3D || {};

// the base class of all other Pseudo3D objects that are somewhat physical entites, this includes camera, ray, and sprite.
Pseudo3D.Entity = function(x, y, dirX, dirY) {
	if (!(this instanceof Pseudo3D.Entity)) return new Pseudo3D.Entity(x, y, dirX, dirY);
	if (!Pseudo3D.Math) {
		console.log("cannot create Entity because Pseudo3D.Math namespace does not exist");
		return;
	}
	this.position = Pseudo3D.Math.Vector(x || 0, y || 0);
	this.direction = Pseudo3D.Math.Vector(dirX || 0, dirY || -1);
}