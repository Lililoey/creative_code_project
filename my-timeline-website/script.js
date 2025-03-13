let timeline = [
    { semester: "Summer 2025", events: ["Off-campus internship (3 months)"] },
    { semester: "Fall 2025", events: ["Real Time 3D (Alan Kwan)", "Real Time (James Connolly)", "Artificial Intelligence (Douglas Rosman)", "Designing Interaction", "Music in Modern Cinema"] },
    { semester: "Winter 2025", events: [] },
    { semester: "Spring 2026", events: ["Gap Semester"] },
    { semester: "Summer 2026", events: ["Off-campus internship (6 months)"] },
    { semester: "Fall 2026", events: ["VCS", "Arthis", "Focus on the Ceramic 3D Printer", "Robotics (Dan Miller)", "BioArt Studio (considering)"] },
    { semester: "Winter 2026", events: ["Neon Techniques (Kacie Lees)"] },
    { semester: "Spring 2027", events: ["Senior Capstone", "Arthis", "Studio (TBD)", "Advanced Art and Technology Projects (Douglas Rosman)"] },
    { semester: "GRADUATION!", events: ["Click to celebrate!"], isGraduation: true }
];

let circles = [];
let offsetX = 0;
let dragging = false;
let lastMouseX = 0;
let bgGradient;
let nodeSize = 40;

// Variables for graduation celebration animation
let celebrating = false;
let celebrationStartTime = 0;
let fireworks = [];
let congratsOpacity = 0;
let bgFadeOut = 0;

function setup() {
    let canvas = createCanvas(window.innerWidth * 0.9, 500);
    canvas.parent("canvas-container");
    
    let startX = 200;
    let startY = height / 2;
    let spacing = width / 5;

    for (let i = 0; i < timeline.length; i++) {
        circles.push({
            x: startX + i * spacing,
            y: startY,
            semester: timeline[i].semester,
            events: timeline[i].events,
            hovered: false,
            isGraduation: timeline[i].isGraduation || false
        });
    }

    // Create a green gradient background
    bgGradient = drawingContext.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#2E7D32"); // Dark green
    bgGradient.addColorStop(1, "#81C784"); // Light green
    
    // Ensure timeline is initially centered
    if (circles.length > 0) {
        offsetX = (width - (circles[circles.length-1].x - circles[0].x + 400)) / 2;
    }
}

function draw() {
    // Clear canvas
    clear();
    
    if (celebrating) {
        drawCelebration();
    } else {
        drawTimeline();
    }
}

function drawTimeline() {
    // Set background
    drawingContext.fillStyle = bgGradient;
    drawingContext.fillRect(0, 0, width, height);
    
    push();
    translate(offsetX, 0);
    
    // Draw line
    stroke(255, 255, 255, 150);
    strokeWeight(4);
    line(circles[0].x - 100, height / 2, circles[circles.length - 1].x + 100, height / 2);
    
    // Draw timeline nodes and labels
    for (let i = 0; i < circles.length; i++) {
        let c = circles[i];
        
        // Draw connection lines
        if (i < circles.length - 1) {
            stroke(255, 255, 255, 100);
            strokeWeight(3);
            line(c.x, c.y, circles[i+1].x, circles[i+1].y);
        }
        
        // Draw node
        noStroke();
        
        // Special styling for graduation node
        if (c.isGraduation) {
            // Draw a star shape instead of a circle
            drawingContext.shadowBlur = c.hovered ? 25 : 15;
            drawingContext.shadowColor = c.hovered ? "#FFEB3B" : "rgba(0,0,0,0.3)"; // Yellow hover for graduation
            
            fill(c.hovered ? "#FFEB3B" : "#4CAF50"); // Green with yellow hover
            push();
            translate(c.x, c.y);
            
            // Draw a star
            beginShape();
            for (let j = 0; j < 10; j++) {
                let radius = j % 2 === 0 ? nodeSize : nodeSize/2;
                let angle = j * TWO_PI / 10 - HALF_PI;
                vertex(radius * cos(angle), radius * sin(angle));
            }
            endShape(CLOSE);
            
            pop();
        } else {
            // Glow effect for hovered nodes
            if (c.hovered) {
                drawingContext.shadowBlur = 20;
                drawingContext.shadowColor = "#8BC34A"; // Light green glow
                fill(139, 195, 74, 230); // Light green fill
            } else {
                drawingContext.shadowBlur = 10;
                drawingContext.shadowColor = "rgba(0,0,0,0.3)";
                fill(46, 125, 50, 230); // Dark green fill
            }
            
            ellipse(c.x, c.y, nodeSize, nodeSize);
        }
        
        drawingContext.shadowBlur = 0;
        
        // Draw semester label
        fill(255);
        textAlign(CENTER);
        textSize(14);
        textStyle(BOLD);
        
        // Special styling for graduation text
        if (c.isGraduation) {
            textSize(16);
            fill("#FFEB3B"); // Yellow text for graduation
            text(c.semester, c.x, c.y - 35);
        } else {
            text(c.semester, c.x, c.y - 30);
        }
        
        // Draw events popup for hovered nodes
        if (c.hovered) {
            let boxWidth = 250;
            let lineHeight = 20;
            let boxHeight = c.events.length * lineHeight + 40;
            if (c.events.length === 0) boxHeight = 60;
            
            // Draw box with gradient
            let eventBoxGradient;
            
            if (c.isGraduation) {
                eventBoxGradient = drawingContext.createLinearGradient(0, c.y - 100, 0, c.y - 100 + boxHeight);
                eventBoxGradient.addColorStop(0, "rgba(76, 175, 80, 0.95)"); // Green graduation box
                eventBoxGradient.addColorStop(1, "rgba(139, 195, 74, 0.9)"); // Lighter green
            } else {
                eventBoxGradient = drawingContext.createLinearGradient(0, c.y - 100, 0, c.y - 100 + boxHeight);
                eventBoxGradient.addColorStop(0, "rgba(27, 94, 32, 0.95)"); // Dark green box
                eventBoxGradient.addColorStop(1, "rgba(56, 142, 60, 0.9)"); // Medium green
            }
            
            drawingContext.fillStyle = eventBoxGradient;
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = "rgba(0,0,0,0.5)";
            
            rect(c.x - boxWidth/2, c.y - 100, boxWidth, boxHeight, 10);
            drawingContext.shadowBlur = 0;
            
            // Draw events text
            fill(255);
            textAlign(CENTER, TOP);
            
            if (c.isGraduation) {
                textSize(18);
                text("Graduation Day!", c.x, c.y - 90);
                
                textSize(14);
                textStyle(NORMAL);
                text("Click to celebrate your achievement!", c.x, c.y - 60);
            } else {
                textSize(16);
                text(c.semester + " Courses", c.x, c.y - 90);
                
                textSize(13);
                textStyle(NORMAL);
                if (c.events.length > 0) {
                    for (let j = 0; j < c.events.length; j++) {
                        text(c.events[j], c.x, c.y - 65 + j * lineHeight);
                    }
                } else {
                    text("No courses scheduled", c.x, c.y - 65);
                }
            }
        }
    }
    pop();
    
    // Draw instruction hint
    fill(255, 255, 255, 150);
    textSize(12);
    textAlign(LEFT);
    text("Drag timeline or click nodes to edit courses", 20, height - 20);
}

function drawCelebration() {
    let elapsedTime = millis() - celebrationStartTime;
    
    // Gradually fade background to white
    bgFadeOut = min(255, elapsedTime / 20);
    background(bgFadeOut);
    
    // Show congratulation text
    if (elapsedTime > 500 && elapsedTime < 6500) {
        congratsOpacity = constrain(map(elapsedTime, 500, 2000, 0, 255), 0, 255);
        if (elapsedTime > 5000) {
            congratsOpacity = constrain(map(elapsedTime, 5000, 6500, 255, 0), 0, 255);
        }
        
        textAlign(CENTER, CENTER);
        textSize(60);
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = "rgba(0,0,0,0.3)";
        
        // Rainbow gradient text - KEEPING ORIGINAL
        let textGradient = drawingContext.createLinearGradient(width/2 - 200, height/2, width/2 + 200, height/2);
        textGradient.addColorStop(0, "rgba(255, 0, 0, " + congratsOpacity/255 + ")");
        textGradient.addColorStop(0.2, "rgba(255, 165, 0, " + congratsOpacity/255 + ")");
        textGradient.addColorStop(0.4, "rgba(255, 255, 0, " + congratsOpacity/255 + ")");
        textGradient.addColorStop(0.6, "rgba(0, 128, 0, " + congratsOpacity/255 + ")");
        textGradient.addColorStop(0.8, "rgba(0, 0, 255, " + congratsOpacity/255 + ")");
        textGradient.addColorStop(1, "rgba(75, 0, 130, " + congratsOpacity/255 + ")");
        
        drawingContext.fillStyle = textGradient;
        drawingContext.font = "bold 60px Poppins";
        drawingContext.textAlign = "center";
        drawingContext.fillText("CONGRATULATIONS!", width/2, height/2);
        
        textSize(24);
        fill(100, 100, 100, congratsOpacity); // Keeping original text color
        text("You've Graduated!", width/2, height/2 + 60);
    }
    
    // Create fireworks
    if (elapsedTime < 6000 && random() < 0.1) {
        createFirework();
    }
    
    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        let fw = fireworks[i];
        fw.update();
        fw.draw();
        
        if (fw.particles.length === 0 && fw.exploded) {
            fireworks.splice(i, 1);
        }
    }
    
    // End celebration after 7 seconds
    if (elapsedTime > 7000) {
        celebrating = false;
        fireworks = [];
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = height;
        this.targetX = x;
        this.targetY = y;
        this.speed = random(3, 6);
        this.angle = atan2(this.targetY - this.y, this.targetX - this.x);
        this.particles = [];
        this.exploded = false;
        // Keeping original random colors for fireworks
        this.color = color(random(255), random(255), random(255));
    }
    
    update() {
        if (!this.exploded) {
            this.x += cos(this.angle) * this.speed;
            this.y += sin(this.angle) * this.speed;
            
            let d = dist(this.x, this.y, this.targetX, this.targetY);
            if (d < 10) {
                this.explode();
            }
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].lifespan <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    draw() {
        if (!this.exploded) {
            fill(this.color);
            noStroke();
            ellipse(this.x, this.y, 8, 8);
        } else {
            for (let p of this.particles) {
                p.draw();
            }
        }
    }
    
    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            let p = new Particle(this.x, this.y, this.color);
            this.particles.push(p);
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(1, 5));
        this.lifespan = 255;
        this.decay = random(2, 5);
    }
    
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.03; // gravity
        this.lifespan -= this.decay;
    }
    
    draw() {
        if (this.lifespan > 0) {
            fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
            noStroke();
            ellipse(this.x, this.y, 4, 4);
        }
    }
}

function createFirework() {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.1, height * 0.6);
    fireworks.push(new Firework(x, y));
}

function startCelebration() {
    celebrating = true;
    celebrationStartTime = millis();
    fireworks = [];
    congratsOpacity = 0;
    bgFadeOut = 0;
    
    // Create a few initial fireworks
    for (let i = 0; i < 3; i++) {
        createFirework();
    }
}

function mouseMoved() {
    if (celebrating) return;
    
    let hoveredAny = false;
    for (let c of circles) {
        let d = dist(mouseX - offsetX, mouseY, c.x, c.y);
        c.hovered = d < (c.isGraduation ? nodeSize : nodeSize/2);
        if (c.hovered) hoveredAny = true;
    }
    
    // Change cursor if hovering over a node
    cursor(hoveredAny ? HAND : DEFAULT);
}

function mousePressed() {
    if (celebrating) return;
    
    let hoveredAny = false;
    for (let c of circles) {
        if (dist(mouseX - offsetX, mouseY, c.x, c.y) < (c.isGraduation ? nodeSize : nodeSize/2)) {
            hoveredAny = true;
            break;
        }
    }
    
    if (!hoveredAny) {
        dragging = true;
        lastMouseX = mouseX;
    }
}

function mouseDragged() {
    if (celebrating || !dragging) return;
    
    offsetX += mouseX - lastMouseX;
    
    // Limit dragging to prevent going too far
    let leftLimit = width - (circles[circles.length-1].x + 100);
    let rightLimit = 100 - circles[0].x;
    
    offsetX = constrain(offsetX, leftLimit, rightLimit);
    
    lastMouseX = mouseX;
}

function mouseReleased() {
    dragging = false;
}

function mouseClicked() {
    if (celebrating) return;
    
    for (let c of circles) {
        let d = dist(mouseX - offsetX, mouseY, c.x, c.y);
        
        if (d < (c.isGraduation ? nodeSize : nodeSize/2)) {
            if (c.isGraduation) {
                startCelebration();
            } else {
                let eventsStr = c.events.length > 0 ? c.events.join(", ") : "";
                let newEvent = prompt(`Edit courses for ${c.semester}:`, eventsStr);
                if (newEvent !== null) {
                    c.events = newEvent.split(",").map(e => e.trim()).filter(e => e.length > 0);
                }
            }
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth * 0.9, 500);
    
    // Recalculate positions
    let startX = 200;
    let startY = height / 2;
    let spacing = width / 5;
    
    for (let i = 0; i < timeline.length; i++) {
        circles[i].x = startX + i * spacing;
        circles[i].y = startY;
    }
    
    // Update gradient
    bgGradient = drawingContext.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#2E7D32"); // Dark green
    bgGradient.addColorStop(1, "#81C784"); // Light green
    
    // Re-center timeline
    if (circles.length > 0) {
        offsetX = (width - (circles[circles.length-1].x - circles[0].x + 400)) / 2;
    }
}