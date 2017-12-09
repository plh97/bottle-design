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
		const scale_val = screen.width > Adjust ? 1 : screen.width / Adjust
		ctx.clearRect(0, 0, canvas.width * scale_val, canvas.height * scale_val);
		ctx.drawImage(
			Image.element,
			0,
			0,
			Canvas.width * scale_val,
			Canvas.height * scale_val
		)
		ctx.fillStyle = 'white';
		ctx.fillRect(163 * scale_val, 240 * scale_val, 117 * scale_val, 300 * scale_val);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(163 * scale_val, 240 * scale_val, 117 * scale_val, 300 * scale_val);
	}




























	//图层1
	static canvas_fir(e) {
		console.log('canvas_fir');
	}
}

module.exports = exports = Canvas;