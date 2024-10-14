var doSave = false;
var textTyped = 'Hello!';
var font;
var shapeSet = 0;
var module1, module2;
var rotationAngle = 0; // 控制旋转角度
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

function draw() {
  background(255);
  imageMode(CENTER);
  
  // 只有在用户输入的文字和字体加载完成后才进行绘制
  if (textTyped.length > 0 && font != undefined) {
    var fontPath = font.getPath(textTyped, 0, 0, 140); // 获取字体路径
    var path = new g.Path(fontPath.commands); // 将字体路径转换为 g.Path 对象
    path = g.resampleByLength(path, 6); // 等距重新采样路径

    var boundingBox = getPathBoundingBox(path); // 计算路径的边界框
    var pathWidth = boundingBox.width; // 获取路径宽度

    // 计算居中偏移量
    translate((width / 2) - (pathWidth / 2), height / 2);

    var diameter = 20; // 图像直径
    rotationAngle += 0.028; // 控制旋转角度

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
  }
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

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
