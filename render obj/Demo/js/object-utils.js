
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

        /*let u = 1 - (longNumber / longitudeSlices);
        let v = 1 - (latNumber / latitudeSlices);*/

        vertexData.push(radius * x);
        vertexData.push(radius * y);
        vertexData.push(radius * z);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);

        /*textureCoordData.push(u);
        textureCoordData.push(v);*/
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
    /*textureCoordData = new Float32Array(textureCoordData);*/
    indexData = new Uint16Array(indexData);


 ////////////////

  return {
    vertexData: vertexData,
    colorData: colorData,
    indicesData: indexData,
  };
}
