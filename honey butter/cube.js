var gl, // A global variable for the WebGL context
    horizAspect,
    shaderProgram,
    vertexPositionAttribute,
    vertexColorAttribute,
    cubeVerticesBuffer,
    perspectiveMatrix,
    lastSquareUpdateTime,
    cubeVerticesIndexBuffer,
    // different cube textures for cube1 and cube2
    cube1Image,
    cube2Image,
    cube1Texture,
    cube2Texture,
    cube1VerticesTextureCoordBuffer,
    cube2VerticesTextureCoordBuffer,
    texture1Coordinates,
    texture2Coordinates;

var shaderProgram;
var rotateCube = true; // keeps track of if cubes should be rotating
var rotateTexture = true; // keeps track of if texture should be rotating
var mvMatrixStack = [];
var moveZ = 0; // for moving forward/backward
var fieldOfView = 0; // for zooming in/out, changing field of view
var rotateOne = 0; // keeps track of cube rotations
var rotateTwo = 0;
var cube1rpm = 20; // rotation speed of cube 1
var cube2rpm = 30; // rotation speed of cube 2


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
  initTextures();
  // draws scene every 15 milliseconds
  setInterval(drawScene, 15);
  // changes something with keyboard input
  document.addEventListener('keypress', function(event) {
    var key = event.keyCode;
    if (key == 105) { // pressed i key, move forward
      moveZ += 1.0;
    } else if (key == 111) { // pressed o key, move backward
      moveZ -= 1.0;
    } else if (key == 114) { // pressed r key, reset everything
      if (rotateCube) {
        rotateCube = false;
      } else {
        rotateCube = true;
      }
    } else if (key == 116) { // pressed t key to start/stop rotation of
                             // texture image around itself on each face
     if (rotateTexture) {
       rotateTexture = false;
     } else {
       rotateTexture = true;
     }
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
 // position attribute and texture attributes

 vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
 gl.enableVertexAttribArray(vertexPositionAttribute);

// for cube 1
 texture1CoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
 gl.enableVertexAttribArray(texture1CoordAttribute);

// for cube 2
 texture2CoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
 gl.enableVertexAttribArray(texture2CoordAttribute);

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
}


// load in all data for drawing everything
function initBuffers() {
  cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

  // vertices for each face of cube
  var vertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// texture for cube 1
 cube1VerticesTextureCoordBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, cube1VerticesTextureCoordBuffer);

 var texture1Coordinates = [
   // Front
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0,
   // Back
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0,
   // Top
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0,
   // Bottom
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0,
   // Right
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0,
   // Left
   0.0,  0.0,
   1.0,  0.0,
   1.0,  1.0,
   0.0,  1.0
 ];

 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture1Coordinates),
               gl.STATIC_DRAW);

// maps texture onto cube 2
 cube2VerticesTextureCoordBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, cube2VerticesTextureCoordBuffer);

// coordinates for cube2 are twice as large as cube1
// so that 4 copies are displayed on each face of the cube
 var texture2Coordinates = [
// Front
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0,
   // Back
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0,
   // Top
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0,
   // Bottom
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0,
   // Right
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0,
   // Left
   0.0,  0.0,
   2.0,  0.0,
   2.0,  2.0,
   0.0,  2.0
 ];

 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture2Coordinates),
               gl.STATIC_DRAW);

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
}

// initialize textures for cube1 and cube2
function initTextures() {
  // for first cube
  cube1Texture = gl.createTexture();
  cube1Image = new Image();
  cube1Image.onload = function() { handleTexture1Loaded(cube1Image, cube1Texture); }
  cube1Image.src = 'honey_butter.png';
  // for second cube
  cube2Texture = gl.createTexture();
  cube2Image = new Image();
  cube2Image.onload = function() { handleTexture2Loaded(cube2Image, cube2Texture); }
  cube2Image.src = 'dr_pepper.png';
}
// for cube 1 with gl.nearest
function handleTexture1Loaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // using WRAP mode
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);
}
// for cube 2 with gl.linear and mip mapping enabled
function handleTexture2Loaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}


// draws things on the screen
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // fieldOfView can make field of view narrower or wider
  perspectiveMatrix = makePerspective(50+fieldOfView, 960.0/540.0, 0.1, 100.0);
  loadIdentity();
  mvTranslate([0,0,moveZ]); // zoom in/out
  mvTranslate([-0.0, 0.0, -10.0]); // makes camera look at scene down z-axis
  // the coordinates of where each cube is supposed to be
  var coord = [
    [-4, 0, 0],
    [4, 0, 0],
  ];

  // makes 2 cubes
  for (var track = 0; track < 2; track++) {
    // pushes matrix - function is in gIUtils.js
    mvPushMatrix();
    // makes another cube at one of the 8 positions
    mvTranslate(coord[track]);

    if (track == 0) {
      // for first cube
      mvRotate(rotateOne, [0, 1, 0]);

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, cube1VerticesTextureCoordBuffer);
      gl.vertexAttribPointer(texture1CoordAttribute, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, cube1Texture);
      gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);
    } else if (track == 1) {
      // for second cube
      mvRotate(rotateTwo, [1, 0, 0]);

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, cube2VerticesTextureCoordBuffer);
      gl.vertexAttribPointer(texture2CoordAttribute, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, cube2Texture);
      gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);
    }
    // gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    setMatrixUniforms();
    // draw a cube
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();
  }
  // if rotateCube is true - switches between true/false if r is pressed
  if (rotateCube) {
    // cube 1 should be rotating at 20 rpm
    // times 360 degs per 60 secs
    // times 15 milliseconds
    rotateOne += cube1rpm * (360/60) * (15/1000);
    // cube 2 should be rotating at 30 rpm
    rotateTwo += cube2rpm * (360/60) * (15/1000);
  }
}
