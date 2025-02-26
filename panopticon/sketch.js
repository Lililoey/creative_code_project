let angle = 0; // 用户视角旋转角度
let lastMouseX = 0;
let lastMouseY = 0;
let isDragging = false;
let numWatchers = 8; // 监视者数量
let radius = 200; // 监视者围绕的半径
let cam;
let userIndex = 0; // 选定的用户作为视角的长方形索引
let camAngle = 0; // 视角绕用户的旋转角度（左右旋转）
let camVerticalAngle = 0; // 视角的上下旋转角度
let targetCamAngle = 0; // 目标水平角度
let targetCamVerticalAngle = 0; // 目标垂直角度
let camDistance = 30; // 视角离用户长方形前方更偏向圆心的位置
const camAngleLimit = Math.PI / 2; // 限制视角旋转范围（左右 180 度）
const camVerticalLimit = Math.PI / 4; // 限制上下俯仰角度（约 ±45 度）
let camTexture;
let w = 640;
let h = 480;
let handPose;
let video;
let videoGraphics;
let predictions = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30); // 限制帧率提高流畅度
  cam = createCapture(VIDEO);
  cam.size(w, h); // 设置摄像头为标准 9:16 纵向比例
  cam.hide();
  camTexture = createGraphics(90, 160);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  videoGraphics = createGraphics(640, 480, P2D); // 在 P2D 画布中处理视频
  
  handPose = ml5.handpose(video, modelReady);
  handPose.on("predict", gotHandPose);
}

function modelReady() {
  console.log("HandPose model ready!");
}

function gotHandPose(results) {
  predictions = results;
}

function draw() {
  background(30);
  
  // 在 P2D 画布中绘制视频，确保 handpose 正确处理
  videoGraphics.image(video, 0, 0, videoGraphics.width, videoGraphics.height);
  
  // 将摄像头画面正确绘制到 camTexture 以保持比例
  camTexture.image(cam, -55, 0, cam.width/3, cam.height/3);
  
  if (predictions.length > 0) {
    let hand = predictions[0];
    let x = hand.landmarks[9][0]; // 使用食指根部的坐标
    let y = hand.landmarks[9][1];
    
    let normX = map(x, 0, videoGraphics.width, -1, 1);
    let normY = map(y, 0, videoGraphics.height, -1, 1);
    
    targetCamAngle = normX * camAngleLimit;
    targetCamVerticalAngle = normY * camVerticalLimit;
  }
  
  // 使用 lerp 使角度平滑过渡
  camAngle = lerp(camAngle, targetCamAngle, 0.1);
  camVerticalAngle = lerp(camVerticalAngle, targetCamVerticalAngle, 0.1);
  
  let userAngle = TWO_PI / numWatchers * userIndex;
  let userX = cos(userAngle) * radius;
  let userZ = sin(userAngle) * radius;
  
  let camOffsetX = cos(userAngle) * (camDistance - 20);
  let camOffsetZ = sin(userAngle) * (camDistance - 20);
  let camX = userX + camOffsetX + cos(camAngle) * 50;
  let camZ = userZ + camOffsetZ + sin(camAngle) * 50;
  let camY = sin(camVerticalAngle) * 100;
  
  camAngle = constrain(camAngle, -camAngleLimit, camAngleLimit);
  camVerticalAngle = constrain(camVerticalAngle, -camVerticalLimit, camVerticalLimit);
  
  let targetY = sin(camVerticalAngle) * -50;
  camera(camX, camY, camZ, userX, targetY, userZ, 0, 1, 0);
  
  for (let i = 0; i < numWatchers; i++) {
    let a = TWO_PI / numWatchers * i;
    let x = cos(a) * radius;
    let z = sin(a) * radius;
    
    push();
    translate(x +50, 120, z);
    rotateY(HALF_PI - a);
    
    texture(camTexture);
    rectMode(CENTER);
    noStroke()
    rect(0, 0, 90, 160);
    pop();
  }
}
