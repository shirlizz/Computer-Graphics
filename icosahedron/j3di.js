/*
* Copyright (C) 2009 Apple Inc. All Rights Reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions
* are met:
* 1. Redistributions of source code must retain the above copyright
*    notice, this list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright
*    notice, this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
* PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
* CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
* PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
* PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
* OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

//
// initWebGL
//
// Initialize the Canvas element with the passed name as a WebGL object and return the
// WebGLRenderingContext.
function initWebGL(canvasName, vshader, fshader, attribs, clearColor, clearDepth)
{
var canvas = document.getElementById(canvasName);
return gl = WebGLUtils.setupWebGL(canvas);
}

function log(msg) {
if (window.console && window.console.log) {
window.console.log(msg);
}
}

// Load shaders with the passed names and create a program with them. Return this program
// in the 'program' property of the returned context.
//
// For each string in the passed attribs array, bind an attrib with that name at that index.
// Once the attribs are bound, link the program and then use it.
//
// Set the clear color to the passed array (4 values) and set the clear depth to the passed value.
// Enable depth testing and blending with a blend func of (SRC_ALPHA, ONE_MINUS_SRC_ALPHA)
//
// A console function is added to the context: console(string). This can be replaced
// by the caller. By default, it maps to the window.console() function on WebKit and to
// an empty function on other browsers.
//

//
// makeBox
//
// Create a box with vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
function makeBox(ctx)
{
// box
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
//
// vertex coords array
var vertices = new Float32Array(
[  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 top
-1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
-1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 bottom
1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]   // v4-v7-v6-v5 back
);

// normal array
var normals = new Float32Array(
[  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
);


// texCoord array
var texCoords = new Float32Array(
[  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
);

// index array
var indices = new Uint8Array(
[  0, 1, 2,   0, 2, 3,    // front
4, 5, 6,   4, 6, 7,    // right
8, 9,10,   8,10,11,    // top
12,13,14,  12,14,15,    // left
16,17,18,  16,18,19,    // bottom
20,21,22,  20,22,23 ]   // back
);

var retval = { };

retval.normalObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.normalObject);
ctx.bufferData(ctx.ARRAY_BUFFER, normals, ctx.STATIC_DRAW);

retval.texCoordObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.texCoordObject);
ctx.bufferData(ctx.ARRAY_BUFFER, texCoords, ctx.STATIC_DRAW);

retval.vertexObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.vertexObject);
ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);

ctx.bindBuffer(ctx.ARRAY_BUFFER, null);

retval.indexObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, retval.indexObject);
ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indices, ctx.STATIC_DRAW);
ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);

retval.numIndices = indices.length;

return retval;
}

//
// makeSphere
//
// Create a sphere with the passed number of latitude and longitude bands and the passed radius.
// Sphere has vertices, normals and texCoords. Create VBOs for each as well as the index array.
// Return an object with the following properties:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
function makeSphere(ctx, radius, lats, longs)
{
var geometryData = [ ];
var normalData = [ ];
var texCoordData = [ ];
var indexData = [ ];

for (var latNumber = 0; latNumber <= lats; ++latNumber) {
for (var longNumber = 0; longNumber <= longs; ++longNumber) {
var theta = latNumber * Math.PI / lats;
var phi = longNumber * 2 * Math.PI / longs;
var sinTheta = Math.sin(theta);
var sinPhi = Math.sin(phi);
var cosTheta = Math.cos(theta);
var cosPhi = Math.cos(phi);

var x = cosPhi * sinTheta;
var y = cosTheta;
var z = sinPhi * sinTheta;
var u = 1-(longNumber/longs);
var v = latNumber/lats;

normalData.push(x);
normalData.push(y);
normalData.push(z);
texCoordData.push(u);
texCoordData.push(v);
geometryData.push(radius * x);
geometryData.push(radius * y);
geometryData.push(radius * z);
}
}

for (var latNumber = 0; latNumber < lats; ++latNumber) {
for (var longNumber = 0; longNumber < longs; ++longNumber) {
var first = (latNumber * (longs+1)) + longNumber;
var second = first + longs + 1;
indexData.push(first);
indexData.push(second);
indexData.push(first+1);

indexData.push(second);
indexData.push(second+1);
indexData.push(first+1);
}
}

var retval = { };

retval.normalObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.normalObject);
ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(normalData), ctx.STATIC_DRAW);

retval.texCoordObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.texCoordObject);
ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(texCoordData), ctx.STATIC_DRAW);

retval.vertexObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER, retval.vertexObject);
ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(geometryData), ctx.STATIC_DRAW);

retval.numIndices = indexData.length;
retval.indexObject = ctx.createBuffer();
ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, retval.indexObject);
ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), ctx.STREAM_DRAW);

return retval;
}

// Array of Objects curently loading
var g_loadingObjects = [];

// Clears all the Objects currently loading.
// This is used to handle context lost events.
function clearLoadingObjects() {
for (var ii = 0; ii < g_loadingObjects.length; ++ii) {
g_loadingObjects[ii].onreadystatechange = undefined;
}
g_loadingObjects = [];
}

//
// loadObj
//
// Load a .obj file from the passed URL. Return an object with a 'loaded' property set to false.
// When the object load is complete, the 'loaded' property becomes true and the following
// properties are set:
//
//  normalObject        WebGLBuffer object for normals
//  texCoordObject      WebGLBuffer object for texCoords
//  vertexObject        WebGLBuffer object for vertices
//  indexObject         WebGLBuffer object for indices
//  numIndices          The number of indices in the indexObject
//
function loadObj(ctx, url)
{
var obj = { loaded : false };
obj.ctx = ctx;
var req = new XMLHttpRequest();
req.obj = obj;
g_loadingObjects.push(req);
req.onreadystatechange = function () { processLoadObj(req) };
req.open("GET", url, true);
req.send(null);
return obj;
}

function processLoadObj(req)
{
log("req="+req+": "+req.status);
// only if req shows "complete"
if (req.readyState == 4) {
g_loadingObjects.splice(g_loadingObjects.indexOf(req), 1);
doLoadObj(req.obj, req.responseText);
log("object loaded.");

}
}

function doLoadObj(obj, text)
{
vertexArray = [ ];
normalArray = [ ];
textureArray = [ ];
indexArray = [ ];

var vertex = [ ];
var normal = [ ];
var texture = [ ];
var facemap = { };
var index = 0;

// This is a map which associates a range of indices with a name
// The name comes from the 'g' tag (of the form "g NAME"). Indices
// are part of one group until another 'g' tag is seen. If any indices
// come before a 'g' tag, it is given the group name "_unnamed"
// 'group' is an object whose property names are the group name and
// whose value is a 2 element array with [<first index>, <num indices>]
var groups = { };
var currentGroup = [-1, 0];
groups["_unnamed"] = currentGroup;

var lines = text.split("\n");
log("lines:");
log(lines.length);
for (var lineIndex in lines) {
var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

// ignore comments
if (line[0] == "#")
continue;

var array = line.split(" ");
if (array[0] == "g") {
// new group
currentGroup = [indexArray.length, 0];
groups[array[1]] = currentGroup;
}
else if (array[0] == "v") {
// vertex
vertex.push(parseFloat(array[1]));
vertex.push(parseFloat(array[2]));
vertex.push(parseFloat(array[3]));
log("vertex:");
log(vertex.length);
}
else if (array[0] == "vt") {
// normal
texture.push(parseFloat(array[1]));
texture.push(parseFloat(array[2]));
}
else if (array[0] == "vn") {
// normal
normal.push(parseFloat(array[1]));
normal.push(parseFloat(array[2]));
normal.push(parseFloat(array[3]));
}
else if (array[0] == "f") {
// face
if (array.length != 4) {
log("*** Error: face '"+line+"' not handled");
continue;
}

for (var i = 1; i < 4; ++i) {
if (!(array[i] in facemap)) {
// add a new entry to the map and arrays
var f = array[i].split("/");
var vtx, nor, tex;

if (f.length == 1) {
vtx = parseInt(f[0]) - 1;
nor = vtx;
tex = vtx;
}
else if (f.length = 3) {
vtx = parseInt(f[0]) - 1;
tex = parseInt(f[1]) - 1;
nor = parseInt(f[2]) - 1;
}
else {
obj.ctx.console.log("*** Error: did not understand face '"+array[i]+"'");
return null;
}

// do the vertices
var x = 0;
var y = 0;
var z = 0;
if (vtx * 3 + 2 < vertex.length) {
x = vertex[vtx*3];
y = vertex[vtx*3+1];
z = vertex[vtx*3+2];
}
vertexArray.push(x);
vertexArray.push(y);
vertexArray.push(z);

// do the textures
x = 0;
y = 0;
if (tex * 2 + 1 < texture.length) {
x = texture[tex*2];
y = texture[tex*2+1];
}
textureArray.push(x);
textureArray.push(y);

// do the normals
x = 0;
y = 0;
z = 1;
if (nor * 3 + 2 < normal.length) {
x = normal[nor*3];
y = normal[nor*3+1];
z = normal[nor*3+2];
}
normalArray.push(x);
normalArray.push(y);
normalArray.push(z);

facemap[array[i]] = index++;
}

indexArray.push(facemap[array[i]]);
currentGroup[1]++;
}

}
log("vertices:");
log(normalArray.length);
}

// set the VBOs
obj.normalObject = obj.ctx.createBuffer();
obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.normalObject);
obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(normalArray), obj.ctx.STATIC_DRAW);

obj.texCoordObject = obj.ctx.createBuffer();
obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.texCoordObject);
obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(textureArray), obj.ctx.STATIC_DRAW);

obj.vertexObject = obj.ctx.createBuffer();
obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.vertexObject);
obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(vertexArray), obj.ctx.STATIC_DRAW);

obj.numIndices = indexArray.length;
obj.indexObject = obj.ctx.createBuffer();
obj.ctx.bindBuffer(obj.ctx.ELEMENT_ARRAY_BUFFER, obj.indexObject);
obj.ctx.bufferData(obj.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), obj.ctx.STREAM_DRAW);

obj.groups = groups;

obj.loaded = true;
}

// Array of images curently loading
var g_loadingImages = [];

// Clears all the images currently loading.
// This is used to handle context lost events.
function clearLoadingImages() {
for (var ii = 0; ii < g_loadingImages.length; ++ii) {
g_loadingImages[ii].onload = undefined;
}
g_loadingImages = [];
}

//
// loadImageTexture
//
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
//
function loadImageTexture(ctx, url)
{
var texture = ctx.createTexture();
ctx.bindTexture(ctx.TEXTURE_2D, texture);
ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 1, 1, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
var image = new Image();
g_loadingImages.push(image);
image.onload = function() { doLoadImageTexture(ctx, image, texture) }
image.src = url;
return texture;
}

function doLoadImageTexture(ctx, image, texture)
{
g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
ctx.bindTexture(ctx.TEXTURE_2D, texture);
ctx.texImage2D(
ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
//ctx.generateMipmap(ctx.TEXTURE_2D)
ctx.bindTexture(ctx.TEXTURE_2D, null);
}

//
// Framerate object
//
// This object keeps track of framerate and displays it as the innerHTML text of the
// HTML element with the passed id. Once created you call snapshot at the end
// of every rendering cycle. Every 500ms the framerate is updated in the HTML element.
//
Framerate = function(id)
{
this.numFramerates = 10;
this.framerateUpdateInterval = 500;
this.id = id;

this.renderTime = -1;
this.framerates = [ ];
self = this;
var fr = function() { self.updateFramerate() }
setInterval(fr, this.framerateUpdateInterval);
}

Framerate.prototype.updateFramerate = function()
{
var tot = 0;
for (var i = 0; i < this.framerates.length; ++i)
tot += this.framerates[i];

var framerate = tot / this.framerates.length;
framerate = Math.round(framerate);
document.getElementById(this.id).innerHTML = "Framerate:"+framerate+"fps";
}

Framerate.prototype.snapshot = function()
{
if (this.renderTime < 0)
this.renderTime = new Date().getTime();
else {
var newTime = new Date().getTime();
var t = newTime - this.renderTime;
if (t == 0)
return;
var framerate = 1000/t;
this.framerates.push(framerate);
while (this.framerates.length > this.numFramerates)
this.framerates.shift();
this.renderTime = newTime;
}
}