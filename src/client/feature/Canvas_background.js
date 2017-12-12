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
}
module.exports = exports = Canvas;