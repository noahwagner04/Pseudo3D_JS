// base utility class incharge of containerizing functions and classes related to math 
var Pseudo3D = Pseudo3D || {};
Pseudo3D.Math = Pseudo3D.Math || {};

// remaps x from a range of s1 - e1 to a range of s2 - e2
Pseudo3D.Math.remap = function(x, s1, e1, s2, e2) {
	return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
}

// if x is less than min, return min, else if x is greater than max, return max, else return x
Pseudo3D.Math.constrain = function(x, min, max) {
	return Math.min(Math.max(x, min), max);
}