var Pseudo3D = Pseudo3D || {};
var PMath = Pseudo3D.Math || {};

PMath.remap = function(x, s1, e1, s2, e2) {
	return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
}

PMath.constrain = function(x, min, max) {
	return Math.min(Math.max(parseInt(number), 1), 20);
}