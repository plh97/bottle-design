import React, { Component } from 'react'
import { Layout, Pagination, Tabs, Button } from 'antd'
import { inject, observer } from "mobx-react"
import {
    update_last_one,
    is_inner,
    is_buttom_array,
    is_close_btn,
    mouse_debug,
    is_scale_btn
} from '../feature/Tool.js'
import {
    canvas_layer,
    isMouseInGraph
} from '../feature/Canvas_layer.js'

import {
    canvas_background
} from '../feature/Canvas_background.js'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()
import isDblTouchTap from "../feature/isDblTouchTap.js"




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
            press:false,
            drag:false,
            scale:false,
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




















    handleTouch = (e,canvas) => {
        const {
            block_props,
            images,
            allHold,
            is_edit
        } = this.props.store
        //因为我只对最后一个图片素材做处理，所以只需要最后一个图片的各种参数
        let {
            angle,
            width,
            height,
            x,
            y,
            scale,
            type            
        } = images[images.length-1]
        //鼠标相对于白板中心位置
        const _mouse = {
            x: e.clientX - canvas.getBoundingClientRect().left - canvas.width * block_props.x ,
            y: e.clientY - canvas.getBoundingClientRect().top - canvas.height * block_props.y
        };
        //鼠标相对于图片位置
        const mouse = {
            x: _mouse.x - x,
            y: _mouse.y - y
        };
        const image_last_one = {
            x,y,
            width,
            height,
            angle,
            scale,
            type
        }
        //关闭按钮
        let close_btn = is_close_btn(
            mouse,
            image_last_one
        )
        // let is_inner = isMouseInGraph(mouse)
        // console.log(
        //     'is_inner',is_inner
        // );
        if (is_edit && close_btn) {
            let new_arr = images;
            new_arr.pop()
            allHold("is_edit",false)
            allHold("images",new_arr)
            canvas_layer(
                canvas,
                images
            )
            return
        }
        //旋转按钮
        let scale_btn = is_scale_btn(
            mouse,
            image_last_one
        )
        if (is_edit && scale_btn) {
            this.setState({
                press:true,
                scale:true,
                image_last_one,
                mouse:{
                    x : e.clientX ,
                    y : e.clientY
                }
            })
            return
        }
        //判断你是否点击的某个图片
        let new_arr = is_buttom_array(
            _mouse,
            images
        )
        if(new_arr == "no change"){
            this.setState({
                mouse:{
                    x : e.clientX ,
                    y : e.clientY
                },
                image_last_one,
                press:true,
                drag:true
            })
            allHold("is_edit",true)
            canvas_layer(
                canvas,
                images,
                true,
                true,
                block_props
            )
        }else if(new_arr == "not click image"){
            allHold("is_edit",false)
            canvas_layer(
                canvas,
                images,
                false
            )
            return
        }else{
            allHold("images",new_arr)
            allHold("is_edit",true)
            canvas_layer(
                canvas,
                new_arr,
                true,
                true,
                block_props
            )
            return
        }
    }































    handleMove = (e,canvas) =>{
        const {
            block_props,
            images,
            allHold
        } = this.props.store
        const {x,y} = images[images.length-1]
        //鼠标位置,
        const mouse = {
            x : e.clientX ,
            y : e.clientY
        };
        //鼠标相对位移
        const relative_displacement = {
            x:mouse.x - this.state.mouse.x,
            y:mouse.y - this.state.mouse.y
        }
        if(this.state.drag){
            let new_images = update_last_one(images,{
                x: this.state.image_last_one.x + relative_displacement.x,
                y: this.state.image_last_one.y + relative_displacement.y
            })
            allHold("images",new_images)
            allHold("is_edit",true)
            canvas_layer(
                canvas,
                images,
                true,
                true,
                block_props
            )
        }else if(this.state.scale){
            //鼠标  》》》》   图片位置
            const mouse_image = {
                x: mouse.x - canvas.getBoundingClientRect().left - canvas.width * block_props.x-x,
                y: mouse.y - canvas.getBoundingClientRect().top - canvas.height * block_props.y-y
            };
            //未知原因，图片比文字比例大一倍
            const angle_tant = Math.atan2(
                this.state.image_last_one.width,
                this.state.image_last_one.height
            );
            let text_image = this.state.image_last_one.type=="image"? 1 : 0.5
            const relative_distantment = Math.sqrt(mouse_image.x*mouse_image.x+mouse_image.y*mouse_image.y)*text_image
            let new_images = update_last_one(images,{
                width: relative_distantment / Math.cos(angle_tant) ,
                height: relative_distantment / Math.sin(angle_tant) ,
                angle: 180*angle_tant/Math.PI - 180 * Math.atan2(mouse_image.x,mouse_image.y) / Math.PI  
            })
            allHold("images",new_images)
            allHold("is_edit",true)
            canvas_layer(
                canvas,
                images,
                true,
                true,
                block_props
            )
        }
    }




    

























    handleTouchStart = (e) => {
        if(screen.width > 768) return
        if( this.props.store.images.length == 0) return
        this.handleTouch({
            clientX : e.touches[0].clientX ,
            clientY : e.touches[0].clientY
        },this.refs.canvas_layer)
    }

    onTouchMove = (e) => {
        if(screen.width>768) return
        //如果没有按下鼠标，不需要处理移动事件
        if(!this.state.press) return
        if(this.props.store.images.length == 0) return
        this.handleMove({
            clientX : e.touches[0].clientX ,
            clientY : e.touches[0].clientY
        },this.refs.canvas_layer)
    }

    onTouchEnd = (e) => {
        if(screen.width>768) return
        this.setState({
            press:false,
            scale:false,
            drag:false,
        })
    }


    




    handleCanvasDown = (e) => {
        if(screen.width < 768) return
        const {
            images
        } = this.props.store
        if(images.length == 0) return
        this.handleTouch({
            clientX : e.clientX ,
            clientY : e.clientY
        },this.refs.canvas_layer)
    }

    handleCanvasMove = (e) => {
        if(screen.width < 768) return
        //如果没有按下鼠标，不需要处理移动事件
        if(!this.state.press) return
        if(this.props.store.images.length == 0) return
        this.handleMove({
            clientX : e.clientX ,
            clientY : e.clientY
        },this.refs.canvas_layer)
    }

    handleCanvasUp = (e) => {
        if(screen.width < 768) return
        this.setState({
            press:false,
            scale:false,
            drag:false,
        })
    }


    handleTouchTap = e => {
        const {
            images,
            is_edit
        } = this.props.store
        if(images.length==0||!is_edit)return 
        if (isDblTouchTap(e)) {
            if(is_edit){
                //编辑
                if(images[images.length-1].type == "image"){
                    //图片
                }else if(images[images.length-1].type == "text"){
                    //文字
                    document.getElementById("text-customization-input").value = images[images.length-1].content
                    this.props.show_text()
                }
            }
        }
    }





    render() {
        return (
            <div className="content-container-show">
                <canvas
                    onDoubleClick={this.handleDbClick}
                    onMouseUp={this.handleCanvasUp}
                    onMouseMove={this.handleCanvasMove}
                    onMouseDown={this.handleCanvasDown}
                    onTouchTap = {this.handleTouchTap}
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
