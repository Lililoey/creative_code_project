const cam_w = 960;
const cam_h = 720;
let capture;

function setup() {
  angleMode(DEGREES);
  createCanvas(cam_w, cam_h, WEBGL); 
  capture = createCapture(VIDEO, { flipped: true });
  capture.size(cam_w, cam_h);
  capture.hide();
}

function draw() {
  background(255); 
  capture.loadPixels();

  if (capture.pixels.length > 0) {
    mirror();
  }
}

function mirror() {
  const stepSize = 20;

  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      const r = capture.pixels[index];
      const g = capture.pixels[index + 1];
      const b = capture.pixels[index + 2];

      const brightness = (r + g + b) / 3;
      const triangleSize = map(brightness, 0, 255, 5, stepSize * 3);
      const rotationY = map(brightness, 255, 0, 0, 180); 

      push();
      translate(x - width / 2, y - height / 2, 0); 
      rotateY(rotationY); 
      fill(g, r, b);
      noStroke();

      const h = (sqrt(3) / 2) * triangleSize;

      beginShape();
      vertex(-triangleSize / 2, h / 2, 0); 
      vertex(triangleSize / 2, h / 2, 0); 
      vertex(0, -h / 2, 0); 
      endShape(CLOSE);

      pop();
    }
  }
}

//function windowResized(){
  //resizeCanvas(windowWidth, windowHeight);
//}
