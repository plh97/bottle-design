'use strict';

class Canvas {
	static canvas_background(
		canvas,
		image,
		canvas_prop = {
			height: screen.height-93 > 600 ? 600 : screen.height-93 ,
			width: screen.width > 400 ? 400 : screen.width,
		},
		image_prop = {
			fill:"height",
			width: 500,
			height: 670,
		}
	) {
        /**
         * @param  		{canvas} 
         * @argument  	{
		 * 					canvas元素	必要参数
		 * 					image元素,	必要参数
		 * 					canvas_prop,  非必要参数
		 * 					image_prop,		非必要参数
		 * 				} 
         * @return 		{string|json} canvas auto to draw background 
         */
		
		const ctx = canvas.getContext('2d');
		//重绘背景
		ctx.clearRect(0, 0, canvas_prop.width, canvas_prop.height);
		//背景图坐标系
		ctx.save()
		ctx.scale(-1, 1)
		ctx.translate(
			-canvas_prop.width*0.5,
			canvas_prop.height*0.5
		) 
		ctx.rotate(0)
		let proportion = (image_prop.width/image_prop.height)/(canvas_prop.width/canvas_prop.height)
		if (image_prop.fill == "height") {
			//image height to fill
			ctx.drawImage(
				image,
				-canvas_prop.width/2*proportion,
				-canvas_prop.height/2,
				canvas_prop.width*proportion,
				canvas_prop.height
			)
			canvas_prop.height
		}else if (Image_prop.fill == "width") {
			//image width to fill
			ctx.drawImage(
				image,
				-canvas_prop.width/2,
				-canvas_prop.height/2*proportion,
				canvas_prop.width,
				canvas_prop.height*proportion
			)
		}
		ctx.restore()

	}









































	//图层1
	static canvas_layer(
		canvas,
		images,
		block_show=true,
		block_prop={
			x: 0.505,
			y: 0.65,
			width: 0.28,
			height: 0.53,
			color: "white",
			border: {
				color:"green"
			}
		},
		canvas_prop = {
			height: screen.height-93 > 600 ? 600 : screen.height-93 ,
			width: screen.width > 400 ? 400 : screen.width,
		}
	) {
		console.log('canvas_layer');
		const ctx = canvas.getContext('2d');
		//init background
		ctx.clearRect(0, 0, canvas_prop.width, canvas_prop.height);
		ctx.save()
		ctx.scale(-1, 1)
		ctx.translate(
			-canvas_prop.width*block_prop.x,
			canvas_prop.height*block_prop.y
		) 
		ctx.rotate(0)
		//init block
		if (block_show) {
			//白色填充块坐标系
			ctx.fillStyle = block_prop.color;
			ctx.fillRect( 
				canvas_prop.width*(-block_prop.width/2),
				canvas_prop.height*(-block_prop.height/2),
				canvas_prop.width*(block_prop.width),
				canvas_prop.height*(block_prop.height)
			);
			ctx.strokeStyle = block_prop.border.color;
			ctx.strokeRect( 
				canvas_prop.width*(-block_prop.width/2),
				canvas_prop.height*(-block_prop.height/2),
				canvas_prop.width*(block_prop.width),
				canvas_prop.height*(block_prop.height)
			);
		}
		//draw images


		//clear out of block

		//draw close button

		//draw scale_spin button
		
		ctx.restore()
	}
}

module.exports = exports = Canvas;