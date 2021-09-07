var barrelColor = new Pseudo3D.Color([1, 2, 3, 100]);
var barrel = new Pseudo3D.SpriteSheet("/pics/eagle.png", [65, 26, 6, 100, "hsb"], 32, 32);
var bluestone = new Pseudo3D.Texture("/pics/bluestone.png", barrelColor);
var colorstone = new Pseudo3D.Texture("/pics/colorstone.png");
var eagle = new Pseudo3D.Texture("/pics/eagle.png", [23, 43, 5]);
barrel.source.html.onload = test;
console.log(barrel);
console.log(bluestone);
console.log(colorstone);
console.log(eagle);

function test() {
	var c = document.createElement("canvas");
	var ctx = c.getContext("2d");
	document.body.appendChild(c);
	let x = 0;
	let y = 0;
    barrel.textures.forEach(texture => {
    	var imageData = new ImageData(texture.pixels, barrel.cellWidth);
    	if (y >= barrel.source.height) {
    		y = 0;
    		x += barrel.cellWidth;
    	}
    	ctx.putImageData(imageData, x, y);
    	y += barrel.cellHeight;
    });
}

