
const canvas=document.querySelector ('canvas'); // It grabs a reference to canvas
const gl=canvas.getContext('webgl'); // Get a context on webgl

// Verify the compatibility of the browser
if (!gl) //Verify if it is null or not
{
	throw new Error ('WebGL not supported'); //If the sentence is null it shows an error message
}

//Building Vertex Data with points of a triangle
const vertexData = [
0,1,0, //V1
1,-1,0,//V2
-1,-1,0,//V3
]

//Construct a buffer: kind of array keeping data in JS script
const buffer = gl.createBuffer(); //Create a data structure which will store vertex positions
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); //// Bind appropriate array buffer to it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //Pass the vertex data to the buffer


//Create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
}
`); //return position
gl.compileShader(vertexShader);


//Create Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Take the input position and transform it into a color
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);// Stablish the color of the pixel
gl.compileShader(fragmentShader);



const program = gl.createProgram();// Create a program
// Connect the program with the shaders
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program); //It ties everything together and verify if vertex and shaders are compatible with each other


const positionLocation = gl.getAttribLocation(program, `position`);// Get a reference like an index
gl.enableVertexAttribArray(positionLocation); // Enable the attribute
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);// Point an attribute to the currently bound Vertex Buffer

gl.useProgram(program); //Tell to GPU which program we will use
gl.drawArrays(gl.TRIANGLES, 0, 3);// Run the program by drawing triangles (in this case justo one triangle)
