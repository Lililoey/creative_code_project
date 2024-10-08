var doSave = false;
var textTyped = 'Hello!';
var font;
var shapeSet = 0;
var module1, module2;
var rotationAngle = 0; // 用来控制旋转角度
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
  let canvasContainer = document.getElementById('canvas-container'); // 从 HTML 中获取一个 id 为 canvas-container 的元素
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(canvasContainer); // 将 p5 canvas 添加到 div 中

  //异步函数asynchronous operations
  //用于导入字体
  opentype.load('data/FreeSans.otf', function(err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f; // 如果字体成功加载，f 就是加载后的字体对象。我们将它赋值给全局global变量 font，以便在其他地方使用该字体进行绘制
    }
  }); // // 当字体加载完成时会调用这个回调函数callback function （只有到了相应条件才会响应的函数）
}

function draw() {
  background(255);
  //noStroke();
  imageMode(CENTER);
  let textWidthValue = textWidth(textTyped); 
  console.log(textWidthValue)
  //rectMode(CENTER);

  //rect(width/2, height/4*3, 100, 50);
  //fill(50);

  
  //判断 textTyped 是否有内容（不是空字符串），以及font变量必须已经成功赋值
  //判断是否有用户输入的文本，并且字体对象是否已经成功加载
  if (textTyped.length > 0 && font != undefined) {
    // get a path from OpenType.js
    var fontPath = font.getPath(textTyped, 0, 0, 140);
    
    // convert it to a g.Path object
    // fontPath.commands用来描述字体的矢量轮廓
    // g.Path 对象可以包含复杂的路径操作和变换方法，比如重新采样、长度计算、绘制等。它使得在路径上绘制图形更加简单和方便。
    var path = new g.Path(fontPath.commands);
    // resample it with equidistant points
    // 这行代码对路径进行重新采样，将路径按固定长度（6 像素）等距地分割成若干个点，以便在这些点上绘制图像
    path = g.resampleByLength(path, 6);

    // 固定直径为20
    var diameter = 20;

    // 增加旋转角度，使其持续旋转
    rotationAngle += 0.028; // 控制旋转速度

    // ------ svg module1 ------
    //console.log(path.commands.length)
    push()
    translate((width / 2) - (textWidthValue / 2), height / 2);  
    for (var i = 0; i < path.commands.length - 1; i++) {
      // 遍历 path.commands 中的所有点（除最后一个），并逐个处理相邻的两个点。
      var pnt = path.commands[i];
      var nextPnt = path.commands[i + 1];

      // 跳过没有坐标的点
      if (!pnt.x || !nextPnt.x) continue;

      // 每三个点放置一个图形
      if (i % 3 == 0) {
        push();
        var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x); // 计算夹角
        translate(pnt.x, pnt.y); // 将图像绘制到路径点的位置
        rotate(angle); // 朝向下一个点
        rotate(rotationAngle); // 自动旋转，不再依赖鼠标
        image(module1, 0, 0, diameter, diameter); // 固定图像大小为20
        pop();
      }

    }
    
    //console.log(textWidth(font))
    // ------ svg module2 ------
    for (var i = 0; i < path.commands.length - 1; i++) {
      var pnt = path.commands[i];
      var nextPnt = path.commands[i + 1];

      // 跳过没有坐标的点
      if (!pnt.x || !nextPnt.x) continue;

      // 每两个点放置一个图形
      if (i % 2 == 0) {
        push();
        var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x);
        translate(pnt.x, pnt.y);
        rotate(angle); // 朝向下一个点
        rotate(-rotationAngle); // 反向自动旋转
        image(module2, 0, 0, diameter, diameter); // 固定图像大小为20
        pop();
      }
    }
    pop();
  }
}


document.getElementById('question').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    let userInput = document.getElementById('question').value;

    if (userInput.trim() !== "") {
      document.getElementById('initial-screen').style.display = 'none';
      document.getElementById('answer-screen').style.display = 'block';
      
      
      let randomAnswerIndex = Math.floor(Math.random()*answers.length);
      let randomAnswer = answers[randomAnswerIndex];
      textTyped = randomAnswer;
    }
  }

  if (event.key === 'Shift') {
    let userInput = document.getElementById('question').value;

    if (userInput.trim() !== "") {
      document.getElementById('answer-screen').style.display = 'block';
      document.getElementById('initial-screen').style.display = 'none';
    }
  }
});

function keyReleased() {
  // 导出 PNG
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

