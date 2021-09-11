var Pseudo3D = Pseudo3D || {};

// the base class of all other Pseudo3D objects that are somewhat physical entites, this includes camera, ray, and sprite.
Pseudo3D.Entity = function(x, y, dirX, dirY) {
	x = typeof x === "number" ? x : 0;
	y = typeof y === "number" ? y : 0;
	dirX = typeof dirX === "number" ? dirX : 0;
	dirY = typeof dirY === "number" ? dirY : -1;
	if (!(this instanceof Pseudo3D.Entity)) return new Pseudo3D.Entity(x, y, dirX, dirY);
	this.position = Pseudo3D.Math.Vector(x, y);
	this.direction = Pseudo3D.Math.Vector(dirX, dirY); // dont normalize vector because ray object doesn't need it, instead manually normalize from inheriting classes.
}