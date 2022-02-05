var print = console.log

var canvas = document.getElementById("canvas")
canvas.width = canvas.height = innerHeight
var ctx = canvas.getContext("2d")
var iterations = 250

var startScale = 6
var scale, beginX, endX, beginY, endY, centerX, centerY

changeAxis(-1,0,startScale)

function draw() {
	for(var x = beginX; x<endX; x += (endX-beginX)/canvas.width) {
		for(var y = beginY; y<endY; y += (endY-beginY)/canvas.height) {
			var pix = getPixel(x,y)
			if(pix === true) { // diverges / black
				ctx.fillStyle = "black"
			} else {
				var offset = 80//40 // how many total different colors should be user
				ctx.fillStyle = "hsl("+(pix%offset/offset*360+180)+", 100%, 50%)"
				
				//var a = (pix%offset/offset*255)+100
				//ctx.fillStyle = "rgb("+a+","+a+","+a+")"
				
				//ctx.fillStyle = "white black".split(" ")[pix%2]
				
				//ctx.fillStyle = "white"
			}
			var canX = (x-beginX)/(endX-beginX)*canvas.width,
				canY = (y-beginY)/(endY-beginY)*canvas.height
				
			ctx.fillRect(Math.round(canX), Math.round(canY), 1, 1)
		}
	}
}

function getPixel(x ,y) {
	var lastA = 0, lastB = 0
	for(var i = 0; i<iterations; i++) {
		// Squared
		var newA = x + lastA**2-lastB**2
		var newB = y + 2*lastA*lastB
		// Cubed
		//var newA = x + lastA**3 - 3*lastA*lastB**2
		//var newB = y - lastB**3 + 3*lastA**2*lastB

		
		lastA = newA
		lastB = newB
		
		if(Math.sqrt(newA*newA + newB*newB) >= 2) {
		//if(newA+newB>=2){
			return i
		}
	}
	return true
}

function changeAxis(cenX, cenY, sc) {
	scale = sc
	centerX = cenX, centerY = cenY
	
	beginX = centerX-scale/2, beginY = centerY-scale/2,
	endX   = centerX+scale/2,   endY = centerY+scale/2
	print(beginX+", "+endX+", "+beginY+", "+endY)
	draw()
} 

canvas.addEventListener("mousedown", function(e) {
	var x = e.offsetX, y = e.offsetY
	
	var canvasX = (x/canvas.width *(endX-beginX) + beginX),
		canvasY = (y/canvas.height*(endY-beginY) + beginY)
	
	changeAxis(canvasX, canvasY, scale/5)
}, false)