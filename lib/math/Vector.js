var Pseudo3D = Pseudo3D || {};
var PMath = Pseudo3D.Math || {};

PMath.Vector = function(x, y, z) {
	if (!(this instanceof PMath.Vector)) return new PMath.Vector(x, y, z);
	this.x = x;
	this.y = y;
	this.z = z || 0;
}