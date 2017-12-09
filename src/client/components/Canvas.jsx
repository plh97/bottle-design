import React, { Component } from 'react'
import { Layout, Pagination, Tabs, Button } from 'antd'
import { inject, observer } from "mobx-react"
import Tool from '../feature/Tool.js'
import {
    canvas_background,
    canvas_fir
} from '../feature/Canvas.js'

const { Content } = Layout
const { TabPane } = Tabs;

@inject("store")
@observer
export default class canvas extends Component {
    constructor() {
        super()
        this.state = {
            spin:"http://oy82lbvct.bkt.clouddn.com/spin.png",
            scale:"http://oy82lbvct.bkt.clouddn.com/scale.png",
            background:"http://oy82lbvct.bkt.clouddn.com/wine.jpg"
        }
    }

    componentDidMount() {
        //获取图片img元素
        const { background } = this.state
        const background_image = document.createElement("img")
        background_image.src = background

        console.log(
            background_image
        );

        
		const canvas = this.refs.canvas_background;
		const ctx = canvas.getContext('2d');
        ctx.drawImage(
			background_image,
			0,
			0,
			400,
			600
        )
        

        // canvas_background({
        //     Canvas:{
        //         element:this.refs.canvas_background,
        //         width:400,
        //         height:600,
        //     },
        //     Image: {
        //         width: 447.75,
        //         height: 600,
        //         element: background_image
        //     },
        //     Block:{
        //         show:true,
        //         color:"white",
        //         width:400,
        //         height:200
        //     },
        //     Adjust:400
        // })
    }

    render() {
        return (
            <div className="content-container-show">
                <canvas
       //             onMouseOut={this.handleMouseOut}
         //           onMouseOver={this.handleMouseOver}
    //                onMouseUp={this.handleCanvasUp}
     ///              onMouseMove={this.handleCanvasMove}
        //            onMouseDown={this.handleCanvasDown}
          //          onTouchStart={this.handleTouchStart}
            //        onTouchEnd={this.onTouchEnd}
              //      onTouchMove={this.onTouchMove}
                    crossOrigin="anonymous"
                    width={`${screen.availWidth > 400 ? 400 : screen.availWidth}`}
                    height="600"
                    className="canvas_fir"
                    ref="canvas_fir" />
                <canvas
                    crossOrigin="anonymous"
                    width={`${screen.availWidth > 400 ? 400 : screen.availWidth}`}
                    height="600"
                    className="canvas_background"
                    ref="canvas_background" />
            </div>
        )
    }
};
