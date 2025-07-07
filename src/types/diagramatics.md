diagramatics logoDiagramaticsGitHubDocsGuidesEditorExamples
Example Articles
Mechanical Advantages of Pulleys

Rolling Dice and the Central limit theorem

Examples
Simple Squares
let big_rect   = square(150).fill('lightblue').stroke('none');
let small_rect = square(20).fill('blue').rotate(Math.PI/4);
let r1 = small_rect.position(big_rect.get_anchor('top-left'));
let r2 = small_rect.translate(V2(75,75)).fill('white');
let r3 = small_rect.position(V2(-75,-75)).fill('black');
let r4 = small_rect.position(big_rect.parametric_point(0.25));
draw(big_rect, r1, r2, r3, r4);


𝑥 = 0

Interactive Slider
int.draw_function = (inp) => {
    let x = inp['x'];

    let big_circ   = circle(50);
    let small_rect = square(20).fill('blue').translate(V2(x,0));
    draw(big_circ, small_rect);
};

int.slider('x', -50, 50, 0);
int.draw();
-1
1
2
3
-1
1
2
3
Plotting Function
let opt = {
    xrange : [-1.5, 4],
    yrange : [-1.5, 4],
}
let ax = xyaxes(opt);
let f = x => x**2;
let g = x => Math.sin(x);
let graph_f = plotf(f, opt).stroke('red').strokewidth(2);
let graph_g = plotf(g, opt).stroke('blue').strokewidth(2);
draw(ax, graph_f, graph_g);
Dice
let pip_positions = {
    1 : [V2(0,0)],
    2 : [V2(-1,-1), V2(1,1)],
    3 : [V2(-1,-1), V2(0,0), V2(1,1)],
    4 : [V2(-1,-1), V2(1,-1), V2(-1,1), V2(1,1)],
    5 : [V2(-1,-1), V2(1,-1), V2(0,0), V2(-1,1), V2(1,1)],
    6 : [V2(-1,-1), V2(1,-1), V2(-1,0), V2(1,0), V2(-1,1), V2(1,1)],
}
let generate_dice_pips = (n) => {
    let positions = pip_positions[n];
    let pips = positions.map((p) => circle(0.25).position(p));
    return diagram_combine(...pips).fill('black').stroke('none');
}
let generate_dice = (n) => {
    let outline = square(4).apply(mod.round_corner(0.5))
        .fill('none').stroke('black').strokewidth(2);
    let pips = generate_dice_pips(n);
    return diagram_combine(outline, pips);
}
let dice = [1,2,3,4,5,6].map((n) => generate_dice(n));
let diceall = distribute_grid_row(dice, 2, 1, 1);
draw(diceall);
𝑎
𝑏
𝑓(𝑎)
𝑓(𝑏)
Area Under Curve
let opt = {
    xrange : [-2, 2],
    yrange : [-1, 2],
}
let axes = axes_empty(opt);
let f = x => Math.cos(x);
let graph_f = plotf(f, opt).stroke('blue').strokewidth(3);

let a = -0.5;
let b = 1.0;

let under_f = under_curvef(f, a, b, opt).fill('blue').opacity(0.5).stroke('none');
let pa = circle(0.05).position(V2(a, f(a)))
  .fill('blue').stroke('none');
let pb = circle(0.05).position(V2(b, f(b)))
.fill('blue').stroke('none');

let ticka = xtickmark(a, 0, 'a');
let tickb = xtickmark(b, 0, 'b');
let labela = textvar('f(a)').move_origin_text('bottom-right').position(V2(a, f(a)));
let labelb = textvar('f(b)').move_origin_text('bottom-left').position(V2(b, f(b)));

let labels = labela.combine(labelb).translate(V2(0, 0.1)).textfill('blue');
let texts = diagram_combine(ticka, tickb, labels, pa, pb);

draw(axes, under_f, graph_f, texts);


𝑛 = 1

Sierpiński triangle
int.draw_function = (inp) => {
    let n = inp['n'];

    let s0 = regular_polygon_side(3, 50)
        .position().fill('lightblue').stroke('none');
    let snext = (s) => diagram_combine(
        s,
        s.translate(V2(50,0)),
        s.translate(V2(25,50*Math.sqrt(3)/2)),
    ).scale(V2(0.5,0.5)).position().flatten();
    let sn = (n) => {
        if (n == 0) return s0;
        else return snext(sn(n-1));
    }
    let a = sn(n);
    draw(a);
};

int.slider('n', 0, 4, 1, 1);
int.draw();
𝐴
𝐵
𝜃
𝜃
Circle Angle Theorem
let circ = regular_polygon(100,50).fill('none').stroke('black');
let pA0 = circ.parametric_point(0.4);
let pB0 = circ.parametric_point(0.6);

int.draw_function = (inp) => {
    let pA = inp['A'];
    let pB = inp['B'];
    let p1 = inp['p1'];
    let p2 = inp['p2'];

    let ang = pA.angle() - pB.angle();
    let arcc = arc(50, ang).strokewidth(3).stroke('blue').rotate(pB.angle());

    let line1 = curve([pA,p1,pB]).stroke('gray').strokedasharray([5]);
    let line2 = curve([pA,p2,pB]).stroke('gray').strokedasharray([5]);

    let labels = diagram_combine(
        textvar('A').position(pA.scale(1.15)),
        textvar('B').position(pB.scale(1.15)),
    );
    let angles = diagram_combine(
        annotation.angle_smaller([pA,p1,pB], '\\theta', 15, 10).fill('lightred'),
        annotation.angle_smaller([pA,p2,pB], '\\theta', 15, 10).fill('lightred'),
    );

    draw(
        circ, arcc,
        labels, angles,
        line1, line2,
    );
    int.locator_draw();
}

int.locator('A', pA0, 4, 'blue', circ);
int.locator('B', pB0, 4, 'blue', circ);
int.locator('p1', circ.parametric_point(0.2), 4, 'red', circ);
int.locator('p2', circ.parametric_point(0.9), 4, 'red', circ);
int.draw();
𝑀𝑔
𝑁
𝑓
𝐹
𝜃
Free Body Diagram
default_diagram_style['stroke-width'] = 2;
default_textdata['font-size'] = 21;

let angle = to_radian(30);
let horizontal = line(V2(0,0), V2(8,0))
    .stroke('gray').strokedasharray([5,5]);
let plane = line(V2(0,0), Vdir(angle).scale(10)).stroke('gray');

let sq = square(4).move_origin('bottom-center')
    .position(plane.parametric_point(0.5)).rotate(angle)
    .fill('lightblue').stroke('none');
let csq = sq.get_anchor('center-center');

let arrow_head_size = 0.12;


let vx = V2(1,0); let vy = V2(0,1); let vnx = V2(-1,0); let vny = V2(0,-1);
let forces_annotation = diagram_combine(
    annotation.vector(vny.scale(3.5), 'Mg', V2(0.6,0.2), arrow_head_size)
        .position(csq),
    annotation.vector(Vdir(angle + Math.PI/2).scale(5), 'N', V2(0.6,0.2), arrow_head_size)
        .position(plane.parametric_point(0.6)),
    annotation.vector(Vdir(angle).scale(1.2), 'f', V2(0.0,-0.6), arrow_head_size)
        .position(plane.parametric_point(0.6)),
    annotation.vector(Vdir(angle).scale(2), 'F', V2(-0.5,-1.0), arrow_head_size)
        .move_origin(Vdir(angle).scale(2)).position(sq.parametric_point(0.5,3)),
);
let angle_annotation = annotation.angle([V2(1,0), V2(0,0), Vdir(angle)], '\\theta', 1, 1.5);

draw (horizontal, sq, plane, forces_annotation, angle_annotation);


𝑡 = 1.5708

Spring Oscillation
let x0 = 50;
let amplitude = 25;
let omega = 1;

int.draw_function = (inp) => {
    let t = inp['t'];
    let x = x0 + amplitude * Math.cos(omega * t);
    
    let wall  = line(V2(0,0), V2(0,20)).strokewidth(2);
    let floor = line(V2(0,0), V2(100,0)).strokewidth(2);
    let box   = square(20).position(V2(x,10))
        .fill('lightblue').stroke('none');

    let p1 = wall.get_anchor('center-right');
    let p2 = box.get_anchor('center-left');
    let spring = mechanics.spring(p1,p2, 2, 10, 1.2);
    draw(box, wall, floor, spring)
}

let period = 2*Math.PI/omega;
int.slider('t', 0, 2*period, period/4, 0.1, 2);
int.draw();
Diagramatics Logo
// base
let base0 = circle(50);
let base1 = circle(35).translate(V2(-40,-20));
let base2 = circle(35).translate(V2( 40,-20));
let base_raw  = diagram_combine(base0, base1, base2);

let base_stroke = base_raw.stroke('black').strokewidth(4);
let base_fill   = base_raw.fill('white').stroke('none');
let base_dashed = base_raw.stroke('gray').strokewidth(2).strokedasharray([5,5]).opacity(0.5);
let base = diagram_combine(base_stroke, base_fill, base_dashed);

// beans
let pivot = V2(0,0);
let bean0 = circle(24).scale(V2(1,1.5))
    .move_origin('bottom-center').position().translate(V2(0,60))
    .strokewidth(2);
let angle_sep = to_radian(36);
let bean1 = bean0.rotate(angle_sep/2*3, pivot);
let bean2 = bean0.rotate(angle_sep/2, pivot);
let bean3 = bean2.hflip(0);
let bean4 = bean1.hflip(0);

let bean_arc_r1 = bean0.origin.length();
let bean_arc1 = arc(bean_arc_r1, 3*angle_sep).rotate(angle_sep)
    .strokedasharray([5,5]).stroke('gray').opacity(0.5).strokewidth(2);
let bean_arc_r2 = bean0.get_anchor('center-center').length();
let bean_arc2 = arc(bean_arc_r2, 3*angle_sep).rotate(angle_sep)
    .strokedasharray([5,5]).stroke('gray').opacity(0.5).strokewidth(2);
let bean_line_1 = line(V2(0,0), bean2.get_anchor('center-center'));
let bean_line_2 = line(V2(0,0), bean3.get_anchor('center-center'));
let bean_lines = bean_line_1.combine(bean_line_2)
    .strokedasharray([5,5]).stroke('gray').opacity(0.5).strokewidth(2);

// accents
let basebg1 = base1.translate(V2(10,-5));
let basebg2 = base2.translate(V2(5,5));
let basebg  = basebg1.combine(basebg2).fill('lightblue').stroke('none');
let beanbg  = bean2.combine(bean3)
    .rotate(to_radian(-4), pivot).fill('lightblue').stroke('none');


draw(
    beanbg, basebg,
    base, bean1, bean2, bean3, bean4,
    bean_arc1, bean_arc2, bean_lines,
);
Examples : Diagramatics

iagramatics
Nabla Icon
Diagramatics
Diagramatics is a JavaScript/TypeScript library designed to easily create interactive diagrams, especially in math and physics. It provides a high-level API for creating and manipulating diagram elements and interactive controls.

Examples
Below are some examples of interactive diagrams created using Diagramatics:

Example Pulley Example Spring

The interaction are shown in the following GIFs:

Example Pulley Example Spring

For more examples, visit Diagramatics Website: Examples.

Usage & Installation
To try the online editor, please visit Diagramatics Website: Editor.

To use it in your own project, please refer to Diagramatics Website: Guides.

Member Visibility
Theme
OS
Diagramatics
Examples
Usage & Installation
diagramatics
angle
angle_smaller
congruence_mark
length
parallel_mark
right_angle
vector
outer_shadow
TAG
Diagram
Interactive
Path
Vector2
draw_to_svg_options
axes_options
_init_default_diagram_style
_init_default_text_diagram_style
_init_default_textdata
ax
default_diagram_style
default_text_diagram_style
default_textdata
align_horizontal
align_vertical
arc
array_repeat
arrow
arrow1
arrow2
axes_corner_empty
axes_empty
axes_transform
circle
clientPos_to_svgPos
curve
diagram_combine
distribute_grid_row
distribute_horizontal
distribute_horizontal_and_align
distribute_variable_row
distribute_vertical
distribute_vertical_and_align
download_svg_as_png
download_svg_as_svg
draw_to_svg
draw_to_svg_element
empty
foreign_object
get_SVGPos_from_event
get_tagged_svg_element
handle_tex_in_svg
image
line
linspace
linspace_exc
multiline
multiline_bb
plot
plotf
plotv
polygon
range
range_inc
rectangle
rectangle_corner
regular_polygon
regular_polygon_side
reset_default_styles
square
str_latex_to_unicode
str_to_mathematical_italic
text
textvar
to_degree
to_radian
transpose
under_curvef
V2
Vdir
xaxis
xgrid
xtickmark
xtickmark_empty
xticks
xyaxes
xycorneraxes
xygrid
yaxis
ygrid
ytickmark
ytickmark_empty
yticks
Generated using TypeDoc
diagramatics logoDiagramaticsGitHubDocsGuidesEditorExamples
Guides
usage
shapes
transformation
style
tags
boolean
points
alignment
table
interactivity
modifier
utilities
geometry
annotation
plot
bar
technical
TeX
Try Online
Try online   diagramatics_logo Diagramatics Online Editor
Or use online code playgrounds

jsfiddle_logo Edit in JSFiddle jsitor_logo Edit in JSitor

Install
CDN
The simplest way of using Diagramatics is to import it from a CDN.
javascript
 :
https://cdn.jsdelivr.net/npm/diagramatics@1.5/dist/diagramatics.js
javascript (min)
 :
https://cdn.jsdelivr.net/npm/diagramatics@1.5/dist/diagramatics.min.js
css
 :
https://cdn.jsdelivr.net/npm/diagramatics@1.5/css/diagramatics.css
*you can change "1.x.x" into the version you want to use, or use "latest" to always use the latest version.
*css is only required to style the interactive controls.

The default font used in Diagramatics is Latin Modern Math. Adiga can link it from CDN, download it, or any other way you want.
font
 :
https://fonts.cdnfonts.com/css/latin-modern-math


The minimal example below shows how to draw a red square on an SVG element.
index.html

<!DOCTYPE html>
<html>
    <body>
        <svg id="mysvg"></svg>
    </body>
    <script type="module">
        import {square, draw_to_svg} from 'https://cdn.jsdelivr.net/npm/diagramatics@1.5/dist/diagramatics.min.js'
        let mysvg = document.getElementById('mysvg');
        let sq = square(10).fill('red');
        draw_to_svg(mysvg, sq);
    </script>
</html>
        
Package Manager
Adiga can also download it from npm using the package manager of your choice.

$ npm install diagramatics
    
After installing, you can import it into your project.
index.html

<!DOCTYPE html>
<html>
    <body>
        <svg id="mysvg"></svg>
    </body>
    <script type="module">
        import {square, draw_to_svg} from 'diagramatics'
        let mysvg = document.getElementById('mysvg');
        let sq = square(10).fill('red');
        draw_to_svg(mysvg, sq);
    </script>
</html>
        
Usage
Minimal example
All you need to have in your html file is an svg element to draw the diagram.
If you want to add interactive controls, you also need a div element to hold the controls and a link to the css.
index.html

<!DOCTYPE html>
<html>
    <head>
        <!-- css for 'Latin Modern Math' font -->
        <link href="https://fonts.cdnfonts.com/css/latin-modern-math" rel="stylesheet">
        <!-- optional css for interactive controls -->
        <link href="diagramatics/css/diagramatics.css" rel="stylesheet">
    </head>
    <body>
        <!-- svg component to draw the diagram -->
        <svg id="mysvg"></svg>

        <!-- optional div to hold interactive controls -->
        <div id="controldiv"></div>
    </body>
    <script src="index.js" type="module"></script>
</html>
        
Minimal example for the index.js file.
index.js

// import the necessary functions from the library
import {square, draw_to_svg} from 'diagramatics'

// get the svg element
let mysvg = document.getElementById('mysvg');

// build the diagram
let sq = square(10).fill('red');

// draw the diagram to `mysvg`
draw_to_svg(mysvg, sq);
        
draw function
draw_to_svg() only accept a single diagram object to draw. To draw multiple diagram objects, use diagram_combine() to combine them into a single diagram object.
To make it simpler, we can also define a function to draw the diagram.
index.js

// import the necessary functions from the library
import {square, draw_to_svg, diagram_combine} from 'diagramatics'

// get the svg element
let mysvg = document.getElementById('mysvg');

// define the `draw` function
let draw = (...diagrams) => {
    draw_to_svg(mysvg, diagram_combine(...diagrams));
};

// build the diagram objects
let sq = square(10).fill();
let sq2 = square(2).fill('red')

// draw the diagram to `mysvg`
draw(sq, sq2);
        
Add interactivity
index.js

// import the necessary functions from the library
import {square, draw_to_svg, diagram_combine, V2, Interactive} from 'diagramatics'

// get the svg and control element
let mysvg = document.getElementById('mysvg');
let controldiv = document.getElementById('controldiv');

// define the `draw` function
let draw = (...diagrams) => {
    draw_to_svg(mysvg, diagram_combine(...diagrams));
};
// create the interactive object
let int = new Interactive(controldiv, mysvg);

// build the diagram objects
int.draw_function = (inp) => {
    let x = inp['x'];
    let big_sq   = square(10).fill();
    let small_sq = square(2).fill('red').translate(V2(x,0));

    draw(big_sq, small_sq);
}

int.slider('x', -10, 10, 0);
int.draw();

        
Importing
Adiga can use the import statement to import the necessary functions from the library one by one.
index.js

import {square, circle, V2} from 'diagramatics'

let sq   = square(10).fill();
let circ = circle(2).fill('red').translate(V2(5,0));

        
Adiga can also import everything from the library using the * wildcard and give it an alias.
index.js

import * as dg from 'diagramatics'

let sq   = dg.square(10).fill();
let circ = dg.circle(2).fill('red').translate(dg.V2(5,0));

        
Or, if you're feeling frisky, you can import everything and put it in the global namespace.
index.js

import * as dg from 'diagramatics'
Object.entries(dg).forEach(([name, exported]) => window[name] = exported);

let sq   = square(10).fill();
let circ = circle(2).fill('red').translate(V2(5,0));

        
Downloading the Diagram
Adiga can download the diagram as an svg or png file using the download_svg_as_svg() and download_svg_as_png() functions respectively.

The size of the image will follow the size of the svg element in the html file.
download_svg_as_svg ( outer_svgelement  :  SVGSVGElement )
download_svg_as_png ( outer_svgelement  :  SVGSVGElement )
let mysvg   = document.getElementById('mysvg_svg');
let btn_svg = document.getElementById('btn_download_svg_as_svg');
let btn_png = document.getElementById('btn_download_svg_as_png');

btn_svg.onclick = () => { download_svg_as_svg(mysvg); }
btn_png.onclick = () => { download_svg_as_png(mysvg); }

let sq  = square(10).fill('white');
let sq2 = square(4).fill('lightblue'); 
draw(sq, sq2);
Download as SVG

Download as PNG

Building Blocks
Diagramatics provides a set of basic building blocks for creating diagrams. These are polygon, curve, text, and image.
polygon ( points  :  Vector2[] )  :  Diagram
let poly = polygon([V2(0,0), V2(0,10), V2(10,10)]);
draw(poly);

// poly.type == 'polygon'
curve ( points  :  Vector2[] )  :  Diagram
let curv = curve([V2(0,0), V2(0,10), V2(10,10)]);
draw(curv);

// curve.type == 'curve'
hello
text ( str  :  string )  :  Diagram
// *for math variable italic style, use `textvar()`

let sq = square(20);
let tx = text('hello');
draw(sq, tx);

// tx.type == 'text'
image ( src  :  string , width  :  number , height  :  number )  :  Diagram
// *for math variable italic style, use `textvar()`
let src = "https://photon-ray.xyz/img/rlogo.jpg";
let img = image(src,10,10);
draw(img);

// img.type == 'image'
Basic Shapes
Diagramatics also provides a set of basic shapes for creating diagrams.
rectangle ( width  :  number , height  :  number )  :  Diagram
let rect = rectangle(20,10);
draw(rect);
square ( sidelength  :  number = 1 )  :  Diagram
let sq = square(20);
draw(sq);
rectangle_corner ( bottomleft  :  Vector2 , topright  :  Vector2 )  :  Diagram
// if you need to define a rectangle by its bottom left and top right corners,
let p1   = V2(0,0);
let p2   = V2(20,10);
let rect = rectangle_corner(p1,p2);
draw(rect);
regular_polygon ( sides  :  number , radius  :  number )  :  Diagram
let poly = regular_polygon(5, 10);
draw(poly);
regular_polygon_side ( sides  :  number , sidelength  :  number )  :  Diagram
// if you want to define a regular polygon by its side length instead of radius,
// use `regular_polygon_side()`

let poly = regular_polygon_side(5, 10);
draw(poly);
circle ( radius  :  number = 1 )  :  Diagram
let circ = circle(10);
draw(circ);
// you can create an ellipse by scaling a circle
let ell = circle(10).scale(V2(2,1));
draw(ell);
line ( start  :  Vector2 , end  :  Vector2 )  :  Diagram
let l = line(V2(0,1), V2(1,0));
draw(l);
arc ( radius  :  number = 1 , angle  :  number )  :  Diagram
// arc will start from the positive x-axis and go counter-clockwise
let ar = arc(10, Math.PI/2);
draw(ar);
// if you need an arc from angle `a` to `b`, use the `.rotate` method
let a = Math.PI*3/4;
let b = Math.PI*3/2;
let ar = arc(10, b-a).rotate(a);
draw(ar);
arrow ( vector  :  Vector2 , headsize  :  number = 1 )  :  Diagram
// if you need to put this arrow at a different position, use the `.translate` method
let ar = arrow(V2(10,5), 0.5);
draw(ar);
arrow1 ( start  :  Vector2 , end  :  Vector2 , headsize  :  number = 1 )  :  Diagram
// if you need to define the arrow by its start and end points, you can use this instead of `arrow()`
// this is equal to `arrow(end.sub(start)).translate(start)`

let ar = arrow1(V2(0,5), V2(10,5), 0.5);
draw(ar);
arrow2 ( start  :  Vector2 , end  :  Vector2 , headsize  :  number = 1 )  :  Diagram
let ar = arrow2(V2(0,5), V2(10,5), 0.5);
draw(ar);
ℎ𝑒𝑙𝑙𝑜
textvar ( str  :  string )  :  Diagram
let sq = square(20);
let tx = textvar('hello');
// `textvar` is just a helper function
// this is equivalent to `tx = text('hello').text_tovar()`
draw(sq, tx);
Combining Diagram
diagram_combine ( ...diagrams  :  Diagram[] )  :  Diagram
let sq1 = square(10);
let sq2 = square(10).translate(V2(12,0));

let sq  = diagram_combine(sq1, sq2);
// when combined, the type of the object is 'diagram'
// sq.type == 'diagram'

let sqs = sq.fill('lightblue').translate(V2(0,12));
draw(sq, sqs);
Adiga can also use Diagram.combine method which does the same thing
Diagram.combine ( ...diagrams  :  Diagram[] )  :  Diagram
// `d0.combine(d1,d2,d3)` is equivalent to
// `diagram_combine(d0,d1,d2,d3)`

let sq1 = square(10);
let sq2 = square(10).translate(V2(12,0));

let sq  = sq1.combine(sq2);
let sqs = sq.fill('lightblue').translate(V2(0,12));
draw(sq, sqs);
Adiga can access the list of diagrams in a Diagram object using Diagram.children
Diagram.children : Diagram[]
// `d0.combine(d1,d2,d3)` is equivalent to
// `diagram_combine(d0,d1,d2,d3)`

let sq1 = square(10);
let sq2 = square(10).translate(V2(12,0));

let sq  = sq1.combine(sq2);
let sqs = sq.fill('lightblue').translate(V2(0,12));

let sqa = sq.children[0];
let sqb = sqs.children[1];
draw(sqa, sqb);

Transformation
Diagram that has been created can be transformed. Diagramatics provide the following transformation :
Diagram.translate ( v  :  Vector2 )  :  Diagram
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.translate(V2(5,5));
draw(sq0, sq1);
Diagram.position ( v  :  Vector2 )  :  Diagram
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.position(V2(5,5));
draw(sq0, sq1);
Diagram.rotate ( angle  :  number , pivot?  :  Vector2 )  :  Diagram
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.rotate(Math.PI/3, V2(-5,-5));
draw(sq0, sq1);
// if pivot is left undefined, the diagram will rotate around its origin

let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.rotate(Math.PI/3);
draw(sq0, sq1);
Diagram.scale ( scale  :  Vector2 | number , origin?  :  Vector2 )  :  Diagram
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.scale(V2(2,0.5), V2(-5,-5));
draw(sq0, sq1);
// if origin is left undefined, the diagram will scale around its origin

let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.scale(V2(2,0.5));
draw(sq0, sq1);
Diagram.skewX ( angle  :  number , base?  :  Vector2 )  :  Diagram
// if base is left undefined, the diagram will skew about its origin
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.skewX(to_radian(30));
draw(sq0, sq1);
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.skewX(to_radian(30), sq.get_anchor('top-center'));
draw(sq0, sq1);
Diagram.skewY ( angle  :  number , base?  :  Vector2 )  :  Diagram
// if base is left undefined, the diagram will skew about its origin
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.skewY(to_radian(30));
draw(sq0, sq1);
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.skewY(to_radian(30), sq.get_anchor('center-left'));
draw(sq0, sq1);
Diagram.vflip ( a?  :  number )  :  Diagram
// Reflect the diagram vertically over a horizontal line `y = a`
// if left undefined, flip over its origin

let tr = regular_polygon(3,10);
let tr0 = tr.stroke('grey').strokedasharray([5]);
let tr1 = tr.vflip(-10);

draw(tr0, tr1);
Diagram.hflip ( a?  :  number )  :  Diagram
// Reflect the diagram horizontally over a vertical line `x = a`
// if left undefined, flip over its origin

let tr = regular_polygon(3,10).rotate(Math.PI/6);
let tr0 = tr.stroke('grey').strokedasharray([5]);
let tr1 = tr.hflip(10);

draw(tr0, tr1);
Reflection
Diagram.reflect ( p1?  :  Vector2 , p2?  :  Vector2 )  :  Diagram
// if given 0 arguments, reflect over the origin
// if given 1 argument, reflect over a point p1
// if given 2 arguments, reflect over a line defined by two points p1 and p2

let sq = square(10);

sq.reflect(V2(1,0));
// is the same as
sq.reflect_over_point(V2(1,0));

sq.reflect(V2(1,0), V2(2,0));
// is the same as
sq.reflect_over_line(V2(1,0), V2(2,0));
Diagram.reflect_over_point ( p  :  Vector2 )  :  Diagram
let penta   = regular_polygon(5, 10);
let penta_0 = penta.stroke('grey').strokedasharray([5]);

let refl_point = V2(10,5);
let penta_1 = penta.reflect_over_point(refl_point);

let refl_indicator = circle(0.5).fill('blue').position(refl_point);
draw(penta_0, penta_1, refl_indicator);
+
0
0
1
1
2
2
3
3
4
4
+
0
0
1
1
2
2
3
3
4
4
// you can see which point reflected into which location in the diagram below

let penta   = regular_polygon(5, 10);
let penta_0 = penta.stroke('grey').strokedasharray([5]);

let refl_point = V2(10,5);
let penta_1 = penta.reflect_over_point(refl_point);

let refl_indicator = circle(0.5).fill('blue').position(refl_point);
draw(penta_0.debug(), penta_1.debug(), refl_indicator);
Diagram.reflect_over_line ( p1  :  Vector2 , p2  :  Vector2 )  :  Diagram
let penta   = regular_polygon(5, 10);
let penta_0 = penta.stroke('grey').strokedasharray([5]);

let p1 = V2(0,15);
let p2 = V2(13,2);
let penta_1 = penta.reflect_over_line(p1, p2);

let refl_line = line(p1,p2).stroke('grey').strokedasharray([5]);
draw(penta_0, penta_1, refl_line);
+
0
0
1
1
2
2
3
3
4
4
+
0
0
1
1
2
2
3
3
4
4
// you can see which point reflected into which location in the diagram below

let penta   = regular_polygon(5, 10);
let penta_0 = penta.stroke('grey').strokedasharray([5]);

let p1 = V2(0,15);
let p2 = V2(13,2);
let penta_1 = penta.reflect_over_line(p1, p2);

let refl_line = line(p1,p2).stroke('grey').strokedasharray([5]);
draw(penta_0.debug(), penta_1.debug(), refl_line);
Custom transformation
Diagram.transform ( transform_function  :  (p : Vector2) => Vector2 )  :  Diagram
let sq = square(15);

// create a transformation function that takes a Vector2 and returns a Vector2
let f_wavy = (v) => V2(0, Math.sin(v.x)).add(v);

// we have to subdivide first before applying the transformation
let sqmod  = sq.apply(mod.subdivide(100)).transform(f_wavy);

draw(sqmod);
Style
Diagram have a style property that can be used to style the diagram.
Here are the style properties that is available for Diagrams.
    stroke           : string,
    fill             : string,
    opacity          : number,
    stroke-width     : number,
    stroke-linecap   : string,
    stroke-dasharray : number[],
    stroke-linejoin  : string,
    vector-effect    : string,
    
Diagramatics provide a set of color that can be used to style the diagram.
The colors is based on tab20 color scheme.
blue        : #1f77b4
lightblue   : #aec7e8
orange      : #ff7f0e
lightorange : #ffbb78
green       : #2ca02c
lightgreen  : #98df8a
red         : #d62728
lightred    : #ff9896
purple      : #9467bd
lightpurple : #c5b0d5
brown       : #8c564b
lightbrown  : #c49c94
 
pink        : #e377c2
lightpink   : #f7b6d2
grey        : #7f7f7f
lightgrey   : #c7c7c7
gray        : #7f7f7f
lightgray   : #c7c7c7
olive       : #bcbd22
lightolive  : #dbdb8d
cyan        : #17becf
lightcyan   : #9edae5

Styling Diagram
Diagram.fill ( color  :  string )  :  Diagram
let sq = square(10).fill('blue');
draw(sq);
// color can be given as colorname or hex color code

let sq = square(10).fill('#d62728');
draw(sq);
Diagram.stroke ( color  :  string )  :  Diagram
let sq = square(10).stroke('red');
draw(sq);
Diagram.opacity ( opacity  :  number )  :  Diagram
// opacity is between 0 and 1
let sq = square(10).fill('blue').opacity(0.5);
draw(sq);
Diagram.strokewidth ( width  :  number )  :  Diagram
let sq = square(10).strokewidth(4);
draw(sq);
Styling Stroke
Diagram.strokelinecap ( linecap  :  'butt' | 'round' | 'square' )  :  Diagram
let l   = line(V2(0,0), V2(0,1)).strokewidth(12);
let l0 = l.strokelinecap('butt');
let l1 = l.strokelinecap('square');
let l2 = l.strokelinecap('round');

let ls = distribute_horizontal([l0,l1,l2], 0.2);

// highlight to make it easier to see
let lhighlight = ls.children.map(x => l.stroke('lightred').strokewidth(2).position(x.origin));

draw(ls, ...lhighlight);
Diagram.strokelinejoin ( linejoin  :  'miter' | 'round' | 'bevel' )  :  Diagram
// this style is based on svg w3c standard
// more info : https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin

let c = curve([V2(0,0), V2(0.5,0.5), V2(1,0)]).strokewidth(12);
let c0 = c.strokelinejoin('miter');
let c1 = c.strokelinejoin('round');
let c2 = c.strokelinejoin('bevel');

let cs = distribute_vertical([c0,c1,c2], 0.2);

// highlight to make it easier to see
let chighlight = cs.children.map(x => c.stroke('lightred').strokewidth(2).position(x.origin));

draw(cs, ...chighlight);
Diagram.strokedasharray ( dasharray  :  number[] )  :  Diagram
// this style is based on svg w3c standard
// more info : https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray

let l = line(V2(0,0), V2(1,0)).strokewidth(12);
// Dashes and gaps of the same size
let l0 = l.strokedasharray([20]);
let l1 = l.strokedasharray([10]);

// Dashes starting with a gap
let l2 = l.strokedasharray([0,10,0]);

// Dashes and gaps of different sizes
let l3 = l.strokedasharray([40,10]);

// Dashes and gaps of various sizes with an odd number of values
let l4 = l.strokedasharray([40,10,20]);

// Dashes and gaps of various sizes with an even number of values
let l5 = l.strokedasharray([40,10,20,30]);

let lines = distribute_vertical([l0,l1,l2,l3,l4,l5], 0.2);
draw(lines);
Diagram.vectoreffect ( vectoreffect  :  'none' | 'non-scaling-stroke' )  :  Diagram
let l = line(V2(0,0), V2(2,0));

// the default is 'non-scaling-stroke', which is calculated relative to the screen.
// so a strokewidth 1 will always be 1 pixel wide, 
// and doesn't care about the coordinate system of the diagram.
let l0 = l.vectoreffect('non-scaling-stroke').strokewidth(1);

// if using 'none', the strokewidth will be relative to the coordinate system of the diagram.
// for example, this line have the length of 2 unit
// so a strokewidth of 1 will be 1 unit wide on the coordinate system of the diagram.
let l1 = l.vectoreffect('none').strokewidth(1);

let lines = distribute_vertical([l0,l1], 1.5);
draw(lines);
Styling Text
hello
Diagram.fontfamily ( fontfamily  :  string )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontfamily('sans-serif');
draw(sq, tx);
hello
Diagram.fontsize ( fontsize  :  number )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontsize(50);
draw(sq, tx);
hello
Diagram.fontweight ( fontweight  :  'normal' | 'bold' | 'bolder' | 'lighter' | number )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontweight('bold');
draw(sq, tx);
hello
Diagram.fontstyle ( fontstyle  :  'normal' | 'italic' )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontstyle('italic');
draw(sq, tx);
hello
there
Diagram.move_origin_text ( anchor  :  string )  :  Diagram
// anchors can be :
// 'top-left', 'top-center', 'top-right',
// 'center-left', 'center-center', 'center-right',
// 'bottom-left', 'bottom-center', 'bottom-right',

let sq  = square(10).stroke('lightgrey');
let tx1 = text('hello').move_origin_text('bottom-right').position(V2(0,0));
let tx2 = text('there').move_origin_text('top-left').position(V2(0,0));
draw(sq, tx1, tx2);
hello
Diagram.textangle ( angle  :  number )  :  Diagram
let sq  = square(10).stroke('lightgrey');
let tx = text('hello').textangle(to_radian(45));
draw(sq, tx);
auto
absolute
Diagram.fontscale ( fontscale  :  'auto' | number )  :  Diagram
// just like stroke's vectoreffect property
// texts can also be automatically scaled to the screen
// or scaled relative to the coordinate system of the diagram by putting in a number

let sq = square(10).stroke('lightgrey');
let txa = text('auto').fontsize(24).fontscale('auto')   .translate(V2(0,1));
let txb = text('absolute').fontsize(24).fontscale(0.1).translate(V2(0,-1));
draw(sq, txa, txb);
auto
absolute
// the square here is 2 times bigger than the previous example
// notice that the 'absolute' text stays the same size 
// relative to the coordinate system of the diagram

let sq = square(20).stroke('lightgrey');
let txa = text('auto').fontsize(24).fontscale('auto')   .translate(V2(0,2));
let txb = text('absolute').fontsize(24).fontscale(0.1).translate(V2(0,-2));
draw(sq, txa, txb);
hello
Diagram.textfill ( color  :  string )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').textfill('blue');
draw(sq, tx);
hello
Diagram.textstroke ( color  :  string )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontweight('bold').textstroke('blue');
draw(sq, tx);
hello
Diagram.textstrokewidth ( width  :  number )  :  Diagram
let sq = square(10).stroke('lightgrey');
let tx = text('hello').fontweight('bold').textstroke('blue').textstrokewidth(5);
draw(sq, tx);
ℎ𝑒𝑙𝑙𝑜
Diagram.text_tovar ( )  :  Diagram
// convert the text into mathematical italic
// equivalent to using `textvar`

let sq = square(10).stroke('lightgrey');
let tx = text('hello').text_tovar();
draw(sq, tx);
hello
Diagram.text_totext ( )  :  Diagram
// convert the text from mathematical italic

let sq = square(10).stroke('lightgrey');
let tx = text('hello').text_tovar().text_totext();
draw(sq, tx);
Applying the same style multiple time
Let's say you want to draw multiple objects with the same style. Adiga can try to apply the style to each object, but that's tedious. And if you want to change the style, you have to manually change it for each object.
let p3 = regular_polygon(3,10).position(V2(-10,10))
    .fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);
let p4 = regular_polygon(4,10).position(V2(-10,-10))
    .fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);
let p5 = regular_polygon(5,10).position(V2(10,10))
    .fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);
let p6 = regular_polygon(6,10).position(V2(10,-10))
    .fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);

draw(p3,p4,p5,p6);
To make it simpler, you can use Diagram.apply and passing it a function that will style the diagram.
Diagram.apply ( func  :  (d : Diagram) => Diagram )  :  Diagram
let style = (d) => d.fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);

let p3 = regular_polygon(3,10).position(V2(-10, 10)).apply(style);
let p4 = regular_polygon(4,10).position(V2(-10,-10)).apply(style);
let p5 = regular_polygon(5,10).position(V2( 10, 10)).apply(style);
let p6 = regular_polygon(6,10).position(V2( 10,-10)).apply(style);

draw(p3,p4,p5,p6);
Adiga can also combine the diagram first, and style the parent Diagram. This will apply the styles to all the children.
diagram_combine ( ...diagrams  :  Diagram[] )  :  Diagram
let p3 = regular_polygon(3,10).position(V2(-10, 10));
let p4 = regular_polygon(4,10).position(V2(-10,-10));
let p5 = regular_polygon(5,10).position(V2( 10, 10));
let p6 = regular_polygon(6,10).position(V2( 10,-10));
let ps = diagram_combine(p3,p4,p5,p6)
            .fill('lightblue').stroke('blue').strokewidth(2).strokedasharray([5]);

draw(ps);
Or you can change the default style of the diagram by changing the values is default_diagram_style.
default_diagram_style
default_diagram_style["fill"]             = 'lightblue';
default_diagram_style["stroke"]           = 'blue';
default_diagram_style["stroke-width"]     = 2;
default_diagram_style["stroke-dasharray"] = [5];

let p3 = regular_polygon(3,10).position(V2(-10, 10));
let p4 = regular_polygon(4,10).position(V2(-10,-10));
let p5 = regular_polygon(5,10).position(V2( 10, 10));
let p6 = regular_polygon(6,10).position(V2( 10,-10));

draw(p3,p4,p5,p6);
This also works for default_text_diagram_style and default_textdata.
default_text_diagram_style
// "fill"             : string,
// "stroke"           : string,
// "stroke-width"     : number,
// "stroke-linecap"   : string,
// "stroke-dasharray" : number[],
// "stroke-linejoin"  : string,
// "vector-effect"    : string,
// "opacity"          : number,
default_textdata
// "text"              : string,
// "font-family"       : string,
// "font-size"         : number,
// "font-weight"       : string,
// "text-anchor"       : string,
// "dominant-baseline" : string,
// "angle"             : number,
// "font-style"        : string,
// "font-scale"        : number,

Tags
Diagramatics has a concept of tags. These tags can be used to make diagram manipulation easier.
Diagram.append_tags ( tags  :  string | string[] )  :  Diagram
let a = square(100).append_tags('blue').append_tags('big');
let b = square(10).append_tags(['blue', 'small']);

// a will have the tags 'blue' and 'big'
// b will have the tags 'blue' and 'small'
Diagram.remove_tags ( tags  :  string | string[] )  :  Diagram
let a = square(100).append_tags('blue').append_tags('big');
let b = square(10).append_tags(['blue', 'small']);
a = a.remove_tags('blue');
b = b.remove_tags(['blue', 'small']);

// a will have the tag 'big'
// b will have no tag
Diagram.reset_tags ( )  :  Diagram
let a = square(10).append_tags(['blue', 'small']);
a = a.reset_tags();

// a will have no tag
Diagram.contain_tag ( tag  :  string )  :  boolean
// check if a diagram contains a tag
let a = square(10).append_tags(['square', 'small']);

a.contain_tag('square'); // true
a.contain_tag('big');    // false
Diagram.contain_all_tags ( tags  :  string[] )  :  boolean
// check if a diagram contains all tags given
let a = square(10).append_tags(['square', 'small', 'blue']);

a.contain_all_tags(['square', 'small']); // true
a.contain_all_tags(['square', 'big']);   // false
Tags Application
Diagram.apply_to_tagged_recursive ( tags  :  string | string[] , func  :  (d : Diagram) => Diagram )  :  Diagram
// this is useful if we have a deeply nested diagram, and we want to apply a function to all diagrams with a tag

let a = square(10);
let b = square(10).append_tags('blue');
let c = circle(5).append_tags('blue');
let d = circle(5);

let distributed = distribute_horizontal([a, b, c, d], 1);
let colored = distributed.apply_to_tagged_recursive('blue', d => d.fill('lightblue'));

draw(colored);
Diagram.get_tagged_elements ( tags  :  string | string[] )  :  Diagram[]
// this is useful if we have a deeply nested diagram, and we want to get the diagrams with certain tags

let a = square(10);
let b = square(10).append_tags('special');
let c = circle(5);
let d = circle(5).append_tags('special');

let distributed = distribute_horizontal([a, b, c, d], 1);
let specials = distributed.get_tagged_elements('special');

draw(...specials);
Built In Tags
Diagram.get_tagged_elements ( tags  :  string | string[] )  :  Diagram[]
enum TAG {
    EMPTY = "empty",
    LINE = "line",
    CIRCLE = "circle",
    TEXTVAR = "textvar",
    
    // prefix
    ROW_ = "row_",
    COL_ = "col_",
    
    // arrow
    ARROW_LINE = "arrow_line",
    ARROW_HEAD = "arrow_head",
    
    // table
    TABLE = "table",
    CONTAIN_TABLE = "contain_table",
    TABLE_CELL = "table_cell",
    TABLE_CONTENT = "table_content",
    EMPTY_CELL = "empty_cell",
    
    //graph
    GRAPH_AXIS = "graph_axis_line",
    GRAPH_TICK = "graph_tick",
    GRAPH_TICK_LABEL = "graph_tick_label",
    GRAPH_GRID = "graph_grid",
}
Styling Arrow Line and Head separately
let arr = arrow(V2(3,10), 2).strokewidth(4)
    .apply_to_tagged_recursive(TAG.ARROW_HEAD, d => d.fill('blue').stroke('white'))
    .apply_to_tagged_recursive(TAG.ARROW_LINE, d => d.stroke('blue'));
draw(arr);

Boolean Operation
Polygon can be combined using boolean operation. The following boolean operation is supported :
boolean.union ( d1  :  Diagram , d2  :  Diagram , tolerance?  :  number )  :  Diagram
let sq = square(10);
let ci = circle(5).position(V2(7,0));

let result = boolean.union(sq, ci);
draw(sq, ci, result.fill('lightblue'));
boolean.difference ( d1  :  Diagram , d2  :  Diagram , tolerance?  :  number )  :  Diagram
let sq = square(10)
    .stroke('gray').strokedasharray([5]);
let ci = circle(5).position(V2(7,0))
    .stroke('gray').strokedasharray([5]);
    
let result = boolean.difference(sq, ci);
draw(sq, ci, result.fill('lightblue'));
let sq = square(10)
    .stroke('gray').strokedasharray([5]);
let ci = circle(5).position(V2(7,0))
    .stroke('gray').strokedasharray([5]);
    
let result = boolean.difference(ci, sq);
draw(sq, ci, result.fill('lightblue'));
boolean.intersect ( d1  :  Diagram , d2  :  Diagram , tolerance?  :  number )  :  Diagram
let sq = square(10)
    .stroke('gray').strokedasharray([5]);
let ci = circle(5).position(V2(7,0))
    .stroke('gray').strokedasharray([5]);
    
let result = boolean.intersect(sq, ci);
draw(sq, ci, result.fill('lightblue'));
boolean.xor ( d1  :  Diagram , d2  :  Diagram , tolerance?  :  number )  :  Diagram
let sq = square(10)
    .stroke('gray').strokedasharray([5]);
let ci = circle(5).position(V2(7,0))
    .stroke('gray').strokedasharray([5]);
    
let result = boolean.xor(sq, ci);
draw(sq, ci, result.fill('lightblue'));
 diagram have an origin and a bounding box. Adiga can see this using Diagram.debug
Points
+
0
0
1
1
2
2
3
3
4
4
Diagram.debug ( show_index  :  boolean = true )  :  Diagram
// the + symbol shows the origin
// the gray lines shows the bounding box
// the red lines shows the path of the object
// the number shows the index of the point in the object

let pentagon = regular_polygon(5,10);
draw(pentagon.debug());
Adiga can access the special points of the bounding box using Diagram.get_anchor
Diagram.get_anchor ( anchor  :  string )  :  Diagram
// anchors can be :
// 'top-left', 'top-center', 'top-right',
// 'center-left', 'center-center', 'center-right',
// 'bottom-left', 'bottom-center', 'bottom-right',

let pentagon = regular_polygon(5,10);
let anchor_top    = pentagon.get_anchor('top-center');
let anchor_bottom = pentagon.get_anchor('bottom-center');
let ctop = circle(0.5).fill('blue').position(anchor_top);
let cbot = circle(0.5).fill('blue').position(anchor_bottom);
draw(pentagon, ctop, cbot);
Adiga can get the bounding box directly using Diagram.bounding_box
Diagram.bounding_box ( )  :  [Vector2, Vector2]
let pentagon = regular_polygon(5,10);
let bbox = pentagon.bounding_box(); // bbox = [v2_bottomleft, v2_topright]

let p1 = circle(0.5).position(bbox[0]).fill('red');
let p2 = circle(0.5).position(bbox[1]).fill('blue');

draw(pentagon, p1, p2);
Adiga can move the origin of the diagram using Diagram.move_origin
Diagram.move_origin ( pos  :  Vector2 | string )  :  Diagram
// anchors can be :
// 'top-left', 'top-center', 'top-right',
// 'center-left', 'center-center', 'center-right',
// 'bottom-left', 'bottom-center', 'bottom-right',

let sq_red  = square(10).fill('red' ).move_origin('bottom-left').position(V2(0,0));
let sq_blue = square(10).fill('blue').move_origin(V2(5,5)      ).position(V2(0,0));

// both of the squares are positioned at the same location (0,0)
// but they have different origins

draw(sq_red, sq_blue);
Adiga can retrieve origin of the diagram using Diagram.origin property
Diagram.origin : Vector2
let sq_red  = square(10).fill('blue' ).move_origin('bottom-left').position(V2(2,2));
let p       = sq_red.origin;
let sq_blue = square(5).fill('white').position(p);

draw(sq_red, sq_blue);
Diagram.parametric_point ( t  :  number , segment_index?  :  number )  :  Vector2
// Path can be described parametrically in the form of (x(t), y(t))
// Path starts at t=0 and ends at t=1
// if segment_index is not defined, t=0 is the start of the path and t=1 is the end of the path
// *you can see where path starts and ends using Diagram.debug()

let pentagon = regular_polygon(5,10);
let p0 = pentagon.parametric_point(0);
let p1 = pentagon.parametric_point(0.25);
let p2 = pentagon.parametric_point(0.5);
let p3 = pentagon.parametric_point(0.75);

let c0 = circle(0.5).fill('blue').position(p0);
let c1 = circle(0.5).fill('blue').position(p1);
let c2 = circle(0.5).fill('blue').position(p2);
let c3 = circle(0.5).fill('blue').position(p3);

draw(pentagon, c0, c1, c2, c3);
// Adiga can also give it a `segment_index`
// Let's say you want to get the point between the 3rd and 4th point i.e. (3rd segment)
// *you can see the index of each point using `Diagram.debug()`

let pentagon = regular_polygon(5,10);
let p = pentagon.parametric_point(0.5, 3);
let c = circle(0.5).fill('blue').position(p);

draw(pentagon, c);
Diagram.add_points ( points  :  Vector2[] )  :  Diagram
let pentagon = regular_polygon(5,10);
let p2 = pentagon.add_points([V2(0,0), V2(-1,2), V2(9,5)]);

draw(p2);
Alignment and Distribution
Diagramatics provide functions to align and distribute diagram objects.
Alignment
let's say we have a list of diagrams, and we want to align them vertically or horizontally.
let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
draw(r1, r2, r3);
align_vertical ( diagrams  :  Diagram[] , alignment  :  'top' | 'center' | 'bottom' )  :  Diagram
let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = align_vertical([r1, r2, r3], 'bottom');
draw(rs);
align_horizontal ( diagrams  :  Diagram[] , alignment  :  'left' | 'center' | 'right' )  :  Diagram
let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = align_horizontal([r1, r2, r3], 'right');
draw(rs);
Distribution
distribute_horizontal ( diagrams  :  Diagram[] , space  :  number = 0 )  :  Diagram
// the objects will be distributed from left to right 
// in the order of the array

let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = distribute_horizontal([r1, r2, r3], 1);
draw(rs);
let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = distribute_horizontal([r2, r1, r3], 1);
draw(rs);
distribute_vertical ( diagrams  :  Diagram[] , space  :  number = 0 )  :  Diagram
// the objects will be distributed from top to bottom
// in the order of the array

let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = distribute_vertical([r1, r2, r3], 1);
draw(rs);
Alignment and Distribution
distribute_horizontal_and_align
( diagrams  :  Diagram[] , horizontal_space  :  number , alignment  :  'top' | 'center' | 'bottom' )  :  Diagram

let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = distribute_horizontal_and_align([r1, r2, r3], 1, 'bottom');
draw(rs);
distribute_vertical_and_align
( diagrams  :  Diagram[] , vertical_space  :  number , alignment  :  'left' | 'center' | 'right' )  :  Diagram

let r1 = rectangle(3, 2).fill('blue' ).position(V2( 1,  1));
let r2 = rectangle(2, 3).fill('white').position(V2( 0,  0));
let r3 = rectangle(2, 2).fill('red'  ).position(V2(-1, -1));
let rs = distribute_vertical_and_align([r1, r2, r3], 1, 'right');
draw(rs);
Grid distribution
distribute_grid_row
( diagrams  :  Diagram[] , column_count  :  number , vectical_space  :  number = 0 , horizontal_space  :  number = 0 )  :  Diagram

let r1 = rectangle(3, 2).fill('blue'  );
let r2 = rectangle(2, 3).fill('white' );
let r3 = rectangle(2, 2).fill('red'   );
let r4 = rectangle(3, 3).fill('grey');
let rs = distribute_grid_row([r1, r2, r3, r4], 2, 1, 1);


draw(rs);



Table
red
blue
table.table
( diagrams  :  Diagram[][] , padding  :  number = 0 , orientation  :  'rows'|'column' = 'rows' , 
    min_rowsize  :  number = 0 , min_colsize  :  number = 0 )  :  Diagram

// The diagrams you want to put in a table should be in a 2D array.

let r1 = text('red').fontsize(24);
let r2 = text('blue').fontsize(24);
let r3 = square().fill('red');
let r4 = square().fill('blue');
let t = table.table([[r1,r2],[r3,r4]], 0.5)
draw(t)
Styling The Table
The Tags that available for tables are TAG.TABLE, TAG.TABLE_CELL, and TAG.TABLE_CONTENT. TAG.ROW_ and TAG.COL_ are also available for rows and columns.
red
blue
Invisible Lines
// If you want to hide the border of the table, you can style the table cell 

let r1 = text('red').fontsize(24);
let r2 = text('blue').fontsize(24);
let r3 = square().fill('red');
let r4 = square().fill('blue');
let t = table.table([[r1,r2],[r3,r4]], 0.5)
t = t.apply_to_tagged_recursive(TAG.TABLE_CELL, (d) => d.stroke('none'))
draw(t)
red
blue
Highlight first Row
// All element in row n have the tag `TAG.ROW_+n`

let r1 = text('red').fontsize(24);
let r2 = text('blue').fontsize(24);
let r3 = square().fill('red');
let r4 = square().fill('blue');
let t = table.table([[r1,r2],[r3,r4]], 0.5)
t = t.apply_to_tagged_recursive([TAG.TABLE_CELL, TAG.ROW_+'0'], (d) => d.fill('#ddd'))
draw(t)
red
blue
Highlight selected cell
let r1 = text('red').fontsize(24);
let r2 = text('blue').fontsize(24);
let r3 = square().fill('red');
let r4 = square().fill('blue');
let t = table.table([[r1,r2],[r3,r4]], 0.5)
t = t.apply_to_tagged_recursive([TAG.TABLE_CELL, TAG.ROW_+'0', TAG.COL_+'1'], (d) => d.fill('#ddd'))
draw(t)




Interactivity
Interactivity is a very important feature of Diagramatics. It allows you to add interactivity to your diagrams, and make them more engaging. The interactive objects in Diagramatics are slider, locator, and label.
Setting up Interactivity
In the html file, what you need to have is a div to hold the interactive controls, and also to link the css to style the control elements.

*In the example below, we import Diagramatics as a package. But you can also import it from the CDN
index.html

<!DOCTYPE html>
<html>
    <head>
        <!-- optional css for interactive controls -->
        <link href="diagramatics/css/diagramatics.css" rel="stylesheet">
    </head>
    <body>
        <!-- svg component to draw the diagram -->
        <svg id="mysvg"></svg>

        <!-- optional div to hold interactive controls -->
        <div id="controldiv"></div>
    </body>
    <script src="index.js" type="module"></script>
</html>
        
In the javascript, you need to create the interactive object, let's call it int. Adiga need to pass in the control div and the svg element.
index.js

// import the necessary functions from the library
import {square, draw_to_svg, diagram_combine, V2, Interactive} from 'diagramatics'

// get the svg and control element
let mysvg = document.getElementById('mysvg');
let controldiv = document.getElementById('controldiv');

// define the `draw` helper function
let draw = (...diagrams) => {
    draw_to_svg(mysvg, diagram_combine(...diagrams));
};

// create the interactive object
let int = new Interactive(controldiv, mysvg);

// ================= build the diagram objects ============================

int.draw_function = (inp) => {
    let x = inp['x'];
    let big_sq   = square(10).fill();
    let small_sq = square(2).fill('red').translate(V2(x,0));

    draw(big_sq, small_sq);
}

int.slider('x', -10, 10, 0);
int.draw();

        
Slider
Slider allows you to select a value from a range.


𝑥 = 0

Interactive.slider
( variable_name  :  string , min  :  number , max  :  number , value  :  number , 
    step?  :  number , time?  :  number , display_format_func?  :  formatFunction )

// create the draw_function that will be run each time the interactive control is changed
int.draw_function = (inp) => {
    // read the value of the variable `x`
    let x = inp['x'];

    let big_sq   = square(40);
    let small_sq = square(10).fill('blue').position(V2(x, 0));
    draw(big_sq, small_sq);
}

// create the slider
int.slider('x', -20, 20, 0);
// do the initial draw
// * without the initial draw, the svg object will be blank
//    and will only be drawn after the slider has been moved
int.draw();
Locator
Locator allows you to select a position in a 2D space.
Adiga can have a free locator, or a locator that is constrained to a track.

If you don't define the track_diagram parameter, then the locator will be free.
Interactive.locator
( variable_name  :  string , value  :  Vector2 , radius  :  number , color?  :  string , 
    track_diagram?  :  Diagram , blink?  :  boolean )

// create the draw_function that will be run each time the interactive control is changed
int.draw_function = (inp) => {
    // read the value of the variable `p`
    let p = inp['p'];

    let big_sq   = square(40);
    let small_sq = square(10).fill('lightgray').position(p);
    draw(big_sq, small_sq);
}

// create the locator
int.locator('p', V2(0, 0), 2, 'blue');
// do the initial draw
int.draw();
int.locator_initial_draw();
The locator will snap to the nearest point on the track.
// create the track for the locator
// you have to define it outside the `draw_function`
let pent = regular_polygon(5, 18);

// create the draw_function that will be run each time the interactive control is changed
int.draw_function = (inp) => {
    // read the value of the variable `p`
    let p = inp['p'];

    let big_sq   = square(40).strokedasharray([5]);
    let small_sq = square(5).fill('lightgray').position(p);
    draw(big_sq, pent, small_sq);
}

// create the locator
int.locator('p', V2(0, 0), 2, 'blue', pent);
// do the initial draw
int.draw();
int.locator_initial_draw();
If you want to have more point on the track, you can use the subdivide modifier (mod.subdivide).
// create the track for the locator
// you have to define it outside the `draw_function`
// resample so you have more point to snap to
let pent = regular_polygon(5, 18).apply(mod.subdivide(20));

// create the draw_function that will be run each time the interactive control is changed
int.draw_function = (inp) => {
    // read the value of the variable `p`
    let p = inp['p'];

    let big_sq   = square(40).strokedasharray([5]);
    let small_sq = square(5).fill('lightgray').position(p);
    draw(big_sq, pent, small_sq);
}

// create the locator
int.locator('p', V2(0, 0), 2, 'blue', pent);
// do the initial draw
int.draw();
int.locator_initial_draw();
Label
Label allows you to display a value. Adiga can set the value of the label using int.set(varname : string, value : any).
𝐴 = 0.28274
Interactive.label ( variable_name  :  string , value  :  any , display_format_func?  :  formatFunction )
int.draw_function = (inp) => {
    // read the value of the variable `p`
    let p = inp['p'];
    let r = p.length();

    let sq   = square(2);
    let circ = circle(r).fill('lightgray');

    // calculate the area of the circle
    let area = Math.PI * r * r;
    int.set('A', area);

    draw(sq, circ);
}

int.label('A',0);
int.locator('p', Vdir(to_radian(30)).scale(0.3), 0.1, 'blue');
int.draw();
int.locator_draw();
Custom external interaction
Adiga can also create your own interactive object and interact with Diagramatics using int.set() and int.get().
For example, you can create a custom button.
- +
𝑥 = 0
let button_l = document.getElementById('custom-button-l');
let button_r = document.getElementById('custom-button-r');

int.draw_function = (inp) => {
    // read the value of the variable `x`
    let x = inp['x'];

    let big_sq   = square(40);
    let small_sq = square(10).fill('blue').position(V2(x, 0));
    draw(big_sq, small_sq);
}

int.label('x', 0);
int.draw();

// setup custom behaviour
button_l.onclick = () => {
    int.set('x', int.get('x') - 1);
    int.draw();
}
button_r.onclick = () => {
    int.set('x', int.get('x') + 1);
    int.draw();
}
Toggle Button
*introduced in v1.2.0
0
Interactive.button_toggle
( name  :  string , diagram_on  :  Diagram , diagram_off  :  Diagram , state  :  boolean = false )

let sq = square(40);
let button_off = square(10).fill('lightgrey');
let button_on  = square(10).fill('blue');

// example, binary (boolean) data to decimal string
function bin_to_decstr(x2,x1,x0){
    let val = 0;
    if (x2) val += 4;
    if (x1) val += 2;
    if (x0) val += 1;
    return String(val);
}

int.draw_function = (inp) => {
    let b0 = inp['b0'];
    let b1 = inp['b1'];
    let b2 = inp['b2'];

    let decstr = bin_to_decstr(b2,b1,b0);
    let text = textvar(decstr).fontsize(100).translate(V2(0,5));

    draw(sq, text);
}

let p0 = V2( 12, -12);
let p1 = V2(  0, -12);
let p2 = V2(-12, -12);
int.button_toggle('b0', button_on.position(p0), button_off.position(p0), false);
int.button_toggle('b1', button_on.position(p1), button_off.position(p1), false);
int.button_toggle('b2', button_on.position(p2), button_off.position(p2), false);
int.draw();
Click Button
*introduced in v1.2.0
Interactive.button_click
( name  :  string , diagram  :  Diagram , diagram_pressed  :  Diagram , callback  :  () => any )

// click button doesn't have a state, so it can't be accessed 
// using `int.get()` or `inp[name]` inside `int.draw_function`

let sq = square(40);
let button = square(10).fill('lightgrey');
let button_pressed = square(10).fill('blue');

draw(sq);

const callback = () => {
    alert('button clicked');
}
int.button_click('b', button, button_pressed, callback);
int.draw();
Custom SVG Object
*introduced in v1.2.0
Interactive.custom_object
( id  :  string , classlist  :  string[] , diagram  :  Diagram )  :  SVGSVGElement

// prepare the diagram
let sq   = square(20);
let circ = circle(5).fill('blue').stroke('white');
let obj  = circ.combine(circ.translate(V2(3,0)))
                .move_origin('center-center').position(V2(0,0));
draw(sq);

// `int.custom_object` returns the html SVGSVGElement
let elem = int.custom_object('cust_obj_id', ['random_class'], obj);

// the id and classlist will be added to the element
// you can then modify the element using the usual javascript DOM manipulation
elem.style.cursor = 'pointer';
elem.onclick = () => {
    alert('hi');
}
elem.onmouseenter = () => {
    elem.style.fillOpacity = 0.5;
}
elem.onmouseleave = () => {
    elem.style.fillOpacity = 1;
}

// don't forget to draw
int.draw()
Drag and Drop
*introduced in v1.2.0
Interactive.dnd_container ( name  :  string , diagram  :  Diagram )
// create a Drag and Drop container object
// need to be used in conjunction with `int.dnd_draggable`
a
b
Interactive.dnd_draggable ( name  :  string , diagram  :  Diagram , container_diagram?  :  Diagram )
// create a Drag and Drop draggable object

// prepare the diagrams
let target_box = square(5).fill('lightgrey');
let target0 = target_box.position(V2(-6,0));
let target1 = target_box.position(V2(0,0));
let target2 = target_box.position(V2(6,0));

let texta   = text('a')
let bga     = circle(2).fill('blue');
let sourcea = diagram_combine(texta, bga).position(V2(-3,-6));

let textb   = text('b')
let bgb     = circle(2).fill('blue');
let sourceb = diagram_combine(textb, bgb).position(V2(3,-6));

// create a bounding box rectangle object so that we know the size of the diagram
// if the DnD objects is contained within another diagram, you can simply draw that diagram instead
//        without the need to create a bounding box
let dnd_objects = diagram_combine(sourcea, sourceb, target0, target1, target2);
let dnd_rect = rectangle_corner(...dnd_objects.bounding_box()).stroke('none').fill('none');
draw(dnd_rect);

int.dnd_container('t0', target0)
int.dnd_container('t1', target1)
int.dnd_container('t2', target2)
int.dnd_draggable('a', sourcea, sourcea.fill('lightgrey'))
int.dnd_draggable('b', sourceb, sourceb.fill('lightgrey'))
int.drag_and_drop_initial_draw();
Adiga can access the draggable position by using it's name inside int.draw_function.

NOTE: it's not possible to int.set() the draggable position.
let sq = square(40);
let containerbox = square(10).fill('lightgrey');
let cont0 = containerbox.position(V2(-10,-10));
let cont1 = containerbox.position(V2(10,10));
let cont2 = containerbox.position(V2(10,-10));
let cont3 = containerbox.position(V2(-10,10));
let obj   = circle(4).fill('blue').position(cont3.origin);

int.draw_function = (inp) => {
    let a = inp['a'];
    let l = line(V2(0,0), a);
    draw(sq, l)
}

int.dnd_container('c0', cont0);
int.dnd_container('c1', cont1);
int.dnd_container('c2', cont2);
int.dnd_draggable('a', obj, cont3);
int.draw();
int.drag_and_drop_initial_draw();
Interactive.get_dnd_data ( )  :  {container:string, content:string[]}[]
// retrieve the state data from the DnD objects

// TODO: write example for this
Display Format
By default, the label and slider will display the value as `italic_name` = `value`. Adiga can change the display format by passing in a function to the display_format_func parameter.
The formatFunction have the following signature: (name : string, value : any, prec? : number) => string



𝑥 is 1.00000

formatFunction ( name  :  string , value  :  any , prec?  :  number )  :  string
function my_fmt(name, value, prec){
    return str_to_mathematical_italic(name) + ' is ' + value.toFixed(prec);
}
int.slider('x', 0, 10, 1, undefined, undefined, my_fmt);
int.draw();

Modifier
Modifier is a function that modifies a Diagram. It takes a Diagram as input, and returns a Diagram as output.
Modifier can be applied to a Diagram using the Diagram.apply method.
Diagram.apply ( modifier_function  :  (d : Diagram) => Diagram )  :  Diagram
// `Diagram.apply` takes any function that takes a Diagram as input and returns a Diagram as output
// but diagramatics also provides built-in modifier functions that can be used
* Diagram.apply only apply the function to the outermost diagram. If you want to apply the function recursively, you can use Diagram.apply_recursive.

+
0
0
1
1
2
2
3
3
4
4
5
5
6
6
7
7
8
8
9
9
10
10
11
11
12
12
13
13
14
14
mod.subdivide ( n  :  number )  :  modifierFunction
// Subdivide each segment of a diagram into `n` segments

let pent  = regular_polygon(5, 5).apply(mod.subdivide(3));

draw(pent.debug());
+
0
0
1
1
2
2
3
3
4
4
5
5
6
6
7
7
8
8
9
9
mod.resample ( n  :  number )  :  modifierFunction
// Resample a diagram so that it has `n` points

let pent  = regular_polygon(5, 5).apply(mod.resample(10));

draw(pent.debug());
+
0
0
4
4
8
8
12
12
16
16
20
20
24
24
28
28
32
32
36
36
40
40
44
44
48
48
52
52
56
56
60
60
64
64
68
68
72
72
76
76
80
80
84
84
88
88
92
92
96
96
let pent  = regular_polygon(5, 5).apply(mod.resample(100));

draw(pent.debug());
If n is not a multiple of the number of points, the path will be distorted. In some cases it might be better to use mod.subdivide instead.
+
0
0
1
1
2
2
3
3
4
4
5
5
6
6
7
7
// if the sampling point is too small or not a multiple of the number of points
// the path will be distorted
let pent  = regular_polygon(5, 5).apply(mod.resample(8));

draw(pent.debug());
mod.round_corner ( radius  :  number | number[] , point_indices?  :  number[] , count?  :  number = 40 )  :  modifierFunction
// Modifies a diagram by rounding the corners of a polygon or curve
// `radius` : radius of the corner
// `point_indices` : indices of the points to be rounded
// * if `point_indices` is not provided, all the points will be rounded

// you can check the index of the point by using the `Diagram.debug` method

let sq  = square(5).apply(mod.round_corner(2, [0,2]));

draw(sq);
mod.add_arrow ( headsize  :  number , flip?  :  boolean = false )  :  modifierFunction
// Add an arrow to the end of a curve
// Make sure the diagram this modifier is applied to is a curve
// `headsize` : size of the arrow head
// `flip` : flip the arrow position

let curve = graph.plotf(x => Math.sin(x));
let with_arrow = curve.apply(mod.add_arrow(0.2)).fill('blue');
draw(with_arrow);
mod.arrowhead_replace ( new_arrowhead  :  Diagram )  :  modifierFunction
// Replace arrowhead inside a diagram with another diagram
// The arrow will be rotated automatically
// The default direction is to the right (+x) with the tip at the origin

let diamond = regular_polygon(4).move_origin('center-right').fill('blue');
let arr  = arrow(V2(10,0)).apply(mod.arrowhead_replace(diamond));
draw(arr);
let d  = square(0.4).skewX(1).move_origin('bottom-right').fill('blue');
let ax = axes_empty().apply(mod.arrowhead_replace(d));
draw(ax);
Apply recursively
Diagram.apply_recursive ( modifier_function  :  (d : Diagram) => Diagram )  :  Diagram
let p3 = regular_polygon(3);
let p4 = regular_polygon(4);
let p5 = regular_polygon(5);
let p6 = regular_polygon(6);
let group = distribute_grid_row([p3,p4,p5,p6], 2, 1, 1);
let rounded_group = group.apply_recursive(mod.round_corner(0.1))
draw(rounded_group);

Utilities
Diagramatics provides some utility functions that can be used to create diagrams.
Vector2
// creating a vector object
let va = new Vector2(1,2);

// you can also use the shorthand `V2`
let vb = V2(1,2);

// you can create a unit vector with a given angle using `Vdir`
let vc = Vdir(Math.PI/2); // the same as `V2(0,1)`
Operation on Vector2
let va = V2(1,2);
let vb = V2(3,4);

let vc, x;

// addition
vc = va.add(vb);  // V2(4,6);

// subtraction
vc = va.sub(vb);  // V2(-2,-2);

// scaling
vc = va.scale(2); // V2(2,4);

// multiplication
vc = va.mul(vb);  // V2(3,8);

// rotation from the origin
vc = va.rotate(Math.PI/2); // V2(-2,1);

// dot product
x = va.dot(vb); // 1*3 + 2*4 = 11;

// cross product
// * the cross product in 2D is a scalar
x = va.cross(vb); // 1*4 - 2*3 = -2;

// length
x = va.length(); // sqrt(1*1 + 2*2) = sqrt(5);

// length squared
x = va.length_sq(); // 1*1 + 2*2 = 5;

// angle from the positive x-axis
x = va.angle(); // atan2(2,1) = 1.1071487177940904;

// normalization
vc = va.normalize(); // V2(1/sqrt(5), 2/sqrt(5));

// checking for equality
x = va.equals(vb); // false;

// apply a function
let f = (v) => v.add(V2(1,1));
vc = va.apply(f); // V2(2,3);
// the same as `vc = f(va)`
to_radian ( angle  :  number )
// helper function to convert from degrees to radians

let angle = to_radian(30); // 0.5235987755982988 
let ang2  = to_radian(90); // 1.5707963267948966 = Math.PI/2
to_degree ( angle  :  number )
// helper function to convert from radians to degrees

let angle = to_degree(Math.PI/2); // 90
let ang2  = to_degree(Math.PI/6); // 30
array_repeat ( arr  :  T[] , len  :  number )  :  T[]
// repeat an array until the length is `len`

let arr = [1,2,3];
let new_arr = array_repeat(arr, 5); // [1,2,3,1,2]
linspace ( start  :  number , end  :  number , n  :  number = 100 )  :  number[]
// create an equivalently spaced array of numbers from start to end (inclusive)
// [start, end]

let arr1 = linspace(0, 1, 5); // [0, 0.25, 0.5, 0.75, 1]
let arr2 = linspace(0, 1, 4); // [0, 0.333, 0.666, 1]
linspace_exc ( start  :  number , end  :  number , n  :  number = 100 )  :  number[]
// create an equivalently spaced array of numbers from start to end (exclusice)
// [start, end)

let arr1 = linspace_exc(0, 1, 5); // [ 0, 0.2, 0.4, 0.6, 0.8 ]
let arr2 = linspace_exc(0, 1, 4); // [ 0, 0.25, 0.5, 0.75 ]
range ( start  :  number , end  :  number , step  :  number = 1 )  :  number[]
// create an equivalently spaced array of numbers from start to end (exclusive)
// [start, end)

let arr1 = range(0, 5);    // [0, 1, 2, 3, 4]
let arr2 = range(0, 5, 1); // [0, 1, 2, 3, 4]
let arr3 = range(0, 5, 2); // [0, 2, 4]
let arr4 = range(0, 5, 0.5); // [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]
range_inc ( start  :  number , end  :  number , step  :  number = 1 )  :  number[]
// create an equivalently spaced array of numbers from start to end (inclusive)
// [start, end]

let arr1 = range_inc(0, 5);    // [0, 1, 2, 3, 4, 5]
let arr2 = range_inc(0, 5, 1); // [0, 1, 2, 3, 4, 5]
let arr3 = range_inc(0, 5, 2); // [0, 2, 4]
let arr4 = range_inc(0, 5, 0.5); // [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
Geometry
Diagramatics provide tools to calculate geometric properties of diagrams.
*many more functions that will be added in the future.
geometry.circle_radius ( circle  :  Diagram )  :  number
// Get the radius of a circle object

let c1 = circle(4).scale(0.5).fill('red');
let r  = geometry.circle_radius(c1); // r = 2
let c2 = circle(r).translate(V2(r,0)).fill('blue');
draw(c1, c2);
geometry.circle_tangent_point_from_point ( point  :  Vector2 , circle  :  Diagram )  :  [Vector2, Vector2]
// Get two points on the circle where the tangent line that pass through the given point intersects the circle

let circ = circle(10);
let p0   = V2(-20,-6);
let [p1,p2] = geometry.circle_tangent_point_from_point(p0, circ);

let c0 = circle(0.5).position(p0).fill('black');
let c1 = circle(0.5).position(p1).fill('red');
let c2 = circle(0.5).position(p2).fill('blue');

let l1 = line(p0, p1).stroke('gray');
let l1e = geometry.line_extend(l1, 0, 5);
let l2 = line(p0, p2).stroke('gray');
let l2e = geometry.line_extend(l2, 0, 5);

draw(l1e, l2e, circ, c0, c1, c2);
geometry.line_extend ( l  :  Diagram , len1  :  number , len2  :  number )  :  Diagram
// extends a line by len1 and len2 on each end
// the extension length can be negative

let l0 = line(V2(-5,0), V2(5,0)).strokewidth(2);
let l1 = geometry.line_extend(l0, 2, 2);
let l2 = geometry.line_extend(l0, 2, 0);
let l3 = geometry.line_extend(l0, 0, 2);
let l4 = geometry.line_extend(l0, -2, -2);
let lines = distribute_vertical([
Annotation
Diagramatics provide functions to annotate diagrams.
𝑚𝑔
𝐹
annotation.vector
( v  :  Vector2 , str?  :  string , text_offset?  :  Vector2 , arrow_head_size?  :  number )  :  Diagram

// by default, the text will be in the tip of the arrow,
// you can change the position of the text using `text_offset`

let sq    = square(10);
let vann1 = annotation.vector(V2(0,-8), "mg", V2(1.5,0)   , 0.4)
    .stroke('blue').fill('blue');
let vann2 = annotation.vector(V2(3, 0), "F" , V2(-0.5,1.5), 0.4)
    .stroke('blue').fill('blue')
    .position(sq.get_anchor('center-right'));
draw(sq, vann1, vann2)
𝜃
annotation.angle
( p  :  [Vector2, Vector2, Vector2] , str?  :  string , radius  :  number = 1 , text_offset?  :  Vector2 | number )  :  Diagram

// annotate angle ∠ABC given the point [A,B,C]
// the default position of the text is at distance the point B
// you can change the position of the text using `text_offset`

let points = [V2(4,3), V2(3,0), V2(0,0)]
let tr  = polygon(points);
let ann = annotation.angle(points, "\\theta", 0.4, 0.6)
    .fill('lightblue').strokewidth(2).stroke('blue');
draw(tr, ann);
𝜃
// the order of points determine which angle to be annotated
// the angle will be in the counter-clockwise direction
// *if you want to annotate the smaller angle, use `annotation.angle_smaller`

let points = [V2(0,0), V2(3,0), V2(4,3)]
let tr  = polygon(points);
let ann = annotation.angle(points, "\\theta", 0.4, -0.6)
    .fill('lightblue').strokewidth(2).stroke('blue');
draw(tr, ann);
𝜃
annotation.angle_smaller
( p  :  [Vector2, Vector2, Vector2] , str?  :  string , radius  :  number = 1 , text_offset?  :  Vector2 | number )  :  Diagram

let points = [V2(0,0), V2(3,0), V2(4,3)]
let tr  = polygon(points);
let ann = annotation.angle_smaller(points, "\\theta", 0.4, 0.6)
    .fill('lightblue').strokewidth(2).stroke('blue');
draw(tr, ann);
𝑥
length
( p1  :  Vector2 , p2  :  Vector2 , str  :  string , offset  :  number , 
    tablength?  :  number , textoffset?  :  number , tabsymmetric  :  boolean = true )  :  Diagram

// if not defined, `text_offset` is `2*offset`

let points = [V2(0,0), V2(3,0), V2(4,3)];
let tr  = polygon(points);
let ann = annotation.length(points[1], points[2], 'x', 0.3, 0.2).stroke('blue');
draw(tr, ann);
Axes Options
All the plotting function can be configured by passing in axes_options, which is an object with the following properties:
    xrange    : [number, number],
    yrange    : [number, number],
    bbox?     : [Vector2, Vector2],
    xticks?   : number[],
    yticks?   : number[],
    n_sample? : number,
    headsize  : number,
    
Plotting
plotv ( data  :  Vector2[] , axes_options?  :  Partial<axes_options> )  :  Diagram
// plot a data in the form of Vector2[]

let data = [V2(-1,1), V2(0,0), V2(1,1), V2(2,2)]
let p = plotv(data);
draw(p);
plot ( xdata  :  number[] , ydata  :  number[] , axes_options?  :  Partial<axes_options> )  :  Diagram
// plot a data in the form of xdata and ydata

let xdata = [-1, 0, 1, 2];
let ydata = [1, 0, 1, 2];
let p = plot(xdata, ydata);
draw(p);
plotf ( f  :  (x:number)=>number , axes_options?  :  Partial<axes_options> )  :  Diagram
// plot a function

let f = (x) => Math.sin(x);
let p = plotf(f);
draw(p);
// you can change the domain and range by passing in `axes_options`

let axopt = {
    xrange : [-2*Math.PI, 2*Math.PI],
}
let f = (x) => Math.sin(x);
let p = plotf(f, axopt);
draw(p);
// you can change number of sample points by passing in `axes_options`

let axopt = {
    xrange   : [-2*Math.PI, 2*Math.PI],
    n_sample : 10,
}
let f = (x) => Math.sin(x);
let p = plotf(f, axopt);
draw(p);
Axes
axes_empty ( axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = axes_empty();
draw(ax);
axes_corner_empty ( axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = axes_corner_empty();
draw(ax);
-1
1
-1
1
xyaxes ( axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = xyaxes().fontsize(12);
draw(ax);
-1
0
1
-1
0
1
xycorneraxes ( axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = xycorneraxes();
draw(ax);
xygrid ( axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = xygrid();
draw(ax);
𝑎
𝑏
𝑐
xtickmark ( x  :  number , y  :  number , str  :  string , axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = axes_empty();
let ta = xtickmark(0.5, 0, 'a');
let tb = xtickmark(1.5, 0, 'b');
let tc = xtickmark(-1,  0, 'c', {ticksize: 1});
draw(ax, ta, tb, tc);
𝑎
𝑏
𝑐
ytickmark ( y  :  number , x  :  number , str  :  string , axes_options?  :  Partial<axes_options> )  :  Diagram
let ax = axes_empty();
let ta = ytickmark(0.5, 0, 'a');
let tb = ytickmark(1.5, 0, 'b');
let tc = ytickmark(-1,  0, 'c', {ticksize: 1});
draw(ax, ta, tb, tc);
Size and Position
By default, the size of the axes will be equal to the xrange and yrange defined in the axes_options
-15
-10
-5
5
10
15
-1
1
2
3
let axopt = {
    xrange : [-20, 20],
    yrange : [-2, 4],
}
let ax = xyaxes(axopt).fontsize(12);
draw(ax);
We can change the size of the axes by passing in bbox in the axes_options.

But, if you want to put something in some specific position, the coordinate system will be different. For example, if we try to put a circle in (5,1), this is what we get.
-15
-10
-5
5
10
15
-1
1
2
3
4
let axopt = {
    xrange : [-20, 20],
    yrange : [-2, 5],
    bbox   : [V2(0,0), V2(10,10)],
    headsize : 0.2,
    ticksize : 0.4,
}
let ax = xyaxes(axopt).fontsize(12);
let p  = V2(5,1);
let c  = circle(0.2).position(p).fill('blue');
draw(ax, c);
What we can do to fix that is by using axes_transform()
-15
-10
-5
5
10
15
-1
1
2
3
4
axes_transform ( opt  :  axes_options )  :  (v : Vector2) => Vector2
let axopt = {
    xrange : [-20, 20],
    yrange : [-2, 5],
    bbox   : [V2(0,0), V2(10,10)],
    headsize : 0.2,
    ticksize : 0.4,
}
let transf = axes_transform(axopt); 
// transf is a function (v : Vector2) => Vector2

let ax = xyaxes(axopt).fontsize(12);
let p  = transf(V2(5,1)); // equivalent to `V2(5,1).apply(transf)`;
let c  = circle(0.2).position(p).fill('blue');
draw(ax, c);
Styling
The plotting functions just return a curve, so you can style it like any other curve.
// you can change the domain and range by passing in `axes_options`

let axopt = {
    xrange : [-Math.PI, Math.PI],
    headsize : 0.1,
}

let ax = axes_empty(axopt);
let f = (x) => Math.sin(x);
let g = (x) => x*x - 1.5;

let fplot = plotf(f, axopt).stroke('red').strokewidth(2);
let gplot = plotf(g, axopt).stroke('blue').strokewidth(2);
draw(ax, fplot, gplot);

Bar Options
All the bar function can be configured by passing in bar_options, which is an object with the following properties:
    gap      : number,
    yrange?  : [number, number],
    yticks?  : number[],
    bbox?    : [Vector2, Vector2],
    ticksize : number,
    
Plotting
Adiga can prepare the data in the form of datavalues : number[] and datanames : string[].
bar.plot ( datavalues  :  number[] , bar_options?  :  Partial<bar_options> )  :  Diagram
let data = [10, 8, 12, 15, 7];
let b    = bar.plot(data);
draw(b);
a
b
c
x
ye
bar.xaxes ( datanames  :  string[] , bar_options?  :  Partial<bar_options> )  :  Diagram
let datanames = ['a', 'b', 'c', 'x', 'ye'];
let xx        = bar.xaxes(datanames);
draw(xx);
1
2
3
4
5
6
7
8
9
10
11
12
13
14
bar.yaxes ( datavalues  :  number[] , bar_options?  :  Partial<bar_options> )  :  Diagram
let data = [10, 8, 12, 15, 7];
let yy   = bar.yaxes(data);
draw(yy);
Plot the entire thing
orange
apple
c
d
ye
2
4
6
8
10
12
14
16
18
let baropt = {
    yrange : [0, 20],
}
let data = [10, 8, 12, 15, 7];
let name = ['orange', 'apple', 'c', 'd', 'ye'];
let b    = bar.plot(data, baropt).fill('lightblue');
let xx   = bar.xaxes(name, baropt).move_origin_text('top-left').textangle(to_radian(30));
let yy   = bar.yaxes(data, baropt);
draw(b, xx, yy);
Interact with standard plot
bar data can be translated into axes_options by setting xrange into [-1, data.length].
a
b
c
d
e
2
4
6
8
10
12
14
16
18
let data = [10, 8, 12, 15, 7];
let name = ['a', 'b', 'c', 'd', 'e'];

let baropt = {
    yrange : [0, 20],
    bbox   : [V2(0,0), V2(10,10)],
}
let axopt = {
    xrange : [-1, data.length],
    yrange : baropt.yrange,
    bbox   : baropt.bbox,
}
let ax_f = axes_transform(axopt);

let b    = bar.plot(data, baropt).fill('lightblue');
let xx   = bar.xaxes(name, baropt);
let yy   = bar.yaxes(data, baropt);

let p    = plot(range(0, data.length), data, axopt).strokedasharray([5]);
let c    = circle(0.2).fill('red').position(ax_f(V2(2, data[2])));

draw(b, xx, yy, p, c);

his page contains more technical details about Diagramatics.
Diagram Class
the Diagram class is the main class of Diagramatics. The Diagram class contains the following properties
    type     : DiagramType      // 'polygon', 'curve', 'text', 'image', 'diagram'
    children : Diagram[]        // Diagrams can have children
    path     : Path | undefined // Polygon and Curve have a path
    origin   : Vector2          // position of the origin of the diagram
    mutable  : boolean
    tags     : string[]

    style    : DiagramStyle
    textdata : TextData
    imgdata  : ImageData
    
User should not directly creating objects of Diagram class and modify their properties. Instead, use the functions and methods provided by Diagramatics.
Mutability
By default, Diagrams are immutable. The users should interact with the Diagram object in a functional way. The Diagram object is immutable in the sense that the Diagram object itself will not be modified by the functions and methods provided by Diagramatics. Instead, the functions and methods will return a new Diagram object with the desired properties. The hope of this design is to make the Diagram object easier to reason about.

But there are performance cost to this design. Since javascript is not a functional language, the languange doesn't really optimize it well.

Because of that, Diagramatics also provide a way to make the Diagram object mutable. This is useful when the diagrams is complex and performance is a concern.

*Techincally, since we're using javascript, the object is not really immutable. But methods and functions provided by Diagramatics by default will act as if the object is immutable to the user.

Adiga can set the mutability of a Diagram object by using Diagram.mut
Diagram.mut ( )  :  Diagram
// here, sq, sq0, sq1 is the same object
let sq = square(10).mut();
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.translate(V2(5,5));
draw(sq0, sq1); // sq0 == sq1
// compare to this where sq, sq0, sq1 is different objects
let sq = square(10);
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.translate(V2(5,5));
draw(sq0, sq1);
// for a mutable object, you don't need to assign it to a variable
let sq = square(10).mut();
sq.stroke('grey').strokedasharray([5]);
sq.fill('lightblue');
draw(sq);
Adiga can turn back the diagram to immutable by using Diagram.immut()
Diagram.immut ( )  :  Diagram
// here, sq, sq0, sq1 is the same object
let sq = square(10).mut();
let sq0 = sq.stroke('grey').strokedasharray([5]);
let sq1 = sq.immut().fill('lightblue').translate(V2(5,5));
draw(sq0, sq1);
If you need a copy of a mutable diagram, you can also use Diagram.copy()
Diagram.copy ( )  :  Diagram
// here, sq, sq0, sq1 is the same object
let sq = square(10).mut();
let sq0 = sq.copy().stroke('grey').strokedasharray([5]);
let sq1 = sq.copy().translate(V2(5,5));
draw(sq0, sq1);

Rendering TeX expression
(JSitor example).
To make the system more flexible and to make Diagramatics not dependent on any specific TeX rendering library, Diagramatics provides a way to render TeX expressions using whatever library the user wants.

Adiga just need to provide a function that takes a TeX string and returns the rendered SVG string.

handle_tex_in_svg ( svg  :  SVGElement , texhandler  :  (texstr : string, config : any) => string )
// `svg` is the SVG element where the TeX expressions are to be rendered.
// `texhandler` is a function that takes a TeX string and returns the rendered SVG string.
One example of texhandler is using MathJax.

Adiga can call the handle_tex_in_svg function separately, or you can call it inside the draw function.

draw_tex
// you can load MathJax from CDN
// If you don't want to load the whole MathJax, you can load only the tex-svg.js module
// <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

let handletex = (str, conf) => {
    return MathJax.tex2svg(str, conf).innerHTML;
};
let draw_tex = (...diagrams) => {
    draw_to_svg_element(diagram_svg, diagram_combine(...diagrams));
    handle_tex_in_svg(diagram_svg, handletex);
};
Diagramatics will recognize any text object in the form "$...$" (or "
" for display style) as a TeX object.

let sq = square(20);
let tx = text('$$\\nabla^2\\phi = 0$$').fontsize(24);
draw_tex(sq, tx);

diagramatics
N
annotation
N
bar
N
boolean
N
boxplot
N
curves
N
encoding
N
filter
N
geo_construct
N
geometry
N
graph
N
mechanics
N
mod
N
numberline
N
table
N
tree
N
utils
E
TAG
C
Diagram
C
Interactive
C
Path
C
Vector2
I
draw_to_svg_options
T
axes_options
V
_init_default_diagram_style
V
_init_default_text_diagram_style
V
_init_default_textdata
V
ax
V
default_diagram_style
V
default_text_diagram_style
V
default_textdata
F
align_horizontal
F
align_vertical
F
arc
F
array_repeat
F
arrow
F
arrow1
F
arrow2
F
axes_corner_empty
F
axes_empty
F
axes_transform
F
circle
F
clientPos_to_svgPos
F
curve
F
diagram_combine
F
distribute_grid_row
F
distribute_horizontal
F
distribute_horizontal_and_align
F
distribute_variable_row
F
distribute_vertical
F
distribute_vertical_and_align
F
download_svg_as_png
F
download_svg_as_svg
F
draw_to_svg
F
draw_to_svg_element
F
empty
F
foreign_object
F
get_SVGPos_from_event
F
get_tagged_svg_element
F
handle_tex_in_svg
F
image
F
line
F
linspace
F
linspace_exc
F
multiline
F
multiline_bb
F
plot
F
plotf
F
plotv
F
polygon
F
range
F
range_inc
F
rectangle
F
rectangle_corner
F
regular_polygon
F
regular_polygon_side
F
reset_default_styles
F
square
F
str_latex_to_unicode
F
str_to_mathematical_italic
F
text
F
textvar
F
to_degree
F
to_radian
F
transpose
F
under_curvef
F
V2
F
Vdir
F
xaxis
F
xgrid
F
xtickmark
F
xtickmark_empty
F
xticks
F
xyaxes
F
xycorneraxes
F
xygrid
F
yaxis
F
ygrid
F
ytickmark
F
ytickmark_empty
F
yticks
Member Visibility
Theme
OS
N
annotation
N
bar
N
boolean
N
boxplot
N
curves
N
encoding
N
filter
N
geo_construct
N
geometry
N
graph
N
mechanics
N
mod
N
numberline
N
table
N
tree
N
utils
E
TAG
C
Diagram
C
Interactive
C
Path
C
Vector2
I
draw_to_svg_options
T
axes_options
V
_init_default_diagram_style
V
_init_default_text_diagram_style
V
_init_default_textdata
V
ax
V
default_diagram_style
V
default_text_diagram_style
V
default_textdata
F
align_horizontal
F
align_vertical
F
arc
F
array_repeat
F
arrow
F
arrow1
F
arrow2
F
axes_corner_empty
F
axes_empty
F
axes_transform
F
circle
F
clientPos_to_svgPos
F
curve
F
diagram_combine
F
distribute_grid_row
F
distribute_horizontal
F
distribute_horizontal_and_align
F
distribute_variable_row
F
distribute_vertical
F
distribute_vertical_and_align
F
download_svg_as_png
F
download_svg_as_svg
F
draw_to_svg
F
draw_to_svg_element
F
empty
F
foreign_object
F
get_SVGPos_from_event
F
get_tagged_svg_element
F
handle_tex_in_svg
F
image
F
line
F
linspace
F
linspace_exc
F
multiline
F
multiline_bb
F
plot
F
plotf
F
plotv
F
polygon
F
range
F
range_inc
F
rectangle
F
rectangle_corner
F
regular_polygon
F
regular_polygon_side
F
reset_default_styles
F
square
F
str_latex_to_unicode
F
str_to_mathematical_italic
F
text
F
textvar
F
to_degree
F
to_radian
F
transpose
F
under_curvef
F
V2
F
Vdir
F
xaxis
F
xgrid
F
xtickmark
F
xtickmark_empty
F
xticks
F
xyaxes
F
xycorneraxes
F
xygrid
F
yaxis
F
ygrid
F
ytickmark
F
ytickmark_empty
F
yticks
diagramatics
angle
angle_smaller
congruence_mark
length
parallel_mark
right_angle
vector
boxplot_options
default_bar_options
axes
empty_tickmarks
plotQ
to_ax_options
outer_shadow
TAG
Diagram
Interactive
Path
Vector2
draw_to_svg_options
axes_options
_init_default_diagram_style
_init_default_text_diagram_style
_init_default_textdata
ax
default_diagram_style
default_text_diagram_style
default_textdata
align_horizontal
align_vertical
arc
array_repeat
arrow
arrow1
arrow2
axes_corner_empty
axes_empty
axes_transform
circle
clientPos_to_svgPos
curve
diagram_combine
distribute_grid_row
distribute_horizontal
distribute_horizontal_and_align
distribute_variable_row
distribute_vertical
distribute_vertical_and_align
download_svg_as_png
download_svg_as_svg
draw_to_svg
draw_to_svg_element
empty
foreign_object
get_SVGPos_from_event
get_tagged_svg_element
handle_tex_in_svg
image
line
linspace
linspace_exc
multiline
multiline_bb
plot
plotf
plotv
polygon
range
range_inc
rectangle
rectangle_corner
regular_polygon
regular_polygon_side
reset_default_styles
square
str_latex_to_unicode
str_to_mathematical_italic
text
textvar
to_degree
to_radian
transpose
under_curvef
V2
Vdir
xaxis
xgrid
xtickmark
xtickmark_empty
xticks
xyaxes
xycorneraxes
xygrid
yaxis
ygrid
ytickmark
ytickmark_empty
yticks
Generated using TypeDoc

Function angle
angle(
    p: [Vector2, Vector2, Vector2],
    str?: string,
    radius?: number,
    text_offset?: number | Vector2,
): Diagram
Create an annotation for angle

Parameters
p: [Vector2, Vector2, Vector2]
three points to define the angle

Optionalstr: string
string to be annotated (will be converted to mathematical italic)

radius: number = 1
radius of the arc

Optionaltext_offset: number | Vector2
position offset of the text if given as a number, the text will be placed at the angle bisector with the given distance from the vertex if given as a vector, the text will be placed at the given position offset

Returns Diagram
Defined in shapes/shapes_annotation.ts:31
Member Visibility
Theme
OS
diagramatics
angle
angle_smaller
congruence_mark
length
parallel_mark
right_angle
vector
boxplot_options
default_bar_options
axes
empty_tickmarks
plotQ
to_ax_options
outer_shadow
TAG
Diagram
Interactive
Path
Vector2
draw_to_svg_options
axes_options
_init_default_diagram_style
_init_default_text_diagram_style
_init_default_textdata
ax
default_diagram_style
default_text_diagram_style
default_textdata
align_horizontal
align_vertical
arc
array_repeat
arrow
arrow1
arrow2
axes_corner_empty
axes_empty
axes_transform
circle
clientPos_to_svgPos
curve
diagram_combine
distribute_grid_row
distribute_horizontal
distribute_horizontal_and_align
distribute_variable_row
distribute_vertical
distribute_vertical_and_align
download_svg_as_png
download_svg_as_svg
draw_to_svg
draw_to_svg_element
empty
foreign_object
get_SVGPos_from_event
get_tagged_svg_element
handle_tex_in_svg
image
line
linspace
linspace_exc
multiline
multiline_bb
plot
plotf
plotv
polygon
range
range_inc
rectangle
rectangle_corner
regular_polygon
regular_polygon_side
reset_default_styles
square
str_latex_to_unicode
str_to_mathematical_italic
text
textvar
to_degree
to_radian
transpose
under_curvef
V2
Vdir
xaxis
xgrid
xtickmark
xtickmark_empty
xticks
xyaxes
xycorneraxes
xygrid
yaxis
ygrid
ytickmark
ytickmark_empty
yticks
Generated using TypeDoc
Function angle_smaller
angle_smaller(
    p: [Vector2, Vector2, Vector2],
    str?: string,
    radius?: number,
    text_offset?: number | Vector2,
): Diagram
Create an annotation for angle (always be the smaller angle)

Parameters
p: [Vector2, Vector2, Vector2]
three points to define the angle

Optionalstr: string
string to be annotated (will be converted to mathematical italic)

radius: number = 1
radius of the arc

Optionaltext_offset: number | Vector2
position offset of the text if given as a number, the text will be placed at the angle bisector with the given distance from the vertex if given as a vector, the text will be placed at the given position offset

Returns Diagram
Defined in shapes/shapes_annotation.ts:69

annotationcongruence_mark
Function congruence_mark
congruence_mark(
    p1: Vector2,
    p2: Vector2,
    count: number,
    size?: number,
    gap?: number,
): Diagram
Create a congruence mark

Parameters
p1: Vector2
start point of the line

p2: Vector2
end point of the line

count: number
number of marks

size: number = 1
size of the mark

Optionalgap: number
gap between the marks

Returns Diagram
annotationlength
Function length
length(
    p1: Vector2,
    p2: Vector2,
    str: string,
    offset: number,
    tablength?: number,
    textoffset?: number,
    tabsymmetric?: boolean,
): Diagram
Parameters
p1: Vector2
p2: Vector2
str: string
offset: number
Optionaltablength: number
Optionaltextoffset: number
tabsymmetric: boolean = true
Function parallel_mark
parallel_mark(
    p1: Vector2,
    p2: Vector2,
    count: number,
    size?: number,
    gap?: number,
    arrow_angle?: number,
): Diagram
Create a parallel mark

Parameters
p1: Vector2
start point of the line

p2: Vector2
end point of the line

count: number
number of marks

size: number = 1
size of the mark

Optionalgap: number
gap between the marks

arrow_angle: number = 0.5
angle of the arrow

Returns Diagram
Function right_angle
right_angle(p: [Vector2, Vector2, Vector2], size?: number): Diagram
Create an annotation for right angle make sure the angle is 90 degree

Parameters
p: [Vector2, Vector2, Vector2]
three points to define the angle

size: number = 1
size of the square

Function vector
vector(
    v: Vector2,
    str?: string,
    text_offset?: Vector2,
    arrow_head_size?: number,
): Diagram
Create an annotation vector

Parameters
v: Vector2
vector to be annotated

Optionalstr: string
string to be annotated (will be converted to mathematical italic) if you don't want to convert to mathematical italic, use annotation.vector_text

Optionaltext_offset: Vector2
position offset of the text

Optionalarrow_head_size: number
size of the arrow head

Type Alias bar_options
type bar_options = {
    bbox?: [Vector2, Vector2];
    gap: number;
    ticksize: number;
    yrange?: [number, number];
    yticks?: number[];
}
Defined in shapes/shapes_bar.ts:6
Properties
P
bbox?
P
gap
P
ticksize
P
yrange?
P
yticks?
Optionalbbox
bbox?: [Vector2, Vector2]
Defined in shapes/shapes_bar.ts:10
gap
gap: number
Defined in shapes/shapes_bar.ts:7
ticksize
ticksize: number
Defined in shapes/shapes_bar.ts:11
Optionalyrange
yrange?: [number, number]
Defined in shapes/shapes_bar.ts:8
Optionalyticks
yticks?: number[]
Variable default_bar_options
default_bar_options: bar_options = ...
Defined in shapes/shapes_bar.ts:14

