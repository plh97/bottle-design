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
            }
        }
    }

    componentDidMount() {
        this.updateCanvasBackground();
    }

    updateCanvasBackground = () => {
        console.log("重绘背景")
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        //清除全部
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
        console.log(this.refs);
        const {
            graphs,
            img_ref
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
            //需要旋转参数
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
            //需要旋转参数
            if(i==graphs.length-1){
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
                    x + width - 5.5,
                    y + 8
                );
                //scale
                ctx.drawImage(
                    this.refs.scale , 
                    //右下角
                    x + width -7 , 
                    y + height -7 , 
                    14 , 
                    14
                );
                //旋转
                ctx.drawImage(
                    this.refs.spin , 
                    //中上
                    x + width/2 -7 , 
                    y -7 , 
                    14 , 
                    14
                );
                ctx.restore()
            }else {
                ctx.restore()
            }
        })
    }




























    handleCanvasDown = (e) => {
        if(screen.availWidth<768) return
        let {
            graphs,
            allHold
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        if( graphs.length !== 0 ) {
            var mouse = {
                x : e.clientX - canvas.getBoundingClientRect().left,
                y : e.clientY - canvas.getBoundingClientRect().top
            };
            var img_index = null
            var img_close = null
            var img_scale = null
            var img_spin = null
            graphs.map( (image,i) => {
                let offset = {
                    x : image.img_axis.x,
                    y : image.img_axis.y
                };
                if(
                    mouse.x > offset.x &&
                    mouse.x < offset.x + image.width &&
                    mouse.y > offset.y &&
                    mouse.y < offset.y + image.height 
                ){
                    console.log("点击图片");
                    this.setState({
                        click: true
                    })
                    img_index = i
                }else if(
                    mouse.x < offset.x + image.width + 10 &&
                    mouse.x > offset.x + image.width - 10 &&
                    mouse.y < offset.y + 10 &&
                    mouse.y > offset.y - 10
                ){
                    img_close = i
                }else if(
                    mouse.x < offset.x + image.width + 10 &&
                    mouse.x > offset.x + image.width - 10 &&
                    mouse.y < offset.y + image.height + 10 &&
                    mouse.y > offset.y + image.height - 10
                ){
                    //缩放图片
                    this.setState({
                        scale: {
                            do:true,
                            index:i
                        }
                    })
                    console.log('缩放图片');
                }else if(
                    mouse.x > offset.x + image.width/2 - 10 &&
                    mouse.x < offset.x + image.width/2 + 10 &&
                    mouse.y > offset.y - 10 &&
                    mouse.y < offset.y + 10
                ){
                    //旋转图片
                    this.setState({
                        spin: {
                            do:true,
                            index:i
                        }
                    })
                    img_index = i
                    console.log('旋转图片');
                }
            });
            if(img_index!=null){
                //此处将第i张图片提到最后
                console.log("此处调整图片顺序");
                let a = graphs;
                a= [
                    ...a.filter((index,i) => {
                        console.log("index,i",img_index,i);
                        return i !== img_index
                    }),
                    a[img_index]
                ]
                allHold("graphs",a)
                this.updateCanvasBackground()
                this.updateCanvasImages()
            }else if(img_close!==null){
                //关闭图片
                let a = graphs;
                a.splice(img_close,1)
                allHold("graphs",a)
                this.updateCanvasBackground()
                this.updateCanvasImages()
            // }else if(img_spin !== null){
            //     //旋转梗
            //     //此处将第i张图片提到最后
            //     let a = graphs;
            //     a= [
            //         ...a.filter((index,i) => {
            //             console.log("img_spin,i",img_spin,i);
            //             return i !== img_spin
            //         }),
            //         a[img_spin]
            //     ]
            //     allHold("graphs",a)
            //     this.updateCanvasBackground()
            //     this.updateCanvasImages()
            }
        }
    }

    handleCanvasMove = (e) => {
        if(screen.availWidth<768) return
        let {
            click,
            scale,
            spin
        } = this.state
        let {graphs,allHold} = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        var mouse = {
            x : e.clientX - canvas.getBoundingClientRect().left,
            y : e.clientY - canvas.getBoundingClientRect().top
        };
        if( graphs.length !== 0 && click ) {
            let graphs_len = graphs["length"]
            let a = graphs
            //数组里面最后一个图片端点位置
            let offset = {
                x : graphs[graphs.length-1].img_axis.x,
                y : graphs[graphs.length-1].img_axis.y
            };
            //永远只移动数组最后一个img{}
            a[graphs_len-1] = Object.assign({},a[graphs_len-1],{
                img_axis: {
                    x:mouse.x-(30),
                    y:mouse.y-(30)
                },
            })
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(graphs.length !== 0 && scale.do){
            // scale
            console.log('开始缩放');
            let a = graphs;
            a[scale.index].width = mouse.x - a[scale.index].img_axis.x
            a[scale.index].height = mouse.y - a[scale.index].img_axis.y
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(graphs.length !== 0 && spin.do){
            // spin
            console.log('开始旋转123123123');
            let graphs_len = graphs["length"]
            let a = graphs
            //数组里面最后一个图片端点位置
            let offset = {
                x : graphs[graphs.length-1].img_axis.x,
                y : graphs[graphs.length-1].img_axis.y
            };
            let img = {
                width : graphs[graphs.length-1].width,
                height : graphs[graphs.length-1].height
            };

            let dirtX = mouse.x - offset.x - img.width/2
            let dirtY = -(mouse.y - offset.y - img.height/2)
            let angle = Math.atan2(dirtY,dirtX)
            
            a[scale.index].angle = (90 - 180*angle/Math.PI )
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
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
        if( graphs.length !== 0 ) {
            var mouse = {
                x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
                y : e.touches[0].clientY - canvas.getBoundingClientRect().top
            };
            var img_index = null
            var img_close = null
            var img_scale = null
            graphs.map( (image,i) => {
                let offset = {
                    x : image.img_axis.x,
                    y : image.img_axis.y
                };
                if(
                    mouse.x>offset.x &&
                    mouse.x<offset.x+image.width &&
                    mouse.y>offset.y &&
                    mouse.y<offset.y+image.height 
                ){
                    //可以开始处理点击事件，让click=true
                    //应该在此处将所点击的图片  是第几张图片  i 储存
                    console.log('点击图片');
                    this.setState({
                        click: true
                    })
                    img_index = i
                }else if(
                    mouse.x < offset.x + image.width + 10 &&
                    mouse.x > offset.x + image.width - 10 &&
                    mouse.y < offset.y + 10 &&
                    mouse.y > offset.y - 10
                ){
                    //关闭图片
                    img_close = i
                }else if(
                    mouse.x < offset.x + image.width + 10 &&
                    mouse.x > offset.x + image.width - 10 &&
                    mouse.y < offset.y + image.height + 10 &&
                    mouse.y > offset.y + image.height - 10
                ){
                    //缩放图片
                    this.setState({
                        scale: {
                            do:true,
                            x:mouse.x-offset.x,
                            y:mouse.y-offset.y,
                            index:i
                        }
                    })
                }
            });
            
            if(img_index!=null){
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
            }else if(img_close!==null){
                //关闭图片
                let a = graphs;
                a.splice(img_close,1)
                allHold("graphs",a)
                this.updateCanvasBackground()
                this.updateCanvasImages()
            }
        }
    }
    
    onTouchMove = (e) =>{
        if(screen.availWidth>768) return
        let {
            click,
            scale
        } = this.state
        let {graphs,allHold} = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        var mouse = {
            x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
            y : e.touches[0].clientY - canvas.getBoundingClientRect().top
        };
        if( graphs.length !== 0 && click ) {
            let graphs_len = graphs["length"]
            let a = graphs
            //数组里面最后一个图片端点位置
            let offset = {
                x : graphs[graphs.length-1].img_axis.x,
                y : graphs[graphs.length-1].img_axis.y
            };
            //永远只移动数组最后一个img{}
            a[graphs_len-1] = Object.assign({},a[graphs_len-1],{
                img_axis: {
                    x:mouse.x-30,
                    y:mouse.y-30
                },
            })
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
        }else if(graphs.length !== 0 && scale.do){
            // scale
            console.log('开始缩放');
            let a = graphs;
            a[scale.index].width = mouse.x - a[scale.index].img_axis.x
            a[scale.index].height = mouse.y - a[scale.index].img_axis.y
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
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
                    ref="canvas"/>
                <img ref="spin" style={{display:"none"}} src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeiconbynhlkfdyfv.png" />
                <img ref="scale" style={{display:"none"}} src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeiconcwl3waofj11.png" />
            </div>
        )
    }
};
