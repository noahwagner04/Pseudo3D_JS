var Pseudo3D = Pseudo3D || {};
Pseudo3D.Resources = Pseudo3D.Resources || {};
// FIX THESE DATA TYPES KIND OF JANKY AT THE MOMENT

// simple color object that stores r g b a values. Gets loaded by the loader namespace, where they can specify the mode of the color upon creation, hsb or rgb.
Pseudo3D.Resources.Color = function(r, g, b, a) {
	if (!(this instanceof Pseudo3D.Resources.Color)) return new Pseudo3D.Resources.Color(r, g, b, a);
	this.colorArray = new Uint8ClampedArray(4);
	this.colorArray[0] = r;
	this.colorArray[1] = g;
	this.colorArray[2] = b;
	this.colorArray[3] = typeof a === "number" ? a : 255;
}