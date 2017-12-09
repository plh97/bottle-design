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
            spin: "http://oy82lbvct.bkt.clouddn.com/spin.png",
            scale: "http://oy82lbvct.bkt.clouddn.com/scale.png",
            background: "http://oy82lbvct.bkt.clouddn.com/wine.jpg"
        }
    }

    componentDidMount() {
        const { background } = this.state
        const background_image = document.createElement("img")
        background_image.src = background
        background_image.onload = () => {
            //绘制背景图片
            canvas_background({
                Canvas: {
                    element: this.refs.canvas_background , 
                    
                    height: screen.height-93 > 600 ? 600 : screen.height-93 ,
                    width: screen.width > 400 ? 400 : screen.width,
                },
                Image: {
                    //图片居中显示，原始尺寸,fill:按高度/宽度填充
                    fill:"height",
                    width: 500,
                    height: 670,
                    element: background_image
                },
                Block: {
                    //百分比表示位置
                    x: 0.5,
                    y: 0.7,
                    width: 0.25,
                    height: 0.5,
                    show: true,
                    color: "white",
                },
                Adjust: 400
            })
        }
    }

    render() {
        return (
            <div className="content-container-show">
                <canvas
                    //onMouseOut={this.handleMouseOut}
                    //onMouseOver={this.handleMouseOver}
                    //onMouseUp={this.handleCanvasUp}
                    //onMouseMove={this.handleCanvasMove}
                    //onMouseDown={this.handleCanvasDown}
                    //onTouchStart={this.handleTouchStart}
                    //onTouchEnd={this.onTouchEnd}
                    //onTouchMove={this.onTouchMove}
                    height={`${screen.height-93 > 600 ? 600 : screen.height-93}`}
                    width={`${screen.width > 400 ? 400 : screen.width}`}
                    className="canvas_fir"
                    crossOrigin="anonymous"
                    ref="canvas_fir" />
                <canvas
                    height={`${screen.height-93 > 600 ? 600 : screen.height-93}`}
                    width={`${screen.availWidth > 400 ? 400 : screen.availWidth}`}
                    className="canvas_background"
                    crossOrigin="anonymous"
                    ref="canvas_background" />
            </div>
        )
    }
};
