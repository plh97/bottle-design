'use strict';

class Canvas {
	//绘制图层
	//...这个函数应该是不要静态属性，提供暴露给外部使用
	static canvas_layer(
		canvas,
		images,
		is_edit=true,
		block_show=true,
		block_props = {
			x: 0.505,
			y: 0.65,
			width: 0.28,
			height: 0.53,
			color: "white",
			border: {
				color:"white"
			}
		},
		canvas_props = {
			height: screen.height-93 > 600 ? 600 : screen.height-93 ,
			width: screen.width > 400 ? 400 : screen.width,
		}
	) {
		const ctx = canvas.getContext('2d');
		Canvas.ctx = ctx
		Canvas.canvas = canvas
		Canvas.block_props = block_props
		Canvas.canvas_props = canvas_props
		//init background
		ctx.clearRect(0, 0, canvas_props.width, canvas_props.height);
		ctx.save()
		ctx.translate(
			canvas_props.width*block_props.x,
			canvas_props.height*block_props.y
		) 
		//draw block
		if (block_show) {
			//白色填充块坐标系
			ctx.fillStyle = block_props.color;
			ctx.fillRect( 
				canvas_props.width*(-block_props.width/2),
				canvas_props.height*(-block_props.height/2),
				canvas_props.width*(block_props.width),
				canvas_props.height*(block_props.height)
			);
			ctx.strokeStyle = block_props.border.color;
			ctx.strokeRect( 
				canvas_props.width*(-block_props.width/2),
				canvas_props.height*(-block_props.height/2),
				canvas_props.width*(block_props.width),
				canvas_props.height*(block_props.height)
			);
		}
		ctx.restore()
		//如果最后一个元素图片 image
		Canvas.canvas_draw_ele (
			images ,
			is_edit
		)

	}








	



	//静态属性，只提供内部
	static canvas_draw_ele (
		elements,
		is_edit
	){
		const {
			canvas_props,
			block_props,
			ctx
		} = Canvas
		//draw images
		elements.map((image,i)=>{
			const {
				element,
				x,y,
				width,
				height,
				angle,
				scale,
				type,
				content,
				font
			} = image
			const rad = angle * Math.PI / 180
			//坐标系转换
			ctx.save()
			ctx.translate(
				canvas_props.width*block_props.x + x,
				canvas_props.height*block_props.y + y
			) 
			ctx.scale(scale, scale)
			ctx.rotate(rad)


			switch (type) {
				case "image":
					//画图
					ctx.drawImage(
						element, 
						-width/2 ,
						-height/2 ,
						width,
						height
					)
					break;
				case "text":
					//draw text
					ctx.textAlign = "center"
					ctx.textBaseline = "middle"
					ctx.font = `${font.weight} ${font.size} ${font.family}`
					ctx.fillStyle = font.color;
					ctx.fillText(
						content,
						0,0
					);
					break;
				default:
					break;
			}

			ctx.restore()
			if(i==elements.length-1){
				//清空图像边框以外
				Canvas.canvas_clear_reserve(
					canvas_props,
					block_props
				)
			}
			
			if( i==elements.length-1 && is_edit ){
				//绘制编辑器
				Canvas.canvas_draw_edit(
					image
				)
			}
		})
	}








		

	//静态属性，只提供内部
	static canvas_draw_edit(
		element
	){
		//draw edit
		const {
			ctx,
			canvas_props,
			block_props
		} = Canvas
		const {
			x,y,width,height,angle,scale
		} = element
		const rad = angle * Math.PI / 180
		//坐标系转换
		ctx.save()
		ctx.translate(
			canvas_props.width*block_props.x + x,
			canvas_props.height*block_props.y + y
		) 
		ctx.scale(scale, scale)
		ctx.rotate(rad)
		//draw outside border
		ctx.strokeStyle = 'blue';
		ctx.strokeRect(
			-width / 2,  
			-height / 2, 
			width, 
			height
		);
		//draw close button
		ctx.fillStyle = "rgba(25, 25, 21,0.2)";;
		ctx.fillRect( 
			width/2 - 6.5,
			-height/2 -8 ,
			13,
			16
		);
		ctx.font="20px Arial";
		ctx.fillStyle = 'black';
		ctx.fillText(
			"X",
			width/2 - 6.5,
			-height/2 +8
		);
		//draw scale_spin button
		ctx.fillStyle = "rgba(25, 25, 21,0.2)";;
		ctx.fillRect( 
			width/2 - 6.5,
			height/2 -8 ,
			13,
			16
		);
		ctx.font="17px Arial";
		ctx.fillStyle = 'black';
		ctx.fillText(
			"🔎",
			width/2 -8,
			height/2 +8
		);
		ctx.restore()
	}






























	static measureText(text){
		const {
			canvas_props,
			block_props,
			ctx
		} = Canvas
        let area = {
            width: ctx.measureText(text.content, `${text.size}/1.6 ${text.font_family}`).width*1.86,
            height: text.size.substring(0,2) *1.3
		}
		return area
	}




	static isMouseInGraph(mouse){
		let ctx = Canvas.canvas.getContext("2d")
		let image = Canvas.images
		// ctx.rect()
		//重新话一次图形不就有path咯。真蛋疼
		console.log("我的鼠标到底在不在图形范围以内呢？？？",image);
		return true
	}











	//静态属性，只提供内部
	//清除既定白板以外的区域
	static canvas_clear_reserve(){
		const {
			ctx,
			block_props,
			canvas_props
		} = Canvas

		ctx.clearRect(
			0,
			0,
			canvas_props.width*(block_props.x-block_props.width/2),
			canvas_props.height
		)
		ctx.clearRect(
			0,
			0,
			canvas_props.width,
			canvas_props.height*(block_props.y-block_props.height/2)
		)
		ctx.clearRect(
			canvas_props.width*(0.5+block_props.width/2),
			0,
			canvas_props.width,
			canvas_props.height
		)
		ctx.clearRect(
			0,
			canvas_props.height*(block_props.y+block_props.height/2),
			canvas_props.width,
			canvas_props.height
		)
	}
}

module.exports = exports = Canvas;