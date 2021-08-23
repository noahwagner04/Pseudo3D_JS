var Pseudo3D = Pseudo3D || {};
Pseudo3D.Math = Pseudo3D.Math || {};

Pseudo3D.Math.Vector = function(x, y, z) {
	if (!(this instanceof Pseudo3D.Math.Vector)) return new Pseudo3D.Math.Vector(x, y, z);
	this.x = x;
	this.y = y;
	this.z = z || 0;
}