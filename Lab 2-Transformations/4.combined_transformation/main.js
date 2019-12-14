
const canvas=document.querySelector ('canvas');
const gl=canvas.getContext('webgl');
if (!gl)
{
	throw new Error ('WebGL not supported');
}
const vertexData = [
  0.5,0.5, 0.0,
  0.5,-0.5, 0.0,
  -0.5,0.5, 0.0,
  -0.5,0.5, 0.0,
  0.5,-0.5,0.0,
  -0.5,-0.5,0.0,
]
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
uniform mat4 matrix1;
void main() {
    gl_Position = matrix1*vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0.5, 0.2, 0.6, 0.9);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const uniformLocations={
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
	shear:function(shx,shy,shz){
		return[
			1, shx,0,0,
			shy,1,0,0,
			0,0,1,0,
			0,0,shz,1,
		];
	},
};

const matrix2=mat4.create();
var translationMatrix=m4CG.translation(0.5,0.5,0);
var scaleMatrix=m4CG.scaling(0.3,0.5,0);
var shearMatrix=m4CG.shear(-0.5,-0.5,-0.3);

mat4.multiply(matrix2,matrix2, translationMatrix);
mat4.multiply(matrix2, matrix2, scaleMatrix);
mat4.multiply(matrix2, matrix2, shearMatrix);

gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix2);
gl.drawArrays(gl.TRIANGLES, 0, 6);

function animate(){
	requestAnimationFrame(animate);
	mat4.rotateY(matrix2,matrix2, Math.PI/2 /70);
	mat4.rotateX(matrix2,matrix2, Math.PI/2 /70);
	gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix2);
	gl.drawArrays(gl.TRIANGLES,0,6);
	
}
animate();
