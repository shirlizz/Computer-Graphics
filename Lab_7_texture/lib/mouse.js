export {mouseDown, mouseMove, mouseUp, mp, rotateX, rotateY}

const canvas=document.querySelector ('canvas');

/*================= Mouse events ======================*/

var mp = {
    AMORTIZATION: 0.95,
    drag: false,
    old_x:0, old_y:0,
    dX: 0, dY: 0,
    THETA: 0,
    PHI: 0,

}
 var mouseDown = function(e) {
	mp.drag = true;
	mp.old_x = e.pageX, mp.old_y = e.pageY;
	e.preventDefault();
	return false;
 };

 var mouseUp = function(e){
	mp.drag = false;
 };

 var mouseMove = function(e) {
	if (!mp.drag) return false;
	mp.dX = (e.pageX-mp.old_x)*2*Math.PI/canvas.width,
	mp.dY = (e.pageY-mp.old_y)*2*Math.PI/canvas.height;
	mp.THETA= mp.dX;
	mp.PHI=mp.dY;
	mp.old_x = e.pageX, mp.old_y = e.pageY;
	e.preventDefault();
 };




 function rotateX(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var mv1 = m[1], mv5 = m[5], mv9 = m[9];

	m[1] = m[1]*c-m[2]*s;
	m[5] = m[5]*c-m[6]*s;
	m[9] = m[9]*c-m[10]*s;

	m[2] = m[2]*c+mv1*s;
	m[6] = m[6]*c+mv5*s;
	m[10] = m[10]*c+mv9*s;
}

function rotateY(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

	m[0] = c*m[0]+s*m[2];
	m[4] = c*m[4]+s*m[6];
	m[8] = c*m[8]+s*m[10];

	m[2] = c*m[2]-s*mv0;
	m[6] = c*m[6]-s*mv4;
	m[10] = c*m[10]-s*mv8;
 }

