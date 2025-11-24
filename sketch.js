// used AI for the dampening water effect/oscillations
// Moving clouds reference:
// https://editor.p5js.org/mena-landry/sketches/D7ql4Nd3V

let waterPoints = [];
let totalPoints = 100;
let cloudx = 100;
let cloudy = 100;

let sunStartX = 100;   // start x position of sun
let sunY = 100;        // y position of sun
let sunSpeed = 50;     // pixels per second for movement
let day = true;        // time: track day/night

function setup() {
  createCanvas(700, 600);

  for (let i = 0; i < totalPoints; i++) {
    waterPoints.push({
      x: map(i, 0, totalPoints - 1, 0, width),
      y: height / 2,
      baseY: height / 2,
      velocity: 0
    });
  }
}


function draw() {
  // --- Sun position based on time ---
  let elapsedSeconds = millis() / 1000; // get elapsed time in seconds
  let sunX = sunStartX + elapsedSeconds * sunSpeed;

  // Background changes to black if the sun passes the canvas width
  if (sunX > width) {
    day = false;
  }

  
  //time: day/night background change
  if (day) {
    background(135, 206, 235); // sky blue (day)
  } else {
    background(0); // night
  }

  //draw sun
  fill(255, 204, 0); // bright yellow
  noStroke();
  ellipse(sunX, sunY, 80, 80);

  //cloud movement
  makeCloud(cloudx, cloudy - 50);
  makeCloud(cloudx + 150, cloudy + 100);
  makeCloud(cloudx - 200, cloudy + 50);
  cloudx += 1; // faster speed than before

  //water oscillations
  for (let i = 0; i < totalPoints; i++) {
    let point = waterPoints[i];
    let force = (point.baseY - point.y) * 0.02;
    point.velocity += force;
    point.velocity *= 0.9;
    point.y += point.velocity;
  }

  for (let i = 1; i < totalPoints - 1; i++) {
    let left = waterPoints[i - 1];
    let right = waterPoints[i + 1];
    let current = waterPoints[i];
    let spread = 0.25 * (left.y + right.y - 2 * current.y);
    current.velocity += spread;
  }

  //draw water
  noStroke();
  fill(0, 100, 200, 200);
  beginShape();
  vertex(0, height);
  for (let i = 0; i < totalPoints; i++) {
    vertex(waterPoints[i].x, waterPoints[i].y);
  }
  vertex(width, height);
  endShape(CLOSE);

  //draw 3 islands and tree one aech, later more details on he islands 
  fill(237, 201, 175);
  ellipse(110, 400, 150, 90);
  drawTree(100, 300);

  fill(237, 201, 175);
  ellipse(260, 360, 150, 90);
  drawTree(250, 250);

  fill(237, 201, 175);
  ellipse(185, 500, 150, 90);
  drawTree(175, 400);
}

//water splash effect mouseclick func
function mousePressed() {
  let closestIndex = floor(map(mouseX, 0, width, 0, totalPoints - 1));
  if (closestIndex >= 0 && closestIndex < waterPoints.length) {
    waterPoints[closestIndex].velocity = -15;
  }
}

//cloud draw func
function makeCloud(cx, cy) {
  fill(250);
  noStroke();
  ellipse(cx, cy, 70, 50);
  ellipse(cx + 10, cy + 10, 70, 50);
  ellipse(cx - 20, cy + 10, 70, 50);
}

//tree draw func
function drawTree(x, y) {
  fill(101, 67, 33);
  rect(x, y, 20, 100);
  fill(57, 102, 17);
  ellipse(x + 10, y, 100, 80);
}
