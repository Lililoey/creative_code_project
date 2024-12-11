let emojiList = [
  '😀', '😂', '🥰', '😎', '😢', '😡', '🤔', '😴', '🤩', '😇',
  '😜', '😆', '😭', '😱', '😷', '😅', '🤯', '😬', '🤗', '🤐',
  '🥳', '😳', '🤔', '😟', '😮', '😋', '😏', '😤', '🤒', '🤕',
  '🥶', '🥵', '😲', '🥺', '😈', '👿', '💀', '👻', '👽', '🤖',
  '💩', '🔥', '🌈', '⭐️', '🌙', '☀️', '⛄', '🌟', '🍀', '🎉',
  '🎃', '🎈', '🎨', '🎵', '🎶', '🎤', '🎧', '🎸', '🥁', '🎷',
  '🎹', '🎻', '🎺', '🎡', '🎢', '🎠', '🏖️', '🏝️', '🏜️', '🌋'
];
let currentEmoji; // 当前表情符号
let fontSize = 8; // 较小的字体大小
let asciiDensity = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 使用大写字母
let frameInterval = 8; // 字母更新的帧间隔
let frameCounter = 0; // 计数器

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace'); // 使用等宽字体
  textAlign(CENTER, CENTER);
  changeEmoji(); // 设置初始的随机表情符号
}

function draw() {
  background(255); // 白色背景
  textSize(fontSize); // 设置字母大小

  // 仅在达到指定的帧间隔时打乱 asciiDensity
  if (frameCounter % frameInterval === 0) {
    asciiDensity = shuffle(asciiDensity.split('')).join('');
  }
  frameCounter++;

  // 创建表情符号的图像用于 ASCII 转换
  let img = createGraphics(120, 120); // 更高分辨率以获得更多细节
  img.pixelDensity(1); // 确保像素密度一致
  img.textSize(100); // 设置表情符号大小
  img.textAlign(CENTER, CENTER);
  img.fill(0); // 用黑色绘制表情符号
  img.background(255); // 表情符号图形的白色背景
  img.text(currentEmoji, img.width / 2, img.height / 2); // 将表情符号绘制在中心
  img.loadPixels();

  // 使用颜色生成 ASCII 艺术
  for (let y = 0; y < img.height; y += 2) { // 减小步长以实现更紧密的行
    for (let x = 0; x < img.width; x += 2) { // 减小步长以实现更紧密的列
      let pixelIndex = (x + y * img.width) * 4;
      let r = img.pixels[pixelIndex];
      let g = img.pixels[pixelIndex + 1];
      let b = img.pixels[pixelIndex + 2];
      let brightness = (r + g + b) / 3; // 计算亮度
      let charIndex = floor(map(brightness, 0, 255, asciiDensity.length - 1, 0));
      let asciiChar = asciiDensity[charIndex];

      // 用像素的颜色绘制字符
      fill(r, g, b);
      text(asciiChar, 
           x * fontSize / 2 + width / 2 - img.width * fontSize / 4, 
           y * fontSize / 2 + height / 2 - img.height * fontSize / 4);
    }
  }
}

function mousePressed() {
  changeEmoji(); // 点击鼠标更换表情符号
}

function changeEmoji() {
  currentEmoji = random(emojiList); // 随机选取一个表情符号
}

// 打乱数组的辅助函数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
