import {drawCup} from "../lib/forms.js"
import {mouseDown, mouseMove, mouseUp, mp, rotateX, rotateY} from "../lib/mouse.js"

const canvas=document.querySelector ('canvas');
const gl=canvas.getContext('webgl'); // imports the library WebGL
if (!gl) // checks that WebGl is imported correctly.
{
	throw new Error ('WebGL not supported');
}


var theta  = 0.0;
var time_old = 0; //For mouse animation
var at = vec3.create();
var up = vec3.create();
var eye = vec3.create();
at =  [0.0, 0.5, 0.0];
up =  [0.0, 1.0, 0.0];
eye = [2.0, 0.0, 0.0];


var cup = drawCup(200);

console.log("Vertex length: " + cup.verticesCup.length)
const positionBuffer = gl.createBuffer(); // Buffers are necessary to save data in memory before drawing the objects
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cup.verticesCup), gl.STATIC_DRAW);


const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cup.indicesCup), gl.STATIC_DRAW);



const projectionMatrix = mat4.create();

mat4.perspective(
    projectionMatrix, 
    75*Math.PI/200, //alpha
    800/560, //canvas.width/canvas.height,
    0.001, //near
    100000, //far
);

const finalMatrix = mat4.create();




const vertexShader = gl.createShader(gl.VERTEX_SHADER); // The vertex shader is related to the vertices of the objects
gl.shaderSource(vertexShader, `
attribute vec3 position;
uniform mat4 matrix1;
void main() {
    gl_Position = matrix1*vec4(position, 1);
}
`);
gl.compileShader(vertexShader); //Compiles the vertex shader in execution time


var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
console.log('Vertex shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vertexShader);
console.log('Shader compiler log: ' + compilationLog);


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // The fragment shader is related to the pixels
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0.5, 0.5, 0.5, 0.9); 
}
`); // Red color is assigned to the pixels
gl.compileShader(fragmentShader); // Compiles the fragment shader in execution time


var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
console.log('Fragment shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vertexShader);
console.log('Shader compiler log: ' + compilationLog);


const program = gl.createProgram(); // It is like creating the scene
gl.attachShader(program, vertexShader); // Attachs the vertex shader to the scene
gl.attachShader(program, fragmentShader); // Attachs the fragment shader to the scene
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`); // In this part the variabie cup.verticesCup is matched to the position to draw the triangle
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);




gl.useProgram(program); // Specify which scene we are going to use
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix:gl.getUniformLocation(program, `matrix1`), // getUniformLocation permite buscar un objeto que se compile en tiempo de ejecucion
};

const matrix2 = mat4.create();

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);

var animate = function (time){

    if (!mp.drag) {
        mp.dX *= mp.AMORTIZATION, mp.dY*=mp.AMORTIZATION;
        mp.THETA=mp.dX, mp.PHI=mp.dY;
        }
    rotateY(eye, mp.THETA);


   // eye[1] = eye[1] -16
    rotateX(eye, mp.PHI);
   // eye[1] = eye[1] +16
    

    time_old = time; 


    theta += 0.1;
    if(theta > 2*Math.PI) theta -= 2*Math.PI;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // model-view matrix for square

    mat4.lookAt(matrix2, eye, at, up);
    mat4.multiply(finalMatrix,projectionMatrix,matrix2)
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawElements(gl.TRIANGLES, (cup.indicesCup).length, gl.UNSIGNED_SHORT,0); // Say what to draw
    //gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT,0);
    requestAnimationFrame(animate);
}

animate(0);