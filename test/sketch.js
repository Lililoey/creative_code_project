let emojiCategories = {
  外貌: ['😀', '🤖', '👩', '🧑', '👨'],
  性格: ['😂', '😡', '🥺', '😎', '🤔'],
  职业: ['👨‍💻', '🧑‍🍳', '👩‍🚀', '🧑‍🔬', '👨‍🎤'],
  故乡: ['🏔️', '🏝️', '🏙️', '🏜️', '🌋']
};

let steps = ["外貌", "性格", "职业", "故乡"];
let currentStep = 0;
let results = {};
let showEmoji = false; // 控制页面切换
let currentEmoji; // 当前生成的 emoji
let fontSize = 8; // ASCII 字母大小
let asciiDensity = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 字母密度
let frameCounter = 0; // 帧计数器
let frameInterval = 8; // ASCII 变化间隔

document.getElementById("startBtn").addEventListener("click", nextStep);

function nextStep() {
  if (!showEmoji) {
    // 显示“生成成功”页面
    let step = steps[currentStep];
    document.getElementById("content").innerHTML = `
      <h1>你的${step}生成成功！</h1>
      <button id="viewBtn">查看</button>
    `;
    document.getElementById("viewBtn").addEventListener("click", () => {
      showEmoji = true;
      nextStep();
    });
  } else {
    // 显示 ASCII 风格 emoji 页面
    let step = steps[currentStep];
    currentEmoji = random(emojiCategories[step]);
    results[step] = currentEmoji;

    document.getElementById("content").innerHTML = `
      <div id="canvasContainer">
        <canvas id="emojiCanvas"></canvas>
      </div>
      <button id="nextBtn">下一步</button>
    `;
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvasContainer");

    document.getElementById("nextBtn").addEventListener("click", () => {
      showEmoji = false;
      currentStep++;
      if (currentStep < steps.length) {
        nextStep();
      } else {
        displayResult();
      }
    });
  }
}

function displayResult() {
  document.getElementById("content").innerHTML = `
    <h1>你的虚拟身份生成完成！</h1>
    <p>外貌：${results["外貌"]}</p>
    <p>性格：${results["性格"]}</p>
    <p>职业：${results["职业"]}</p>
    <p>故乡：${results["故乡"]}</p>
    <button id="restartBtn">重新生成</button>
  `;
  document.getElementById("restartBtn").addEventListener("click", () => location.reload());
}

function draw() {
  if (!currentEmoji) return;

  background(255); // 白色背景
  textSize(fontSize);
  textFont("monospace");
  textAlign(CENTER, CENTER);

  // ASCII 动态变化
  if (frameCounter % frameInterval === 0) {
    asciiDensity = shuffle(asciiDensity.split("")).join("");
  }
  frameCounter++;

  // 创建 ASCII 图像
  let img = createGraphics(120, 120);
  img.pixelDensity(1);
  img.textSize(100);
  img.textAlign(CENTER, CENTER);
  img.fill(0);
  img.background(255);
  img.text(currentEmoji, img.width / 2, img.height / 2);
  img.loadPixels();

  for (let y = 0; y < img.height; y += 2) {
    for (let x = 0; x < img.width; x += 2) {
      let pixelIndex = (x + y * img.width) * 4;
      let r = img.pixels[pixelIndex];
      let g = img.pixels[pixelIndex + 1];
      let b = img.pixels[pixelIndex + 2];
      let brightness = (r + g + b) / 3;
      let charIndex = floor(map(brightness, 0, 255, asciiDensity.length - 1, 0));
      let asciiChar = asciiDensity[charIndex];

      fill(r, g, b);
      text(
        asciiChar,
        x * fontSize / 2 + width / 2 - img.width * fontSize / 4,
        y * fontSize / 2 + height / 2 - img.height * fontSize / 4
      );
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
