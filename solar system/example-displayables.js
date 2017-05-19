// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett Ridge for CS174a.
// example-displayables.js - The subclass definitions here each describe different independent animation processes that you want to fire off each frame, by defining a display
// event and how to react to key and mouse input events.  Make one or two of your own subclasses, and fill them in with all your shape drawing calls and any extra key / mouse controls.

// Now go down to Example_Animation's display() function to see where the sample shapes you see drawn are coded, and a good place to begin filling in your own code.

Declare_Any_Class( "Debug_Screen",  // Debug_Screen - An example of a displayable object that our class Canvas_Manager can manage.  Displays a text user interface.
  { 'construct': function( context )
      { this.define_data_members( { string_map: context.shared_scratchpad.string_map, start_index: 0, tick: 0, visible: false, graphicsState: new Graphics_State() } );
        shapes_in_use.debug_text = new Text_Line( 35 );
      },
    'init_keys': function( controls )
      { controls.add( "t",    this, function() { this.visible ^= 1;                                                                                                             } );
        controls.add( "up",   this, function() { this.start_index = ( this.start_index + 1 ) % Object.keys( this.string_map ).length;                                           } );
        controls.add( "down", this, function() { this.start_index = ( this.start_index - 1   + Object.keys( this.string_map ).length ) % Object.keys( this.string_map ).length; } );
        this.controls = controls;
      },
    'update_strings': function( debug_screen_object )   // Strings that this displayable object (Debug_Screen) contributes to the UI:
      { debug_screen_object.string_map["tick"]              = "Frame: " + this.tick++;
        debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
      },
    'display': function( time )
      { if( !this.visible ) return;

        shaders_in_use["Default"].activate();
        gl.uniform4fv( g_addrs.shapeColor_loc, Color( .8, .8, .8, 1 ) );

        var font_scale = scale( .02, .04, 1 ),
            model_transform = mult( translation( -.95, -.9, 0 ), font_scale ),
            strings = Object.keys( this.string_map );

        for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
        {
          shapes_in_use.debug_text.set_string( this.string_map[ strings[idx] ] );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (strings)
          model_transform = mult( translation( 0, .08, 0 ), model_transform );
        }
        model_transform = mult( translation( .7, .9, 0 ), font_scale );
        shapes_in_use.debug_text.set_string( "Controls:" );
        shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );    // Draw some UI text (controls title)

        for( let k of Object.keys( this.controls.all_shortcuts ) )
        {
          model_transform = mult( translation( 0, -0.08, 0 ), model_transform );
          shapes_in_use.debug_text.set_string( k );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (controls)
        }
      }
  }, Animation );

Declare_Any_Class( "Example_Camera",     // An example of a displayable object that our class Canvas_Manager can manage.  Adds both first-person and
  { 'construct': function( context )     // third-person style camera matrix controls to the canvas.
      { // keeps track of the original state of the system
        this.original = mult(translation(0, -10, -70), rotation(45, [0,1,0]));
        // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
        context.shared_scratchpad.graphics_state = new Graphics_State( mult(this.original, rotation(45, [0,1,0])), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );
        this.define_data_members( { graphics_state: context.shared_scratchpad.graphics_state, thrust: vec3(), origin: vec3( 0, 5, 0 ), looking: false } );

        },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { var n = 1;
        controls.add( "Space", this, function() { this.thrust[2] =  n; });  controls.add( "space",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "up", this, function() { this.thrust[1] = -n; }); controls.add( "up",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "down", this, function() { this.thrust[1] = n; }); controls.add( "down",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "right", this, function() { this.thrust[0] = -n; }); controls.add( "right",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "left", this, function() { this.thrust[0] = n; }); controls.add( "left",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "1",     this, function() { n = 1;} );
        controls.add( "2",     this, function() { n = 2;} );
        controls.add( "3",     this, function() { n = 3;} );
        controls.add( "4",     this, function() { n = 4;} );
        controls.add( "5",     this, function() { n = 5;} );
        controls.add( "6",     this, function() { n = 6;} );
        controls.add( "7",     this, function() { n = 7;} );
        controls.add( "8",     this, function() { n = 8;} );
        controls.add( "9",     this, function() { n = 9;} );
        controls.add( "r",     this, function() { this.graphics_state.camera_transform = this.original }); // revert to original system
        //controls.add( "a",     this, function() { ;} );
            },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      { var C_inv = inverse( this.graphics_state.camera_transform ), pos = mult_vec( C_inv, vec4( 0, 0, 0, 1 ) ),
                                                                  z_axis = mult_vec( C_inv, vec4( 0, 0, 1, 0 ) );
        user_interface_string_manager.string_map["origin" ] = "Center of rotation: " + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);
        user_interface_string_manager.string_map["cam_pos"] = "Cam Position: " + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);    // The below is affected by left hand rule:
        user_interface_string_manager.string_map["facing" ] = "Facing: "       + ( ( z_axis[0] > 0 ? "West " : "East ") + ( z_axis[1] > 0 ? "Down " : "Up " ) + ( z_axis[2] > 0 ? "North" : "South" ) );
      },
    'display': function( time )
      { var leeway = 70,  degrees_per_frame = .0004 * this.graphics_state.animation_delta_time,
                          meters_per_frame  =   .01 * this.graphics_state.animation_delta_time;

        for( var i = 0; this.looking && i < 2; i++ )      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
        {
          var velocity = ( ( offset_minus[i] > 0 && offset_minus[i] ) || ( offset_plus[i] < 0 && offset_plus[i] ) ) * degrees_per_frame;  // Use movement's quantity unless the &&'s zero it out
          this.graphics_state.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), this.graphics_state.camera_transform );     // On X step, rotate around Y axis, and vice versa.
        }     // Now apply translation movement of the camera, in the newest local coordinate frame
        this.graphics_state.camera_transform = mult( translation( scale_vec( meters_per_frame, this.thrust ) ), this.graphics_state.camera_transform );
      }
  }, Animation );

Declare_Any_Class( "Example_Animation",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
        shapes_in_use.sphere          = new Sphere( false , 5); // the Sun
        shapes_in_use.grey_sphere     = Sphere.prototype.auto_flat_shaded_version( true , 3); // first icy-grey planet
        shapes_in_use.swampy_sphere   = new Sphere( false , 5); // second swampy blue-green planet
        shapes_in_use.watery_sphere   = new Sphere( false , 7); // third watery shiny planet
        shapes_in_use.dull_sphere     = new Sphere( false , 6); // fourth brown-red dull planet
        shapes_in_use.moon            = new Sphere( false , 5); // the moon

      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      {
        controls.add( "ALT+g", this, function() { this.shared_scratchpad.graphics_state.gouraud       ^= 1; } );   // Make the keyboard toggle some
        controls.add( "ALT+n", this, function() { this.shared_scratchpad.graphics_state.color_normals ^= 1; } );   // GPU flags on and off.
        controls.add( "ALT+a", this, function() { this.shared_scratchpad.animate                      ^= 1; } );
      },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      {
        user_interface_string_manager.string_map["time"]    = "Animation Time: " + Math.round( this.shared_scratchpad.graphics_state.animation_time )/1000 + "s";
        user_interface_string_manager.string_map["animate"] = "Animation " + (this.shared_scratchpad.animate ? "on" : "off") ;
      },
    'display': function(time)
      {
        var graphics_state  = this.shared_scratchpad.graphics_state,
            model_transform = mat4();             // We have to reset model_transform every frame, so that as each begins, our basis starts as the identity.
        shaders_in_use[ "Default" ].activate();

        // *** Lights: *** Values of vector or point lights over time.  Arguments to construct a Light(): position or vector (homogeneous coordinates), color, size
        // If you want more than two lights, you're going to need to increase a number in the vertex shader file (index.html).  For some reason this won't work in Firefox.
        graphics_state.lights = [];                    // First clear the light list each frame so we can replace & update lights.

        var t = graphics_state.animation_time/1000, light_orbit = [ Math.cos(t), Math.sin(t) ];
        // graphics_state.lights.push( new Light( vec4(  30*light_orbit[0],  30*light_orbit[1],  34*light_orbit[0], 1 ), Color( 0, .4, 0, 1 ), 100000 ) );
        // graphics_state.lights.push( new Light( vec4( -10*light_orbit[0], -20*light_orbit[1], -14*light_orbit[0], 0 ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) );
        graphics_state.lights.push( new Light( vec4(0, -3, 0, 1), Color(.8, .1, .1, 1), 1000000));

        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.
        // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
        var   placeHolder = new Material( Color(0,0,0,0), 0,0,0,0, "Blank" ),
              sun_color = new Material( Color( .8,.1,.1, 1), .7, .8, .4, 20 ),
              grey_color = new Material( Color( .5,.5,.5, 1), .4, .8, .4, 20 ),
              swampy_color = new Material( Color(.1,.9,.7, 1), .4, .8, .4, 20),
              watery_color = new Material( Color(0,.7,1, 1), .4, .8, .4, 100), // shiny color
              dull_color = new Material( Color(.5,.2,.1, 1), .4, .8, .4, 5), // dull color
              moon_color = new Material( Color(.9,.9,.9, 1), .4, .8, .4, 20);

          // create matrix for pushing and popping transformations
          var matStack = [model_transform];
          function mPush(){
            matStack.push(model_transform);
            model_transform = mat4();
          }
          function mPop(){
            var world = matStack.pop();
            model_transform = mult(world, model_transform);
          }

        // model_transform = mult( model_transform, translation(0, -3, 0) );
        var center = vec3(0, -3, 0); // center of the solar system

        mPush(); // draw the Sun at position center
        var sun_scale = scale( 3.5, 3.5, 3.5 ); // the Sun
        model_transform = mult( translation(center), sun_scale );
        shapes_in_use.sphere.       draw(graphics_state, model_transform, sun_color);
        mPop();
        mPush(); // the first icy-grey planet
        var gray_scale = scale( 1, 1, 1); // size/diameter of planet
        var gray_distance = vec3(8, 0, 0); // distance from center of Sun
        model_transform = mult( translation(center), model_transform); // set center of orbit to be around sun
        model_transform = mult(translation(gray_distance), model_transform); // set orbit radius to be that far from sun
        model_transform = mult(rotation(.12*time, [0,1,0]), model_transform); // set speed of orbit and around y-axis
        model_transform = mult(gray_scale, model_transform); // set size of planet
        shapes_in_use.grey_sphere. draw(graphics_state, model_transform, grey_color);
        mPop();
        mPush(); // the second green-blue planet
        var swampy_scale = scale( 1.3, 1.3, 1.3);
        var swampy_distance = vec3(12, 0, 0);
        model_transform = mult( translation(center), model_transform);
        model_transform = mult( translation(swampy_distance), model_transform);
        model_transform = mult(rotation(.23*time, [0,1,0]), model_transform);
        model_transform = mult(swampy_scale, model_transform);
        graphics_state.gouraud = true; // to get gourad lighting
        shapes_in_use.swampy_sphere. draw(graphics_state, model_transform, swampy_color);
        graphics_state.gouraud = false; // set back to false to prevent other planets from having gourad lighting
        mPop();
        mPush(); // the third watery planet
        var watery_scale = scale( 0.8, 0.8, 0.8);
        var watery_distance = vec3(15, 0, 0);
        model_transform = mult( translation(center), model_transform);
        model_transform = mult( translation(watery_distance), model_transform);
        model_transform = mult(rotation(.15*time, [0,1,0]), model_transform);
        model_transform = mult(watery_scale, model_transform); // set size of planet
        shapes_in_use.watery_sphere. draw(graphics_state, model_transform, watery_color);
        mPop();
        mPush(); // the fourth dull planet
        var dull_scale = scale( 1.6, 1.6, 1.6);
        var dull_distance = vec3(18, 0, 0);
        model_transform = mult( translation(center), model_transform);
        model_transform = mult( rotation(0.09*time, [0,1,0]), model_transform);
        model_transform = mult( translation(dull_distance), model_transform);
        model_transform = mult(dull_scale, model_transform); // set size of planet
        shapes_in_use.dull_sphere. draw(graphics_state, model_transform, dull_color);
        // add the moon
        var moon_scale = scale( .4,.4,.4);  // size of the moon circling the fourth planet
        var moon_distance = vec3(1, 0, 0); // the radius of the moon's orbit around 4th planet
        // model_transform = mult(translation(moon_distance), model_transform);
        model_transform = mult(rotation(.2*time, [1,0, 0]), model_transform);
        model_transform = mult(moon_scale, model_transform); // set size of planet
        shapes_in_use.moon. draw(graphics_state, model_transform, moon_color); // add the moon so that it orbits the 4th planet
        mPop();
      }
  }, Animation );
