import React, { Component } from 'react'
import { Layout,Pagination ,  Tabs, Button  } from 'antd'
import { inject, observer } from "mobx-react"
import Tool from '../feature/Tool.js'

const { Content } = Layout
const { TabPane } = Tabs;

@inject("store")
@observer
export default class canvas extends Component {
    constructor(){
        super()
        this.state={
            click:false,
            show_material: false,
            scale:{
                do:false,
                index:0
            },
            spin:{
                do:false,
                index:0
            },
            mouseDownAxis:{
                x:0 ,
                y:0
            },
            mouseDownImgAxis:{
                x:0 ,
                y:0
            },
        }
    }

    componentDidMount() {
        this.updateCanvasBackground();
    }

    updateCanvasBackground = () => {
        //重绘背景
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(screen.width<447.75){
            let scale_val = screen.width/447.75
            ctx.fillStyle = 'white';
            ctx.fillRect(170*scale_val, 240*scale_val, 100*scale_val, 300*scale_val);
            ctx.strokeStyle = 'green';
            ctx.strokeRect(170*scale_val, 240*scale_val, 100*scale_val, 300*scale_val);
        }else{
            ctx.fillStyle = 'white';
            ctx.fillRect(170, 240, 100, 300);
            ctx.strokeStyle = 'green';
            ctx.strokeRect(170, 240, 100, 300);
        }
    }

    updateCanvasImages = (e) => {
        //重绘图片数组
        const {
            graphs,
            img_ref,
            edit
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        graphs.map( (graph,i) => {
            let img = img_ref[`image${graph.img_index}`]
            let x = graph.img_axis.x
            let y = graph.img_axis.y
            let width = graph.width
            let height = graph.height
            let angle = graph.angle
            let rad = -angle * Math.PI / 180
            //画图片
            ctx.save()
            ctx.scale(-1, 1)
            ctx.translate(-width/2-x, y+height/2) 
            ctx.rotate(rad)
            ctx.drawImage(
                img, 
                -width / 2,  
                -height / 2, 
                width, 
                height
            )
            //画边框
            if( edit && i==graphs.length-1){
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(
                    -width / 2,  
                    -height / 2, 
                    width, 
                    height
                );
                //X
                ctx.font="20px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText(
                    "X",
                    -width/2 - 6.5,
                    -height/2 +8
                );
                //scale
                ctx.drawImage(
                    this.refs.scale , 
                    -width/2 -7 , 
                    height/2 -7 , 
                    14 , 
                    14
                );
                //spin
                ctx.drawImage(
                    this.refs.spin , 
                    -7 , 
                    -height/2 -7 , 
                    14 , 
                    14
                );
            }
            ctx.restore()
        })
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
        // const mouse = {
        //     x : screen.clientX - canvas.getBoundingClientRect().left,
        //     y : screen.clientY - canvas.getBoundingClientRect().top
        // };

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
            console.log(
                e.mouse,
                mouseDownAxis
            );
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





















    handleCanvasDown = (e) => {
        if(screen.availWidth<768) return
        let {
            graphs,
            allHold
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        //鼠标位置
        const mouse = {
            x : e.clientX - canvas.getBoundingClientRect().left,
            y : e.clientY - canvas.getBoundingClientRect().top
        };
        //var可以实现变量提升，所以用var不用let
        var img_index = null
        var img_close = null
        var img_scale = null
        graphs.map( (image,i) => {
            //图片坐标
            let offset = {
                x : image.img_axis.x,
                y : image.img_axis.y
            };
            //图片中心点
            let img_center = {
                x : image.img_axis.x + image.width/2,
                y : image.img_axis.y + image.height/2
            };
            //旋转角度
            let angle = -image.angle
            //图片最远值  --- 勾股定理
            let distancement = Math.sqrt(
                image.width * image.width + 
                image.height * image.height
            )/2
            if(
                Tool.is_inner(mouse,{
                    x : img_center.x + Math.cos((angle+45)*Math.PI/180) * distancement - 10 ,
                    _x : img_center.x + Math.cos((angle+45)*Math.PI/180) * distancement + 10 ,
                    y : img_center.y - Math.sin((angle+45)*Math.PI/180) * distancement - 10 ,
                    _y : img_center.y - Math.sin((angle+45)*Math.PI/180) * distancement + 10 
                })
            ){
                //关闭图片
                img_close = i
            }else if(
                Tool.is_inner(mouse,{
                    x : img_center.x - Math.cos((angle+135)*Math.PI/180) * distancement - 10 ,
                    _x : img_center.x - Math.cos((angle+135)*Math.PI/180) * distancement + 10 ,
                    y : img_center.y + Math.sin((angle+135)*Math.PI/180) * distancement - 10 ,
                    _y : img_center.y + Math.sin((angle+135)*Math.PI/180) * distancement + 10 ,
                })
            ){
                //缩放图片
                this.setState({
                    scale: {
                        do:true,
                        index:i
                    }
                })
            }else if(
                Tool.is_inner(mouse,{
                    x : img_center.x + Math.cos((angle+90)*Math.PI/180) * distancement - 10 ,
                    _x : img_center.x + Math.cos((angle+90)*Math.PI/180) * distancement + 10 ,
                    y : img_center.y - Math.sin((angle+90)*Math.PI/180) * distancement - 10 ,
                    _y : img_center.y - Math.sin((angle+90)*Math.PI/180) * distancement + 10 ,
                })
            ){
                //旋转图片
                console.log("开始图片的旋转");
                this.setState({
                    spin: {
                        do:true,
                        index:i
                    }
                })
            }else if(
                //优先点击图片旋转。关闭。缩放。按钮
                Tool.is_inner(mouse,{
                    x : offset.x,
                    _x : offset.x + image.width,
                    y : offset.y,
                    _y : offset.y + image.height
                })
            ){
                //点击图片
                this.setState({
                    mouseDownAxis:{
                        x:mouse.x,
                        y:mouse.y
                    },
                    mouseDownImgAxis:{
                        x:offset.x,
                        y:offset.y
                    }
                })
                this.setState({
                    click: true
                })
                img_index = i
            }
        })

        if(img_close!==null){
            //关闭图片
            let a = graphs;
            a.splice(img_close,1)
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(img_index!==null){
            //此处将第i张图片放到最后，点击事件发生开始     必做
            let a = graphs;
            a= [
                ...a.filter((index,i) => {
                    return i !== img_index
                }),
                a[img_index]
            ]
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }
    }

    handleCanvasMove = (e) => {
        if(screen.availWidth<768) return
        let {
            click,
            scale,
            spin
        } = this.state
        let {
            graphs,
            allHold
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        let mouse = {
            x : e.clientX - canvas.getBoundingClientRect().left,
            y : e.clientY - canvas.getBoundingClientRect().top
        }
        if( graphs.length !== 0 && (click||scale.do||spin.do) ) {
            this.handleMove({
                mouse
            })
        }
    }

    handleCanvasUp = (e) => {
        if(screen.availWidth<768) return
        this.setState({
            click: false,
            scale:{
                do:false,
                index:0
            },
            spin:{
                do:false,
                index:0
            }
        })
    }





















    





    


    handleTouchStart = (e) =>{
        if(screen.availWidth>768) return
        let {
            graphs,
            allHold
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        // window.e = e
        var mouse = {
            x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
            y : e.touches[0].clientY - canvas.getBoundingClientRect().top
        };
        var img_index = null
        var img_close = null
        var img_scale = null
        graphs.map( (image,i) => {
            //图片坐标
            let offset = {
                x : image.img_axis.x,
                y : image.img_axis.y
            };
            if(
                Tool.is_inner(mouse,{
                    x : offset.x + image.width - 10,
                    _x : offset.x + image.width + 10,
                    y : offset.y - 10,
                    _y : offset.y + 10
                })
            ){
                //关闭图片
                img_close = i
            }else if(
                Tool.is_inner(mouse,{
                    x : offset.x + image.width - 10,
                    _x : offset.x + image.width + 10,
                    y : offset.y + image.height - 10,
                    _y : offset.y + image.height + 10
                })
            ){
                //缩放图片
                this.setState({
                    scale: {
                        do:true,
                        index:i
                    }
                })
            }else if(
                Tool.is_inner(mouse,{
                    x : offset.x + image.width/2 - 10,
                    _x : offset.x + image.width/2 + 10,
                    y : offset.y - 10,
                    _y : offset.y + 10
                })
            ){
                //旋转图片
                console.log("开始图片的旋转");
                this.setState({
                    spin: {
                        do:true,
                        index:i
                    }
                })
            }else if(
                //优先点击图片旋转。关闭。缩放。按钮
                Tool.is_inner(mouse,{
                    x : offset.x,
                    _x : offset.x + image.width,
                    y : offset.y,
                    _y : offset.y + image.height
                })
            ){
                this.setState({
                    mouseDownAxis:{
                        x:mouse.x,
                        y:mouse.y
                    },
                    mouseDownImgAxis:{
                        x:offset.x,
                        y:offset.y
                    }
                })
                //点击图片
                this.setState({
                    click: true
                })
                img_index = i
            }
        });
        
        if(img_close!==null){
            //关闭图片
            let a = graphs;
            a.splice(img_close,1)
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(img_index!=null){
            //此处将第i张图片提到最后
            let a = graphs;
            a= [
                ...a.filter((index,i) => {
                    return i !== img_index
                }),
                a[img_index]
            ]
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }
    }
    
    onTouchMove = (e) =>{
        if(screen.availWidth>768) return
        let {
            click,
            scale,
            spin
        } = this.state
        let {
            graphs,
            allHold
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        let mouse = {
            x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
            y : e.touches[0].clientY - canvas.getBoundingClientRect().top
        };
        
        if( graphs.length !== 0 && (click||scale.do||spin.do) ) {
            this.handleMove({
                mouse
            })
        }
    }
    
    onTouchEnd = (e) =>{
        if(screen.availWidth>768) return
        this.setState({
            click: false,
            scale:{
                do:false,
                index:0
            }
        })
    }

    handleMouseOut = (e) => {
        this.props.store.allHold("edit",false)
        this.updateCanvasBackground()
        this.updateCanvasImages()
    }

    handleMouseOver = (e) => {
        this.props.store.allHold("edit",true)
        this.updateCanvasBackground()
        this.updateCanvasImages()
    }



    render() {
        return (
            <div className="content-container-show">
                <img src="http://www.jaloogn.com/uupload/ushop/admin/custom/material/00000059/19fb8efd-bba9-4fcc-a6e0-82c4d2fba50e.jpg" />
                <canvas 
                    onMouseUp={this.handleCanvasUp} 
                    onMouseMove={this.handleCanvasMove} 
                    onMouseDown={this.handleCanvasDown}
                    onTouchStart={this.handleTouchStart}
                    onTouchEnd={this.onTouchEnd}
                    onTouchMove={this.onTouchMove}
                    className="upper-canvas " 
                    width={`${screen.availWidth > 447 ? 447.75 : screen.availWidth}`} 
                    height="600" 
                    onMouseOut={this.handleMouseOut}
                    onMouseOver={this.handleMouseOver}
                    ref="canvas"/>
                <img ref="spin" style={{display:"none"}} src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeiconbynhlkfdyfv.png" />
                <img ref="scale" style={{display:"none"}} src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeiconcwl3waofj11.png" />
            </div>
        )
    }
};
