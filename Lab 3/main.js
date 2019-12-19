
const canvas=document.querySelector ('canvas'); // It grabs a reference to canvas
const gl=canvas.getContext('webgl'); // Get a context on webgl



// Verify the compatibility of the browser
if (!gl) //Verify if it is null or not
{
	throw new Error ('WebGL not supported'); //If the sentence is null it shows an error message
}

//Building Vertex Data with points of a triangle
const vertexData = [
	// Front face
         0.0,  0.5,  0.0,
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,

        // Right face
         0.0,  0.5,  0.0,
         0.5, -0.5,  0.5,
         0.5, -0.5, -0.5,

        // Back face
         0.0,  0.5,  0.0,
         0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,

        // Left face
         0.0,  0.5,  0.0,
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,

				//base
				-0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
				 0.5, -0.5, -0.5,
				 0.5, -0.5, -0.5,
				-0.5, -0.5, -0.5,
				-0.5, -0.5,  0.5,

];

const colorData = [
     0.8,0.2,0.2,
		 0.8,0.2,0.2,
		 0.8,0.2,0.2,

     0,0.5,0.3,
		 0,0.5,0.3,
		 0,0.5,0.3,

     0,0.1,0.3,
		 0,0.1,0.3,
		 0,0.1,0.3,

		 0.5,0.5,0.2,
		 0.5,0.5,0.2,
		 0.5,0.5,0.2,

		 0.1,0.6,0,
		 0.1,0.6,0,
		 0.1,0.6,0,
		 0.1,0.6,0,
		 0.1,0.6,0,
		 0.1,0.6,0,
];


//function randomColor() {
//    return [Math.random(), Math.random(), Math.random()];
//}

/*let colorData = [
     ...randomColor(),
     ...randomColor(),
     ...randomColor(),
];*/

/*
let colorData = [];
for (let face = 0 ; face <6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 3; vertex++) {
        colorData.push(...faceColor);
    }
};*/

//Construct a buffer: kind of array keeping data in JS script
const positionBuffer = gl.createBuffer(); //Create a data structure which will store vertex positions
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //// Bind appropriate array buffer to it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //Pass the vertex data to the buffer

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

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


const program = gl.createProgram();// Create a program
// Connect the program with the shaders
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program); //It ties everything together and verify if vertex and shaders are compatible with each other


const positionLocation = gl.getAttribLocation(program, `position`);// Get a reference like an index
gl.enableVertexAttribArray(positionLocation); // Enable the attribute
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);// Point an attribute to the currently bound Vertex Buffer

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program); //Tell to GPU which program we will use
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
	matrix: gl.getUniformLocation(program, `matrix1`),
};
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
};

const matrix2=mat4.create();
//var translationMatrix=m4CG.translation(0.5,0.5,0);
//var scaleMatrix=m4CG.scaling(0.1,0.5,0);
//mat4.multiply(matrix2,matrix2, translationMatrix);
//mat4.multiply(matrix2, matrix2, scaleMatrix);





function render(){
	// Clear the canvas
	gl.clearColor(0.1, 0.3, 0.2, 0.3);
	// Enable the depth test
	gl.enable(gl.DEPTH_TEST);
	// Clear the color buffer bit
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Set the view port
	gl.viewport(0,0,canvas.width,canvas.height);

	requestAnimationFrame(render);
	mat4.rotateY(matrix2, matrix2, Math.PI/2 / 70);
	mat4.rotateX(matrix2, matrix2, Math.PI/2 / 70);
	gl.uniformMatrix4fv(uniformLocations.matrix,false,matrix2)
	gl.drawArrays(gl.TRIANGLES,0,vertexData.length/3);

}

render();
