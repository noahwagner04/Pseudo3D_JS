/*
basic vector class used heavily in the Pseudo3D.ray and Pseudo3D.camera classes
all vectors have a z attribute, those with a z attribute of 0 are assumed to be 2d
*/
var Pseudo3D = Pseudo3D || {};
Pseudo3D.Math = Pseudo3D.Math || {};

Pseudo3D.Math.Vector = function(x, y, z) {
	/*
	if the user instantiates an instance without useing "this" keyword, 
	force a new instance using the "new" keyword to prevent unexpected behavior
	*/
	if (!(this instanceof Pseudo3D.Math.Vector)) return new Pseudo3D.Math.Vector(x, y, z);

	// if any input is not a number, default to 0
	this.x = typeof x === "number" ? x : 0;
	this.y = typeof y === "number" ? y : 0;
	this.z = typeof z === "number" ? z : 0;
};
/*
returns the squared length of this vector, use this function if the length of the 
vector doesn't matter; it's faster than getLength()
*/
Pseudo3D.Math.Vector.prototype.getLengthSquared = function() {
	if (this.z) {
		// if we are a 3d vector...
		return Math.pow(Math.sqrt(this.x * this.x + this.y * this.y), 2) + this.z * this.z;
	} else {
		// if we are a 2d vector...
		return this.x * this.x + this.y * this.y;
	}
};

// returns the actual length of this vector, slower than getLengthSquared()
Pseudo3D.Math.Vector.prototype.getLength = function() {
	return Math.sqrt(this.getLengthSquared());
};

/*
sets this vectors length to a desired length, changing its x, y, and z
coordinates respectively, returns this vector
this function doesn't do anything if all of the vectors coordinates are 0
*/
Pseudo3D.Math.Vector.prototype.setLength = function(l) {
	/*
	this function works by scaling all the vectors components 
	by the scale factor of the hypotenuse to l, which is l / hypotenuse.
	This can be represented by scaling a trangle, when scaling one side,
	all others must be scaled proportionally to keep its structure
	*/

	// if l is not a number, set it to 0
	l = typeof l === "number" ? l : 0;
	var hypotenuse = this.getLength();
	if (this.z) {
		// only change our z coordiante if we are a 3d vector
		this.z *= l / hypotenuse;
		this.z = this.z || 0;
	}
	this.x *= l / hypotenuse;
	this.y *= l / hypotenuse;
	this.x = this.x || 0;
	this.y = this.y || 0;
	return this;
};
/*
rotates the vector by a certain amount of degrees per axis
if this vector is 2d only rotate using the first argument
returns this vector whose coordinates are modified after rotating
*/
Pseudo3D.Math.Vector.prototype.rotate = function(angleX, angleY, angleZ) {
	// if any angle is not a number, default to 0
	angleX = typeof angleX === "number" ? angleX : 0;
	angleY = typeof angleY === "number" ? angleY : 0;
	angleZ = typeof angleZ === "number" ? angleZ : 0;

	// convert inputed degrees to radians
	var radX = angleX * (Math.PI / 180);
	var radY = this.z ? angleY * (Math.PI / 180) : 0;
	var radZ = this.z ? angleZ * (Math.PI / 180) : 0;

	// coefficients of the rotation matrices
	var cosX = Math.cos(radX);
	var sinX = Math.sin(radX);
	var cosY = this.z ? Math.cos(radY) : 0;
	var sinY = this.z ? Math.sin(radY) : 0;
	var cosZ = this.z ? Math.cos(radZ) : 0;
	var sinZ = this.z ? Math.sin(radZ) : 0;
	var oldX = this.x;
	var oldY = this.y;
	var oldZ = this.z;

	if (this.z) {
		// if we are a 3d vector, rotate using the 3d rotation matrix
		this.x = oldX * (cosZ * cosY) + oldY * (cosZ * sinY * sinX - sinZ * cosX) + oldZ * (cosZ * sinY * cosX + sinZ * sinX);
		this.y = oldX * (sinZ * cosY) + oldY * (sinZ * sinY * sinX + cosZ * cosX) + oldZ * (sinZ * sinY * cosX - cosZ * sinX);
		this.z = oldX * (-sinY) + oldY * (cosY * sinX) + oldZ * (cosY * cosX);
	} else {
		// if we are a 2d vector, rotate using the 2d rotation matrix
		this.x = oldX * cosX - oldY * sinX;
		this.y = oldX * sinX + oldY * cosX;
	}
	return this;
};

// normalizes this vector, returns this vector with the modified coordinates
Pseudo3D.Math.Vector.prototype.normalize = function() {
	return this.setLength(1);
};

// returns the distance between this vector and another specified vector
Pseudo3D.Math.Vector.prototype.distanceFrom = function(vector) {
	/*
	if the passed in argument is not a Pseudo3D.Math.Vector, 
	make it equal a vector whose coordiantes are (0, 0, 0)
	*/
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	/*
	get the vector inbetween this and the specified vector by subtracting the two
	in doing this we are essentially pivoting this vector to the origin, and moving the other vector in parallel
	then get the length of this inbetween vector
	*/
	return this.clone().subtract(vector).getLength();
};

// returns the squared distance between this vector and another specified vector (faster than distanceFrom())
Pseudo3D.Math.Vector.prototype.distanceFromSquared = function(vector) {
	/*
	if the passed in argument is not a Pseudo3D.Math.Vector,
	make it equal a vector whose coordiantes are (0, 0, 0)
	*/
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	/*
	get the vector inbetween this and the specified vector by subtracting the two
	in doing this we are essentially pivoting this vector to the origin, and moving the other vector in parallel
	then get the length of this inbetween vector
	*/
	return this.clone().subtract(vector).getLengthSquared();
};

/*
adds this vector's coordinates with the specified vector's coordinates
returns this vector with the newly modified coordinates
*/
Pseudo3D.Math.Vector.prototype.add = function(vector) {
	// if the provided vector is not a Pseudo3D.Math.Vector, use an empty one
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
	return this;
};

/*
adds a number to all the coordinates of this vector
returns this vector with the newly modified coordinates
*/
Pseudo3D.Math.Vector.prototype.addConst = function(num) {
	// if the provided number is not a number, default to 0
	num = typeof num === "number" ? num : 0;
	this.x += num;
	this.y += num;
	this.z += num;
	return this;
};

/*
subtracts this vector's coordinates with the specified vector's coordinates
returns this vector with the newly modified coordinates
*/
Pseudo3D.Math.Vector.prototype.subtract = function(vector) {
	// if the provided vector is not a Pseudo3D.Math.Vector, use an empty one
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
	return this;
};

/*
subtracts a number to all the coordinates of this vector
returns this vector with the newly modified coordinates
*/
Pseudo3D.Math.Vector.prototype.subractConst = function(num) {
	// if the provided number is not a number, default to 0
	num = typeof num === "number" ? num : 0;
	this.x -= num;
	this.y -= num;
	this.z -= num;
	return this;
};

/*
multiplies a number to all the coordinates of this vector
returns this vector with the newly modified coordinates
*/
Pseudo3D.Math.Vector.prototype.scale = function(s) {
	// if the provided scalar is not a number, default to 0
	s = typeof s === "number" ? s : 0;
	this.x *= s;
	this.y *= s;
	this.z *= s;
	return this;
};

// returns the dot product of this vector and the provided vector
Pseudo3D.Math.Vector.prototype.dotProduct = function(vector) {
	// if the provided vector is not a Pseudo3D.Math.Vector, use an empty one
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	return this.x * vector.x + this.y * vector.y + this.z * vector.z;
};

// returns the angle between this vector and the provided vector, only works on 2d vectors
Pseudo3D.Math.Vector.prototype.angleBetween = function(vector) {
	if(this.z || vector.z) {
		// if the vector is 3d, return
		console.log("Vector.angleBetween only works on 2d vectors");
		return;
	}
	// if the provided vector is not a Pseudo3D.Math.Vector, use an empty one
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	var length1 = this.getLength();
	var length2 = vector.getLength();
	// uses the angle between two vectors equation, wiki how has a good explanation of what's going on
	return Math.acos(this.dotProduct(vector) / (length1 * length2)) * (180 / Math.PI);
};

// returns a new vector identical to this one
Pseudo3D.Math.Vector.prototype.clone = function() {
	return new Pseudo3D.Math.Vector(this.x, this.y, this.z);
};