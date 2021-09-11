var Pseudo3D = Pseudo3D || {};
Pseudo3D.Math = Pseudo3D.Math || {};

Pseudo3D.Math.Vector = function(x, y, z) {
	if (!(this instanceof Pseudo3D.Math.Vector)) return new Pseudo3D.Math.Vector(x, y, z);
	this.x = typeof x === "number" ? x : 0;
	this.y = typeof y === "number" ? y : 0;
	this.z = typeof z === "number" ? z : 0;
};

Pseudo3D.Math.Vector.prototype.getLengthSquared = function() {
	if (this.z) {
		return Math.pow(Math.sqrt(this.x * this.x + this.y * this.y), 2) + this.z * this.z;
	} else {
		return this.x * this.x + this.y * this.y;
	}
};

Pseudo3D.Math.Vector.prototype.getLength = function() {
	return Math.sqrt(this.getLengthSquared());
};

Pseudo3D.Math.Vector.prototype.setLength = function(l) {
	l = typeof l === "number" ? l : 0;
	var hypotenuse = this.getLength();
	if (this.z) {
		this.z *= l / hypotenuse;
		this.z = this.z || 0;
	}
	this.x *= l / hypotenuse;
	this.y *= l / hypotenuse;
	this.x = this.x || 0;
	this.y = this.y || 0;
	return this;
};

Pseudo3D.Math.Vector.prototype.rotate = function(angleX, angleY, angleZ) {
	angleX = typeof angleX === "number" ? angleX : 0;
	angleY = typeof angleY === "number" ? angleY : 0;
	angleZ = typeof angleZ === "number" ? angleZ : 0;
	var radX = angleX * (Math.PI / 180);
	var radY = this.z ? angleY * (Math.PI / 180) : 0;
	var radZ = this.z ? angleZ * (Math.PI / 180) : 0;
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
		this.x = oldX * (cosZ * cosY) + oldY * (cosZ * sinY * sinX - sinZ * cosX) + oldZ * (cosZ * sinY * cosX + sinZ * sinX);
		this.y = oldX * (sinZ * cosY) + oldY * (sinZ * sinY * sinX + cosZ * cosX) + oldZ * (sinZ * sinY * cosX - cosZ * sinX);
		this.z = oldX * (-sinY) + oldY * (cosY * sinX) + oldZ * (cosY * cosX);
	} else {
		this.x = oldX * cosX - oldY * sinX;
		this.y = oldX * sinX + oldY * cosX;
	}
	return this;
};

Pseudo3D.Math.Vector.prototype.normalize = function() {
	return this.setLength(1);
};

Pseudo3D.Math.Vector.prototype.distanceFrom = function(vector) {
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	return this.clone().subtract(vector).getLength();
};

Pseudo3D.Math.Vector.prototype.distanceFromSquared = function(vector) {
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	return this.clone().subtract(vector).getLengthSquared();
};

Pseudo3D.Math.Vector.prototype.add = function(vector) {
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
	return this;
};

Pseudo3D.Math.Vector.prototype.addConst = function(num) {
	num = typeof num === "number" ? num : 0;
	this.x += num;
	this.y += num;
	this.z += num;
	return this;
};

Pseudo3D.Math.Vector.prototype.subtract = function(vector) {
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
	return this;
};

Pseudo3D.Math.Vector.prototype.subractConst = function(num) {
	num = typeof num === "number" ? num : 0;
	this.x -= num;
	this.y -= num;
	this.z -= num;
	return this;
};

Pseudo3D.Math.Vector.prototype.scale = function(s) {
	s = typeof s === "number" ? s : 0;
	this.x *= s;
	this.y *= s;
	this.z *= s;
	return this;
};

Pseudo3D.Math.Vector.prototype.dotProduct = function(vector) {
	vector = vector instanceof Pseudo3D.Math.Vector ? vector : new Pseudo3D.Math.Vector();
	return this.x * vector.x + this.y * vector.y + this.z * vector.z;
};

// make only work with 2d vectors, dont want to try and learn 3d math for this
Pseudo3D.Math.Vector.prototype.angleBetween = function(vector) {

};

Pseudo3D.Math.Vector.prototype.clone = function() {
	return new Pseudo3D.Math.Vector(this.x, this.y, this.z);
};