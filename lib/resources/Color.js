var Pseudo3D = Pseudo3D || {};
var Resources = Pseudo3D.Resources || {};

// simple color object that stores r g b a values. Gets loaded by the loader namespace, where they can specify the mode of the color upon creation, hsb or rgb.
Resources.Color = (function() {
	var buffer = ArrayBuffer(4);

	function Color(r, g, b, a) {
		if (!(this instanceof Resources.Color)) return new Resources.Color(r, g, b, a);
		this.colorArray = Uint8ClampedArray(buffer);
		this.colorArray[0] = r;
		this.colorArray[1] = g;
		this.colorArray[2] = b;
		this.colorArray[3] = a;
	}
	return Color;
})();