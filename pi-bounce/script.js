var ctx, square1, square2, totalCollisions = 0, repPerLoop = 10000, print = console.log
function init() {
	canvas = document.getElementById("canvas")
	ctx = canvas.getContext("2d")
	ctx.width = canvas.width, ctx.height = canvas.height
	
	var massDiff = 100**5

	square1 = new Square(400,  50, 1, 0, "red")
	square2 = new Square(800, 100, 1*massDiff, -1/repPerLoop, "blue")
	
	
	loop()
}

function loop() {
	ctx.clearRect(0, 0, ctx.width, ctx.height)
	
	square1.draw(ctx)
	square2.draw(ctx)
	
	for(var i = 0; i<repPerLoop; i++) {
		square1.update()
		square2.update()

		if(square1.collide(square2)) {
			// elastic collision
			document.getElementById("text").innerHTML = "Collions = " + ++totalCollisions
			speed1 = square1.speed
			speed2 = square2.speed
			square1.speed = (square1.mass-square2.mass)/(square1.mass+square2.mass) * speed1
										+2*square2.mass/(square1.mass+square2.mass) * speed2

			square2.speed = 2*square1.mass/(square1.mass+square2.mass) * speed1
			  -(square1.mass-square2.mass)/(square1.mass+square2.mass) * speed2
		}

		if(square1.x < 0) {
			document.getElementById("text").innerHTML = "Collions = " + ++totalCollisions
			square1.speed *= -1
		}
	}
	
	setTimeout(loop, 0)
}