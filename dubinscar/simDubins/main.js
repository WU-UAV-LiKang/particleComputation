function init() {
    var world;
    var ctx;
    var canvas_width = 1120 * 2;
    var canvas_height = 630 * 2;
    var mouse_pressed = false;
    var mouse_joint = false;
    var mouse_x, mouse_y;

    //box2d to canvas scale , therefore 1 metre of box2d = 30px of canvas :)
    var scale = 30;

    /*
        This method will draw the world again and again
        called by settimeout , self looped
    */
    function step() {
        var fps = 60;
        var timeStep = 1.0 / (fps * 0.8);

        //move the box2d world ahead
        world.Step(timeStep, 8, 3);
        world.ClearForces();

        //call this function again after 1/60 seconds or 16.7ms
        setTimeout(step, 1000 / fps);

        //redraw the world
        ctx.save();
        ctx.translate(0, canvas_height);
        ctx.scale(1, -1);
        world.DrawDebugData();
        ctx.restore();

        ctx.font = 'bold 18px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#555';
        ctx.fillText('Box2d MouseJoint example with Dubins paths', canvas_width / 2, 40);
        //ctx.fillText('LSL is pink, RSR is yellow, RSL is light blue, LSR is black, LRL is red, RLR is green ', canvas_width / 2, 70);
        ctx.fillText('Starting point is red and goal point is green', canvas_width / 2, 70);
        ctx.textAlign = 'left';
        ctx.fillText('X Coordinate', 50, 40);
        ctx.fillText('Y Coordinate', 200, 40);
        ctx.fillText('Angle', 350, 40);


        for (b = world.GetBodyList(); b; b = b.GetNext()) {
            //for (c = world.GetBodyList(); c; c = c.GetNext()) {
            if (b.GetUserData() == 'rod2') {
                var c = b;
            }
            if (b.GetUserData() == 'rod1' && c.GetUserData() == 'rod2') {
                var startx = ((b.GetPosition().x) * scale).toFixed(2);
                var starty = ((b.GetPosition().y) * scale).toFixed(2);
                var starta = (b.GetAngle()).toFixed(2);
                ctx.fillText(startx, 50, 70);
                ctx.fillText(starty, 200, 70);
                ctx.fillText(starta, 350, 70);

                //ctx.fillText(c.GetAngle(), 350, 100);

                var goalx = ((c.GetPosition().x) * scale).toFixed(2);
                var goaly = ((c.GetPosition().y) * scale).toFixed(2);
                var goala = (c.GetAngle()).toFixed(2);

                var start = [Number(startx), 1260 - Number(starty), Number(starta) + 1.5708];
                var goal = [Number(goalx), 1260 - Number(goaly), Number(goala) + 1.5708];
                var r = 180; //radius of curvature

                //measure the distance between goal and start. print assembled
                var distance = Math.sqrt(Math.pow((goal[1] - start[1]), 2) + Math.pow((goal[0] - start[0]), 2));
                if (distance < 10) {
                    ctx.textAlign = 'left';
                    //ctx.fillText(distance.toFixed(2), 50, 100);
                    ctx.fillText('ASSEMBLED!', 50, 100);
                }

                var csl = leftcircle(start, r);
                var cgl = leftcircle(goal, r);
                var csr = rightcircle(start, r);
                var cgr = rightcircle(goal, r);

                ctx.beginPath();  //green end point
                ctx.arc(goal[0], goal[1], 8, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgb(0, 200, 10)';
                ctx.fill();

                ctx.beginPath();  //red start point
                ctx.arc(start[0], start[1], 8, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgb(200, 10, 10)';
                ctx.fill();

                //draw arrow at start
                var xcoord = start[0];
                var ycoord = start[1];
                var length = 50;
                var lineangle = -(start[2] + 1.5708);
                ctx.beginPath();
                ctx.moveTo(xcoord, ycoord);
                ctx.lineTo(xcoord + length * Math.cos(lineangle), ycoord + length * Math.sin(lineangle));
                ctx.lineTo((xcoord + length * Math.cos(lineangle)) + 20 * Math.cos(lineangle + 2.356), (ycoord + length * Math.sin(lineangle)) + 20 * Math.sin(lineangle + 2.356));
                ctx.lineTo(xcoord + length * Math.cos(lineangle), ycoord + length * Math.sin(lineangle));
                ctx.lineTo((xcoord + length * Math.cos(lineangle)) + 20 * Math.cos(lineangle - 2.356), (ycoord + length * Math.sin(lineangle)) + 20 * Math.sin(lineangle - 2.356));
                ctx.strokeStyle = 'rgb(220, 0, 0)';
                ctx.stroke();

                //draw the rod with notch on canvas
                var lineangle = -start[2];
                ctx.beginPath();
                ctx.moveTo(xcoord, ycoord);
                ctx.lineTo(xcoord + 35.16 * Math.cos(lineangle + 1.081), ycoord + 35.16 * Math.sin(lineangle + 1.081));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712) + 102 * Math.cos(lineangle + 6.283), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712) + 102 * Math.sin(lineangle + 6.283));
                ctx.lineTo((xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712) + 102 * Math.cos(lineangle + 6.283) + 35.16 * Math.cos(lineangle + 5.202), (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712) + 102 * Math.sin(lineangle + 6.283) + 35.16 * Math.sin(lineangle + 5.202));
                ctx.fillStyle = 'rgb(220, 0, 0)';
                ctx.fill();

                //save rod with notch
                var rod_notch = [{ x: xcoord, y: ycoord },
                { x: xcoord + 35.16 * Math.cos(lineangle + 1.081), y: ycoord + 35.16 * Math.sin(lineangle + 1.081) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712) + 102 * Math.cos(lineangle + 6.283), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712) + 102 * Math.sin(lineangle + 6.283) },
                { x: (xcoord + 35.16 * Math.cos(lineangle + 1.081)) + 102 * Math.cos(lineangle + 0) + 30 * Math.cos(lineangle + 1.5708) + 240 * Math.cos(lineangle + 3.142) + 30 * Math.cos(lineangle + 4.712) + 102 * Math.cos(lineangle + 6.283) + 35.16 * Math.cos(lineangle + 5.202), y: (ycoord + 35.16 * Math.sin(lineangle + 1.081)) + 102 * Math.sin(lineangle + 0) + 30 * Math.sin(lineangle + 1.5708) + 240 * Math.sin(lineangle + 3.142) + 30 * Math.sin(lineangle + 4.712) + 102 * Math.sin(lineangle + 6.283) + 35.16 * Math.sin(lineangle + 5.202) }];


                //draw arrow at goal
                var xcoord = goal[0];
                var ycoord = goal[1];
                var length = 50;
                var lineangle = -(goal[2] + 1.5708);
                ctx.beginPath();
                ctx.moveTo(xcoord, ycoord);
                ctx.lineTo(xcoord + length * Math.cos(lineangle), ycoord + length * Math.sin(lineangle));
                ctx.lineTo((xcoord + length * Math.cos(lineangle)) + 20 * Math.cos(lineangle + 2.356), (ycoord + length * Math.sin(lineangle)) + 20 * Math.sin(lineangle + 2.356));
                ctx.lineTo(xcoord + length * Math.cos(lineangle), ycoord + length * Math.sin(lineangle));
                ctx.lineTo((xcoord + length * Math.cos(lineangle)) + 20 * Math.cos(lineangle - 2.356), (ycoord + length * Math.sin(lineangle)) + 20 * Math.sin(lineangle - 2.356));
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgb(0, 220, 0)';
                ctx.stroke();

                //draw the mirrored rod on canvas
                var lineangle = -goal[2];
                ctx.beginPath();
                ctx.moveTo(xcoord, ycoord);
                ctx.lineTo(xcoord + 37.5 * Math.cos(lineangle + 0.927), ycoord + 37.5 * Math.sin(lineangle + 0.927));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708) + 97.5 * Math.cos(lineangle + 6.283), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708) + 97.5 * Math.sin(lineangle + 6.283));
                ctx.lineTo((xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708) + 97.5 * Math.cos(lineangle + 6.283) + 37.5 * Math.cos(lineangle + 5.355), (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708) + 97.5 * Math.sin(lineangle + 6.283) + 37.5 * Math.sin(lineangle + 5.355));
                ctx.fillStyle = 'rgb(0, 220, 0)';
                ctx.fill();

                //save the mirrored rod points
                var mirrored_rod = [{ x: xcoord, y: ycoord },
                { x: xcoord + 37.5 * Math.cos(lineangle + 0.927), y: ycoord + 37.5 * Math.sin(lineangle + 0.927) },
                { x: xcoord + 37.5 * Math.cos(lineangle + 0.927) + 97.5 * Math.cos(lineangle + 0), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) },
                { x: (xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) },
                { x: (xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) },
                { x: (xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708) },
                { x: (xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708) + 97.5 * Math.cos(lineangle + 6.283), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708) + 97.5 * Math.sin(lineangle + 6.283) },
                { x: (xcoord + 37.5 * Math.cos(lineangle + 0.927)) + 97.5 * Math.cos(lineangle + 0) + 60 * Math.cos(lineangle + 4.712) + 240 * Math.cos(lineangle + 3.142) + 60 * Math.cos(lineangle + 1.5708) + 97.5 * Math.cos(lineangle + 6.283) + 37.5 * Math.cos(lineangle + 5.355), y: (ycoord + 37.5 * Math.sin(lineangle + 0.927)) + 97.5 * Math.sin(lineangle + 0) + 60 * Math.sin(lineangle + 4.712) + 240 * Math.sin(lineangle + 3.142) + 60 * Math.sin(lineangle + 1.5708) + 97.5 * Math.sin(lineangle + 6.283) + 37.5 * Math.sin(lineangle + 5.355) }
                ];


                //draw the left and right circles at the start and goal
                ctx.beginPath();
                ctx.arc((leftcircle(start, r))[0], (leftcircle(start, r))[1], r, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'rgb(0, 0, 220)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc((leftcircle(goal, r))[0], (leftcircle(goal, r))[1], r, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'rgb(0, 0, 220)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc((rightcircle(start, r))[0], (rightcircle(start, r))[1], r, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'rgb(0, 0, 220)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc((rightcircle(goal, r))[0], (rightcircle(goal, r))[1], r, 0, 2 * Math.PI, false);
                ctx.strokeStyle = 'rgb(0, 0, 220)';
                ctx.stroke();

                //begin drawing shortest path
                var arc_lsl = lsl(csl, cgl, start, goal, r)[4];

                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgb(220, 0, 220)';
                ctx.fillText("LSL = " + arc_lsl, canvas_width / 2 - 300, 100);

                var a = lsl(csl, cgl, start, goal, r)[0];
                var b = lsl(csl, cgl, start, goal, r)[1];
                var d = lsl(csl, cgl, start, goal, r)[2];
                var e = lsl(csl, cgl, start, goal, r)[3];


                var startAngle = Math.atan2(b - ((leftcircle(start, r))[1]), a - ((leftcircle(start, r))[0]));
                var endAngle = Math.atan2(start[1] - ((leftcircle(start, r))[1]), start[0] - ((leftcircle(start, r))[0]));
                ctx.beginPath();
                ctx.arc((leftcircle(start, r))[0], (leftcircle(start, r))[1], r, startAngle, endAngle, false);
                ctx.strokeStyle = 'rgb(220, 0, 220)';
                ctx.stroke();

                if (endAngle < startAngle) {
                    endAngle += 2 * Math.PI; //for Left turns
                }

                var angle_diff = endAngle - startAngle;
                var angle_ratio = Math.floor(angle_diff / 0.2);
                //var num_polygon = angle_diff / angle_ratio;
                var angle = endAngle;
                for (i = 0; i <= angle_ratio; i++) {
                    var xcoord_pt2 = Number((leftcircle(start, r))[0]) + r * Math.cos(angle);
                    var ycoord_pt2 = Number((leftcircle(start, r))[1]) + r * Math.sin(angle);
                    var polygon_pts1 = drawPolygon(xcoord_pt2, ycoord_pt2, angle, "green", 1, ctx);
                    /*if (greinerHormann.intersection(polygon_pts1, mirrored_rod) !== null) {
                        drawPolygon(xcoord_pt2, ycoord_pt2, angle, "red", 1, ctx);
                        console.log(polygon_pts1);
                        //TODO: variable which gives me points of intersection
                    }*/
                    intersect(mirrored_rod, polygon_pts1).forEach(function (p) {
                        //ctx.textAlign = 'left';
                        //ctx.fillText('Intersecting!', 50, 150);
                        drawPolygon(xcoord_pt2, ycoord_pt2, angle, "red", 1, ctx);
                    });
                    angle = angle - 0.2;
                }

                var startAngle = Math.atan2(goal[1] - ((leftcircle(goal, r))[1]), goal[0] - ((leftcircle(goal, r))[0]));
                var endAngle = Math.atan2(e - ((leftcircle(goal, r))[1]), d - ((leftcircle(goal, r))[0]));
                ctx.beginPath();
                ctx.arc((leftcircle(goal, r))[0], (leftcircle(goal, r))[1], r, startAngle, endAngle, false);
                ctx.strokeStyle = 'rgb(220, 0, 220)';
                ctx.stroke();

                /*if (endAngle < startAngle) {
                    endAngle += 2 * Math.PI; //for Left turns
                }

                var angle_diff = endAngle - startAngle;
                var angle_ratio = Math.floor(angle_diff / 0.2);
                var num_polygon = angle_diff / angle_ratio;
                var angle = startAngle;
                for (i = 0; i <= Math.abs(angle_ratio); i++) {
                    var xcoord_pt2 = Number((leftcircle(goal, r))[0]) + r * Math.cos(angle);
                    var ycoord_pt2 = Number((leftcircle(goal, r))[1]) + r * Math.sin(angle);
                    var polygon_pts1 = drawPolygon(xcoord_pt2, ycoord_pt2, angle, "green", 1,ctx);
                    if (greinerHormann.intersection(polygon_pts1, mirrored_rod) !== null) {
                        drawPolygon(xcoord_pt2, ycoord_pt2, angle, "red", 1,ctx);
                    }
                    angle = angle + 0.2;
                }*/



                ctx.beginPath();
                ctx.moveTo(a, b);
                ctx.lineTo(d, e);
                ctx.strokeStyle = 'rgb(220, 0, 220)';
                ctx.stroke(); //Drawing lsl path ends here 


                //drawing polygons along the straight line segment of the path
                var straight = lsl(csl, cgl, start, goal, r)[5];
                var ratio = Math.floor(Number(straight) * 5 / r);
                var lineangle = -(Math.atan2(Number(d) - Number(a), Number(e) - Number(b)));
                var t = 0;
                while (t <= 1) {
                    var xcoord = Number(a) * (1 - t) + Number(d) * t;
                    var ycoord = Number(b) * (1 - t) + Number(e) * t;
                    var polygon_pts1 = drawPolygon(xcoord, ycoord, lineangle, "green", -1, ctx);
                    /*if (greinerHormann.intersection(polygon_pts1, mirrored_rod) !== null) {
                        drawPolygon(xcoord, ycoord, lineangle, "red", -1, ctx);
                        //console.log(polygon_pts1);
                    }*/
                    intersect(polygon_pts1, mirrored_rod).forEach(function (p) {
                        ctx.textAlign = 'left';
                        ctx.fillText('Intersecting!', 50, 150);
                        drawPolygon(xcoord, ycoord, lineangle, "red", -1, ctx);
                    });
                    t = t + 1 / ratio;
                }

                /*ctx.beginPath();
                ctx.moveTo(300, 300);
                ctx.lineTo(500, 300);
                ctx.lineTo(500, 500);
                ctx.lineTo(300, 500);
                ctx.lineTo(300, 300);
                ctx.filStyle = 'rgb(220, 0, 220)';
                ctx.fill(); //Drawing lsl path ends here 
 
                var square = [{ x: 300, y: 300 },
                { x: 500, y: 300 },
                { x: 500, y: 500 },
                { x: 300, y: 500 }];
 
                intersect(square, mirrored_rod).forEach(function (p) {
                    ctx.textAlign = 'left';
                    ctx.fillText('Intersecting!', 50, 150);
                });*/

                /*if (greinerHormann.intersection(square, mirrored_rod) !== null) {
                    ctx.textAlign = 'left';
                    ctx.fillText('Intersecting!', 50, 150);
                }*/

                //}
            }
        }

    }



    //Convert coordinates in canvas to box2d world
    function get_real(p) {
        return new b2Vec2(p.x + 0, canvas_height_m - p.y);
    }

    function GetBodyAtMouse(includeStatic) {
        var mouse_p = new b2Vec2(mouse_x, mouse_y);

        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouse_x - 0.001, mouse_y - 0.001);
        aabb.upperBound.Set(mouse_x + 0.001, mouse_y + 0.001);

        var body = null;

        // Query the world for overlapping shapes.
        function GetBodyCallback(fixture) {
            var shape = fixture.GetShape();

            if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic) {
                var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);

                if (inside) {
                    body = fixture.GetBody();
                    return false;
                }
            }

            return true;
        }

        world.QueryAABB(GetBodyCallback, aabb);
        return body;
    }

    // main entry point
    $(function () {
        //first create the world
        world = createWorld();

        var canvas = $('#canvas');
        ctx = canvas.get(0).getContext('2d');

        //get internal dimensions of the canvas
        canvas_width = parseInt(canvas.attr('width'));
        canvas_height = parseInt(canvas.attr('height'));
        canvas_height_m = canvas_height / scale;

        //If mouse is moving over the thing
        $(canvas).mousemove(function (e) {
            var p = get_real(new b2Vec2(e.pageX / scale, e.pageY / scale))

            mouse_x = p.x;
            mouse_y = p.y;

            if (mouse_pressed && !mouse_joint) {
                var body = GetBodyAtMouse();

                if (body) {
                    //if joint exists then create
                    var def = new b2MouseJointDef();

                    def.bodyA = ground;
                    def.bodyB = body;
                    def.target = p;

                    def.collideConnected = true;
                    def.maxForce = 1000 * body.GetMass();
                    def.dampingRatio = 0;

                    mouse_joint = world.CreateJoint(def);

                    body.SetAwake(true);
                }
            }
            else {
                //nothing
            }

            if (mouse_joint) {
                mouse_joint.SetTarget(p);
            }
        });

        $(canvas).mousedown(function () {
            //flag to indicate if mouse is pressed or not
            mouse_pressed = true;
        });

        /*
            When mouse button is release, mark pressed as false and delete the mouse joint if it exists
        */
        $(canvas).mouseup(function () {
            mouse_pressed = false;

            if (mouse_joint) {
                world.DestroyJoint(mouse_joint);
                mouse_joint = false;
            }
        });

        //start stepping
        step(world, ctx);
    });

};