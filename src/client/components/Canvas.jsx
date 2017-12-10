import React, { Component } from 'react'
import { Layout, Pagination, Tabs, Button } from 'antd'
import { inject, observer } from "mobx-react"
import Tool from '../feature/Tool.js'
import {
    canvas_background,
    canvas_layer
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
            canvas_background(
                this.refs.canvas_background,
                background_image
            )
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images
            )
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
                    className="canvas_layer"
                    crossOrigin="anonymous"
                    ref="canvas_layer" />
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
