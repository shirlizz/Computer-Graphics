//=====function to store buffers of each object=========
function Shape() {
	this.positionBuffer = gl.createBuffer();
	this.normalBuffer = gl.createBuffer();
	this.colorBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();

	this.positionBuffer.itemSize = 3;
	this.normalBuffer.itemSize = 3;
	this.colorBuffer.itemSize = 4;
	this.indexBuffer.itemSize = 1;

	this.elementType = gl.TRIANGLES;

	return this;
}


//==============objects definitions========
var coordinate_system;
var pyramid;
var cube;
var cylinder;
var sphere;
var icosa;
var rombo;
var cone;
var bunny;
var copa;
var ring;


//==============================Icosaedro=========================================

function init_icosahedron_buffers()
{
	icosa=new Shape();
	
    var x=0.6;
	var z=1.0;

	


	var vertexData=
	[
        -x,0.0,z,//0
        x,0.0,z,//1
        -x,0.0,-z,//2
        x,0.0,-z,//3

        0.0,z,x,//4
        0.0,z,-x,//5
        0.0,-z,x,//6
        0.0,-z,-x,//7

        z,x,0.0,//8
        -z,x,0.0,//9
        z,-x,0,//10
        -z,-x,0.0,//11
    ];
	gl.bindBuffer(gl.ARRAY_BUFFER, icosa.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
	icosa.positionBuffer.numItems = vertexData.length/3;
	console.log('vertices rombo ' + vertexData.length);


	gl.bindBuffer(gl.ARRAY_BUFFER, icosa.normalBuffer);

	var normalData= vertexData;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    icosa.normalBuffer.itemSize = 3;
	icosa.normalBuffer.numItems = normalData.length/3;
	console.log('normal length '+ normalData.length);


	var indexData=
	[
        0,4,1,  0,9,4,
        9,5,4,  4,5,8,
        4,8,1,  8,10,1,
        8,3,10, 5,3,8,
        5,2,3,  2,7,3,
        7,10,3, 7,6,10,
        7,11,6, 11,0,6,
        0,1,6,  6,1,10,
        9,0,11, 9,11,2,
        9,2,5,  7,2,11,
    ];

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, icosa.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	icosa.indexBuffer.numItems = indexData.length;
	console.log('indices rombo ' + indexData.length);
	
	for(let i=0;i <= indexData.length;i+=3)
        {
            var vertex0=vec3.create();
            vertex0[0]=vertexData[indexData[i+1]];
            vertex0[1]=vertexData[indexData[i+1]+1];
            vertex0[2]=vertexData[indexData[i+1]+2];

            var A=vec3.create();
            A[0]=vertexData[indexData[i]]-vertex0[0];
            A[1]=vertexData[indexData[i]+1]-vertex0[1];
            A[2]=vertexData[indexData[i]+2]-vertex0[2];

            var B=vec3.create();
            B[0]=vertexData[indexData[i+2]]-vertex0[0];
            B[1]=vertexData[indexData[i+2]+1]-vertex0[1];
            B[2]=vertexData[indexData[i+2]+2]-vertex0[2];  
    
  
        }


	var color = [0.6, 1.0, 0.3, 0.8]; 
	var unpackedColors = [];
	for (var j = 0; j<indexData.length; j++)
		unpackedColors = unpackedColors.concat(color);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, icosa.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    icosa.colorBuffer.numItems = unpackedColors.length;
	console.log('colores length ' + unpackedColors.length);


}

//=========================piramide==================================
function init_pyramid_buffers() {
	
	pyramid = new Shape();



    var vertices = [
    	-1.0, -1.0,  1.0,	//  0
    	-1.0, -1.0,  1.0,	//  1
    	-1.0, -1.0,  1.0,	//  2	  
		 
		 1.0, -1.0,  1.0,	//  3
		 1.0, -1.0,  1.0,	//  4
		 1.0, -1.0,  1.0,	//  5

		 1.0, -1.0, -1.0,	//  6
		 1.0, -1.0, -1.0,	//  7
		 1.0, -1.0, -1.0,	//  8

		-1.0, -1.0, -1.0,	//  9
		-1.0, -1.0, -1.0,	// 10
		-1.0, -1.0, -1.0,	// 11

         0.0,  1.0,  0.0,	// 12
         0.0,  1.0,  0.0,	// 13
         0.0,  1.0,  0.0,	// 14
         0.0,  1.0,  0.0,	// 15

    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	pyramid.positionBuffer.numItems = 16;
	



	gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.normalBuffer);
    var normals = vertices;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    pyramid.normalBuffer.itemSize = 3;
    pyramid.normalBuffer.numItems = 16;


    var side0 = [0.0, 0.7, 0.3, 0.6];
    var side1 = [1.0, 0.0, 0.0, 1.0];
    var side2 = [0.0, 0.0, 1.0, 1.0];
    var side3 = [0.0, 1.0, 0.0, 1.0];
    var bottom = [1.0, 0.0, 1.0, 1.0];

    var colors = [
    	bottom,
    	side0,
    	side3,

    	bottom,
    	side1,
    	side0,

    	bottom,
    	side2,
    	side1,

    	bottom,
    	side3,
    	side2,

    	side0,
    	side1,
    	side2,
    	side3
    ];

    var flatcolors = [];
    for (var i in colors) {
    	flatcolors = flatcolors.concat(colors[i]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatcolors), gl.STATIC_DRAW);
    pyramid.colorBuffer.numItems = colors.length;


    var pyramidVertexIndices = [
		6, 3, 0, 9, 6, 0,
    	12,  1,  5,
    	13,  4,  8,
    	14,  7, 11,
    	15, 10,  2
    ];

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramid.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidVertexIndices), gl.STATIC_DRAW);
    pyramid.indexBuffer.numItems = 18;

}
//==========================rombo===================================
function init_rombo_buffers() {
	
	rombo = new Shape();
	
    var vertices = [
	//adelante
	-0.5,0,0.5,//0
	0,1,0,//1
	0.5,0,0.5,//2

	0.5,0,0.5,//3
	0,-1,0,//4
	-0.5,0,0.5,//5

	//derecha
	0.5,0,0.5,//6
	0,1,0,//7
	0.5,0,-0.5,//8

	0.5,0,-0.5,//9
	0,-1,0,//10
	0.5,0,0.5,//11


	//atras
	0.5,0,-0.5,//12
	0,1,0,//13
	-0.5,0,-0.5,//14

	-0.5,0,-0.5,//15
	0,-1,0,//16
	0.5,0,-0.5,//17

	 //izquierda
	-0.5,0,0.5,//18
	0,1,0,//19
	-0.5,0,-0.5,//20

	-0.5,0,-0.5,//21
	0,-1,0,//22
	-0.5,0,0.5,//23
	

    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rombo.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	rombo.positionBuffer.itemSize = 3;
    rombo.positionBuffer.numItems = vertices.length/3;
//


	gl.bindBuffer(gl.ARRAY_BUFFER, rombo.normalBuffer);
	var normals= vertices;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	rombo.normalBuffer.itemSize = 3;
	rombo.normalBuffer.numItems = normals.length/3;

    var side0 = [0.6, 0.0, 0.0, 0.5];
    var side1 = [0.5, 0.9, 1.0, 0.8];
    var side2 = [0.5, 0.4, 0.0, 0.8];
	var side3 = [0.6, 0.2, 0.2, 0.8];
	var side4 = [0.7, 0.8, 0.0, 0.9];
    var side5 = [0.9, 1.0, 0.1, 0.9];
    var side6 = [1.0, 0.5, 0.0, 0.8];
	var side7 = [1.0, 0.2, 0.0, 0.5];
    

    var colors = [
    	side0,
    	side0,
    	side0,

    	side1,
    	side1,
    	side1,

    	side2,
    	side2,
    	side2,

    	side3,
    	side3,
    	side3,

    	side4,
    	side4,
		side4,
		
		side5,
    	side5,
    	side5,

    	side6,
    	side6,
    	side6,

    	side7,
    	side7,
    	side7,
    	
    ];

    var flatcolors = [];
    for (var i in colors) {
    	flatcolors = flatcolors.concat(colors[i]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, rombo.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatcolors), gl.STATIC_DRAW);
    rombo.colorBuffer.numItems = colors.length;


    var romboVertexIndices = [
    	

		0,1,2,
		3,4,5,
		6,7,8,
		9,10,11,
		12,13,14,
		15,16,17,
		18,19,20,
		21,22,23,
		15,16,17,

		
    ];

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rombo.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(romboVertexIndices), gl.STATIC_DRAW);
	rombo.indexBuffer.itemSize = 1;
	rombo.indexBuffer.numItems = romboVertexIndices.length;

}


//=========================cubo================================
function init_cube_buffers() {
	cube = new Shape();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.normalBuffer);
    var normals = [
		// Front face
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		// Back face
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		// Top face
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		// Bottom face
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		// Right face
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		// Left face
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cube.normalBuffer.itemSize = 3;
    cube.normalBuffer.numItems = 24;


	vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,
		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,
		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0,
	];


	gl.bindBuffer(gl.ARRAY_BUFFER, cube.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cube.positionBuffer.numItems = 24;

	colors = [
		[0.7, 1.0, 0.2, 0.8], // Front face
		[1.0, 0.1, 0.3, 0.5], // Back face
		[0.0, 1.0, 0.0, 1.0], // Top face
		[0.0, 0.0, 1.0, 1.0], // Bottom face
		[1.0, 0.0, 1.0, 1.0], // Right face
		[0.0, 1.0, 1.0, 1.0], // Left face
	];
	var unpackedColors = [];

	for (var i in colors) {
		var color = colors[i];
		for (var j=0; j < 4; j++) {
			unpackedColors = unpackedColors.concat(color);
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	cube.colorBuffer.numItems = 24;

	var cubeVertexIndices = [
		0, 1, 2, 0, 2, 3, // Front face
		4, 5, 6, 4, 6, 7, // Back face
		8, 9, 10, 8, 10, 11, // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23 // Left face
	]
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cube.indexBuffer.numItems = 36;

}


//=====================Cilindro===================================

function init_cylinder_buffers(n) {
	cylinder = new Shape();

	var vertices = [];
	var normals = [];

	var upperring = [];
	var lowerring = [];

	var normalsUp = [];
	var normalsSide = [];
	var normalsDown = [];

	for (var i = 0; i<n; i++) {
		var angle = (i/n)*2*Math.PI;

		upperring.push(Math.sin(angle)); // x
		upperring.push(Math.cos(angle)); // y
		upperring.push(1.0); // height / 2

		lowerring.push(Math.sin(angle)); // x
		lowerring.push(Math.cos(angle)); // y
		lowerring.push(-1.0); // height / 2

		normalsUp.push(0.0);
		normalsUp.push(0.0);
		normalsUp.push(1.0);

		normalsSide.push(Math.sin(angle));
		normalsSide.push(Math.cos(angle));
		normalsSide.push(0.0);

		normalsDown.push(0.0);
		normalsDown.push(0.0);
		normalsDown.push(-1.0);
	}

	vertices = vertices.concat(upperring);
	vertices = vertices.concat(upperring);
	vertices = vertices.concat(lowerring);
	vertices = vertices.concat(lowerring);

	normals = normals.concat(normalsUp);
	normals = normals.concat(normalsSide);
	normals = normals.concat(normalsSide);
	normals = normals.concat(normalsDown);


	gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cylinder.positionBuffer.numItems = n*4;

	gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cylinder.normalBuffer.numItems = n*4;

	gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.colorBuffer);
	colors = [
		[0.1, 0.7, 1.0, 0.6], // top
		[1.0, 0.2, 0.5, 0.8], // side
		[0.5, 0.0, 1.0, 1.0], // bottom
	];

	var unpackedColors = [];
	for (var i = 0; i<n; i++) { unpackedColors = unpackedColors.concat(colors[0]); }
	for (var i = 0; i<n; i++) { unpackedColors = unpackedColors.concat(colors[1]); }
	for (var i = 0; i<n; i++) { unpackedColors = unpackedColors.concat(colors[1]); }
	for (var i = 0; i<n; i++) { unpackedColors = unpackedColors.concat(colors[2]); }


	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	cylinder.colorBuffer.numItems = n*4;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder.indexBuffer);


	var cylinderVertexIndices = [];

	for (var i = 1; i < n-1; i++) {
		var j = i+n;
		var k = j+n;
		var l = k+n;
		cylinderVertexIndices = cylinderVertexIndices.concat([0, i+1, i]);
		cylinderVertexIndices = cylinderVertexIndices.concat([l, l+1, n*3]);
	}

	for (var i = 0; i < n; i++) {
		var j = i+n;
		var k = j+n;
		var l = k+n;
		cylinderVertexIndices = cylinderVertexIndices.concat([j, n+(i+1)%n, k]);
		cylinderVertexIndices = cylinderVertexIndices.concat([k, n+(i+1)%n, 2*n+(i+1)%n]);
	}

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderVertexIndices), gl.STATIC_DRAW);
	cylinder.indexBuffer.numItems = cylinderVertexIndices.length;
}
//========================Esfera==============================

function init_sphere_buffers(n, ring_num) {
	sphere = new Shape();

	var positions = [];
	var unpackedColors = [];
	var sphereVertexIndices = [];

	var vertexIndexForRingAndN = function (j, i) {
		return (i%n)+j*n;
	};

	for (var j = 0; j<ring_num; j++) {
		var r = Math.sin((j/(ring_num-1))*Math.PI);
		var height = Math.cos((j/(ring_num-1))*Math.PI);
		for (var i = 0; i<n; i++) {
			positions.push(r*Math.sin((i/n)*2*Math.PI)); // x
			positions.push(r*Math.cos((i/n)*2*Math.PI)); // y
			height_pos = height;
			positions.push(height);

			if (j < ring_num-1) {

				var aa = vertexIndexForRingAndN(j,   i);
				var ab = vertexIndexForRingAndN(j,   i+1);
				var ba = vertexIndexForRingAndN(j+1, i);
				var bb = vertexIndexForRingAndN(j+1, i+1);

				sphereVertexIndices = sphereVertexIndices.concat([aa, ab, bb]);
				sphereVertexIndices = sphereVertexIndices.concat([aa, bb, ba]);
			}

		}
	}

	var color = [1, 1, 1, 1]; 

	for (var j = 0; j<ring_num; j++)
		for (var i = 0; i<n; i++) 
			unpackedColors = unpackedColors.concat(color);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	sphere.positionBuffer.numItems = n*ring_num;

	sphere.normalBuffer = sphere.positionBuffer;

	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	sphere.colorBuffer.numItems = n*ring_num;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereVertexIndices), gl.STATIC_DRAW);
	sphere.indexBuffer.numItems = sphereVertexIndices.length;

}
//=======================Cono=================================================

function init_cone_buffer()
{
	cone = new Shape();
	const vertexPositionData = [];
	const indexData = [];
    const normalData = [];
  
      const r = 0.8;
      const n = 360;
  
      vertexPositionData.push(0, 1, 0);
      //textureCoordData.push(0.5, 0.5);
      normalData.push(0, 1, 0);
  
      
  
      for (let i = 0; i < n; i++) {
		const y = -1;
        const x = r * Math.cos(i * 2 * Math.PI/n );
        const z = r * Math.sin(i * 2 * Math.PI/n );
        vertexPositionData.push(x);
        vertexPositionData.push(y);
        vertexPositionData.push(z);
  
        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
      }
  
      for (let i = 0; i < n; i++) {
        const first = 0;
        const second = i;
        const third = (i + 1) % n === 0 ? 1 : (i + 1);
  
        indexData.push(first);
        indexData.push(second);
        indexData.push(third);
	  }
	  
	  gl.bindBuffer(gl.ARRAY_BUFFER, cone.positionBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	  cone.positionBuffer.itemSize = 3; 
	  cone.positionBuffer.numItems = vertexPositionData.length/3;
	  //console.log('cone vertex: '+ vertexPositionData );
	  console.log('cone vertex: '+ vertexPositionData.length);

  
	  gl.bindBuffer(gl.ARRAY_BUFFER, cone.normalBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	  cone.normalBuffer.itemSize = 3; 
	  cone.normalBuffer.numItems = normalData.length/3;

	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone.indexBuffer);
	  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	  cone.indexBuffer.numItems = indexData.length;
	  console.log('cone indices: '+ indexData.length);

	  var color = [1.0, 0.8, 0.0, 0.7]; 
	  var unpackedColors = [];
	  for (var j = 0; j<indexData.length; j++)
			  unpackedColors = unpackedColors.concat(color);
	

    gl.bindBuffer(gl.ARRAY_BUFFER, cone.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	cone.colorBuffer.numItems = unpackedColors.length;
	console.log('colors length cone: ' + unpackedColors.length);




}
//============================Copa=========================================================
function drawCup(nSlices) {
	var a = 0.5;
	var b = 0.1;
	copa = new Shape();
    var cup = [ 
        
		0,1,0, //0
        0.5,1,0, //1
        0,0.6,0, //2
        0.1,0.6,0,//3
        0.5,0.6,0,//4
        0,0.4,0,//5
        0.1,0.4,0,//6
        0,0-a,0,//7
        0.1,0-a,0,//8
        0.1,-0.3,0,//9
        0.1,-0.5,0,//10
        0.5,-0.4,0,//11
		0.5,0-a,0//12


    ];
    
    
    var indicesCup = [
     

        0,1,2,
        1,4,2,
        2,3,5,
        3,6,5,
        3,4,6,
        5,6,7,
        6,8,7,
        9,11,10,
        10,11,8,
        11,12,8

    ];

    const sizeData = cup.length;
    const sizeIndices = indicesCup.length;
    const counterIndices = (sizeIndices/3)+3; //sizeIndices/2 + 1
    var dTheta = (2*Math.PI)/nSlices;

    for (let i = 0; i < nSlices; i++) {
        var theta = dTheta*i;
        var nextTheta = (i+1)*dTheta;
        var auxData=[];
        for (let j = 0; j < sizeData; j=j+3) {
            var xNext = cup[j]*Math.cos(nextTheta) + cup[j+2]*Math.sin(nextTheta);
            var yNext = cup[j+1];
            var zNext = -Math.sin(nextTheta)*cup[j] + cup[j+2]*Math.cos(nextTheta);
            cup.push(xNext, yNext, zNext)

        
        }

        for (let k = 0; k < sizeIndices; k++) {
            indicesCup.push(indicesCup[k]+(i+1)*(counterIndices));
           
        }

	}
	var normals = cup;
	gl.bindBuffer(gl.ARRAY_BUFFER, copa.positionBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cup), gl.STATIC_DRAW);
	  copa.positionBuffer.itemSize = 3; 
	  copa.positionBuffer.numItems = cup.length/3;
	  //console.log('cone vertex: '+ vertexPositionData );
	  console.log('cup vertex: '+ cup.length);

  
	  gl.bindBuffer(gl.ARRAY_BUFFER, copa.normalBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	  copa.normalBuffer.itemSize = 3; 
	  copa.normalBuffer.numItems = normals.length/3;

	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, copa.indexBuffer);
	  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesCup), gl.STATIC_DRAW);
	  copa.indexBuffer.itemSize = 1;
	  copa.indexBuffer.numItems = indicesCup.length;
	  console.log('cup indices: '+ indicesCup.length);

	  var color = [0.9, 0.1, 0.6, 0.8]; 
	  var unpackedColors = [];
	  for (var j = 0; j<cup.length; j++)
			  unpackedColors = unpackedColors.concat(color);
	

    gl.bindBuffer(gl.ARRAY_BUFFER, copa.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	copa.colorBuffer.numItems = unpackedColors.length;
	console.log('colors length cup: ' + unpackedColors.length);

}
//=============================================================================

function init_torus(){

	torus = new Shape();

	var vert = [], norm = [], ind = [];
   	var nPhi = 100, nTheta = 50,  r1 = .35, r2 = 1, Theta = 0, Phi = 0,
    dTheta = 2*Math.PI/nTheta, dPhi = dTheta/nPhi;
   	nn = nTheta*nPhi;
   	for (var i = 0; i < nn; i++ ){
      Theta += dTheta;   Phi   += dPhi;
      var cosTheta = Math.cos( Theta ),  sinTheta = Math.sin( Theta ),
          cosPhi = Math.cos( Phi ),  sinPhi = Math.sin( Phi ),
          dist   = r2 + r1 * cosTheta;
      vert.push ( cosPhi*dist, -sinPhi*dist, r1*sinTheta );     // points
      norm.push ( cosPhi*cosTheta, -sinPhi*cosTheta, sinTheta); // normals
      ind.push( i, (i + nTheta) % nn);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, torus.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert), gl.STATIC_DRAW);
	//torus.positionBuffer.itemSize = 3; 
	torus.positionBuffer.numItems = vert.length;
	console.log('torus vertex: '+ vert.length);

  
	gl.bindBuffer(gl.ARRAY_BUFFER, torus.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm), gl.STATIC_DRAW);
	//torus.normalBuffer.itemSize = 3; 
	torus.normalBuffer.numItems = norm.length;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ind), gl.STATIC_DRAW);
	torus.indexBuffer.itemSize = 1;
	//torus.indexBuffer.numItems = ind.length;
	console.log('torus indices: '+ ind.length);

	var color = [0.9, 0.1, 0.6, 0.8]; 
	var unpackedColors = [];
	for (var j = 0; j<ind.length; j++)
		unpackedColors = unpackedColors.concat(color);
	

    gl.bindBuffer(gl.ARRAY_BUFFER, torus.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	torus.colorBuffer.numItems = unpackedColors.length;
	console.log('colors length torus: ' + unpackedColors.length);

	   


}

//=========================Ring============================

function init_ring(){

	ring = new Shape();

	var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = 0.5;

            var vertexPositionData = [];
            var normalData = [];
            var indexData = [];

            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++)                     
              {  var theta = latNumber *2* Math.PI / latitudeBands;
                

                for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                
                    //Equation used for torus
                    var x = (1 + radius * Math.cos(phi)) * Math.cos(theta);
                    var y = (1 + radius * Math.cos(phi)) * Math.sin(theta);
                    var z = radius * Math.sin(phi);

                  

                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
               
                    vertexPositionData.push(radius * x);
                    vertexPositionData.push(radius * y);
                    vertexPositionData.push(radius * z)
                }
            }

            for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);
                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }



	gl.bindBuffer(gl.ARRAY_BUFFER, ring.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	ring.positionBuffer.itemSize = 3; 
	ring.positionBuffer.numItems = vertexPositionData.length/3;
	console.log('ring vertex: '+ vertexPositionData.length);

  
	gl.bindBuffer(gl.ARRAY_BUFFER, ring.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	ring.normalBuffer.itemSize = 3; 
	ring.normalBuffer.numItems = normalData.length/3;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ring.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	ring.indexBuffer.itemSize = 1;
	ring.indexBuffer.numItems = indexData.length;
	console.log('ring indices: '+ indexData.length);

	var color = [0.3, 0.2, 0.9, 1.0]; 
	var unpackedColors = [];
	for (var j = 0; j<indexData.length; j++)
		unpackedColors = unpackedColors.concat(color);
	

    gl.bindBuffer(gl.ARRAY_BUFFER, ring.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	ring.colorBuffer.numItems = unpackedColors.length;
	console.log('colors length ring: ' + unpackedColors.length);








}
	
 //=========================bunny====================================



//============================Inicio de buffer y coordendas===========================
function init_buffers() {

	coordinate_system = new Shape();

	var vertices = [
		1.5, 0.0, 0.0,
		0.0, 1.5, 0.0,
		0.0, 0.0, 1.5,
		0.0, 0.0, 0.0
	];

	var colors = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0
	];

	var normals = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];

	var indices = [
		0, 3,
		1, 3,
		2, 3
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, coordinate_system.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	coordinate_system.positionBuffer.numItems = vertices.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, coordinate_system.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	coordinate_system.normalBuffer.numItems = normals.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, coordinate_system.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	coordinate_system.colorBuffer.numItems = colors.length;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coordinate_system.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	coordinate_system.indexBuffer.numItems = indices.length;

	coordinate_system.elementType = gl.LINES;

	//init buffers of each object
	init_cone_buffer();
	init_pyramid_buffers();
    init_cube_buffers();
	init_cylinder_buffers(24);
	init_sphere_buffers(24, 12);
	init_rombo_buffers();
	init_icosahedron_buffers();
	drawCup(100);
	init_torus();
	init_ring();
	//loadObj(gl, 'ObjXYZ.obj');
	
}

//==============================================================================

