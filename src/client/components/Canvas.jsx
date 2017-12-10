import React, { Component } from 'react'
import { Layout, Pagination, Tabs, Button } from 'antd'
import { inject, observer } from "mobx-react"
import {
    update_last_one,
    is_inner,
    is_buttom_array,
    is_close_btn,
    is_scale_btn
} from '../feature/Tool.js'
import {
    canvas_background,
    canvas_layer,
    canvas_index_refresh
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
            background: "http://oy82lbvct.bkt.clouddn.com/wine.jpg",
            mouse:{
                x:0,
                y:0
            },
            press:false
        }
    }

    componentDidMount() {
        const { background } = this.state
        const background_image = document.createElement("img")
        background_image.src = background
        background_image.crossOrigin="anonymous"
        background_image.onload = () => {
            canvas_background(
                this.refs.canvas_background,
                background_image
            )
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images,
                true,
                true,
                this.props.store.block_props
            )
        }
    }































    //提取处理移动事件
    handleMove = (e) => {
        let {
            allHold,
            graphs
        } = this.props.store
        let {
            click,
            scale,
            spin,
            mouseDownAxis,
            mouseDownImgAxis
        } = this.state
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        //集成move事件，因为移动pc   mouse 坐标不一致，所以mouse由move事件统一提供
        //graphs则自己去获取
        if( graphs.length !== 0 && click ) {
            let graphs_len = graphs["length"]
            let a = graphs
            //数组里面最后一个图片端点位置
            let offset = {
                x : a[a.length-1].img_axis.x,
                y : a[a.length-1].img_axis.y
            };
            //永远只移动数组最后一个img{}
            a[graphs_len-1] = Object.assign({},a[graphs_len-1],{
                img_axis: {
                    x: mouseDownImgAxis.x + (e.mouse.x - mouseDownAxis.x) ,
                    y: mouseDownImgAxis.y + (e.mouse.y - mouseDownAxis.y)
                },
            })
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(graphs.length !== 0 && scale.do){
            // scale
            let a = graphs;
            a[scale.index].width = e.mouse.x - a[scale.index].img_axis.x
            a[scale.index].height = e.mouse.y - a[scale.index].img_axis.y
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(graphs.length !== 0 && spin.do){
            // spin
            let a = graphs;
            a[spin.index].angle = 20
            let dartX = e.mouse.x - graphs[spin.index].img_axis.x - graphs[spin.index].width/2
            let dartY = e.mouse.y - graphs[spin.index].img_axis.y - graphs[spin.index].height/2
            a[spin.index].angle = 180*Math.atan2(dartY,dartX)/Math.PI +90
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }
    }


















































    handleTouchStart = (e) => {
        if(screen.width>768) return
        const canvas = this.refs.canvas_layer
        const {
            block_props,
            images,
            allHold,
            is_edit
        } = this.props.store
        //鼠标位置 >>>  相对于画板正中间,
        const mouse = {
            x : e.touches[0].clientX - canvas.getBoundingClientRect().left - canvas.width * block_props.x,
            y : e.touches[0].clientY - canvas.getBoundingClientRect().top - canvas.height * block_props.y
        };

        /////////////////关闭按钮
        let close_btn = is_close_btn(
            mouse,
            images[images.length-1],
        )
        if (is_edit && close_btn) {
            let new_arr = images;
            new_arr.pop()
            allHold("images",new_arr)
            allHold("is_edit",true)
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images
            )
            return
        }
        ////////////////////////////////////////////////////
        /////////////////缩放按钮
        let scale_btn = is_scale_btn(
            mouse,
            images[images.length-1],
        )
        if (is_edit && scale_btn) {
            console.log("scale btn");
            this.setState({
                press:true
            })
            return
        }
        ////////////////////////////////////////////////////

        //判断你是否点击的某个图片
        //需要一个函数判断是否属于点击区域
        let new_arr = is_buttom_array(
            mouse,
            images
        )
        if(new_arr == "no change"){
            const image_last_one = {
                x:images[images.length-1].x,
                y:images[images.length-1].y,
                angle:images[images.length-1].angle,
                scale:images[images.length-1].scale
            }
            this.setState({
                mouse:{
                    x : e.touches[0].clientX ,
                    y : e.touches[0].clientY
                },
                image_last_one,
                press:true
            })
            allHold("is_edit",true)
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images,
                true,
                true,
                this.props.store.block_props
            )
        }else if(new_arr == "not click image"){
            console.log(
                "not click image"
            );
            allHold("is_edit",false)
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images,
                false
            )
            return
        }else{
            allHold("images",new_arr)
            allHold("is_edit",true)
            canvas_layer(
                this.refs.canvas_layer,
                new_arr,
                true,
                true,
                this.props.store.block_props
            )
            return
        }
    }

    onTouchMove = (e) => {
        if(screen.width>768) return
        //如果没有按下鼠标，不需要处理移动事件
        if(!this.state.press) return
        const canvas = this.refs.canvas_layer
        const {
            block_props,
            images,
            allHold
        } = this.props.store
        //鼠标位置 >>>  相对于画板正中间,
            const mouse = {
                x : e.touches[0].clientX ,
                y : e.touches[0].clientY
            };
            const relative_displacement = {
                x:mouse.x - this.state.mouse.x,
                y:mouse.y - this.state.mouse.y
            }
            let new_images = update_last_one(images,{
                x: this.state.image_last_one.x + relative_displacement.x,
                y: this.state.image_last_one.y + relative_displacement.y
            })
            allHold("images",new_images)
            allHold("is_edit",true)
            canvas_layer(
                this.refs.canvas_layer,
                this.props.store.images,
                true,
                true,
                this.props.store.block_props
            )
    }

    onTouchEnd = (e) => {
        if(screen.width>768) return
        this.setState({
            press:false
        })
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
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
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
