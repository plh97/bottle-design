'use strict';

class Canvas {
	//绘制图层
	//...这个函数应该是不要静态属性，提供暴露给外部使用
	static canvas_layer(
		canvas,
		images,
		is_edit=true,
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
		const ctx = canvas.getContext('2d');
		//将ctx作为全局变量，不用再做参数来传递了。。。
		Canvas.ctx = ctx
		Canvas.canvas = canvas
		Canvas.block_prop = block_prop
		Canvas.canvas_prop = canvas_prop

		//init background
		ctx.clearRect(0, 0, canvas_prop.width, canvas_prop.height);
		ctx.save()
		ctx.translate(
			canvas_prop.width*block_prop.x,
			canvas_prop.height*block_prop.y
		) 

		//draw block
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
		ctx.restore()

		//如果最后一个元素图片 image
		
		Canvas.canvas_draw_ele (
			images.filter(ele => ele.type == "image" ),
			images[images.length-1].type == "image" ? true : false
		)

		Canvas.canvas_draw_ele (
			images.filter(ele => ele.type == "text" ),
			images[images.length-1].type == "text" ? true : false
		)
	}

































	



	//静态属性，只提供内部
	static canvas_draw_ele (
		elements,
		is_edit
	){
		const {
			canvas_prop,
			block_prop,
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
				canvas_prop.width*block_prop.x + x,
				canvas_prop.height*block_prop.y + y
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
					image = Object.assign({},image,{
						width: ctx.measureText(content, `${font.size}/1.6 ${font.family}`).width + 3 ,
						height: font.size.substring(0,2) *1.3
					})
					break;
				default:
					break;
			}

			ctx.restore()
			if(i==elements.length-1){
				//清空图像边框以外
				Canvas.canvas_clear_reserve(
					canvas_prop,
					block_prop
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
			canvas_prop,
			block_prop
		} = Canvas
		const {
			x,y,width,height,angle,scale
		} = element
		const rad = angle * Math.PI / 180
		//坐标系转换
		ctx.save()
		ctx.translate(
			canvas_prop.width*block_prop.x + x,
			canvas_prop.height*block_prop.y + y
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










































	//静态属性，只提供内部
	//清除既定白板以外的区域
	static canvas_clear_reserve(){
		const {
			ctx,
			block_prop,
			canvas_prop
		} = Canvas

		ctx.clearRect(
			0,
			0,
			canvas_prop.width*(block_prop.x-block_prop.width/2),
			canvas_prop.height
		)
		ctx.clearRect(
			0,
			0,
			canvas_prop.width,
			canvas_prop.height*(block_prop.y-block_prop.height/2)
		)
		ctx.clearRect(
			canvas_prop.width*(0.5+block_prop.width/2),
			0,
			canvas_prop.width,
			canvas_prop.height
		)
		ctx.clearRect(
			0,
			canvas_prop.height*(block_prop.y+block_prop.height/2),
			canvas_prop.width,
			canvas_prop.height
		)
	}
}

module.exports = exports = Canvas;