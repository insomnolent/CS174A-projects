Parameters for cubes

Cube 1:
- Speed: 20 rpm
- Texture: 256x256 png of chips
- Filtering: nearest
Cube 2:
- Speed: 30 rpm
- Texture: 256x256 png of Dr Pepper can
- Filtering: tri-linear

Requirements I fulfilled:

1. Implement the assignment in a clean and understandable manner. Your code must be readily understandable for grading including extensive comments. A README.md that explains what you did and anything else the we need to know to run your assignment including the choices you are asked to make when implementing the assignment (i.e. colors, speeds, etc). Set up a WebGL capable HTML canvas able to display without error. Its size should be at least 960x540 and should have the z-buffer enabled and cleared to a black background. Implement necessary shader codes without error. – 5 points.

2. Implement functionality to load two square images (of your choice) into texture maps. Remember, images used for texture maps should have power of two dimensions. You must include whatever files are needed for us to run your code in your repository (images, etc). - 10 points.

3. Apply the entire first texture image onto each face of a cube (cube #1) that has dimensions 2x2x2. The texture coordinates should range from (0,1) in both the s and t dimensions. Filtering should be set to use nearest neighbor.  – 10 points.

4. Create a second cube (cube #2) with dimension 2x2x2 where the second texture image is applied to each face but is zoomed out by 50% (the image should shrink). Enable Mip Mapping for the zoomed texture using tri-linear filtering. - 10 points.

5. Position both cubes side by side within the view of your starting camera view – both cubes should have a dimension of 2x2x2. Place the center of cube #1 at (-4,0,0) and the center of cube #2 at (4,0,0). Use a perspective projection and set the horizontal FOV to 50 degrees. Define two keys ‘i’ and ‘o’ that move the camera nearer or farther away, along the z-axis, from the cubes so we can see the effect of the texture filtering as the textures get smaller or larger. The key press step should be 1 unit in either direction. - 10 points.

6. Use the key ‘r’ to start and stop the rotation both cubes. The cube #1 should rotate around its Y-axis at a rate of 20 rpm. Cube #2 should rotate around that cube’s X-axis at a rate of 30 rpm. - 5 points.
