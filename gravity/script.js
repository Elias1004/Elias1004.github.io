var print = console.log
var canvas = document.getElementById("canvas")
canvas.width = innerHeight-15, canvas.height = innerHeight-15
var ctx = canvas.getContext("2d")
var particles
var G = 0.1
var amount = 500
var trialLenght = 300// 30/G
var avrgMass = [0, 20]
var avrgVel = 1
var density = 1

/*var seed = 0;
Math.random = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}*/

function Particle(x, y) {
	this.x = x
	this.y = y
	this.velocity = {x: Math.random()*avrgVel-avrgVel/2, y: Math.random()*avrgVel-avrgVel/2}
	this.mass = Math.random()*(avrgMass[1]-avrgMass[0]) + avrgMass[0]
	this.trial = []
}
Particle.prototype = {
	draw: function() {
		ctx.strokeStyle = this.mass > 0? "black":"red"
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius(), 0, 2*Math.PI)
		ctx.stroke()
		
		ctx.moveTo(this.x, this.y)
		ctx.beginPath()
		for(var i = 0; i<this.trial.length; i++) {
			ctx.lineTo(this.trial[i].x, this.trial[i].y)
		}
		ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
		ctx.stroke()
	},
	
	update: function() {
		this.x += this.velocity.x
		this.y += this.velocity.y
		
		this.trial.push({x: this.x, y: this.y})
		
		if(this.trial.length >= trialLenght*Math.abs(this.mass)) {
			this.trial.shift()
		}
		
		var offset = 100
		// Outside of canvas
		if(this.x<-offset || this.x>canvas.width+offset || this.y<-offset || this.y>canvas.height+offset) {
			this.trial = []
		}
		
		//bounce walls
		/*if(this.x < Math.sqrt(Math.abs(this.mass))) {
			this.velocity.x =  Math.abs(this.velocity.x)
		}
		if(this.x > canvas.width-Math.sqrt(Math.abs(this.mass))) {
			this.velocity.x = -Math.abs(this.velocity.x)
		}
		if(this.y < Math.sqrt(Math.abs(this.mass))) {
			this.velocity.y =  Math.abs(this.velocity.y)
		}
		if(this.y > canvas.height-Math.sqrt(Math.abs(this.mass))) {
			this.velocity.y = -Math.abs(this.velocity.y)
		}*/
	},
	
	addForce: function(x, y) {
		this.velocity.x += x / Math.abs(this.mass)
		this.velocity.y += y / Math.abs(this.mass)
	},

	radius: function() {
		return Math.cbrt(Math.abs(this.mass)) / density
	}
}

function init() {
	particles = []
	for(var i = 0; i < amount; i++) {
		quadSize = 1.5 // the size of the field in which the particles spawn in = 1/x
		particles.push(new Particle(Math.random()*canvas.width /quadSize + (canvas.width /2 - canvas.width /quadSize/2),
									Math.random()*canvas.height/quadSize + (canvas.height/2 - canvas.height/quadSize/2)))
	}
	/*var sun = new Particle(canvas.width/2, canvas.height/2)
	var earth = new Particle(sun.x+100, sun.y)
	earth.mass = 0.01
	earth.velocity = {x:0, y:-0.00071525*10000*1.1}
	sun.mass = 3330
	sun.velocity = {x:0, y:0}
	particles.push(sun)
	particles.push(earth)*/
	loop()
}

function loop() {
	draw()
	update()
	requestAnimationFrame(loop)
}

function update() {
	for(var i = 0; i < particles.length; i++) {
		for(var j = i+1; j < particles.length; j++) {
			
			var a = particles[i], b = particles[j]
			
			
			var distance = Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2))
			var force = G*(a.mass*b.mass / (distance**2))
			var angle = Math.atan2(a.y-b.y, a.x-b.x)
			var forceX = Math.cos(angle)*force,
				forceY = Math.sin(angle)*force
			a.addForce(-forceX, -forceY)
			b.addForce(forceX, forceY)
		}
		// Lorenz Kraft
		//var k = .002
		//particles[i].addForce(k*particles[i].velocity.y, -k*particles[i].velocity.x)
	}
	
	for(var i = 0; i < particles.length; i++) {
		for(var j = i+1; j < particles.length; j++) {
			var a = particles[i], b = particles[j]
			// Combine crashing particles
			if(collide(a, b)) {
				particles.splice(i, 1)
				particles.splice(j-1, 1)
				var p = new Particle((a.x*a.mass+b.x*b.mass)/(a.mass+b.mass), (a.y*a.mass+b.y*b.mass)/(a.mass+b.mass))
				p.velocity.x = a.velocity.x*a.mass/(a.mass+b.mass) + b.velocity.x*b.mass/(a.mass+b.mass)
				p.velocity.y = a.velocity.y*a.mass/(a.mass+b.mass) + b.velocity.y*b.mass/(a.mass+b.mass)
				p.mass = a.mass + b.mass
				particles.push(p)
			}
		}
	}
	
	for(var i = 0; i < particles.length; i++) {
		particles[i].update()
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	
	for(var i = 0; i < particles.length; i++) {
		particles[i].draw()
	}
}

function collide(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2)) < a.radius() + b.radius()
}

init()
