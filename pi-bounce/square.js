function Square(x, size, mass, speed, color) {
	this.size = size
	this.x = x
	this.mass = mass
	this.speed = speed
	this.color = color
}

Square.prototype = {
	draw: function (ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, ctx.height-this.size, this.size, this.size)
	},
	
	update: function() {
		this.x += this.speed
		
	},
	
	collide: function(other) {
		return this.x+this.size > other.x && this.speed >= 0
	}
}