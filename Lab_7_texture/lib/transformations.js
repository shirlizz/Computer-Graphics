export {m4CG}

var m4CG = {
	translation:function(tx,ty,tz) {
		return [
			 1,	 0,  0, 0,
			 0,  1,  0, 0,
			 0,  0,  1, 0,
			tx, ty, tz, 1,
		];
	},
	scaling:function(sx,sy,sz){
		return [
			sx,	 0,  0, 0,
			 0, sy,  0, 0,
			 0,  0,	sz, 0,
			 0,  0,  0, 1,
		];
	},
	rotationX:function(angle){
		return [
			1, 				 0, 	   		   0,	0,
			0, Math.cos(angle), -Math.sin(angle),	0,
			0, Math.sin(angle),  Math.cos(angle), 	0,
			0, 				 0, 			   0, 	1,			
		];
	},
	rotationY:function(angle){
		return [
			 Math.cos(angle), 	0,	Math.sin(angle), 	0,
						   0, 	1, 				  0,	0,
			-Math.sin(angle),	0, 	Math.cos(angle), 	0,
						   0,	0, 				  0,	1,			
		];
	},
	rotationZ:function(angle){
		return [
			Math.cos(angle),	-Math.sin(angle),	0,	0,
			Math.sin(angle),	 Math.cos(angle),	0,	0,
						  0,				   0,	1,	0,
						  0,				   0,	0,	1,			
		];
	},
	
	shadow: function (yl){
		return [
		1, 0, 0, 0,
		0, 1, 0, -1/yl,
		0, 0, 1, 0,
		0, 0, 0, 0
	]}
};
