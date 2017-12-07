import React, { Component } from 'react'
import { Layout,Pagination ,  Tabs, Button  } from 'antd'
import { inject, observer } from "mobx-react"

const { Content } = Layout
const { TabPane } = Tabs;

@inject("store")
@observer
export default class canvas extends Component {
    constructor(){
        super()
        this.state={
            click:false,
            drag_img_index:null,
            show_material: false
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

    updateCanvasImages = () => {
        const {
            graphs,
            img_ref
        } = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        graphs.map( graph => {
            ctx.drawImage(
                img_ref[`image${graph.img_index}`] , 
                graph.img_axis.x , 
                graph.img_axis.y , 
                graph.width , 
                graph.height
            );
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(
                graph.img_axis.x,
                graph.img_axis.y,
                graph.width,
                graph.height
            );
            ctx.font="20px Arial";
            ctx.fillStyle = 'black';
            ctx.fillText(
                "X",
                graph.img_axis.x + graph.width-5.5,
                graph.img_axis.y+8
            );
        })
    }

    handleCanvasDown = (e) => {
        if(screen.availWidth<768) return
        let {
            graphs,
            allHold
        } = this.props.store
        let {drag_img_index} = this.state
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        if( graphs.length !== 0 ) {
            var mouse = {
                x : e.clientX - canvas.getBoundingClientRect().left,
                y : e.clientY - canvas.getBoundingClientRect().top
            };
            var _index = null
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
                    console.log("你可能处于被点击的地方");
                    //可以开始处理点击事件，让click=true
                    //应该在此处将所点击的图片  是第几张图片  i 储存
                    this.setState({
                        click: true,
                        index:i
                    })
                    _index = i
                }
            });
            //此处将第i张图片提到最后
            let a = graphs;
            a= [
                ...a.filter((index,i) => {
                    console.log(index,i);
                    return i !== _index
                }),
                a[_index]
            ]
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
            console.log("将某一张图片提到最后",drag_img_index);

            // e.preventDefault();
        }
    }

    handleCanvasMove = (e) => {
        if(screen.availWidth<768) return
        let {
            click,
            drag_img_index
        } = this.state
        let {graphs,allHold} = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        if( graphs.length !== 0 && click ) {
            let graphs_len = graphs["length"]
            let a = graphs
            var mouse = {
                x : e.clientX - canvas.getBoundingClientRect().left,
                y : e.clientY - canvas.getBoundingClientRect().top
            };
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
        }
    }

    handleCanvasUp = (e) => {
        if(screen.availWidth<768) return
        this.setState({
            click: false
        })
    }
    

    handleTouchStart = (e) =>{
        if(screen.availWidth>768) return
        let {
            graphs,
            allHold
        } = this.props.store
        let {drag_img_index} = this.state
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        // window.e = e
        if( graphs.length !== 0 ) {
            var mouse = {
                x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
                y : e.touches[0].clientY - canvas.getBoundingClientRect().top
            };
            let _index = null;
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
                    _index = i
                }
            });
            //此处将第i张图片提到最后
            console.log("将某一张图片提到最后1212",_index);
            let a = graphs;
            a= [
                ...a.filter((index,i) => {
                    console.log(index,i);
                    return i !== _index
                }),
                a[_index]
            ]
            allHold("graphs",a)
            this.updateCanvasBackground()
            this.updateCanvasImages()
            // e.preventDefault();
        }
    }
    
    onTouchMove = (e) =>{
        if(screen.availWidth>768) return
        let {
            click,
            drag_img_index
        } = this.state
        let {graphs,allHold} = this.props.store
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        if( graphs.length !== 0 && click ) {
        
            let graphs_len = graphs["length"]
            let a = graphs
            var mouse = {
                x : e.touches[0].clientX - canvas.getBoundingClientRect().left,
                y : e.touches[0].clientY - canvas.getBoundingClientRect().top
            };
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
        }
    }
    
    onTouchEnd = (e) =>{
        if(screen.availWidth>768) return
        this.setState({
            click: false
        })
    }















    render() {
        console.log(screen.availWidth);
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
            </div>
        )
    }
};
