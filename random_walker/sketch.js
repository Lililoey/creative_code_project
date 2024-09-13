var x;
var y;
var z;
let points = []; // 用于存储生成的点及其位置和颜色
let stepSize = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  x = 0;
  y = 0;
  z = 0;
}

function draw() {
  orbitControl();
  background(0); // 保持黑色背景，模拟宇宙效果

  // 绘制所有存储的点，形成轨迹
  push();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    stroke(p.color); // 为每个点设置存储的颜色
    strokeWeight(5); // 调整点的大小，使它们更明显
    point(p.x, p.y, p.z); // 绘制之前的所有点，留下痕迹
  }
  pop();

  // 随机生成一个新点的坐标
  var r = floor(random(6));
  switch (r) {
    case 0:
      x = x + 5;
      break;
    case 1:
      x = x - 5;
      break;
    case 2:
      y = y + 5;
      break;
    case 3:
      y = y - 5;
      break;
    case 4:
      z = z + 5;
      break;
    case 5:
      z = z - 5;
      break;
  }

  // 随机生成一个荧光色（高饱和度和亮度）
  let randomColor = color(random(100, 255), random(100, 255), random(100, 255));

  // 将新的点和颜色添加到points数组中
  points.push({ x: x, y: y, z: z, color: randomColor });

  // 绘制当前随机生成的点并设置颜色
  stroke(randomColor);
  strokeWeight(10); // 调整当前点的大小
  point(x, y, z);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
