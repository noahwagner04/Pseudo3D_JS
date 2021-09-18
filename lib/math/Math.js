var Pseudo3D = Pseudo3D || {};
Pseudo3D.Math = Pseudo3D.Math || {};

Pseudo3D.Math.remap = function(x, s1, e1, s2, e2) {
	return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
}

Pseudo3D.Math.constrain = function(x, min, max) {
	return Math.min(Math.max(x, min), max);
}