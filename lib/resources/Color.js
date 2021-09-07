var Pseudo3D = Pseudo3D || {};

Pseudo3D.Color = (function() {

	function HSBToRGB(h, s, b, a) {
		h = Pseudo3D.Math.constrain(h, 0, 360);
		s = Pseudo3D.Math.constrain(s, 0, 100) / 100;
		b = Pseudo3D.Math.constrain(b, 0, 100) / 100;
		a = Pseudo3D.Math.constrain(a, 0, 100) / 100;

		let c = b * s;
		let x = c * (1 - Math.abs((h / 60) % 2 - 1));
		let m = b - c;
		let rgb = [0, 0, 0];

		if (h >= 0 && h < 60) {
			rgb = [c, x, 0];
		} else if (h >= 60 && h < 120) {
			rgb = [x, c, 0];
		} else if (h >= 120 && h < 180) {
			rgb = [0, c, x];
		} else if (h >= 180 && h < 240) {
			rgb = [0, x, c];
		} else if (h >= 240 && h < 300) {
			rgb = [x, 0, c];
		} else if (h >= 300 && h < 360) {
			rgb = [c, 0, x];
		}
		return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255, a * 255];
	}

	function Color(colorArray, type) {
		if (!(this instanceof Pseudo3D.Color)) {
			return new Pseudo3D.Color(
				colorArray,
				type
			);
		}
		colorArray = colorArray instanceof Array ? colorArray : [];
		colorArray[3] = typeof colorArray[3] === "number" ? colorArray[3] : 255;
		if (type === Pseudo3D.ColorTypes.HSB) {
			this.hsbArray = new Uint16Array(4); 
			this.hsbArray[0] = Pseudo3D.Math.constrain(colorArray[0], 0, 360);
			this.hsbArray[1] = Pseudo3D.Math.constrain(colorArray[1], 0, 100);
			this.hsbArray[2] = Pseudo3D.Math.constrain(colorArray[2], 0, 100);
			this.hsbArray[3] = Pseudo3D.Math.constrain(colorArray[3], 0, 100);
			var rgb = HSBToRGB(
				this.hsbArray[0],
				this.hsbArray[1],
				this.hsbArray[2],
				this.hsbArray[3]
			);
			colorArray[0] = rgb[0];
			colorArray[1] = rgb[1];
			colorArray[2] = rgb[2];
			colorArray[3] = rgb[3];
		}
		this.rgbArray = new Uint8ClampedArray(4);
		this.rgbArray[0] = colorArray[0];
		this.rgbArray[1] = colorArray[1];
		this.rgbArray[2] = colorArray[2];
		this.rgbArray[3] = colorArray[3];
	}
	return Color;
})();