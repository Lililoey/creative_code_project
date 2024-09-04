let message = "This is not an error"; // 初始显示的消息
let alternativeMessage = "Move your mouse to explore more"; // 鼠标按下后显示的消息
let showAlternativeMessage = false; // 控制显示哪个消息的标志
let positions = []; // 存储鼠标位置的数组
let maxPositions = 100; // 存储的最大位置数

function setup() {
    createCanvas(windowWidth, windowHeight); // 创建一个全屏画布
    background(255); // 背景颜色设为白色
    textSize(24); // 设置文字大小
    fill(0); // 设置文字颜色为黑色
}

function draw() {
    background(255); // 每帧清除画布

    if (showAlternativeMessage) {
        // 只显示 "Move your mouse to explore more" 一次，并且固定在鼠标位置
        text(alternativeMessage, mouseX, mouseY); // 在当前鼠标位置绘制消息
    } else {
        // 显示并跟随鼠标移动 "This is not an error"
        positions.push(createVector(mouseX, mouseY));

        // 如果位置数组长度超过最大限制，删除最早的位置
        if (positions.length > maxPositions) {
            positions.shift();
        }

        // 绘制存储的每个位置的文字
        for (let i = 0; i < positions.length; i++) {
            let pos = positions[i];
            text(message, pos.x, pos.y); // 在每个存储的位置绘制消息
        }
    }
}

// 当鼠标按下时切换消息显示状态
function mousePressed() {
    showAlternativeMessage = true; // 设置标志为true以显示新消息
    positions = []; // 清空位置数组以移除所有痕迹
}

// 当鼠标释放时恢复默认状态
function mouseReleased() {
    showAlternativeMessage = false; // 释放鼠标时恢复到初始状态
}
