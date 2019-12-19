export {cube, indicesCube, sphere_GetInfo, ellipse_GetInfo, drawCup}

var cube = [
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
    
    
const indicesCube = [
    0,1,2, //front
    1,2,3,

    4,5,6, //back
    5,6,7,

    0,4,1, //top
    1,4,5,

    3,2,6, //bottom
    3,7,6,

    0,4,2, //left
    4,2,6,

    5,1,3, //right
    5,3,7,

];


function sphere_GetInfo(){
    let latitudeSlices = 50;
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

    var data = {
        vertex: vertexData,
        indices: indexData,
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

    var data = {
        vertex: vertexData,
        indices: indexData,
    };

    return(data);
}






function drawCup(nSlices) {

    var cup = [ 
        /*0, 0, 0,//V1 
        3, 0, 0,//V2 
        3, 0.5, 0,//V3 
        0.5, 1, 0,//V4 
        0.5, 4, 0,//V5 
        3, 5, 0,//V6 
        3, 9, 0,//V7 
        //0, 8, 0,//V8*/

        0,1,0, //0
        0.5,1,0, //1
        0,0.6,0, //2
        0.1,0.6,0,//3
        0.5,0.6,0,//4
        0,0.4,0,//5
        0.1,0.4,0,//6
        0,0,0,//7
        0.1,0,0,//8
        0.1,0.1,0,//9
        0.1,0.05,0,//10
        0.5,0.05,0,//11
        0.5,0,0//12

    ];
    
    
    var indicesCup = [
        /*0,1, 
        1,2,
        2,3, 
        3,4,
        4,5, 
        5,6,
        //6,7,*/ 

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

    const sizeData = cup.length
    const sizeIndices = indicesCup.length
    const counterIndices = sizeIndices/3 + 3; //sizeIndices/2 + 1
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


    var data = {
        verticesCup: cup,
        indicesCup: indicesCup
    }

    return (data)
}
