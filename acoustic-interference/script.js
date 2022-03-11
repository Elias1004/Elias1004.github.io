let speaker1, speaker2, pixelLength, canvas, ctx, scale, lambda;

const init = () => {
  pixelLength = 70; // How many pixels will be drawn each iteration
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  scale = canvas.width / pixelLength;

  speaker1 = {
    x: (pixelLength * 4) / 11,
    y: (pixelLength * 1) / 4,
  };
  speaker2 = {
    x: (pixelLength * 7) / 11,
    y: (pixelLength * 1) / 4,
  };

  document.getElementById("canvas").onmousemove = (e) => {
    var { offsetX: x, offsetY: y, buttons } = e;
    if (buttons) {
      x = x / scale;
      y = y / scale;
      // Move the closer speaker to the mousepos
      if (distance(x, y, speaker1) < distance(x, y, speaker2)) {
        speaker1.x = x;
        speaker1.y = y;
      } else {
        speaker2.x = x;
        speaker2.y = y;
      }
    }
  };

  loop();
};

const distance = (x, y, speaker) => {
  return Math.sqrt(Math.pow(x - speaker.x, 2) + Math.pow(y - speaker.y, 2));
};

const loop = () => {
  lambda = Math.pow(1.02, parseInt(document.getElementById("lambda").value));
  document.getElementById("lambdavalue").innerHTML =
    Math.round(lambda * 1e4) / 1e4 + " Pixel";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < pixelLength; x++) {
    for (let y = 0; y < pixelLength; y++) {
      let dist1 = distance(x, y, speaker1);
      let dist2 = distance(x, y, speaker2);
      let deltaDist = Math.abs(dist1 - dist2);
      let grayScale = Math.abs((2 * (deltaDist % lambda)) / lambda - 1) * 255;
      //let grayScale = 4*Math.pow(((deltaDist%lambda)/lambda - 0.5 ), 2) * 255;
      ctx.fillStyle =
        "rgba(" + grayScale + "," + grayScale + "," + grayScale + ")";

      // Draw the pixel at the canvas position
      ctx.fillRect(x * scale, y * scale, scale + 1, scale + 1);
    }
  }

  ctx.fillStyle = "red";
  //ctx.fillRect(
  //  speaker1.x * scale - scale / 2,
  //  speaker1.y * scale - scale / 2,
  //  scale,
  //  scale
  //);
  //ctx.fillRect(
  //  speaker2.x * scale - scale / 2,
  //  speaker2.y * scale - scale / 2,
  //  scale,
  //  scale
  //);
  ctx.beginPath();
  ctx.arc(speaker1.x * scale, speaker1.y * scale, scale / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(speaker2.x * scale, speaker2.y * scale, scale / 2, 0, Math.PI * 2);
  ctx.fill();
  requestAnimationFrame(loop);
};
