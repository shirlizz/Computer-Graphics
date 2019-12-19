const canvas=document.querySelector ('canvas'); // It grabs a reference to canvas
const gl=canvas.getContext('webgl'); // Get a context on webgl

// Verify the compatibility of the browser
if (!gl) //Verify if it is null or not
{
    throw new Error ('WebGL not supported'); //If the sentence is null it shows an error message
}
/*
var obj =loadObj(gl,"/home/gisel/Descargas/Example-3D Object, Sphere/Demo");
obj.normalObject
obj.texCoordObject
obj.vertexObject
obj.numIndices*/
//ingresar desde los arrays
//ex:
//obj.normalObject=newBuffer
/*
var sphere= sphere_GetInfo();
var vertexData = sphere.vertexData;
var colorData=sphere.colorData;
var indices=sphere.indicesData;*/

var icosahedron= icosahedron_GetInfo();
var vertexData = icosahedron.vertexData;
var colorData=icosahedron.colorData;
var indices=icosahedron.indicesData;





//Building Vertex Data with points of a triangle


function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
};

/*let colorData = [
     ...randomColor(),
     ...randomColor(),
     ...randomColor(),

];*/

//Construct a buffer: kind of array keeping data in JS script
const positionBuffer = gl.createBuffer(); //Create a data structure which will store vertex positions
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //// Bind appropriate array buffer to it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //Pass the vertex data to the buffer

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const indexbuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);



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

    projectionz:function(d){
        return [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,-1/d,0,
        ]
    }
};





//const matrix2=mat4.create();

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,75*Math.PI/180,
                                                                    800/560,//canvas.width/ canvas.lenght
                                                                    0.0001, //near
                                                                    1100 //far
);

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();
var translationMatrix=m4CG.translation(-2.5,3,-4);
var translationViewMatrix = m4CG.translation(-3,3,2 );

var scaleMatrix=m4CG.scaling(0.5,0.5,0.5);
mat4.multiply(modelMatrix,modelMatrix,translationMatrix);
mat4.multiply(viewMatrix,viewMatrix, translationViewMatrix);
mat4.invert(viewMatrix,viewMatrix);
function render(){
    requestAnimationFrame(render);
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI/2 / 70);
    mat4.multiply(mvMatrix,viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix,false,mvpMatrix)
    //gl.drawArrays(gl.TRIANGLES,0,vertexData.length/3);

//  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexbuffer);

    gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
}

render();
