/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let w = 640;
let h = 480;
let pinchCounter = 0;
let wasPinched = false;
let particles = [];

let options = {
  maxHands: 2,
  flipped: true, // boolean
  runtime: "mediapipe", // also "mediapipe"
  modelType: "lite", // also "lite"
};

function preload() {
  // Load the handPose model
  handPose = ml5.handPose(options);
}

function setup() {
  createCanvas(w, h);
  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(w, h);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    let hand = hands[0];

    let thumbTip = hand.thumb_tip;
    let pointerTip = hand.index_finger_tip;

    let fingerDistance = floor(
      dist(thumbTip.x, thumbTip.y, pointerTip.x, pointerTip.y)
    );

    let fingerMidPointX = (thumbTip.x + pointerTip.x) / 2;
    let fingerMidPointY = (thumbTip.y + pointerTip.y) / 2;
    
    print(fingerDistance)

    if (fingerDistance > 20) {
      for (let k = 0; k < 10; k++) {
        particles.push(
          new Particle(
            (thumbTip.x + pointerTip.x) / 2,
            (thumbTip.y + pointerTip.y) / 2,
            fingerDistance // Passing fingerDistance
          )
        );

      }
    }

    //     for(let i = particles.length - 1; i > 0; i--) {
    //       let p = particles[i]
    //       p.update();
    //       p.display();

    //       if(p.age < 0) {
    //         particles.splice(i, 1)
    //       }
    //     }

    //fill(0, 255, 0)
    //text(pinchCounter, width/2, height/2)

    let lineThickness = map(fingerDistance, 1, 600, 2, 50);
    //strokeWeight(lineThickness)
    //line(thumbTip.x, thumbTip.y, pointerTip.x, pointerTip.y)

    //circle(thumbTip.x, thumbTip.y, 5);
    //circle(pointerTip.x, pointerTip.y, 5);

    // fill(255)
    // stroke(255, 0, 0)
    // strokeWeight(5)
    // textSize(40)
    //text(fingerDistance, (thumbTip.x + pointerTip.x)/2, (thumbTip.y + pointerTip.y)/2);
  }

  //print(particles.length)
  for (let i = particles.length - 1; i > 0; i--) {
    let p = particles[i];
    //print(p)
    p.update();
    p.display();

    if (p.age < 0) {
      particles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key == " ") {
    print(hands);
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

class Particle {
  constructor(x, y, _fingerDistance) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.1, 0.1), -1);
    this.age = 255;
    this.fingerDistance = _fingerDistance;
    this.size = this.fingerDistance /3;
  }

  update() {
    this.pos.add(this.vel);
    this.age--;
  }

  display() {
    fill(200, this.age);
    // noStroke();
    textSize(this.size);
    textAlign(CENTER);
    text("❤️", this.pos.x, this.pos.y);
  }
}
