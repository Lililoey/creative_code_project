let fireworks = [];
let zoom = 500;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);  // 降低帧率以提高流畅度
  colorMode(HSB);
  stroke(255);
  strokeWeight(4);
  background(0);
}

function draw() {
  // 半透明背景用于制造拖尾效果
  background(0, 0, 0, 50);  // 提高背景透明度，使尾迹清除更快
  
  // 控制视角放大和缩小
  translate(0, 0, zoom);

  // 增加烟花生成的概率，使场景更丰富，但减少烟花的生成量
  if (random(1) < 0.05) {  // 概率减小，减少生成的烟花数量
    fireworks.push(new Firework());
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function mouseWheel(event) {
  zoom += event.delta;  // 通过鼠标滚轮来控制放大和缩小
}

class Firework {
  constructor() {
    this.firework = new Particle(random(-width / 2, width / 2), height / 2, random(-width / 2, width / 2), true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, 0.1, 0));  // 更小的重力
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.1, 0));  // 更小的重力
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    // 增加爆炸后粒子的数量，但减少数量来优化性能
    for (let i = 0; i < 75; i++) {  // 减少粒子数量至 75 个
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.firework.pos.z, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y, z, firework) {
    this.pos = createVector(x, y, z);
    this.firework = firework;
    this.lifespan = 255;

    this.history = [];  // 记录粒子的历史位置

    if (this.firework) {
      this.vel = createVector(0, random(-10, -6), 0);  // 调整上升速度
    } else {
      this.vel = p5.Vector.random3D();
      this.vel.mult(random(2, 8));  // 调整爆炸时的速度范围
    }
    this.acc = createVector(0, 0, 0);
    this.hu = random(255);  // 色相随机
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.95);  // 增加减速效果
      this.lifespan -= 2;  // 调整粒子的生命时间，减少衰减速度
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 记录历史位置
    this.history.push(this.pos.copy());
    
    // 限制历史轨迹的长度，减小计算量
    if (this.history.length > 15) {  // 将轨迹点数减少到 15
      this.history.splice(0, 1);
    }
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    colorMode(HSB);
    
    // 画出曲线轨迹
    noFill();
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      let alpha = map(i, 0, this.history.length, 0, 255);  // 让轨迹尾端渐隐
      strokeWeight(1);  // 将线条调细
      stroke(this.hu, 255, 255, alpha);
      vertex(pos.x, pos.y, pos.z);
    }
    endShape();
    
    // 画出当前的粒子
    if (!this.firework) {
      strokeWeight(1);  // 爆炸粒子轨迹更细
      stroke(this.hu, 255, 255, this.lifespan);  // 饱和度和亮度都设置为 255
    } else {
      strokeWeight(2);  // 烟花上升时稍微粗一点
      stroke(this.hu, 255, 255);  // 提高上升过程中烟花的亮度
    }
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    point(0, 0, 0);
    pop();
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}