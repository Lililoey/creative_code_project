// Particle system for background
let particles = [];
let trailParticles = [];
let maxTrailParticles = 150;
let ripples = []; // 存储水波纹效果

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Create initial background particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    // Clear background with light color
    background(248, 247, 245, 15);
    
    // Update and display background particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        
        // Remove particles that are offscreen
        if (particles[i].isOffscreen()) {
            particles.splice(i, 1);
        }
    }
    
    // Create new particles occasionally
    if (frameCount % 10 === 0 && particles.length < 120) {
        particles.push(new Particle());
    }
    
    // Update and display mouse trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        trailParticles[i].update();
        trailParticles[i].display();
        
        // Remove faded particles
        if (trailParticles[i].alpha <= 0) {
            trailParticles.splice(i, 1);
        }
    }
    
    // Create trail particles when mouse moves
    if (pmouseX !== mouseX && pmouseY !== mouseY) {
        let newParticle = new TrailParticle(mouseX, mouseY);
        trailParticles.push(newParticle);
        
        // Limit the number of trail particles
        if (trailParticles.length > maxTrailParticles) {
            trailParticles.shift();
        }
    }
    
    // Update and display ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].display();
        
        // Remove completed ripples
        if (ripples[i].isDone()) {
            ripples.splice(i, 1);
        }
    }
}

// Handle mouse click to create water ripple effect
function mousePressed() {
    ripples.push(new Ripple(mouseX, mouseY));
    return false; // Prevent default
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Background particle class
class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(1, 3);
        this.speedX = random(-0.3, 0.3);
        this.speedY = random(-0.3, 0.3);
        
        // Soft, neutral colors for elegant design
        this.color = color(
            random(150, 200), 
            random(150, 200), 
            random(150, 200), 
            random(40, 80)
        );
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Subtle speed change for gentle movement
        if (frameCount % 60 === 0) {
            this.speedX += random(-0.05, 0.05);
            this.speedY += random(-0.05, 0.05);
            
            // Limit speed for calm effect
            this.speedX = constrain(this.speedX, -0.5, 0.5);
            this.speedY = constrain(this.speedY, -0.5, 0.5);
        }
    }
    
    display() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }
    
    isOffscreen() {
        return (
            this.x < -50 || 
            this.x > width + 50 || 
            this.y < -50 || 
            this.y > height + 50
        );
    }
}

// Mouse trail particle class with brighter colors
class TrailParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(3, 8);
        this.alpha = 150;  // 增加初始透明度
        this.fadeSpeed = random(1, 3);
        
        // 更明亮的颜色选择
        // 随机选择一种颜色方案
        const colorScheme = floor(random(4));
        
        switch(colorScheme) {
            case 0: // 明亮的蓝色
                this.color = color(
                    random(30, 100), 
                    random(150, 220), 
                    random(220, 255)
                );
                break;
            case 1: // 明亮的紫色
                this.color = color(
                    random(150, 200), 
                    random(50, 120), 
                    random(200, 255)
                );
                break;
            case 2: // 明亮的绿色
                this.color = color(
                    random(50, 120), 
                    random(180, 255), 
                    random(100, 200)
                );
                break;
            case 3: // 明亮的珊瑚色
                this.color = color(
                    random(220, 255), 
                    random(100, 160), 
                    random(100, 150)
                );
                break;
        }
    }
    
    update() {
        this.alpha -= this.fadeSpeed;
        this.size -= 0.05;
    }
    
    display() {
        noStroke();
        fill(
            red(this.color),
            green(this.color),
            blue(this.color),
            this.alpha
        );
        ellipse(this.x, this.y, this.size);
    }
}

// 更新的水波纹效果类 - 更明亮但透明度更低
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = random(100, 200);
        this.speed = random(1, 3);
        this.strokeWeight = random(0.8, 2);
        this.alpha = 80;  // 降低整体透明度
        this.fadeSpeed = 1.5;  // 稍微减慢淡出速度
        
        // Create multiple rings for each ripple
        this.rings = floor(random(2, 5));
        this.ringSpacing = random(10, 20);
        
        // 更明亮但透明度更低的颜色选择
        const rippleColorScheme = floor(random(4));
        
        switch(rippleColorScheme) {
            case 0: // 明亮的青色
                this.color = color(
                    random(20, 70),
                    random(170, 210),
                    random(200, 230)
                );
                break;
            case 1: // 明亮的蓝紫色
                this.color = color(
                    random(90, 130),
                    random(80, 120),
                    random(180, 220)
                );
                break;
            case 2: // 明亮的绿松石色
                this.color = color(
                    random(40, 80),
                    random(150, 180),
                    random(160, 190)
                );
                break;
            case 3: // 明亮的铜绿色
                this.color = color(
                    random(50, 100),
                    random(140, 180),
                    random(150, 180)
                );
                break;
        }
    }
    
    update() {
        this.radius += this.speed;
        
        // Start fading after radius reaches a certain size
        if (this.radius > this.maxRadius * 0.3) {
            this.alpha -= this.fadeSpeed;
        }
    }
    
    display() {
        for (let i = 0; i < this.rings; i++) {
            let ringRadius = this.radius - (i * this.ringSpacing);
            
            // Only draw rings that have positive radius
            if (ringRadius > 0) {
                noFill();
                stroke(
                    red(this.color),
                    green(this.color),
                    blue(this.color),
                    this.alpha * (1 - i / this.rings * 0.7) // 外环更透明
                );
                strokeWeight(this.strokeWeight * (1 - i / this.rings * 0.5)); // 外环更细
                ellipse(this.x, this.y, ringRadius * 2);
            }
        }
    }
    
    isDone() {
        return this.alpha <= 0;
    }
}