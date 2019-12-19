/*
function sphere_GetInfo() {
	//create an array of positions for the cube.

 /////////////
    let latitudeSlices = 50;
    let longitudeSlices = 50;
    let radius = 1.1;

    let vertexData = [];
    let normalData = [];
    let textureCoordData = [];
    let indexData = [];
	let dTheta=Math.PI / latitudeSlices;
	let dPhi=2 * Math.PI / longitudeSlices

    // Calculate sphere vertex positions, normals, and texture coordinates.
    for (let latNumber = 0; latNumber <= latitudeSlices; ++latNumber) {
      let theta = latNumber * dTheta;
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeSlices; ++longNumber) {
        let phi = longNumber * dPhi;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = cosPhi * cosTheta;
        let y = cosPhi*sinTheta;
        let z = sinPhi;

        //let u = 1 - (longNumber / longitudeSlices);
        //let v = 1 - (latNumber / latitudeSlices);

        vertexData.push(radius * x);
        vertexData.push(radius * y);
        vertexData.push(radius * z);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);

        //textureCoordData.push(u);
        //textureCoordData.push(v);
      }
    }

    // Calculate sphere indices.
    for (let latNumber = 0; latNumber < latitudeSlices; ++latNumber) {
      for (let longNumber = 0; longNumber < longitudeSlices; ++longNumber) {
        let first = (latNumber * (longitudeSlices + 1)) + longNumber;
        let second = first + longitudeSlices + 1;

        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

	let colorData = [];
    for (let vertex = 0; vertex < indexData.length; vertex++) {
        colorData.push(...[1.0,  0.0,  0.0,  0.8]);

}
    vertexData = new Float32Array(vertexData);
    normalData = new Float32Array(normalData);
    //textureCoordData = new Float32Array(textureCoordData);
    indexData = new Uint16Array(indexData);


 ////////////////

  return {
    vertexData: vertexData,
    colorData: colorData,
    indicesData: indexData,
  };
}
*/
function getVertices(vertices, indices){
  let finalVertices = [];
  for (let i = 0; i < indices.length; i++) {
      let a = indices[i]*3
      let b = a+1;
      let c = b+1;
      finalVertices.push(vertices[a],vertices[b],vertices[c]);
  }
  return(finalVertices);
}


function n_normalize(v){
  var out = vec3.create();

  var d = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
  if (d==0){
      d = 0.001;
  }

  out[0] = v[0]/d;
  out[1] = v[1]/d;
  out[2] = v[2]/d;

  return(out);
}

function crossProduct(vecA, vecB){
  var out = vec3.create();

  out[0] = vecA[1]*vecB[2] - vecA[2]*vecB[1];
  out[1] = vecA[0]*vecB[2] - vecA[2]*vecB[0];
  out[2] = vecA[0]*vecB[1] - vecA[1]*vecB[0];



  return(n_normalize(out));
}

function norm(point){
  var x = point[0]
  var y = point[1]
  var z = point[2]

  return(Math.sqrt(x*x + y*y + z*z))
}

function midPoint(a,b){
  var newX = (a[0] + b[0])/2;
  var newY = (a[1] + b[1])/2;
  var newZ = (a[2] + b[2])/2;
  return([newX, newY, newZ])
  
}


function normalizeRadius(point, radius){
  var normValue = norm(point);
  var newX = point[0]*radius/normValue;
  var newY = point[1]*radius/normValue;
  var newZ = point[2]*radius/normValue;
  return([newX, newY, newZ])




}


function randomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

function subdivision(n, vertexData, indexData, radius){
  var newIndices = []
  var newVertices = []
  var v1, v2, v3, out, mid1, mid2, mid3;
  if (n == 0){
      out = {
          vertices: vertexData,
          indices: indexData,
      }
  }else{
      for (let i = 0; i < indexData.length; i+=3) {
          v1 = [vertexData[3*indexData[i+0]] , vertexData[3*indexData[i+0]+1], vertexData[3*indexData[i+0]+2]]
          v2 = [vertexData[3*indexData[i+1]] , vertexData[3*indexData[i+1]+1], vertexData[3*indexData[i+1]+2]]
          v3 = [vertexData[3*indexData[i+2]] , vertexData[3*indexData[i+2]+1], vertexData[3*indexData[i+2]+2]]
          mid1 = normalizeRadius(midPoint(v1,v2), radius)
          mid2 = normalizeRadius(midPoint(v2,v3), radius)
          mid3 = normalizeRadius(midPoint(v3,v1), radius)

          newVertices.push(...v1, ...v2, ...v3, ...mid1, ...mid2, ...mid3)
          let auxIndices = [

              (i/3)*6 + 0, (i/3)*6 + 3, (i/3)*6 + 5,
              (i/3)*6 + 3, (i/3)*6 + 4, (i/3)*6 + 5,
              (i/3)*6 + 2, (i/3)*6 + 5, (i/3)*6 + 4,
              (i/3)*6 + 1, (i/3)*6 + 4, (i/3)*6 + 3,

          ]
          
          newIndices.push(...auxIndices)
          

      }

      out = subdivision(n-1, newVertices, newIndices, radius)
  }

  return(out)
}

function computeNormals(vertices, indices){
  let normalData = [];
  for (let i = 0; i < indices.length; i+=3) {
      var vertexO = vec3.create();
      var vertex1 = vec3.create();
      var vertex2 = vec3.create();

      vertexO[0] = vertices[3*indices[i+1]]
      vertexO[1] = vertices[3*indices[i+1]+1]
      vertexO[2] = vertices[3*indices[i+1]+2]

      vertex1[0] = vertices[3*indices[i]]
      vertex1[1] = vertices[3*indices[i]+1]
      vertex1[2] = vertices[3*indices[i]+2]
      
      vertex2[0] = vertices[3*indices[i+2]]
      vertex2[1] = vertices[3*indices[i+2]+1]
      vertex2[2] = vertices[3*indices[i+2]+2]


      /**Better computationally*/

      // normalData.push(n_normalize(vertex1))
      // normalData.push(n_normalize(vertexO))
      // normalData.push(n_normalize(vertex2))

      /** */

      var a = vec3.create();
      var b = vec3.create();
      a[0] = vertex1[0]-vertexO[0]
      a[1] = vertex1[1]-vertexO[1]
      a[2] = vertex1[2]-vertexO[2]

      b[0] = vertex2[0]-vertexO[0]
      b[1] = vertex2[1]-vertexO[1]
      b[2] = vertex2[2]-vertexO[2]


      var tmpCross = crossProduct(b,a)
      normalData.push(...tmpCross, ...tmpCross, ...tmpCross)

  }

  return(normalData);

}



function icosahedron_GetInfo()
{
    var x=0.5;
    var z=0.8;
    var normalData=[];
    var vertexData=[

      /*
        -x,0.0,z,
        x,0.0,z,
        -x,0.0,-z,
        x,0.0,-z,

        0.0,z,x,
        0.0,z,-x,
        0.0,-z,x,
        0.0,-z,-x,

        z,x,0.0,
        -z,x,0.0,
        z,-x,0,
        -z,-x,0.0,
    ]
    
    var indexData=[
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
    ]
  */
 -x,  0,  z,
 x,  0,  z,
-x,  0, -z,
 x,  0, -z,
 0,  z,  x,
 0,  z, -x,
 0, -z,  x,
 0, -z, -x,
 z,  x,  0,
-z,  x,  0,
 z, -x,  0,
-z, -x,  0,
]

var indicesData = [
0,4,1,
0,9,4,
9,5,4,
4,5,8,
4,8,1,
8,10,1,
8,3,10,
5,3,8,
5,2,3,
2,7,3,
7,10,3,
7,6,10,
7,11,6,
11,0,6,
0,1,6,
6,1,10,
9,0,11,
9,11,2,
9,2,5,
7,2,11
]


//for(let k=0;k<=6;k++){

  var radius = norm([vertexData[0], vertexData[1], vertexData[2]])
  var subdivided = subdivision(4, vertexData, indicesData, radius)
  normalData = computeNormals(subdivided.vertices, subdivided.indices)

  let colorData = [];
    for (let face=0; face<subdivided.indices.length/3; face++){
        let faceColor= randomColor();
        //let faceColor= [1,0,0]
        for (let vertex = 0; vertex < 3; vertex++) {
            colorData.push(...faceColor);
            
        }
    }

    var data = {
        vertices: getVertices(subdivided.vertices, subdivided.indices),
        indices: subdivided.indices,
        colors: colorData,
        normals: normalData
    }

    return(data)
}

/*
    for(let i=0;i<=indexData.length;i+=3)
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

    }*/
 // }
/*
    let colorData = [];
    for (let vertex = 0; vertex < indexData.length; vertex++) {
        colorData.push(...[1.0,  0.0,  0.0,  0.8]);
    
    }
    */


   // normalData = new Float32Array(normalData);

   // var tmpCross=cross(B,A);
   // normalData.push(tmpCross);
    /*
    return {
        vertexData: vertexData,
        colorData: colorData,
        indicesData: indexData,
      };


}
*/
/*
function n_normalize(v){
    var out=vec3.create();
    var d=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    if(d==0)
        d=0.00001;
    out[0]=v[0]/d;
    out[1]=v[1]/d;
    out[2]=v[2]/d;
    return out;
}*?
/*
function cross(a,b){
    

    cross[0]=a[1]*b[2]-a[2]*b[1];
    cross[1]=a[0]*b[2]-a[2]*b[0];
    cross[2]=a[0]*b[1]-a[1]*b[0];

    return n_normalize(cross);
}
*/


//otra manera
/*
normalData.push(n_normalize(vertex0))
normalData.push(n_normalize(vertex1))
normalData.push(n_normalize(vertex2))
*/