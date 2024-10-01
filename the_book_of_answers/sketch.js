var doSave = false;
var textTyped = 'Hello!';
var font;
var shapeSet = 0;
var module1, module2;
var rotationAngle = 0; // 用来控制旋转角度

function preload() {
  module1 = loadImage('data/C_03.svg');
  module2 = loadImage('data/C_04.svg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  opentype.load('data/FreeSans.otf', function(err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
    }
  });
}

function draw() {
  background(255);
  noStroke();
  imageMode(CENTER);

  // margin border
  translate(60, 300);

  if (textTyped.length > 0 && font != undefined) {
    // get a path from OpenType.js
    var fontPath = font.getPath(textTyped, 0, 0, 200);
    // convert it to a g.Path object
    var path = new g.Path(fontPath.commands);
    // resample it with equidistant points
    path = g.resampleByLength(path, 6);

    // 固定直径为20
    var diameter = 20;

    // 增加旋转角度，使其持续旋转
    rotationAngle += 0.028; // 控制旋转速度

    // ------ svg module1 ------
    for (var i = 0; i < path.commands.length - 1; i++) {
      var pnt = path.commands[i];
      var nextPnt = path.commands[i + 1];

      // 跳过没有坐标的点
      if (!pnt.x || !nextPnt.x) continue;

      // 每三个点放置一个图形
      if (i % 3 == 0) {
        push();
        var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x);
        translate(pnt.x, pnt.y);
        rotate(angle); // 朝向下一个点
        rotate(rotationAngle); // 自动旋转，不再依赖鼠标
        image(module1, 0, 0, diameter, diameter); // 固定图像大小为20
        pop();
      }
    }

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
  }
}

function keyReleased() {
  // 导出 PNG
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
}
