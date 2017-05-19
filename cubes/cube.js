var gl, // A global variable for the WebGL context
    horizAspect,
    shaderProgram,
    vertexPositionAttribute,
    vertexColorAttribute,
    cubeVerticesBuffer,
    perspectiveMatrix,
    lastSquareUpdateTime,
    cubeVerticesIndexBuffer,
    cubeVerticesColorBuffer,
    // the different colors of cubes
    cubeVerticesColorBufferBlue,
    cubeVerticesColorBufferGreen,
    cubeVerticesColorBufferRed,
    cubeVerticesColorBufferYellow,
    cubeVerticesColorBufferPurple,
    cubeVerticesColorBufferSky,
    cubeVerticesColorBufferOrchid,
    cubeVerticesColorBufferCyan,
    // the color of edges
    cubeVerticesColorBufferWhite,
    cubeVerticesIndexBufferLines;
var mvMatrixStack = [];
var changeColor = 0;
var moveY = 0; // for moving up/dow
var moveX = 0; // for moving left/right
var moveZ = 0; // for moving forward/backward
var fieldOfView = 0; // for zooming in/out, changing field of view
var rotateX = 0; // for moving camera view left/right
var count = 0; // keeps track of cube rotations

function start() {
  // grab HTML tag for canvas, set horiz aspect ratio
  var canvas = document.getElementById('glCanvas');
  horizAspect = canvas.height/canvas.width;
  // Initialize GL context
  gl = initWebGL(canvas);
  // Only continue if WebGL is available and working
  if (!gl) {
    return;
  }
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Enable depth testing of objects
  gl.enable(gl.DEPTH_TEST);
  // Near things obscure far things
  gl.depthFunc(gl.LEQUAL);
  // Clear the color as well as the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  initBuffers();
  initShaders();
  // draws scene every 15 milliseconds
  setInterval(drawScene, 15);
  // changes something with keyboard input
  document.addEventListener('keypress', function(event) {
    var key = event.keyCode;
      if (key == 99) { // pressed c key, change cube colors
      changeColor += 1;
    } else if (key == 110) { // pressed n key, zoom in
      fieldOfView -= 1;
    } else if (key == 119) { // pressed w key, zoom out
      fieldOfView += 1;
    } else if (key == 105) { // pressed i key, move forward
      moveZ += 0.25;
    } else if (key == 106) { // pressed j key, move left
      moveX += 0.25;
    } else if (key == 107) { // pressed k key, move right
      moveX -= 0.25;
    } else if (key == 109) { // pressed m key, move backward
      moveZ -= 0.25;
    } else if (key == 114) { // pressed r key, reset everything
      moveX = 0;
      moveY = 0;
      moveZ = 0;
      fieldOfView = 0;
      rotateX = 0;
    }
      }, false);
  // moves camera view up/down or twist left/right
  document.addEventListener('keydown', function(event) {
    var key = event.keyCode;
      if (key == 38) { // pressed up key, moves up
      moveY -= 0.25;
    } else if (key == 40) { // pressed down key, moves down
      moveY += 0.25;
    } else if (key == 37) { // pressed left key, looks left
      rotateX -= 4;
    } else if (key == 39) { // pressed right key, looks right
      rotateX += 4;
    }
      }, false);

}
// initialize webGL
function initWebGL(canvas) {
  gl = null;
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) { // if unable to initialize
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  return gl;
}
// initialize shaders
function initShaders() {
  // gets the shader for fragmentShader and vertexShader
  var fragmentShader = getShader(gl, 'shader-fs');
  var vertexShader = getShader(gl, 'shader-vs');
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
  }
  gl.useProgram(shaderProgram);
 // position attribute and color attributes
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(vertexPositionAttribute);
  vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(vertexColorAttribute);}

function getShader(gl, id, type) {
  var shaderScript, theSource, currentChild, shader;
  shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  theSource = shaderScript.text;
  if (!type) {
    // looks for info from HTML file
    if (shaderScript.type == 'x-shader/x-fragment') {
      type = gl.FRAGMENT_SHADER;
    } else if (shaderScript.type == 'x-shader/x-vertex') {
      type = gl.VERTEX_SHADER;
    } else {
      // Unknown shader type
      return null;
    }
  }
  shader = gl.createShader(type);
  gl.shaderSource(shader, theSource);
  // Compile the shader program
  gl.compileShader(shader);
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }
  return shader; // after processing info from index.html
}
// load in all data for drawing everything
function initBuffers() {
  cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

// vertices for each face of cube
  var vertices = [
  // Front face
  -0.5, -0.5,  0.5,
   0.5, -0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5,  0.5,  0.5,
  // Back face
  -0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5, -0.5, -0.5,
  // Top face
  -0.5,  0.5, -0.5,
  -0.5,  0.5,  0.5,
   0.5,  0.5,  0.5,
   0.5,  0.5, -0.5,
  // Back face
  -0.5, -0.5, -0.5,
   0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,
  // Right face
   0.5, -0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5,  0.5,
  // Left face
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  -0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// the 8 different colors of 8 different cubes
var green = [
  [0.0,  1.0,  0.0,  1.0],  [0.0,  1.0,  0.0,  1.0],  [0.0,  1.0,  0.0,  1.0],
  [0.0,  1.0,  0.0,  1.0],  [0.0,  1.0,  0.0,  1.0],  [0.0,  1.0,  0.0,  1.0],
];
var blue = [
  [0.0,  0.0,  1.0,  1.0],  [0.0,  0.0,  1.0,  1.0],  [0.0,  0.0,  1.0,  1.0],
  [0.0,  0.0,  1.0,  1.0],  [0.0,  0.0,  1.0,  1.0],  [0.0,  0.0,  1.0,  1.0],
];
var red = [
  [1.0,  0.0,  0.0,  1.0],  [1.0,  0.0,  0.0,  1.0],  [1.0,  0.0,  0.0,  1.0],
  [1.0,  0.0,  0.0,  1.0],  [1.0,  0.0,  0.0,  1.0],  [1.0,  0.0,  0.0,  1.0],
];
var yellow = [
  [1.0,  1.0,  0.0,  1.0],  [1.0,  1.0,  0.0,  1.0],  [1.0,  1.0,  0.0,  1.0],
  [1.0,  1.0,  0.0,  1.0],  [1.0,  1.0,  0.0,  1.0],  [1.0,  1.0,  0.0,  1.0],
];
var purple = [
  [1.0,  0.0,  1.0,  1.0],  [1.0,  0.0,  1.0,  1.0],  [1.0,  0.0,  1.0,  1.0],
  [1.0,  0.0,  1.0,  1.0],  [1.0,  0.0,  1.0,  1.0],  [1.0,  0.0,  1.0,  1.0],
];
var sky = [
  [0.7,  1.0,  1.0,  1.0],  [0.7,  1.0,  1.0,  1.0],  [0.7,  1.0,  1.0,  1.0],
  [0.7,  1.0,  1.0,  1.0],  [0.7,  1.0,  1.0,  1.0],  [0.7,  1.0,  1.0,  1.0],
];
var orchid = [
  [0.8,  0.6,  1.0,  1.0],  [0.8,  0.6,  1.0,  1.0],  [0.8,  0.6,  1.0,  1.0],
  [0.8,  0.6,  1.0,  1.0],  [0.8,  0.6,  1.0,  1.0],  [0.8,  0.6,  1.0,  1.0],
];
var cyan = [
  [0.0,  1.0,  1.0,  1.0],  [0.0,  1.0,  1.0,  1.0],  [0.0,  1.0,  1.0,  1.0],
  [0.0,  1.0,  1.0,  1.0],  [0.0,  1.0,  1.0,  1.0],  [0.0,  1.0,  1.0,  1.0],
];
// the color for the edges of cubes
var white = [
  [1.0,  1.0,  1.0,  1.0],  [1.0,  1.0,  1.0,  1.0],  [1.0,  1.0,  1.0,  1.0],
  [1.0,  1.0,  1.0,  1.0],  [1.0,  1.0,  1.0,  1.0],  [1.0,  1.0,  1.0,  1.0],
];

var greenColor = []; // cube green
var blueColor = []; // cube blue
var redColor = []; // cube red
var yellowColor = []; // cube yellow
var purpleColor = []; // cube purple
var skyColor = []; // cube light blue
var orchidColor = []; // cube light purple
var cyanColor = []; // cube cyan
var whiteColor = [];

for (var j = 0; j < 6; j++) {
  var c_green = green[j];
  var c_blue = blue[j];
  var c_red = red[j];
  var c_yellow = yellow[j];
  var c_purple = purple[j];
  var c_sky = sky[j];
  var c_orchid = orchid[j];
  var c_cyan = cyan[j];
  var c_white = white[j];
  for (var i = 0; i < 4; i++) {
    greenColor = greenColor.concat(c_green);
    blueColor = blueColor.concat(c_blue);
    redColor = redColor.concat(c_red);
    yellowColor = yellowColor.concat(c_yellow);
    purpleColor = purpleColor.concat(c_purple);
    skyColor = skyColor.concat(c_sky);
    orchidColor = orchidColor.concat(c_orchid);
    cyanColor = cyanColor.concat(c_cyan);
    whiteColor = whiteColor.concat(c_white);
  }
}
// creates new buffer for each color used in scene
cubeVerticesColorBufferGreen = gl.createBuffer(); // green
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferGreen);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(greenColor), gl.STATIC_DRAW);
cubeVerticesColorBufferBlue = gl.createBuffer(); // blue
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferBlue);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blueColor), gl.STATIC_DRAW);
cubeVerticesColorBufferRed = gl.createBuffer(); // red
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferRed);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(redColor), gl.STATIC_DRAW);
cubeVerticesColorBufferYellow = gl.createBuffer(); // yellow
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferYellow);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(yellowColor), gl.STATIC_DRAW);
cubeVerticesColorBufferPurple = gl.createBuffer(); // purple
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferPurple);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(purpleColor), gl.STATIC_DRAW);
cubeVerticesColorBufferSky = gl.createBuffer(); // sky
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferSky);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyColor), gl.STATIC_DRAW);
cubeVerticesColorBufferOrchid = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferOrchid);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orchidColor), gl.STATIC_DRAW);
cubeVerticesColorBufferCyan = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferCyan);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyanColor), gl.STATIC_DRAW);
cubeVerticesColorBufferWhite = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferWhite);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(whiteColor), gl.STATIC_DRAW);

cubeVerticesIndexBuffer = gl.createBuffer(); // tells you what order to draw them in
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

// This array defines each face as two triangles, using the
// indices into the vertex array to specify each triangle's
// position.
var cubeVertexIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
];

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

// draw wireframe for cube, only edges
var cubeVertexIndicesLines = [
  0, 1, 0, 3, 3, 2, 2, 1, // front face edges
  7, 6, 6, 5, 5, 4, 4, 7, // back face edges
  0, 4, 1, 7, 3, 5, 2, 6, // edges connecting front/back faces
  ];

  // make new buffer for edges of cube
  cubeVerticesIndexBufferLines = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBufferLines);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndicesLines), gl.STATIC_DRAW);


}
// draws things on the screen
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // fieldOfView can make field of view narrower or wider
  perspectiveMatrix = makePerspective(45+fieldOfView, 960.0/540.0, 0.1, 100.0);
  loadIdentity();
  mvTranslate([moveX,moveY,moveZ]); // moves scene up/down, left/right, zoom in/out
  mvRotate(rotateX, [0, 1, 0]); // rotates camera left or right
  mvTranslate([-0.0, 0.0, -40.0]); // makes camera look at scene down z-axis
  // the coordinates of where each cube is supposed to be
  var coord = [
    [10, 10, 10],
    [10, 10, -10],
    [10, -10, 10],
    [-10, 10, 10],
    [10, -10, -10],
    [-10, -10, 10],
    [-10, 10, -10],
    [-10, -10, -10],
  ];

// makes 8 cubes
for (var track = 0; track < 8; track++) {
  // pushes matrix - function is in gIUtils.js
  mvPushMatrix();
  // makes another cube at one of the 8 positions
  mvTranslate(coord[track]);
  // incrementing count makes cubes rotate
  mvRotate(45 + count, [1, 0, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

// changeColor rotates the colors of cubes
// each cube is a different color
if (track == changeColor%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferGreen);
} else if (track == (1+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferBlue);
} else if (track == (2+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferRed);
} else if (track == (3+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferYellow);
} else if (track == (4+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferPurple);
} else if (track == (5+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferSky);
} else if (track == (6+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferCyan);
} else if (track == (7+changeColor)%8) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferOrchid);
}
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  setMatrixUniforms();
  // draw a colored cube
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

  // make outline of cubes (edges) white and draw them for each cube
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBufferWhite);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBufferLines);
  gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
  // pops matrix - function is in gIUtils.js
  mvPopMatrix();
  // reset track if greater than 8
  if (track == 8) {
    track = 0;
  }
}
  count++; // incrementing count allows cubes to rotate
}
