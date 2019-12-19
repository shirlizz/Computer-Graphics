import {cube_GetInfo, textureCoordinates} 	from "../lib/forms.js"
import {m4CG} 								from "../lib/transformations.js"

const canvas=document.querySelector ('canvas');
const gl=canvas.getContext('webgl');
if (!gl)
{
	throw new Error ('WebGL not supported');
}

var cube = cube_GetInfo();

//---------------------------------------------------------------------

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);

//Texture Buffer
const textureBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

//Create a texture
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

//Fill the texture with a 1x1 blue pixel.
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
	new Uint8Array([0, 0, 255, 255]));

//Asynchronously load an image
var image = new Image();
image.src = "../lib/noodles.jpg";
image.addEventListener('load', function() {
	//Now that the image has loaded make copy it to the texture.
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
	gl.generateMipmap(gl.TEXTURE_2D);
});

//--------------------------------------------------------------------

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec2 aTexCoord;

uniform mat4 matrix1;

varying vec2 vTexCoord;

void main() {
	gl_Position = matrix1 * vec4(position, 1);
	
	//Pass the texcoord to the fragment shader
	vTexCoord = aTexCoord;
}
`);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

// Passed in from the vertex shader.
varying vec2 vTexCoord;

// The texture.
uniform sampler2D uTexture;

void main() {
	gl_FragColor = texture2D(uTexture, vTexCoord);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
	
const positionLocation = gl.getAttribLocation(program, `position`);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

//For texture
const textcoordLocation = gl.getAttribLocation(program, `aTexCoord`);
gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
gl.enableVertexAttribArray(textcoordLocation);
gl.vertexAttribPointer(textcoordLocation, 2, gl.FLOAT, false, 0, 0);

//-----------------------------------------------------------------
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);//Activar profundidad para ver las 3D

const uniformLocations = {
	matrix  : gl.getUniformLocation(program,`matrix1`),
	atexture: gl.getUniformLocation(program,`aTextCoord`)
};

const matrix2 = mat4.create();

//var scaleMatrix = m4CG.scaling(2,1.5,0);
//mat4.multiply(matrix2,matrix2, scaleMatrix);

var rotateX = m4CG.rotationX(Math.PI/360);
var rotateY = m4CG.rotationY(Math.PI/360);
var rotateZ = m4CG.rotationZ(Math.PI/360);

mat4.multiply(matrix2,matrix2,m4CG.rotationZ(Math.PI));

function render(){
	requestAnimationFrame(render);
	mat4.multiply(matrix2, matrix2, rotateY);
	mat4.multiply(matrix2, matrix2, rotateZ);
	mat4.multiply(matrix2, matrix2, rotateX);
	gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix2);
	gl.uniform1i(uniformLocations.atexture, 0);
	gl.drawArrays(gl.TRIANGLES, 0, cube.vertices.length/3);
};
render();
