
const canvas=document.querySelector ('canvas');//Referencia a canvas
const gl=canvas.getContext('webgl');//Contexto en webgl
if (!gl)
{
	throw new Error ('WebGL not supported'); //Verifica la compatibilidad del browser
}
//Contiene los vertices
const vertexData = [
0.5,0.5, 0.0,
 0.5,-0.5, 0.0,
  -0.5,0.5, 0.0,
	-0.5,0.5, 0.0,
	 0.5,-0.5,0.0,
	  -0.5,-0.5,0.0,
]
const buffer = gl.createBuffer(); //Crea un buffer vacio para almacenar el vertexData
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);//Pasa los datos de vertexData al buffer

const vertexShader = gl.createShader(gl.VERTEX_SHADER);//Crea el shader de vertices
//shaderSource recibe como entrada el vertexShader y un codigo
//codigo: -crea un vector que almacena coordenadas de 3 dimensiones
//        -define una matriz de 4 dimensiones
//				-los datos se usan para gl_Position
gl.shaderSource(vertexShader, `
attribute vec3 position;
uniform mat4 matrix1;
void main() {
    gl_Position = matrix1*vec4(position, 1);
}
`);//gl_Position retorna la posicion final
gl.compileShader(vertexShader); // compila el shader de vertices

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);//Crea un shader para los fragmentos
//shaderSource recibe como entrada el vertexShader y un codigo
//codigo: - Define el color de pixel
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);// va a retornar el color
gl.compileShader(fragmentShader);

const program = gl.createProgram();//Crea un programa de shaders
gl.attachShader(program, vertexShader); //Une el vertexShader al programa
gl.attachShader(program, fragmentShader); //Une el fragmentShader al programa
gl.linkProgram(program);//Junta todo y verifica que los vertices y shaders son compatibles

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program); //Determinamos que programa de shaders vamos  usar

const uniformLocations={
	matrix: gl.getUniformLocation(program, `matrix1`),
};

//Define una variable que contiene funciones que vn a ser llamadas mas tarde
//Cada funcion tiene su respectiva matriz
var m4CG= {
	//Funcion de traslacion
	//Input: medida de traslacion en x,y,z
	translation: function(tx,ty,tz){
		return[
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			tx,ty,tz,1
		];
	},
	//Funcion de escalar
	//Input: recibe la medida a escalar la figura en x,y,z
	scaling:function(sx,sy,sz){
		return [
			sx,0,0,0,
			0,sy,0,0,
			0,0,sz,0,
			0,0,0,1,
		];
	},
	//Funcion de inclinacion
	//Input: recibe la medida a inclinar en x,y,z
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
var translationMatrix=m4CG.translation(0.5,0.5,0);//Especifica en que medidas se va  a hacer la traslacion
var scaleMatrix=m4CG.scaling(0.3,0.5,0);//Define las medidas de escalar la imagen
var shearMatrix=m4CG.shear(-0.5,-0.5,-0.3);// Medidas de inclinacion

//mat4.multiply(matrix2,matrix2, translationMatrix);
//mat4.multiply(matrix2, matrix2, scaleMatrix);
//mat4.multiply(matrix2, matrix2, shearMatrix);

//gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix2);
//gl.drawArrays(gl.TRIANGLES, 0, 6);

function animate(){//Crea una funcion para animar la imagen aplicando las transformaciones antes definidas
	requestAnimationFrame(animate); //Informa al navegador que se desea realizar una animacion
	mat4.rotateY(matrix2,matrix2, Math.PI/2 /70);//Funcion que rota la figura en y 90 grados
	gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix2);
	//input: -ubicacion de la matriz,
	// 			 -valor booleano para especificar se transpone o no la matriz
	// 			 -un arrays (en este caso una matriz)
	gl.drawArrays(gl.TRIANGLES,0,6);//Dibuja la figura con la primitiva de triangulos

}
animate();//llama a la funcion de animacion
