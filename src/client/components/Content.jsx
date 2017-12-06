import React, { Component } from 'react'
import { Layout,Pagination ,  Tabs, Button  } from 'antd'
import { inject, observer } from "mobx-react"

import Tigger from '../feature/Trigger.js'

const { Content } = Layout
const { TabPane } = Tabs;

let img_list = []
for(let i=1;i<29;i++){
    img_list.push({
        url:"http://www.jaloogn.com/uupload/ushop/admin/custom/material/00000001/2668f6ca-ca04-4a5c-87de-e82766b4125e.jpg",
        id:i
    })
}

@inject("store")
@observer
export default class content extends Component {
    constructor(){
        super()
        this.state={
            current_page:1
        }
    }

    componentDidMount() {
        //初始化执行一次
        this.updateCanvasBackground();

    }

    handleImageClick = (e) =>{
        console.log(e);
    }

    updateCanvasBackground() {
        console.log("updateCanvasBackground")
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(170, 240, 100, 300);
        ctx.strokeStyle = 'green';
        ctx.strokeRect(170, 240, 100, 300);
    }

    updateCanvasImages(img_url,axis) {
        console.log("updateCanvasImages",img_url,axis)
        //那么我需要什么数据呢？？？
        //我需要图片的一个[]数组，通过给图片数组排序，得到图片显示顺序，
        //图片数组中包括图片url以及图片的坐标位置/以及图片的大小，以便于图片时刻重绘
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = ()=>{
           ctx.drawImage(img,axis.x,axis.y,70,70);
           ctx.strokeStyle = 'blue';
           ctx.strokeRect(axis.x,axis.y,70,70);
        };
        img.src = img_url;
    }
        
    handleClick = (e) =>{
        const canvas = this.refs.canvas;
        if(e.target.dataset.drag){
            this.updateCanvasImages(e.target.src,{
                x:180,
                y:280
            })
            canvas.addEventListener("mousedown",(e) => {
                var x = e.clientX;
                var y = e.clientY;
                var rect = canvas.getBoundingClientRect();
                x -= rect.left;
                y -= rect.top;
                console.log(canvas.clientX); // (x, y) 就是鼠标在 canvas 单击时的坐标

                console.log("你点击的区域 是否属于图片范围内",e);
                if(
                    60<e.layerX &&
                    e.layerX<130 &&
                    280<e.layerY &&
                    e.layerY<350 
                ){
                    //你处于需要拖拽的范围
                    //给canvas添加鼠标移动事件
                    canvas.addEventListener("mousemove",(e)=>{
                        ctx.clearRect(0,0,canvas.width,canvas.height);
                        this.updateCanvasBackground()
                        //这里再次绘制图片
                        ctx.drawImage(img,e.layerX,e.layerY,70,70);
                        ctx.strokeStyle = 'blue';
                        ctx.strokeRect(e.layerX,e.layerY,70,70);
                    })
                }
            })
        }
    }

    handlePageChange = (e,f) =>{
        this.setState({
            current_page:e
        })
    }
    render() {
        const {current_page}= this.state
        return (
            <Content className="content" onClick={this.handleClick}>
                <div className="content-navigation">
                    <a href="#">首页</a>
                    <a href="#">定制馆</a>
                    <a href="#">定制馆</a>
                    <a href="#">砍价专区</a>
                    <a href="#">拼图专区</a>
                    <a href="#">合作代理</a>
                </div>
                <Tigger className="content-container">
                    <div className="content-container-material">
                        <Tabs type="card">
                            <TabPane tab="定制素材" key="1">
                                <div className="select">
                                    场景：
                                    <select name="select">
                                        <option value="value1" defaultValue>婚庆</option>
                                        <option value="value2">生日聚会</option>
                                        <option value="value3">企业定制</option>
                                        <option value="value3">节日/纪念日</option>
                                    </select>
                                </div>
                                <div className="material-container-image">
                                    {img_list.filter((img)=> img.id>(current_page-1)*12 && img.id<=(current_page)*12 ).map((img,i)=>(
                                        <img data-drag={true} src={img.url} key={i} alt={`图片素材${img.id}`}/>
                                    ))}
                                </div>
                                <Pagination className="material-pagination" size="small"simple={true} total={img_list.length} onChange={this.handlePageChange} />
                            </TabPane>
                            <TabPane tab="文字定制" key="2">
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                            </TabPane>
                            <TabPane tab="图片定制" key="3">
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="content-container-show">
                        <img src="http://www.jaloogn.com/uupload/ushop/admin/custom/material/00000059/19fb8efd-bba9-4fcc-a6e0-82c4d2fba50e.jpg" />
                        <canvas className="upper-canvas " width="447.75" height="600" ref="canvas"/>
                    </div>
                    <div className="content-container-designer"></div>
                </Tigger>
            </Content>
        )
    }
};
