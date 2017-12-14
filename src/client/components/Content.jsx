//package
import React, { Component } from 'react'
import { Layout,Pagination ,Button ,Tabs ,Icon } from 'antd'
import { inject, observer } from "mobx-react"

//local
import Canvas from './Canvas.jsx'

import {
    canvas_layer,
    measureText
} from '../feature/Canvas_layer.js'

import {
    canvas_background
} from '../feature/Canvas_background.js'

import {color_list_rgb} from "../../../config/client.js"

//app
const { Content } = Layout;
const { TabPane } = Tabs;


@inject("store")
@observer
export default class content extends Component {
    constructor(){
        super()
        this.state={
            current_page: 1,
            show_material: false,
            img_list:[
                {
                    url:"http://oy82lbvct.bkt.clouddn.com/material1.jpg",
                    id:1
                },{
                    url:"http://oy82lbvct.bkt.clouddn.com/material2.jpg",
                    id:2
                },{
                    url:"http://oy82lbvct.bkt.clouddn.com/material3.jpg",
                    id:3
                },{
                    url:"http://oy82lbvct.bkt.clouddn.com/material4.jpg",
                    id:4
                },{
                    url:"http://oy82lbvct.bkt.clouddn.com/bk1.jpg",
                    id:5
                }
            ],
            text_font_props: {
                color: "rgb(0, 0, 0)",
                family: 'Pacifico',
                size:"15px",
                weight: "bolder"
            }
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
        //添加图片
        const {
            images,
            texts,
            allHold,
            is_edit
        } = this.props.store
        if(e.target.dataset.drag){
            let a = images;
            let scale_val = screen.width>400 ? 1 : screen.width/400
            a.push({
                element:e.target ,
                x: 0 ,
                y: 0 ,
                width:70 * scale_val,
                height:70 * scale_val,
                angle:0,
                scale:1,
                type: "image"
            })
            allHold("images",a)
            allHold("is_edit",true)
            canvas_layer(
                this.refs._canvas.wrappedInstance.refs.canvas_layer,
                a,
                this.props.store.texts,
                true,
                true,
                this.props.store.block_props
            )
            this.setState({
                show_material:false
            })
        }else if(e.target.dataset.text){
            let text = this.state.text_font_props
            //如果没有输入文字，则提示
            if(text.content=="") {
                let alert_content = document.createElement("span")
                alert_content.append("请输入文字!！！")
                alert_content.style.top = "30%"
                alert_content.style.left = "40%"
                alert_content.style.color = "#fff"
                alert_content.style.border = "2px solid #ddd"
                alert_content.style.zIndex = "999"
                alert_content.style.padding = "5px"
                alert_content.style.position = "absolute"
                alert_content.style.fontWeight = "bolder"
                alert_content.style.borderRadius = "5px"
                alert_content.style.backgroundColor = "red"
                document.body.append(alert_content)
                setTimeout(()=>{
                    alert_content.remove()
                },2000)
                this.setState({
                    show_text_customization: false
                })
                return
            }  
            text = Object.assign({},text,{
                content: document.getElementById("text-customization-input").value
            })
                
            let a = images;
            let scale_val = screen.width > 400 ? 1 : screen.width / 400
            if(is_edit){
                console.log('is_edit',is_edit);
                if(images[images.length-1]&&images[images.length-1].type=="text"){
                    //当处于可编辑状态
                    //最后一个为图片
                    //则修改最后一个数组属性
                    a[a.length] = {
                        content: text.content ,
                        x: 0 ,
                        y: 0 ,
                        width:measureText(text).width ,
                        height:measureText(text).height,
                        angle:0,
                        scale:1,
                        font:{
                            color: text.color,
                            size: text.size ,
                            weight: text.weight,
                            family: text.family
                        },
                        type: "text"
                    }
                }
            }else {
                //
                a.push({
                    content: text.content ,
                    x: 0 ,
                    y: 0 ,
                    width:measureText(text).width ,
                    height:measureText(text).height,
                    angle:0,
                    scale:1,
                    font:{
                        color: text.color,
                        size: text.size ,
                        weight: text.weight,
                        family: text.family
                    },
                    type: "text"
                })
            }
            allHold("images",a)
            allHold("is_edit",true)
            canvas_layer(
                this.refs._canvas.wrappedInstance.refs.canvas_layer,
                this.props.store.images,
                true,
                true,
                this.props.store.block_props
            )
            this.setState({
                show_text_customization: false
            })
            document.getElementById("text-customization-input").value = ""
        }
        
        switch (e.target.id) {
            case "text-customization-font":
                this.setState({
                    text_font_props: Object.assign({},this.state.text_font_props,{
                        family: e.target.innerText
                    })
                })
                console.log("修改family",this.state.text_font_props);
                break;
            case "text-customization-color":
                this.setState({
                    text_font_props: Object.assign({},this.state.text_font_props,{
                        color: e.target.style.background
                    })
                })
                console.log("修改color",this.state.text_font_props);
                break;
            default:
                break;
        }
    }
    
    show_text = (e) => {
        const {
            images,
            is_edit
        } = this.props.store
        this.setState({
            show_text_customization: !this.state.show_text_customization
        })
        document.getElementById("text-customization-input").value = ""            
        if (is_edit) {
            //change
            if(images.length>0 && images[images.length-1].type == "text"){
                //长度大于1，且最后一个数组是数字
                console.log('将最后一个是文字的写入属性');
                this.setState({
                    text_font_props: Object.assign({},images[images.length-1].font,{
                        content:images[images.length-1].content
                    })
                })
            }
        }else {
            //new
            console.log('将最后一个是文字的写入属性');            
            this.setState({
                text_font_props: {
                    color: "rgb(0, 0, 0)",
                    family: 'Pacifico',
                    size:"15px",
                    weight: "bolder"
                }
            })
        }

        //点击完后，此处处理逻辑，如果
        // 我的点击有图片就是图片，没有图片采用默认数据
    }
    
    show_material = (e) => {
        const {
            images
        } = this.props.store
        const text_default_font_props = {
            color: "#000000",
            family: 'Pacifico',
            size:"15px",
            weight: "bolder"
        }
        let text_font_props = text_default_font_props
        if(images.length > 0){
            text_font_props = ( is_edit && images[images.length-1].type == 'text' ) ? images[images.length-1].font : text_default_font_props
        }

        this.setState({
            text_font_props
        })

        this.setState({
            show_material: !this.state.show_material
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
            ctx.drawImage(
                image, 
                0, 0,  
                screen.width > 400 ? 400 : screen.width ,
                screen.height-93 > 600 ? 600 : screen.height-93 
            )
            a.href = canvas_background.toDataURL("image/png")
            a.download=true
            a.click()
        }, 0);
    }

    handleUpload = (e) => {
        const {img_list} = this.state
        let data = new FormData()
		data.append("smfile", e.target.files[0])
		fetch('https://sm.ms/api/upload', {
		  method: 'POST',
		  body: data
		}).then(
			response => response.json()
		).then(
			success => {
                this.setState({
                    img_list: [...img_list,{
                        url:success.data.url,
                        id:img_list.length
                    }]
                })
			}
		)
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
            img_list,
            current_page,
            show_material,
            show_text_customization,
            text_font_props
        }= this.state
        const {
            images,
            is_edit
        } = this.props.store
        console.log(
            text_font_props
        );
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
                    <div className={`${show_material ? "active":""} content-container-material`}>
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
                                    <span className="upload" onClick={()=>{
                                        this.refs.upload_image.click()
                                    }}>
                                        +
                                        <input onChange={this.handleUpload} type="file" ref="upload_image"/>
                                    </span>
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
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                            </TabPane>
                        </Tabs>
                    </div>
                    <Canvas 
                        show_text={this.show_text}
                        ref="_canvas"/>
                    <div className="content-container-designer"></div>
                    <div className={`${show_text_customization ? "active":""} content-container-text-customization`}>
                        <div className="text-customization-mask"></div>
                        <div className="text-customization-content">
                            <span>内容</span>
                            <input id="text-customization-input" type="text"/>
                            <Icon type="close-circle-o" onClick={()=>{
                                document.getElementById("text-customization-input").value=''
                            }} />
                        </div>
                        <div className="text-customization-font">
                            <span className="text-customization-font-title">字体</span>
                            <span className="text-customization-font-container">
                                {["Pacifico","Arial","宋体","流体"].map((text,i)=>(
                                    <span 
                                        id="text-customization-font"
                                        className={`${text==text_font_props.family ? "active":""}`}
                                        key={i}>{text}</span>
                                ))}
                            </span>
                        </div>
                        <div className="text-customization-color">
                            <span className="text-customization-color-title">颜色</span>
                            <span className="text-customization-color-container">
                                {color_list_rgb.map((color,i) => (
                                    <i style={{background:color}}
                                        id="text-customization-color"
                                        className={`${color==text_font_props.color ? "active":""}`}
                                        key={i}/>
                                ))}
                            </span>
                        </div>
                        <div className="text-customization-submit">
                            <Button data-text={true} type="primary">
                                {is_edit ? "修改" : "添加"}
                            </Button>
                        </div>
                    </div>
                    
                </div>
                <div className="content-footer">
                    <span onClick={this.show_material}>素材<br/>📖</span>
                    <span onClick={this.handleDownload}>
                        图片<br/>📷
                    </span>
                    <span onClick={this.show_text}> 
                        文字<br/>✏️
                    </span>
                    {/* <span>
                        设计师<br/>🙋‍
                    </span> */}
                    <span onClick={this.handlePreview}>
                        预览<br/>👊🏾
                    </span>
                </div>
            </Content>
        )
    }
};
