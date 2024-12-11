let emojiCategories = {
  外貌: ['🐶', '🐱', '🐻', '🦊', '🐰', '🐨', '🐻‍❄️', '🐼', '🐣', '🐧', '🦄', '🦞', '🦐', '🪼', '🦑', '🐳', '🐋', '🐠', '🐢', '🦋', '🦉', '👩', '🧑', '👨', '🧑‍🦲', '👩‍🦱', '🧑‍🦱', '👨‍🦱','🤖'],
  性格: ['😀', '🤣', '😋', '😛', '🤩', '🫠', '🫥', '😴', '🤤', '🫣', '😶‍🌫️', '🤯', '😡', '🥵', '🥹', '🥰', '😍', '🥳', '🤓', '🤪'],
  职业: ['🧑‍🎨', '🧑‍🚀', '👩‍✈️', '🧑‍🔬', '👩🏻‍💻', '🧑‍🏫', '👩‍🌾', '👩‍⚕️', '🕵️‍♀️', '💂', '👮', '👷‍♀️', '👮', '🧙‍♀️', '🎅', '🧜‍♀️', '🧝‍♀️', '🧛', '🔮', '📿', '💈', '🩰', '🎨', '🎻', '🎤', '🎺', '🎸', '🎳', '⚽️', '🎣', '🎵'],
  故乡: ['🗽', '🗼', '🌋', '🏜️', '🏝️', '🏖️', '⛰️', '🏔️', '⛩️', '🎠', '⛲️', '🎢', '🖼️', '🏕️', '🏟️', '🏯']
};


let steps = ["外貌", "性格", "职业", "故乡"];
let currentStep = 0;
let results = {};
let showEmoji = false;
let currentEmoji;
let fontSize = 8;
let asciiDensity = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let frameCounter = 0;
let frameInterval = 8;

// Keyboard event listener
document.addEventListener("keydown", handleKey);

function handleKey(event) {
  if (event.key === "Enter" || event.key.toLowerCase() === "w") {
    nextStep();
  } else if (event.key.toLowerCase() === "s") {
    prevStep();
  }
}

function nextStep() {
  if (currentStep >= steps.length) {
    displayResult();
    return;
  }

  if (!showEmoji) {
    // Show image corresponding to the current step
    let stepImages = ["images/1.png", "images/2.png", "images/3.png", "images/4.png"];
    document.getElementById("content").innerHTML = `
      <img id="stepImage" src="${stepImages[currentStep]}" alt="Step ${currentStep + 1}" />
    `;
    showEmoji = true;
  } else {
    // Show ASCII emoji generation
    let step = steps[currentStep];
    currentEmoji = random(emojiCategories[step]);
    results[step] = currentEmoji;

    document.getElementById("content").innerHTML = `
      <div id="canvasContainer"></div>
    `;
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvasContainer");
    canvas.style("display", "block");
    canvas.style("margin", "0 auto");
    canvas.style("position", "absolute");
    canvas.style("top", "50%");
    canvas.style("left", "50%");
    canvas.style("transform", "translate(-50%, -50%)");
    resizeCanvas(windowWidth, windowHeight);

    showEmoji = false;
    currentStep++;
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showEmoji = false;
    nextStep();
  }
}

function displayResult() {
  document.body.style.backgroundColor = "#e6ffe5";
  document.getElementById("content").innerHTML = `
    <h1 style='color: #1b8345;'>Your virtual identity is complete!</h1>
    <p style='color: #1b8345;'>Appearance: ${results["外貌"]}</p>
    <p style='color: #1b8345;'>Personality: ${results["性格"]}</p>
    <p style='color: #1b8345;'>Occupation: ${results["职业"]}</p>
    <p style='color: #1b8345;'>Hometown: ${results["故乡"]}</p>
    <p style='color: #1b8345;'>Press Enter or W to restart!</p>
  `;

  document.addEventListener("keydown", restartToHome, { once: true });
}

function restartToHome(event) {
  if (event.key === "Enter" || event.key.toLowerCase() === "w") {
    document.body.style.backgroundColor = "#e6ffe5";
    document.getElementById("content").innerHTML = `
      <img id="headerImage" src="images/title.png" alt="欢迎图片" />
      <img id="descriptionImage" src="images/description.png" alt="描述图片" />
    `;
    currentStep = 0;
    results = {};
  }
}

function draw() {
  if (!currentEmoji) return;

  background(255); // 白色背景确保没有绿色显示
  textSize(fontSize);
  textFont("monospace");
  textAlign(CENTER, CENTER);

  if (frameCounter % frameInterval === 0) {
    asciiDensity = shuffle(asciiDensity.split("")).join("");
  }
  frameCounter++;

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

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

