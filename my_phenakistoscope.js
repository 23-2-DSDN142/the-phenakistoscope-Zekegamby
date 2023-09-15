const SLICE_COUNT = 10;
let rotationAngle = 0;
let circlePositions = [];

function setup_pScope(pScope){
  pScope.output_mode(ANIMATED_DISK);
  pScope.scale_for_screen(true);
  pScope.draw_layer_boundaries(true);
  pScope.set_direction(CCW);
  pScope.set_slice_count(SLICE_COUNT);
}

function setup_layers(pScope){
  new PLayer(null, 220);  // Background layer
  var layer1 = new PLayer(centralElement);
  layer1.mode( SWIRL(5) );
  layer1.set_boundary( 200, 1000 );
  var layer2 = new PLayer(decorativePattern);
  layer2.mode( RING );
  layer2.set_boundary( 0, 400 );
}

function centralElement(x, y, animation, pScope){
  push();
  translate(x, y);
  rotate(radians(rotationAngle));
  scale(animation.frame * 2);

  fill(25, 100, 100); // Red color for central element
  ellipse(0, 0, 60, 60); // Central rotating element

  pop();

  rotationAngle += 1; // Rotate the central element
}

function decorativePattern(x, y, animation, pScope){
  push();
  translate(x, y);

  // Decorative pattern
  let numShapes = 12;
  let angleIncrement = 360 / numShapes;
  for (let i = 0; i < numShapes; i++) {
    let angle = radians(i * angleIncrement + rotationAngle);
    let radius = 100 + 60 * cos(angle * 6); // Varying radius for an exciting effect
    let shapeX = radius * cos(angle);
    let shapeY = radius * sin(angle);
    
    // Morphing shapes
    let size = map(sin(angle + animation.frame), -1, 1, 10, 40); // Morphing size
    let rotation = map(cos(angle + animation.frame), -1, 1, 0, PI); // Morphing rotation
    
    // Changing colors
    let hue = (i * 30 * 10) % 360; // Changing hue
    fill(hue, 10, 80); // Random hue, full saturation, and brightness
    
    push();
    translate(shapeX, shapeY);
    rotate(rotation);
    ellipse(0, 0, size, size); // Decorative shapes
    pop();
  }

  // Move circles to the outer ring while rotating around the center
  for (let i = 0; i < circlePositions.length; i++) {
    let pos = circlePositions[i];
    let angle = radians(rotationAngle + i * (360 / circlePositions.length));
    let radius = 120 + 40 * cos(angle * 3); // Varying radius for rotation
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    ellipse(x + pos.x, y + pos.y, 70, 20); // Moving circles
  }

  pop();
}

function updateCirclePositions() {
  // Update the positions of circles moving to the outer ring
  circlePositions = [];
  let numCircles = 8;
  for (let i = 0; i < numCircles; i++) {
    circlePositions.push({ x: 0, y: 0 });
  }
}

// Call updateCirclePositions to initialize the circle positions
updateCirclePositions();
