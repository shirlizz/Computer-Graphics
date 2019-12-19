export {vsPhong, fsPhongDiffuse, fsPhongSpecular, vsGouraudDiffuse, vsGouraudSpecular, fsGouraud}
//-----------------------------------------------------------------------------------------------
//Activate canvas from html
var canvas = document.querySelector('canvas')

//Initialize WebGL in canvas
var gl = WebGLUtils.setupWebGL(canvas);

//Error handling
if (!gl){
    alert("WebGL isn't available");
}

//Set the viewport 
gl.viewport( 0, 0, canvas.width, canvas.height );

//Specify the color values used when clearing color buffers
gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

//Enable depth comparisons and updates to the depth buffer
gl.enable(gl.DEPTH_TEST);

//-------------------------------------PHONG VERTEX SHADER-------------------------------------

const vsPhong = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vsPhong, `
//medium precision of the GPU to calculate floats
precision mediump float;

//Data pulled from buffers
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

//Global values for all vertices of a single draw call
uniform mat4 MVMatrix;
uniform mat4 PMatrix; 
uniform mat4 uNMatrix;

//Data passing to fragment shader
varying vec3 normalInterp;
varying vec3 vertPos;

void main() {
    vec4 vertPos4 = MVMatrix * vec4(aVertexPosition, 1.0);

    vertPos = vec3(vertPos4) / vertPos4.w;

    normalInterp = aVertexNormal;
    gl_Position = PMatrix * vertPos4;
}    
`);

gl.compileShader(vsPhong);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(vsPhong, gl.COMPILE_STATUS);
console.log('Vertex shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vsPhong);
console.log('Shader compiler log: ' + compilationLog);

//-----------------------PHONG DIFFUSE FRAGMENT SHADER-------------------------

const fsPhongDiffuse = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fsPhongDiffuse, `
//low precision of the GPU to calculate floats
precision lowp float;

//Data recieved from vertex shader
varying vec3 normalInterp;
varying vec3 vertPos;

//Global values
uniform vec4 vLightPosition;
uniform vec4 vLightDiffuseColor;
uniform vec4 vLightAmbientColor;
uniform vec4 vLightSpecularColor;

void main() {
    vec3 N = normalInterp; //16
    vec3 L = normalize((vLightPosition.xyz));
    vec3 R = reflect(-L, N);
    vec3 v = normalize(vertPos); 
    float lambertian = max(dot(N,L), 0.0);
    
    gl_FragColor = 1.0*vLightAmbientColor +  1.0*lambertian*vLightDiffuseColor;
}
`); // Red color is assigned to the pixels
gl.compileShader(fsPhongDiffuse);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(fsPhongDiffuse, gl.COMPILE_STATUS);
console.log('Fragment shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(fsPhongDiffuse);
console.log('Shader compiler log: ' + compilationLog);

//------------------------PHONG SPECULAR FRAGMENT SHADER------------------------------

const fsPhongSpecular = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fsPhongSpecular, `
precision lowp float;

varying vec3 vertPos;
varying vec3 normalInterp;

uniform vec4 vLightPosition;
uniform vec4 vLightDiffuseColor;
uniform vec4 vLightAmbientColor;
uniform vec4 vLightSpecularColor;

void main() {

    vec3 N = normalInterp; //16
    vec3 L = normalize((vLightPosition.xyz));
    vec3 R = reflect(-L, N);
    vec3 v = normalize(vertPos); 
    float specAngle = max(dot(R,v), 0.0);
    float specular = pow(specAngle, 100.0);
    
    gl_FragColor = 1.0*vLightAmbientColor +  specular*vLightSpecularColor;
    
}
`); // Red color is assigned to the pixels
gl.compileShader(fsPhongSpecular);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(fsPhongSpecular, gl.COMPILE_STATUS);
console.log('Fragment shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(fsPhongSpecular);
console.log('Shader compiler log: ' + compilationLog);

//---------------------------GOURAUD DIFFUSE VERTEX SHADER----------------------------

const vsGouraudDiffuse = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vsGouraudDiffuse, `
precision lowp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 color;

uniform int mode;
uniform mat4 MVMatrix;
uniform mat4 PMatrix; 
uniform int shadow;
uniform vec4 vLightPosition;
uniform vec4 vLightDiffuseColor;
uniform vec4 vLightAmbientColor;
uniform vec4 vLightSpecularColor;

varying vec3 vNormal;
varying vec4 vColor;

void main() {

    vec4 vertex = MVMatrix*vec4(aVertexPosition,1.0);
    gl_Position = PMatrix*vertex;

    if(shadow == 1){
        vColor = vec4(0,0,0,1);
    }

    else {
        vNormal = aVertexNormal;
        vec3 lightDir = normalize(vLightPosition.xyz);
        vec3 R = reflect(lightDir, vNormal);
        vec3 v = normalize(vec3(vertex)); 
        float lambertian = max(dot(vNormal, -lightDir), 0.0);
        
        vColor = 2.0*vLightAmbientColor + 1.0*lambertian*vLightDiffuseColor;         
    }        
}
`);
gl.compileShader(vsGouraudDiffuse);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(vsGouraudDiffuse, gl.COMPILE_STATUS);
console.log('Vertex shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vsGouraudDiffuse);
console.log('Shader compiler log: ' + compilationLog);


//-------------------GOURAUD SPECULAR VERTEX SHADER------------------------

const vsGouraudSpecular = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vsGouraudSpecular, `
precision lowp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 color;

uniform int mode;
uniform mat4 MVMatrix;
uniform mat4 PMatrix; 
uniform int shadow;

uniform vec4 vLightPosition;
uniform vec4 vLightDiffuseColor;
uniform vec4 vLightAmbientColor;
uniform vec4 vLightSpecularColor;

varying vec3 vNormal;
varying vec4 vColor;

void main() {

    vec4 vertex = MVMatrix*vec4(aVertexPosition,1.0);
    gl_Position = PMatrix*vertex;

    if(shadow == 1) {
        vColor = vec4(0,0,0,1);
    }

    else {
        vNormal = aVertexNormal;
        vec3 lightDir = normalize(vLightPosition.xyz);
        vec3 R = reflect(lightDir, vNormal);
        vec3 v = normalize(vec3(vertex)); 
       
        float specAngle = max(dot(R,v), 0.0);
        float specular = pow(specAngle, 10.0);

        vColor = 2.0*vLightAmbientColor + specular*vLightSpecularColor;         
    }        
}
`);
gl.compileShader(vsGouraudSpecular);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(vsGouraudSpecular, gl.COMPILE_STATUS);
console.log('Vertex shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(vsGouraudSpecular);
console.log('Shader compiler log: ' + compilationLog);

//-----------------------GOURAUD FRAGMENT SHADER----------------------------

const fsGouraud = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fsGouraud, `
precision mediump float;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}
`);
gl.compileShader(fsGouraud);

//COMPILATION STATUS
var compiled = gl.getShaderParameter(fsGouraud, gl.COMPILE_STATUS);
console.log('Fragment shader compiled successfully: ' + compiled);
var compilationLog = gl.getShaderInfoLog(fsGouraud);
console.log('Shader compiler log: ' + compilationLog);
