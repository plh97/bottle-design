'use strict';

class Canvas {
	static canvas_background(e) {
        /**
         * 个人工具,
         * @param  {canvas} 
         * @return {string|json} get access_token || ''
         */

		//需要的参数
		//1.canvas_background 元素本身，画布尺寸，是否显示白板
		//2.image 元素本身，width,height, 默认居中显示
		//3.block  白色画板，由背景层提供，需要参数  color,whether show,width,height
		//4.缩放阙值   

		const {
			Adjust,
			Canvas,
			Block,
			Image
		} = e
		const canvas = Canvas.element;
		const ctx = canvas.getContext('2d');

		console.log('canvas_background', e);
		//重绘背景
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		console.log(
			( Canvas.height - (Image.width / Canvas.width) * Canvas.height ) / 2
		);
		if (Image.fill == "height") {
			//按图片高度来填充
			ctx.drawImage(
				Image.element,
				( Canvas.width - Image.height / Canvas.height * Canvas.width ) / 2,
				0,
				Image.height / Canvas.height * Canvas.width ,
				Canvas.height 
			)
		}else if (Image.fill == "width") {
			//按图片高度来填充
			ctx.drawImage(
				Image.element,
				0 ,
				(Image.width / Canvas.width) * Canvas.height - Canvas.height  ,
				Canvas.width,
				Canvas.height + ( Canvas.height - (Image.width / Canvas.width) * Canvas.height )*2  ,
			)
		}
		ctx.fillStyle = 'white';
		ctx.fillRect( 
			
		);
		ctx.strokeStyle = 'black';
		ctx.strokeRect( 

		);
	}




























	//图层1
	static canvas_fir(e) {
		console.log('canvas_fir');
	}
}

module.exports = exports = Canvas;