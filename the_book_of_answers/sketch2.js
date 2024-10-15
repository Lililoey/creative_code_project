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
  "It doesn't matter",
  "Always think twice",
  "Stay focused",
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

  // 初始绑定：在 question 页面按 Enter 跳转到 answer 页面
  bindQuestionPage();
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
  background(255);  // 白色背景
  imageMode(CENTER);

  let fontSize = 140;  // 固定字体大小
  let lineHeight = fontSize * 1.2;  // 行高
  let margin = 40;  // 左右边距
  let maxWidth = width - margin * 2;  // 最大可用宽度，去掉左右边距

  // 计算文本的总高度，以便居中
  let numLines = Math.ceil(textTyped.length / (maxWidth / fontSize));  // 估算总行数
  let totalTextHeight = numLines * lineHeight;  // 总文本高度
  let yPos = (height - totalTextHeight / 4) / 2;  // 垂直居中起始位置

  if (textTyped.length > 0 && font != undefined) {
    // 按单词分割文本
    let words = textTyped.split(' ');
    let currentLine = '';  // 当前行的文字
    let lineWidth = 0;  // 当前行的宽度
    let spaceWidth = font.getAdvanceWidth(' ', fontSize);  // 空格的宽度

    for (let word of words) {
      let wordWidth = font.getAdvanceWidth(word, fontSize);  // 计算单词的宽度

      if (lineWidth + wordWidth + spaceWidth < maxWidth) {
        // 如果当前行可以放下该单词，则添加到当前行
        currentLine += word + ' ';
        lineWidth += wordWidth + spaceWidth;
      } else {
        // 当前行放不下该单词，则渲染当前行并换行
        renderLine(currentLine.trim(), fontSize, yPos, margin, maxWidth);  // 渲染当前行
        yPos += lineHeight;  // 移动到下一行
        currentLine = word + ' ';  // 当前单词放到新的一行
        lineWidth = wordWidth + spaceWidth;
      }
    }

    // 渲染最后一行
    if (currentLine.length > 0) {
      renderLine(currentLine.trim(), fontSize, yPos, margin, maxWidth);
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

// 用命名函数处理 question 页面行为
function handleQuestionPageEnter(event) {
  if (event.key === 'Enter') {
    let userInput = document.getElementById('question').value;
    if (userInput.trim() !== "") {
      // 切换到答案页面
      document.getElementById('initial-screen').style.display = 'none';
      document.getElementById('answer-screen').style.display = 'block';

      let randomAnswerIndex = Math.floor(Math.random() * answers.length);
      let randomAnswer = answers[randomAnswerIndex];
      textTyped = randomAnswer;

      // 解绑 question 页面的 Enter 事件并绑定 answer 页面的事件
      unbindQuestionPage();
      bindAnswerPage();
    }
  }
}

// 用命名函数处理 answer 页面行为
function handleAnswerPageEnter(event) {
  if (event.key === 'Enter') {
    // 隐藏答案界面，显示问题输入界面
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('initial-screen').style.display = 'block';
  
    // 清空输入框内容
    document.getElementById('question').value = '';
    textTyped = ''; // 清除上一次的答案

    // 解绑 answer 页面的 Enter 事件并绑定 question 页面的事件
    unbindAnswerPage();
    bindQuestionPage();
  }
}

// 绑定 question 页面按 Enter 键行为
function bindQuestionPage() {
  document.addEventListener('keypress', handleQuestionPageEnter);
}

// 解绑 question 页面的按键事件
function unbindQuestionPage() {
  document.removeEventListener('keypress', handleQuestionPageEnter);
}

// 绑定 answer 页面按 Enter 键行为
function bindAnswerPage() {
  document.addEventListener('keypress', handleAnswerPageEnter);
}

// 解绑 answer 页面的按键事件
function unbindAnswerPage() {
  document.removeEventListener('keypress', handleAnswerPageEnter);
}

function keyReleased() {
  // 导出 PNG
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
