Pseudo3D.Loader.loadColor("barrelColor", [1, 2, 3, 100], "hsb");
Pseudo3D.Loader.loadImage("barrel", "/pics/barrel.png", "barrelColor");
Pseudo3D.Loader.loadImage("bluestone", "/pics/bluestone.png", "d");
Pseudo3D.Loader.loadImage("colorstone", "/pics/colorstone.png", [23, 3]);
Pseudo3D.Loader.loadImage("eagle", "/pics/eagle.png", [2344, 54, 45, 455]);
var barrel = Pseudo3D.Loader.getResource("barrel", (img) => printImage(img));
var bluestone = Pseudo3D.Loader.getResource("bluestone", (img) => printImage(img));
var colorstone = Pseudo3D.Loader.getResource("colorstone", (img) => printImage(img));
var eagle = Pseudo3D.Loader.getResource("eagle", (img) => printImage(img));

// var barrelColor = new Pseudo3D.Color([1, 2, 3, 100]);
// var barrel = new Pseudo3D.Image("/pics/barrel.png", [65, 26, 6, 100]);
// var bluestone = new Pseudo3D.Image("/pics/bluestone.png", barrelColor);
// var colorstone = new Pseudo3D.Image("/pics/colorstone.png");
// var eagle = new Pseudo3D.Image("/pics/eagle.png" [23, 43, 5]);

function printImage(img) {
	console.log(img);
}