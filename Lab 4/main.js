//=================Creando canvas============================================
//import {AMORTIZATION,drag,old_x,old_u,dX,dY,mouseDown, mouseMove, mouseUp, rotateX, rotateY}

const canvas=document.querySelector ('canvas'); // It grabs a reference to canvas
const gl=canvas.getContext('webgl'); // Get a context on webgl
if (!gl) //Verify if it is null or not
{
	throw new Error ('WebGL not supported'); //If the sentence is null it shows an error message
}


//=================================


var at = vec3.create();
var up = vec3.create();
var eye = vec3.create();
at =  [0.3, 0.0, 0.0];
up =  [0.0, 1.0, 0.0];
eye = [0.1, 0.2, 1.0];


var time_old = 0;
var AMORTIZATION = 0.95;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;
var THETA = 0;
var PHI = 0;
//=================================




//===================Vertices=======================

//Building Vertex Data with points of a triangle
const vertexData = [
// Cara delantera
  -0.5, -0.5,  0.5, //0
   0.5, -0.5,  0.5, //1
   0.5,  0.5,  0.5, //2
  -0.5,  0.5,  0.5, //3

  // Cara trasera
  -0.5, -0.5, -0.5, //4
  -0.5,  0.5, -0.5, //5
   0.5,  0.5, -0.5, //6
   0.5, -0.5, -0.5, //7


];

//===================Indices============================================
var vertexIndices = [
  0,  1,  2,    0,  2,  3,  // enfrente
  4,  5,  6,    4,  6,  7,  // atrás
  5,  3,  2,    5,  2, 6,   // arriba
  4, 7, 1,      4, 1, 0,    // fondo
  7, 6, 2,      7, 2, 1,    // derecha
  4, 0, 3,      4, 3, 5     // izquierda
];

//===================Colores ==============================================
function randomColor() {
    return [Math.random(), Math.random()];
}

let colorData = [];
for (let face = 0; face < 4; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 4; vertex++) {
        colorData.push(...faceColor);
    }
}

//==========================Almacenando vertices ,indices y colores====================
//Construct a buffer: kind of array keeping data in JS script
const positionBuffer = gl.createBuffer(); //Create a data structure which will store vertex positions
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //// Bind appropriate array buffer to it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //Pass the vertex data to the buffer


const indexpositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexpositionBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);


const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

//=========================Shaders===============================================
//Create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform  mat4 matrix1;
void main() {
		vColor = color;
    gl_Position = matrix1 * vec4(position, 1);
}
`); //return position
gl.compileShader(vertexShader);
var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
console.log('Vertex shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vertexShader);
console.log('Shader compiler log: ' + compilationLog);





//Create Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Take the input position and transform it into a color
gl.shaderSource(fragmentShader, `
	precision mediump float;
	varying vec3 vColor;
	void main() {
	    gl_FragColor = vec4(vColor, 1);
	}
	`);// Stablish the color of the pixel
gl.compileShader(fragmentShader);
//console.log(gl.getShaderInfoLog(fragmentShader));
var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
console.log('Fragment shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vertexShader);
console.log('Shader compiler log: ' + compilationLog);



const program = gl.createProgram();// Create a program
// Connect the program with the shaders
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program); //It ties everything together and verify if vertex and shaders are compatible with each other

//=====================Asosciando atributos a los shaders=====================================

const positionLocation = gl.getAttribLocation(program, `position`);// Get a reference like an index
gl.enableVertexAttribArray(positionLocation); // Enable the attribute
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);// Point an attribute to the currently bound Vertex Buffer

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

//var mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];

gl.useProgram(program); //Tell to GPU which program we will use
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
	matrix: gl.getUniformLocation(program, `matrix1`),
};


var mouseDown = function(e) {
    drag = true;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
    return false;
};

var mouseUp = function(e){
            drag = false;
};

var mouseMove = function(e) {
    if (!drag) return false;
    dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
    dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
    THETA= dX;
    PHI=dY;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
};

//const matrix2 = mat4.create();
canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);

function rotateX(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var mv1 = m[1], mv5 = m[5], mv9 = m[9];

	m[1] = m[1]*c-m[2]*s;
	m[5] = m[5]*c-m[6]*s;
	m[9] = m[9]*c-m[10]*s;

	m[2] = m[2]*c+mv1*s;
	m[6] = m[6]*c+mv5*s;
	m[10] = m[10]*c+mv9*s;
}

function rotateY(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

	m[0] = c*m[0]+s*m[2];
	m[4] = c*m[4]+s*m[6];
	m[8] = c*m[8]+s*m[10];

	m[2] = c*m[2]-s*mv0;
	m[6] = c*m[6]-s*mv4;
	m[10] = c*m[10]-s*mv8;
 }


//const finalMAtrix = mat4.create();



//========================= funciones de transformaciones======================================
var m4CG= {
	translation: function(tx,ty,tz){
		return[
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			tx,ty,tz,1
		];
	},
	scaling:function(sx,sy,sz){
		return [
			sx,0,0,0,
			0,sy,0,0,
			0,0,sz,0,
			0,0,0,1,
		];
	},

	projectionz: function(d){
		return [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,-1/d,0,
		]
	}
};

//===============================Matrices=====================================
//const matrix2=mat4.create();

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,75*Math.PI/180,
								800/560,//canvas.width/ canvas.lenght
								0.0001, //near
								1000 //far
);

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();

//const finalMatrix = mat4.create();

var translationMatrix=m4CG.translation(-1.5,50,-2);
var translationViewMatrix = m4CG.translation(-1,0,2);
var scaleMatrix=m4CG.scaling(5,5,5);
var scalationViewMatrix = m4CG.scaling(10,10,10)
mat4.multiply(modelMatrix,modelMatrix,translationMatrix);
mat4.multiply(viewMatrix,viewMatrix, translationViewMatrix);
mat4.multiply(modelMatrix,modelMatrix,scaleMatrix);
mat4.multiply(viewMatrix,viewMatrix,scalationViewMatrix);
mat4.invert(viewMatrix,viewMatrix);





//=================Dibujando==========================================
var animate= function (time){

	
	
	var dt = time-time_old;

	if (!drag) {
		dX *= AMORTIZATION, dY*=AMORTIZATION;
		THETA=dX, PHI=dY;
	}

	rotateY(eye,THETA);


	// eye[1] = eye[1] -16
	rotateX(eye,PHI);
	// eye[1] = eye[1] +16

	time_old = time; 
	//gl.enable(gl.DEPTH_TEST);

	  //gl.depthFunc(gl.LEQUAL);


  	mat4.lookAt(modelMatrix, eye, at, up);
	//mat4.lookAt(viewMatrix, [0.5,50,1],[0,50,0],[0,50,0]);
	//mat4.rotateY(modelMatrix, modelMatrix, Math.PI/2 / 70);
	//mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / 70);
	mat4.multiply(mvMatrix,viewMatrix, modelMatrix);
	mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);
	gl.uniformMatrix4fv(uniformLocations.matrix,false,mvpMatrix)
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	requestAnimationFrame(animate);	
}

animate(0);
