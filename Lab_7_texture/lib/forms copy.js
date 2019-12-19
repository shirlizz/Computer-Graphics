import {norm, crossProduct, subdivision, randomColor, computeNormals} from "./util.js"

export {axis, icosahedron_GetInfo,cube_GetInfo, prism_GetInfo, sphere_GetInfo, pyramid_GetInfo, 
    prism1_GetInfo, prism2_GetInfo, prism3_GetInfo, prism4_GetInfo, ellipse_GetInfo, drawCup, prism6_GetInfo}


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


const axis = [
    //x axis 
    2.5,  0,  0, 
    -2.5,  0,  0, 
    //y axis 
    0,  2.5,  0, 
    0, -2.5,  0, 
    //z axis 
    0,  0,  2.5, 
    0,  0, -2.5, 
];



function cube_GetInfo(){
    let cube = [
        //Front 
        -1,  1,  1,//V1 
         1,  1,  1,//V2 
        -1, -1,  1,//V3 
         1, -1,  1,//V4 
        //Back 
        -1,  1, -1,//V5 
         1,  1, -1,//V6 
        -1, -1, -1,//V7 
         1, -1, -1,//V8 
    ];

    let indicesCube = [
        0,1,2, //front
        1,3,2,
    
        4,6,5, //back
        5,6,7,
    
        0,4,1, //top
        1,4,5,
    
        3,6,2, //bottom
        3,7,6,
    
        0,2,4, //left
        4,2,6,
    
        5,3,1, //right
        5,7,3,
    
    ];
    
    let colorCube = []

    for (let face=0; face<6; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorCube.push(...faceColor);
            
        }
    }
    
    let normalData = computeNormals(cube, indicesCube)


    let data = {
        vertices: getVertices(cube,indicesCube),
        indices: indicesCube,
        colors: colorCube,
        normals: normalData
    };
    return(data);
}

var icosahedron_GetInfo = function (){
    var x = 0.5;
    var z = 0.8;

    var normalData = [];

    var vertexData = [
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

   

    var radius = norm([vertexData[0], vertexData[1], vertexData[2]])
    var subdivided = subdivision(3, vertexData, indicesData, radius)

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




function prism_GetInfo(){
    let prism = [
        //Front 
        -1,  1,  1,//V1 
         1,  1,  1,//V2 
        -1, -1,  1,//V3 
         1, -1,  1,//V4 
        //Back 
        -1,  1, -1,//V5 
         1,  1, -1,//V6 
        -1, -1, -1,//V7 
         1, -1, -1,//V8 
    ];

    let indicesPrism = [
   
        3,2,6, //bottom
        3,7,6,
    
        0,4,2, //left
        4,2,6,
    
        0,4,3, //transversal
        4,7,3,

        0,3,2, //front
    
        4,7,6, //back
    ];
    
    let colorPrism = []

    for (let face=0; face<6; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorPrism.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(prism,indicesPrism),
        indices: indicesPrism,
        colors: colorPrism
    };
    return(data);
}




function pyramid_GetInfo(){
    let pyramid = [
        //Front 
        -1,  1,  1,//V1 
         1,  1,  1,//V2 
        -1, -1,  1,//V3 
         1, -1,  1,//V4 
        
        //Back 
        -1,  1, -1,//V5 
         1,  1, -1,//V6 
        -1, -1, -1,//V7 
         1, -1, -1,//V8 

         //center top
         0,  1,  0,//V9
    ];

    let indicesPyramid = [
   
        8,3,2, //front
    
        8,7,6, //back

        3,2,6, //bottom
        3,7,6,
    
        8,2,6, //left
    
        8,7,3, //right

    ];
    
    let colorPyramid = []

    for (let face=0; face<4; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorPyramid.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(pyramid,indicesPyramid),
        indices: indicesPyramid,
        colors: colorPyramid
    };
    return(data);
}



function prism1_GetInfo(){
    let prism1 = [
        //Front 
        -1,  1,  1,//V1 
         1,  1,  1,//V2 
        -1, -1,  1,//V3 
         1, -1,  1,//V4 
        
        //Back 
        -1,  1, -1,//V5 
         1,  1, -1,//V6 
        -1, -1, -1,//V7 
         1, -1, -1,//V8 

    ];

    let indicesprism1 = [
   
        0,3,2,
        5,7,3,//

        0,2,6,
        5,3,6,//

        0,3,6,
        5,6,7,//

        3,2,6, //bottom
        3,7,6,

    ];
    
    let colorprism1 = []

    for (let face=0; face<4; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorprism1.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(prism1,indicesprism1),
        indices: indicesprism1,
        colors: colorprism1
    };
    return(data);
}





function prism2_GetInfo(){
    let prism2 = [
        //Front 
        -1,  1,  1,//V0 
         1,  1,  1,//V1 
        -1, -1,  1,//V2 
         1, -1,  1,//V3 
        
        //Back 
        -1,  1, -1,//V4 
         1,  1, -1,//V5 
        -1, -1, -1,//V6 
         1, -1, -1,//V7 

         //center front
         0,  0,  1,//V8

         //center back
         0,  0, -1,//V9

    ];

    let indicesprism2 = [
        0,3,2, //front
        1,3,8,

        4,7,6,//back
        5,7,9,


        0,4,2, //left
        4,2,6,
    
        5,1,3, //right
        5,3,7,

        3,2,6, //bottom
        3,7,6,

        5,8,9,//top1
        5,1,8,

        4,9,8,//top2
        4,8,0,

    ];
    
    let colorprism2 = []

    for (let face=0; face<7; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorprism2.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(prism2,indicesprism2),
        indices: indicesprism2,
        colors: colorprism2
    };
    return(data);
}





function prism3_GetInfo(){
    let prism3 = [
        //Front 
        -1,  1,  1,//V0 
         1,  1,  1,//V1 
        -1, -1,  1,//V2 
         1, -1,  1,//V3 
        
        //Back 
        -1,  1, -1,//V4 
         1,  1, -1,//V5 
        -1, -1, -1,//V6 
         1, -1, -1,//V7 

         //center front
         0,  0,  1,//V8

         //center back
         0,  0, -1,//V9

    ];

    let indicesprism3 = [
        0,8,2, //front
        1,3,8,

        4,9,6,//back
        5,7,9,


        0,4,2, //left
        4,2,6,
    
        5,1,3, //right
        5,3,7,

        5,8,9,//top1
        5,1,8,

        4,9,8,//top2
        4,8,0,

        3,8,7,//bottom1
        8,9,7,

        8,2,9,
        6,9,2,
    ];
    
    let colorprism3 = []

    for (let face=0; face<8; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorprism3.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(prism3,indicesprism3),
        indices: indicesprism3,
        colors: colorprism3
    };
    return(data);
}



function prism4_GetInfo(){
    let prism4 = [
        //Front 
        -1,  1,  1,//V0 
         1,  1,  1,//V1 
        -1, -1,  1,//V2 
         1, -1,  1,//V3 
        
        //Back 
        -1,  1, -1,//V4 
         1,  1, -1,//V5 
        -1, -1, -1,//V6 
         1, -1, -1,//V7 

         //center front
         0,  0,  0,//V8

    ];

    let indicesprism4 = [
        0,4,2, //left
        4,2,6,
    
        5,1,3, //right
        5,3,7,

        4,8,0,
        6,8,2,

        0,8,2,
        4,8,6,

        5,1,8,
        7,3,8,

        1,3,8,
        5,7,8,
    ];
    
    let colorprism4 = []

    for (let face=0; face<6; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorprism4.push(...faceColor);
            
        }
    }
    
    let data = {
        vertices: getVertices(prism4,indicesprism4),
        indices: indicesprism4,
        colors: colorprism4
    };
    return(data);
}



// function prism2_GetInfo(){
//     let prism2 = [
//         //Front 
//         -1,  1,  1,//V1 
//          0,  1,  1,
//          1,  1,  1,//V2 
//         -1,  0,  1,//V1 
//          0,  0,  1,
//          1,  0,  1,//V2 
//         -1,  -1,  1,//V1 
//          0,  -1,  1,
//          1,  -1,  1,//V2          
        
//         //Mid
//         -1,  1,  1,//V1 
//          0,  1,  1,
//          1,  1,  1,//V2 
//         -1,  0,  1,//V1 
//          0,  0,  1,
//          1,  0,  1,//V2 
//         -1,  -1,  1,//V1 
//          0,  -1,  1,
//          1,  -1,  1,//V2  

//         //Back 
//         -1,  1,  1,//V1 
//          0,  1,  1,
//          1,  1,  1,//V2 
//         -1,  0,  1,//V1 
//          0,  0,  1,
//          1,  0,  1,//V2 
//         -1,  -1,  1,//V1 
//          0,  -1,  1,
//          1,  -1,  1,//V2  

//     ];

//     let indicesprism2 = [
   
//         0,3,2,
//         5,7,3,//

//         0,2,6,
//         5,3,6,//

//         0,3,6,
//         5,6,7,//

//         3,2,6, //bottom
//         3,7,6,

//     ];
    
//     let colorprism2 = []

//     for (let face=0; face<4; face++){
//         let faceColor= randomColor();
//         for (let vertex = 0; vertex < 6; vertex++) {
//             colorprism2.push(...faceColor);
            
//         }
//     }
    
//     let data = {
//         vertices: getVertices(prism2,indicesprism2),
//         indices: indicesprism2,
//         colors: colorprism2
//     };
//     return(data);
// }



// function tw_GetInfo(){
//     let prism = [
//         //Front 
//         -1,  1,  1,//V0 
//          0,  1,  1,//V1
//          1,  1,  1,//V2
//         -1,  0,  1,//V3 
//          0,  0,  1,//V4
//          1,  0,  1,//V5         
//         -1,  -1,  1,//V6 
//          0,  -1,  1,//V7
//          1,  -1,  1,//V8  

//         //Mid 
//         -1,  1,  0,//V9 
//         0,  1,  0,//V10
//         1,  1,  0,//V11
//        -1,  0,  0,//V12 
//         0,  0,  0,//V13
//         1,  0,  0,//V14         
//        -1,  -1,  0,//V15 
//         0,  -1,  0,//V16
//         1,  -1,  0,//V17  



//         //Back 
//         -1,  1,  -1,//V18 
//          0,  1,  -1,//V19
//          1,  1,  -1,//V20
//         -1,  0,  -1,//V21 
//          0,  0,  -1,//V22
//          1,  0,  -1,//V23         
//         -1,  -1,  -1,//V24 
//          0,  -1,  -1,//V25
//          1,  -1,  -1,//V26 
//     ];

//     let indicesPrism = [
//         0,3,2, //front
    
//         4,7,6, //back
    
//         3,2,6, //bottom
//         3,7,6,
    
//         0,4,2, //left
//         4,2,6,
    
//         0,4,3, //transversal
//         4,7,3
//     ];
    
//     let colorPrism = []

//     for (let face=0; face<6; face++){
//         let faceColor= randomColor();
//         for (let vertex = 0; vertex < 5; vertex++) {
//             colorPrism.push(...faceColor);
            
//         }
//     }
    
//     let data = {
//         vertices: getVertices(prism,indicesPrism),
//         indices: indicesPrism,
//         colors: colorPrism
//     };
//     return(data);
// }
    

function sphere_GetInfo(){
    let latitudeSlices = 10;
    let longitudeSlices = 50;
    let radius = 1;
   
    let vertexData = [];
    let colorData = [];
    let indexData = [];
    let normalData = [];
    let dTheta =  Math.PI/latitudeSlices;
    let dPhi =  2*Math.PI/longitudeSlices;

    for (let latNumber = 0; latNumber <= latitudeSlices; latNumber++) {
        let theta = dTheta*latNumber;
        for (let longNumber = 0; longNumber <= longitudeSlices; longNumber++) {
            let phi = dPhi*longNumber;
            let x = radius * Math.cos(phi) * Math.cos(theta); 
            let y = radius * Math.cos(phi) * Math.sin(theta); 
            let z = radius * Math.sin(phi);
            
            vertexData.push(x,y,z);
            normalData.push(x,y,z);

        }      
    }


    for (let latNumber = 0; latNumber < latitudeSlices; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeSlices; longNumber++) {
            let first =  latNumber*(longitudeSlices+1) + longNumber;
            let second = first + longitudeSlices + 1;
            indexData.push(first, second, first+1);
            indexData.push(second, second+1, first+1);
        }      
    }

    var finalVertices = getVertices(vertexData, indexData);

    let colorSphere = []

    for (let face=0; face<latitudeSlices; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6*longitudeSlices; vertex++) {
            colorSphere.push(...faceColor);
            
        }
    }

    normalData = computeNormals(finalVertices, indexData)

    let data = {
        vertices: finalVertices,
        indices: indexData,
        colors: colorSphere,
        normals: normalData
    };

    
    return(data);
}


function ellipse_GetInfo(){
    let latitudeSlices = 50;
    let longitudeSlices = 50;
    let radius1 = 1;
    let radius2 = 2;
    let radius3 = 1.5;
    

    let vertexData = [];
    let colorData = [];
    let indexData = [];
    let normalData = [];
    let dTheta =  Math.PI/latitudeSlices;
    let dPhi =  2*Math.PI/longitudeSlices;

    for (let latNumber = 0; latNumber <= latitudeSlices; latNumber++) {
        let theta = dTheta*latNumber;
        for (let longNumber = 0; longNumber <= longitudeSlices; longNumber++) {
            let phi = dPhi*longNumber;
            let x = radius1 * Math.cos(phi) * Math.cos(theta); 
            let y = radius2 * Math.cos(phi) * Math.sin(theta); 
            let z = radius3 * Math.sin(phi);
            
            vertexData.push(x,y,z);
            normalData.push(x,y,z);
        }      
    }


    for (let latNumber = 0; latNumber < latitudeSlices; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeSlices; longNumber++) {
            let first =  latNumber*(longitudeSlices+1) + longNumber;
            let second = first + longitudeSlices + 1;
            indexData.push(first, second, first+1);
            indexData.push(second, second+1, first+1);
        }      
    }

    var finalVertices = getVertices(vertexData, indexData);
    let colorEllipse = []


    for (let face=0; face<latitudeSlices; face++){
        let faceColor= randomColor();
        for (let vertex = 0; vertex < 6*longitudeSlices; vertex++) {
            colorEllipse.push(...faceColor);
            
        }
    }

    var data = {
        vertices: finalVertices,
        indices: indexData,
        colors: colorEllipse
    };
    return(data);
}






function drawCup(nSlices) {

    var cup = [ 
        0, 0, 0,//V1 
        3, 0, 0,//V2 
        3, 0.5, 0,//V3 
        1, 1, 0,//V4 
        1, 3, 0,//V5 
        3, 4, 0,//V6 
        3, 8, 0,//V7 
        0, 8, 0,//V8 
    ];
    
    
    var indicesCup = [
        0,1, 
        1,2,
        2,3, 
        3,4,
        4,5, 
        5,6,
        6,7, 
    
    ];

    const sizeData = cup.length
    const sizeIndices = indicesCup  .length
    const counterIndices = sizeIndices/2 + 1;
    var dTheta = (2*Math.PI)/nSlices;

    for (let i = 0; i < nSlices; i++) {
        var theta = dTheta*i;
        var nextTheta = (i+1)*dTheta;
        var auxData=[];
        for (let j = 0; j < sizeData; j=j+3) {
            var xNext = cup[j]*Math.cos(nextTheta) + cup[j+2]*Math.sin(nextTheta);
            var yNext = cup[j+1]
            var zNext = -Math.sin(nextTheta)*cup[j] + cup[j+2]*Math.cos(nextTheta);


            cup.push(xNext, yNext, zNext)

        
        }

        for (let k = 0; k < sizeIndices; k++) {
            indicesCup.push(indicesCup[k]+(i+1)*(sizeIndices/2 + 1));
           
        }

    }


    var data = {
        verticesCup: cup,
        indicesCup: indicesCup
    }

    return (data)
}


function prism6_GetInfo(){
    let prism = [
         0,     0.5,     0,     //V0
        //Up
         0,  0.7, -1,     //V1 
         1,  0.7, -0.5,//V2 
         1,  0.7,  0.5,//V3 
         0,  0.7,  1,     //V4
        -1,  0.7,  0.5,//V5
        -1,  0.7, -0.5,//V6
          
         0,     -1,  0, //V7
        //Bottom 
         0,  -0.7, -1,  //V8
         1,  -0.7, -0.5,//V9 
         1,  -0.7,  0.5,//V10
         0,  -0.7,  1,  //V11
        -1,  -0.7,  0.5,//V12
        -1,  -0.7, -0.5,//V13
    ];

    let indicesPrism = [
        0,1,2, //UP
        0,2,3,
        0,3,4,
        0,4,5,
        0,5,6,
        0,6,1,
        
        7, 8, 9, //BOTTOM
        7, 9,10,
        7,10,11,
        7,11,12,
        7,12,13,
        7,13, 8,
        
        1, 2, 8, //Face1
        8, 2, 9,
        
        2, 3, 9, //Face2
        9, 3,10,        

        3, 4,10, //Face3
        10,4,11,        

        4, 5,11, //Face4
        11,5,12,        

        5, 6,12, //Face5
        12,6,13,        

        6, 1,13, //Face6
        13,1, 8,                
    ];
    
let colorPrism6 = [];
for (let face = 0; face < 8; face++){
    let faceColor = randomColor();
    if (face == 0 || face == 1) {
        for (let vertex = 0; vertex < 18; vertex++)
        {
            colorPrism6.push(...faceColor);
        }
    }
    else
    {
        for (let vertex = 0; vertex < 6; vertex++)
        {
            colorPrism6.push(...faceColor);
        }
    }
}
    
    let data =
    {
        vertices: getVertices(prism,indicesPrism),
        indices: indicesPrism,
        colors: colorPrism6
    };
    return(data);
}