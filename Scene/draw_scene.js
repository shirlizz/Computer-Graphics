
//============Function to store matrix=========================
function Object3D(shape, children) {
	this.shape = shape;

	this.posRotMatrix = mat4.create();
	this.sclMatrix = mat4.create();
	this.rotation = 0.0;

	if (children !== undefined)
		this.children = children;
	else
		this.children = [];


	mat4.identity(this.posRotMatrix);
	mat4.identity(this.sclMatrix);

	return this;
}
//====================================
var selected;
var scene;


var at = vec3.create();
var up = vec3.create();
var eye = vec3.create();
at =  [0.0, 4.0, 0.0];
up =  [0.0, 1.0, 0.0];
eye = [1.0, 18.0, 10.0];

//=================function to save objects and its position================
function build_scene() {
	scene = [ 
		new Object3D(null, [
			new Object3D(sphere),
			new Object3D(cube),
			new Object3D(cylinder),

			new Object3D(copa),
			new Object3D(cone),
			new Object3D(ring),

			new Object3D(pyramid),
			new Object3D(icosa),
			new Object3D(rombo),
			])
	];

	mat4.translate(scene[0].children[0].posRotMatrix, [-3.0, 4.0, -15.0]);
	mat4.translate(scene[0].children[1].posRotMatrix, [ 0.0, 4.0, -15.0]);
	mat4.translate(scene[0].children[2].posRotMatrix, [ 3.0, 4.0, -15.0]);

	mat4.translate(scene[0].children[3].posRotMatrix, [ -3.0, 0.0, -15.0]);
	mat4.translate(scene[0].children[4].posRotMatrix, [ 0.0, 0.0, -15.0]);
	mat4.translate(scene[0].children[5].posRotMatrix, [ 3.0, 0.0, -15.0]);

	mat4.translate(scene[0].children[6].posRotMatrix, [ -3.0, -4.0, -15.0]);
	mat4.translate(scene[0].children[7].posRotMatrix, [ 0.0, -4.0, -15.0]);
	mat4.translate(scene[0].children[8].posRotMatrix, [ 3.0, -4.0, -15.0]);

};

//=========funciton to draw the scene===========================
function draw_scene() {



	update_lighting_mode();//update the mode that we select in the scene
	

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.lineWidth(3);
	var modMatrix =mat4.create();
	var viewMatrix = mat4.create();
	var mvMatrix = mat4.create();
	var pMatrix = mat4.create();
	var pro = mat4.create();
	var mv2Matrix=mat4.create();

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
 
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

	var rootMatrix = mat4.create();
	mat4.identity(rootMatrix);


	
	for (var i in scene) {
		draw_scene_subtree(rootMatrix, scene[i]);
	}

}


//==============================================
function draw_scene_subtree(parentmatrix, object) {
	var localmatrix = mat4.create();
	mat4.set(parentmatrix, localmatrix);

	
	mat4.multiply(localmatrix, object.posRotMatrix);
	mat4.multiply(localmatrix, object.sclMatrix);

	// send localmatrix to the shader
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, localmatrix);

	if (object.shape !== null)
		draw_object(object.shape);

	for (var i in object.children) {
		draw_scene_subtree(localmatrix, object.children[i]);
		if (selected_object_id-1 == i)
			draw_object(coordinate_system);
	}

}

// =====call the buffers and objetcs to bind each buffer===
function draw_object(shape) {
	var vertexPositionBuffer = shape.positionBuffer;
	var vertexNormalBuffer = shape.normalBuffer;
	var vertexColorBuffer = shape.colorBuffer;
	var vertexIndexBuffer = shape.indexBuffer;

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	gl.drawElements(shape.elementType, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
