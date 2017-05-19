Requirements fulfilled:

1. Implement the assignment in a clean and understandable manner. Your code must be readily understandable for grading including extensive comments. A README.md that explains what you did and anything else the we need to know to run your assignment including the choices you are asked to make when implementing the assignment (i.e. colors, speeds, radius', etc). – 5 points.

2. Set up a WebGL capable HTML canvas able to display without error. Its size should be at least 960x540 and should have the z-buffer enabled and cleared to a black background. Implement necessary shader codes without error. – 5 points.

3. Develop a function that generates the geometry for a sphere in a form usable by WebGL. A parameter of the function should define the number of vertices that forms the sphere. – 10 points.

4. Extend the sphere function to generate normal vectors for shading. A parameter should be added to the function specifying the generation of normal vectors for flat, Gouraud or Phong smooth shading. – 15 points.

5. You will create a small solar system made of spheres. A sun with four (4) orbiting planets. You choose a location (other than the origin) and diameter of the sun, the radius of each planet’s orbit around the sun (keep the orbits in the same plane), the diameters and how fast each planet orbits around the sun – except that each planet should have a different orbital radius, speed and diameter – 5 points.

6. (You may want to read through all the requirements before deciding on sizes given the navigation requirements in item 13. You do not want to make the solar system so large, or small, it cannot be navigated given the step size.)

7. Implement a point light source at the location of the sun. The sun’s size relative to the four planets should determine its color. Large size, the color should be warmer (reddish), or if smaller, the color should be colder (bluish). Use that color for both the light source and the sun’s geometry. You do not need to light the sun's geometry. – 10 points.

8. The first planet from the sun should have a faceted appearance. It has an icy-gray color (you select the specific gray). Use flat shading. The complexity of the planet (number of vertices) should be high enough to look like a sphere but low enough that we can readily see the effect of flat shading. - 15 points.

9. The second planet from the sun should have a swampy, watery blue-green color (you select the specific blue-green). The complexity (number of vertices) of this sphere should be higher than the first planet and be Gouraud shaded with a specular highlight that should be apparent when visible. - 15 points.

10. The third planet from the sun should appear to be covered in calm smooth light blue water (you select the specific light blue). The complexity (number of vertices) of this sphere should be high enough so that when it's Phong shaded and with a specular highlight that should be apparent when visible. The planet appears quite shiny. - 15 points

11. The fourth planet from the sun is a muddy brownish-orange (you select the specific brownish-orange color). With a complexity (number of vertices) somewhere between the second and third planets. It should be Phong shaded and with a specular highlight that should be apparent when visible. The planet appears quite dull. - 5 points

12. Add a moon orbiting around one of your planets. You decide on the moon’s orbital radius and speed, diameter, color and appearance (shading model: flat, Gouraud, Phong). The moon's orbit should not interfere with the orbits of planets adjacent to the one the moon is orbiting. – 10 points.

13. Implement vertex and fragment shading as necessary to light the sun and planets as outlined above. It is up to you to figure out where all or part of the shading is best implemented (i.e. in the application, vertex shader or fragment shader). Where does it make sense to perform lighting calculations, on the CPU or GPU? Vertex or Fragment shader? – 20 points

14. Implement a keyboard based navigation system to allow a user to fly around your solar system. The initial (and reset using the 'r' key) camera position should be such that the entire solar system is visible from a position slightly above the ecliptic (out of the orbital plane) - enough that we can see all the planets orbiting. The left and right arrow keys should rotate the heading of the camera by N degrees per keypress. The up and down arrow keys should rotate the pitch of the camera by N degrees per keypress. Each press of the space bar moves the camera forward by N units. The number keys (1-9) should set the value of N. N should initially be 1 (and reset to 1). All motion, changes to heading, pitch and any forward motion, is relative to the current heading and pitch of the camera. – 10 points.

Parameters for planets:

Center of solar system: (0, -3, 0)

The Sun:
- radius: 3.5
- color: red

1st Planet:
- radius: 1
- color: icy-grey
- distance from sun: 8
- speed: 0.12
- complexity: 3
- shading: Flat

2nd Planet:
- radius: 1.3
- color: blue-green-teal
- distance from sun: 12
- speed: 0.23
- complexity: 5
- shading: Gouraud

3rd Planet:
- radius: 0.8
- color: shiny blue
- distance from sun: 15
- speed: 0.15
- complexity: 7
- shading: Phong

4th Planet:
- radius: 1.6
- color: dull brown
- distance from sun: 18
- speed: 0.09
- complexity: 6
- shading: Phong

Moon:
- radius: 0.4
- color: white/light grey
- distance from plant: 2
- speed: 0.1
- complexity: 5
- shading: Phong
