//package
import React, { Component } from 'react'
import { Layout,Pagination ,  Tabs, Button  } from 'antd'
import { inject, observer } from "mobx-react"

//local
import Canvas from './Canvas.jsx'
import {
    canvas_background,
    canvas_layer
} from '../feature/Canvas.js'

//app
const { Content } = Layout
const { TabPane } = Tabs;

//造数据
let img_list = []
for(let i=0;i<7;i++){
    img_list.push({
        url:"http://oy82lbvct.bkt.clouddn.com/material1.jpg",
        id:i*4+1
    })
    img_list.push({
        url:"http://oy82lbvct.bkt.clouddn.com/material2.jpg",
        id:i*4+2
    })
    img_list.push({
        url:"http://oy82lbvct.bkt.clouddn.com/material3.jpg",
        id:i*4+3
    })
    img_list.push({
        url:"http://oy82lbvct.bkt.clouddn.com/material4.jpg",
        id:i*4+4
    })
}

@inject("store")
@observer
export default class content extends Component {
    constructor(){
        super()
        this.state={
            current_page: 1,
            show_material: false
        }
    }

    handlePageChange = (e,f) =>{
        const {
            allHold
        } = this.props.store
        this.setState({
            current_page:e
        })
        allHold("img_ref",this.refs)
    }



























        
    handleClick = (e) =>{
        const {
            graphs,
            allHold,
        } = this.props.store
        if(e.target.dataset.drag){
            this.setState({
                show_material:false
            })
            //添加图片
            const {
                images,
                allHold,
                show_material
            } = this.props.store
            let index = e.target.dataset.index
            if(e.target.dataset.drag){
                let a = images;
                let scale_val = screen.width>400 ? 1 : screen.width/400
                a.push({
                    element:e.target ,
                    x: 0 ,
                    y: 0 ,
                    width:70,
                    height:70,
                    angle:0,
                    scale:1
                })
                allHold("images",a)
                allHold("is_edit",true)
                canvas_layer(
                    this.refs._canvas.wrappedInstance.refs.canvas_layer,
                    this.props.store.images,
                    true,
                    true,
                    this.props.store.block_props
                )
            }
        }
    }

    show_material = (e) => {
        this.setState({
            show_material:!this.state.show_material
        })
    }

    handleDownload = (e) =>{
        const a = document.createElement("a")
        const image = document.createElement("img")
        const canvas_layer = this.refs._canvas.wrappedInstance.refs.canvas_layer
        const canvas_background = this.refs._canvas.wrappedInstance.refs.canvas_background
        const ctx = canvas_background.getContext('2d');
        const image_src = canvas_layer.toDataURL("image/png");
        image.src = image_src
        image.crossOrigin = "anonymous"
        setTimeout(() => {
            ctx.drawImage(image, 0, 0, 400,600)
            const a_href = canvas_background.toDataURL("image/png");
            a.href=a_href
            a.download=true
            a.click()
        }, 0);
    }

    handlePreview = (e) => {
        this.props.store.allHold("is_edit",false)
        canvas_layer(
            this.refs._canvas.wrappedInstance.refs.canvas_layer,
            this.props.store.images,
            false,
            false,
            this.props.store.block_props
        )
    }

    render() {
        const {
            current_page,
            show_material
        }= this.state
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
                <div className="content-container">
                    <div
                        className={`${show_material ? "active":""} content-container-material`}>
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
                                        <img 
                                            data-drag={true} 
                                            crossOrigin="anonymous"
                                            src={img.url} 
                                            key={i} 
                                            alt={`图片素材${img.id}`}/>
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
                            </TabPane>
                            <TabPane tab="图片定制" key="3">
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                            </TabPane>
                        </Tabs>
                    </div>
                    <Canvas ref="_canvas"/>
                    <div className="content-container-designer"></div>
                </div>
                <div className="content-footer">
                    <span onClick={this.show_material}>素材<br/>📖</span>
                    <span
                        onClick={this.handleDownload}
                        >图片<br/>📷</span>
                    <span>文字<br/>✏️</span>
                    <span>设计师<br/>🙋‍</span>
                    <span 
                        onClick={this.handlePreview}
                        >预览<br/>👊🏾</span>
                </div>
            </Content>
        )
    }
};
