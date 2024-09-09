let eyeImg;

function preload(){
  eyeImg = loadImage("eye.png");
}

function setup() {
  createCanvas(400, 400);

}

function draw() {
  //background(220);
  
  let f = new Face();
  f.display();

}
//blueprint for a Face object
class Face{
  
  //properties
  constructor(){
    this.size = random(30, 60); // only use "this" inside of class
    this.x = random(width);
    this.y = random(height);
    this.skinColor = color(random(256), random(256), random(256));
    this.eyeColor = color(random(256), random(256), random(256));
    this.eyeSize = random(8, 20);
    this.eyeDistance = random(10, 30);
    this.eyeHeight = random(4, 10);

    //random(256) = 0 - 255.99999999
  }
  
  //methods
  display(){
    //draw the face
    fill(this.skinColor)
    ellipse(this.x, this.y, this.size)
    
    //dreaw the eyes
    fill(this.eyeColor)
    image(eyeImg, 
      this.x - this.eyeDistance / 2, 
      this.y - this.eyeHeight, 
      this.eyeSize, this.eyeSize);
    image(eyeImg, 
      this.x + this.eyeDistance / 2, 
      this.y - this.eyeHeight, 
      this.eyeSize, this.eyeSize);
    
  }
  
}