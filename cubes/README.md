The main code for this project is in cube.js. It uses some functions (mvPushMatrix
   and mvPopMatrix) from gIUtils.js

For this project, I set up a WebGL canvas with a size of 960 x 540 cleared to a
black background. There are 8 unit cubes that are all (+/-10, +/-10, +/-10) from
the origin. They are all different colors and the cube edges are white. Cubes
display in a square aspect ratio, and a simple camera navigation system was
implemented. 

For keyboard inputs:
c - rotates colors of cubes
n - makes field of view more narrow
w - makes field of view more wide
i - moves camera forward
m - moves camera backward
j - moves camera left
k - moves camera right

Arrow keys:
left - rotates camera view left
right - rotates camera view right
up - moves camera position up
down - moves camera position down
