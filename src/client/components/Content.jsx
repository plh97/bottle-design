import React, { Component } from 'react'
import { Layout,Pagination ,  Tabs, Button  } from 'antd'
import { inject, observer } from "mobx-react"

import Tigger from '../features/Tigger.js'

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
        this.updateCanvas();
    }

    handleImageClick = (e) =>{
        console.log(e);
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
    }

    handlePageChange = (e,f) =>{
        this.setState({
            current_page:e
        })
    }
    render() {
        const {current_page}= this.state
        return (
            <Content className="content">
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
                                        <img src={img.url} key={i} alt={`图片素材${img.id}`}/>
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
                        <canvas className="upper-canvas " width="105" height="300" ref="canvas"/>
                    </div>
                    <div className="content-container-designer"></div>
                </Tigger>
            </Content>
        )
    }
};
