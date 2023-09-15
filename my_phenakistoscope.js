const SLICE_COUNT = 25;

const colorPalette = [
  [26, 40, 71],
  [252, 230, 198],
  [106, 154, 224],
  [30, 61, 97]
];

let colorIndex = 0;
let backgroundColorIndex = 2;
let num = 1;
let increment = 1;

// Define variables for color shifting
let color1;
let color2;
let color3;
let lerpedColor;
let t = -1;
let lerpingSpeed = 0.0003;

function setup_pScope(pScope) {
  pScope.output_mode(ANIMATED_DISK);
  pScope.scale_for_screen(true);
  pScope.draw_layer_boundaries(false);
  pScope.set_direction(CW);
  pScope.set_slice_count(SLICE_COUNT);

  // Initialize color shifting variables
  color1 = color(colorPalette[1]); // Red
  color2 = color(colorPalette[2]); // Green
  color3 = color(colorPalette[3]); // Blue
}

function setup_layers(pScope) {
  new PLayer(null, 50, 70, 150); // Background layer

  var layer1 = new PLayer(wave);
  layer1.mode(SWIRL(3));
  layer1.set_boundary(200, 1000);

  var layer2 = new PLayer(seagulls);
  layer2.mode(RING);
  layer2.set_boundary(0, 300);

  var layer3 = new PLayer(decorativePattern);
  layer3.mode(SWIRL(5)); // Set the mode for decorativePattern
  layer3.set_boundary(0, 400);
}

function wave(x, y, animation, pScope) {
  push();
  scale(animation.frame * 1.6);
  noStroke();

  let palette = color(colorPalette[colorIndex]);
  fill(palette);
  for (let i = 0; i < 6; i++) {
    num += increment;

    // Check if we need to reverse the pattern
    if (num == 5 || num == 1) {
      increment *= -1; // Reverse the increment direction
    }
    beginShape();
    for (let angle = num * 10; angle <= 360; angle += 10) {
      let xCoord = cos(angle) * (Math.floor(random(100)));
      let yCoord = sin(angle) * (Math.floor(random(50)) + 30) * cos(animation.frame * (Math.floor(random(100))) + angle);
      vertex(xCoord, yCoord);
    }
    endShape(CLOSE);
    translate(0, 10);
  }

  pop();

  colorIndex = (colorIndex + 1) % colorPalette.length;
}

function seagulls(x, y, animation, pScope) {
  num += increment;

  // Check if we need to reverse the pattern
  if (num == 5 || num == 1) {
    increment *= -1; // Reverse the increment direction
  }
  push();
  translate(num * x, num * y);
  noStroke();

  // Randomly select a color from the palette for the seagulls
  let palette = colorPalette[Math.floor(random(colorPalette.length))];
  fill(palette[0], palette[1], palette[2], 200);

  for (let i = 0; i < 5; i++) {
    ellipse(i * Math.floor(random(60)), -30 + cos(frameCount * 0.1 + i * 0.3) * 10, 20, 10);
  }
  pop();

}



function decorativePattern(x, y, animation, pScope) {
  push();
  translate(x, y);

  // Decorative pattern
  let rotationAngle = -300;
  let numShapes = 25;
  let angleIncrement = 360 / numShapes;
  for (let i = 0; i < numShapes; i++) {
    let angle = radians(i * angleIncrement + rotationAngle);
    let radius = 100 + 60 * cos(angle * 6); // Varying radius for an exciting effect
    let shapeX = radius * cos(angle);
    let shapeY = radius * sin(angle);

    // Calculate the interpolated color
    lerpedColor = lerpColor(color1, color2, t);

    // Morphing shapes
    let size = map(sin(angle + animation.frame), -1, 1, 10, 40); // Morphing size
    let rotation = map(cos(angle + animation.frame), -1, 1, 0, PI); // Morphing rotation

    // Changing colors
    fill(lerpedColor); // Use the interpolated color

    push();
    translate(shapeX, shapeY);
    rotate(rotation);
    ellipse(0, 0, size, size); // Decorative shapes
    pop();
  }

  pop();

  // Increment the interpolation variable
  t += lerpingSpeed;

  // Wrap t to keep it within [0, 1]
  if (t > 1) {
    t = 0;
    // Swap colors when one interpolation cycle is complete
    let temp = color1;
    color1 = color2;
    color2 = color3;
    color3 = temp;
  }
}


// Rest of your code remains unchanged