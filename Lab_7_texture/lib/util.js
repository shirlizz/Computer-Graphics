export {subdivision, norm, crossProduct, randomColor, computeNormals, redColor, blueColor, greenColor, xyzmodel, lmsmodel}

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

function redColor() {
    return [1.0, 0.0, 0.0];
}

function blueColor() {
    return [0.0, 0.0, 1.0];
}

function greenColor() {
    return [0.0, 1.0, 0.0];
}

function xyzmodel(colorarray) {
    var r = colorarray[0]
    var g = colorarray[1]
    var b = colorarray[2]
    return [(0.4124*r)+(0.3576*g)+(0.1805*b), (0.2126*r)+(0.7152*g)+(0.0722*b), (0.0193*r)+(0.1192*g)+(0.9505*b)]
}

function lmsmodel(colorarray) {
var x = colorarray[0]
var y = colorarray[1]
var z = colorarray[2]
return [(0.38971*x)+(0.68898*y)-(0.07868*z), (1.18340*y)+(0.04641*z)-(0.22981*x), (0.0*x)+(0.0*y)+(1.0*z)]
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
