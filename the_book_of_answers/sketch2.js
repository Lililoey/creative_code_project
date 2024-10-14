var doSave = false;
var textTyped = 'Hello!';
var font;
var shapeSet = 0;
var module1, module2;
var rotationAngle = 0; // 控制旋转角度
var rotationSpeed = 0.05; // 固定的旋转速度
let answers = [
  "Focus on the moment",
  "Asking advice from others",
  "It doesn't matter.",
  "Always think twice",
  "Stay focused.",
  "Trying different paths",
  "Take time to reflect and find the answers within",
  "Trust your original thought",
  "Get it in writing",
  "Proceed at a more relaxed pace",
  "Trust your intuition",
  "Of course",
  "There is no guarantee",
  "A year from now it won't matter",
  "Give it all you're got",
  "Try a more unlikely solution",
  "Shift your focus",
  "Your actions will improve things",
  "The opportunity for you is coming soon",
  "Save your energy",
  "Collaboration will be the key"
];

function preload() {
  module1 = loadImage('data/C_03.svg');
  module2 = loadImage('data/C_04.svg');
}

function setup() {
  let canvasContainer = document.getElementById('canvas-container');
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(canvasContainer);

  // 异步加载字体
  opentype.load('data/FreeSans.otf', function(err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
    }
  });
}

// 手动计算路径的边界框
function getPathBoundingBox(path) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (let command of path.commands) {
    if (command.x !== undefined && command.y !== undefined) {
      minX = Math.min(minX, command.x);
      minY = Math.min(minY, command.y);
      maxX = Math.max(maxX, command.x);
      maxY = Math.max(maxY, command.y);
    }
  }

  return {
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// 固定字体大小并根据屏幕宽度换行，考虑左右边距
function draw() {
  background(255);
  imageMode(CENTER);
  
  let fontSize = 140; // 固定字体大小
  let lineHeight = fontSize * 1.2; // 行高
  let yPos = height / 4; // 初始 y 位置，保证文字可以居中
  let margin = 40; // 左右边距
  
  if (textTyped.length > 0 && font != undefined) {
    let currentLine = ''; // 当前行的文字
    let lineWidth = 0; // 当前行的宽度
    let spaceWidth = font.getAdvanceWidth(' ', fontSize); // 空格的宽度
    let maxWidth = width - margin * 2; // 最大可用宽度，去掉左右边距

    for (let char of textTyped) {
      // 计算每个字符的宽度
      let charWidth = font.getAdvanceWidth(char, fontSize);

      if (lineWidth + charWidth < maxWidth) { // 在允许范围内，添加字符
        currentLine += char;
        lineWidth += charWidth;
      } else {
        renderLine(currentLine, fontSize, yPos, margin, maxWidth); // 渲染当前行
        yPos += lineHeight; // 移动到下一行
        currentLine = char; // 当前字符放到新的一行
        lineWidth = charWidth;
      }
    }

    // 渲染最后一行
    if (currentLine.length > 0) {
      renderLine(currentLine, fontSize, yPos, margin, maxWidth);
    }

    // 更新旋转角度，限制角度在 0 到 TWO_PI 之间
    rotationAngle = (rotationAngle + rotationSpeed) % TWO_PI;
  }
}

// 渲染一行文字，考虑左右边距
function renderLine(line, fontSize, yPos, margin, maxWidth) {
  var fontPath = font.getPath(line, 0, 0, fontSize);
  var path = new g.Path(fontPath.commands);
  path = g.resampleByLength(path, 6);

  // 计算路径宽度并居中
  var boundingBox = getPathBoundingBox(path);
  var pathWidth = boundingBox.width;

  push();
  // 将文本放在左右边距内并水平居中
  translate(margin + (maxWidth - pathWidth) / 2, yPos); 
  var diameter = 20; // 图像直径

  // 绘制 module1 SVG
  for (let i = 0; i < path.commands.length - 1; i++) {
    var pnt = path.commands[i];
    var nextPnt = path.commands[i + 1];
    if (!pnt.x || !nextPnt.x) continue;

    if (i % 3 == 0) {
      push();
      var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x); // 计算角度
      translate(pnt.x, pnt.y);
      rotate(angle);
      rotate(rotationAngle); // 旋转图像
      image(module1, 0, 0, diameter, diameter); // 绘制 module1
      pop();
    }
  }

  // 绘制 module2 SVG
  for (let i = 0; i < path.commands.length - 1; i++) {
    var pnt = path.commands[i];
    var nextPnt = path.commands[i + 1];
    if (!pnt.x || !nextPnt.x) continue;

    if (i % 2 == 0) {
      push();
      var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x);
      translate(pnt.x, pnt.y);
      rotate(angle);
      rotate(-rotationAngle); // 反向旋转
      image(module2, 0, 0, diameter, diameter); // 绘制 module2
      pop();
    }
  }
  pop();
}

// 监听输入框按键事件
document.getElementById('question').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    let userInput = document.getElementById('question').value;

    if (userInput.trim() !== "") {
      document.getElementById('initial-screen').style.display = 'none';
      document.getElementById('answer-screen').style.display = 'block';
      
      let randomAnswerIndex = Math.floor(Math.random() * answers.length);
      let randomAnswer = answers[randomAnswerIndex];
      textTyped = randomAnswer;
    }
  }
});

document.getElementById('try-again-button').addEventListener('click', function() {
    // 隐藏答案界面，显示问题输入界面
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('initial-screen').style.display = 'block';
  
    // 清空输入框内容
    document.getElementById('question').value = '';
  
    // 保持原有布局，确保位置不变
    textTyped = ''; // 清除上一次的答案
  });
  
  

//function keyReleased() {
    // 导出 PNG
    //if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
  //}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
