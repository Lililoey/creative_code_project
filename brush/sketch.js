//////////////////////////////////////////////////
// Object for creation and real-time resize of canvas
const C = {
    loaded: false,
    prop() { return this.height / this.width },
    isLandscape() { return window.innerHeight <= window.innerWidth * this.prop() },
    resize() {
        if (this.isLandscape()) {
            document.getElementById(this.css).style.height = "100%";
            document.getElementById(this.css).style.removeProperty('width');
        } else {
            document.getElementById(this.css).style.removeProperty('height');
            document.getElementById(this.css).style.width = "100%";
        }
    },
    setSize(w, h, p, css) {
        this.width = w, this.height = h, this.pD = p, this.css = css;
    },
    createCanvas() {
        this.main = createCanvas(this.width, this.height, WEBGL);
        pixelDensity(this.pD);
        this.main.id(this.css);
        this.resize();
    }
};
C.setSize(3000, 6000, 1, 'mainCanvas');

function windowResized() {
    C.resize();
}

//////////////////////////////////////////////////
// Example starts here

let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];
let hatch_brushes = ["marker", "marker2"];
let stroke_brushes = ["2H", "HB", "charcoal"];

function setup() {
    C.createCanvas();
    angleMode(DEGREES);
    background("#fffceb");
    translate(-width / 2, -height / 2);  // Center the canvas
    frameRate(30);  // Control circle appearance rate
}

function draw() {
    // Generate a random diameter, ensuring the circle fits within the canvas
    let diameter = random(50, 150);

    // Generate random positions within the canvas, accounting for circle size
    let x = random(-width / 2 + diameter / 2, width / 2 - diameter / 2);
    let y = random(-height / 2 + diameter / 2, height / 2 - diameter / 2);

    // Randomly decide whether to fill or stroke the circle
    if (random() < 0.5) {
        brush.fill(random(palette), random(60, 100));
        brush.bleed(random(0.1, 0.4));
        brush.fillTexture(0.55, 0.8);
    } else {
        brush.set(random(stroke_brushes), random(palette));
        brush.setHatch(random(hatch_brushes), random(palette));
        brush.hatch(random(10, 60), random(0, 180), { rand: 0, continuous: false, gradient: false });
    }

    // Draw a circle at the calculated random position
    brush.circle(x, y, diameter);

    // Reset brush state for the next circle
    brush.noStroke();
    brush.noFill();
    brush.noHatch();
}
