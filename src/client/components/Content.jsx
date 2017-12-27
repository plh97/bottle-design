//package
import React, { Component } from 'react'
import { 
    Layout,
    Pagination ,
    Button ,
    Tabs ,
    Icon,
    Input,
    InputNumber ,
    Select
} from 'antd'
import { inject, observer } from "mobx-react"
import IconAlignLeft from 'react-icons/lib/fa/align-left';
import IconAlignRight from 'react-icons/lib/fa/align-right';
import IconAlignCenter from 'react-icons/lib/fa/align-center';

//local
import Canvas from './Canvas.jsx'

import {
    canvas_layer,
    measureText
} from '../feature/Canvas_layer.js'

import {
    canvas_background,
    canvas_background_3d
} from '../feature/Canvas_background.js'

import {color_list_rgb} from "../../../config/client.js"
import Tool from "../feature/Tool.js"

//app
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
let toggle_show = true


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
                size:"15px",
                color: "rgb(0,0,0)",
                weight: "bolder",
                family: 'Pacifico',
                textAlign: "center",
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
            let content = document.getElementById("text-customization-input").value || document.getElementById("text-customization-input-pc").value
            if(content=="") {
                Tool.alert_content({
                    content:"文字不能为空!",
                    backgroundColor:"red",
                    color:"#fff"
                })
                this.setState({
                    show_text_customization: false
                })
                return
            }
            text = Object.assign({},text,{content})
            let a = images;
            let scale_val = screen.width > 400 ? 1 : screen.width / 400
            if(is_edit){
                if(images[images.length-1]&&images[images.length-1].type=="text"){
                    Object.assign(a[a.length-1],{
                        content: text.content ,
                        width:measureText(text).width ,
                        height:measureText(text).height + 8,
                        font:{
                            color: text.color,
                            size: text.size ,
                            weight: text.weight,
                            family: text.family
                        }
                    })
                }
            }else {
                a.push({
                    content: text.content ,
                    x: 0 ,
                    y: 0 ,
                    width:measureText(text).width ,
                    height:measureText(text).height + 8,
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
            document.getElementById("text-customization-input-pc").value = ""
        }
        
        switch (e.target.id) {
            case "text-customization-font":
                this.setState({
                    text_font_props: Object.assign({},this.state.text_font_props,{
                        family: e.target.innerText
                    })
                })
                break;
            case "text-customization-color":
                this.setState({
                    text_font_props: Object.assign({},this.state.text_font_props,{
                        color: e.target.style.background
                    })
                })
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
        if (is_edit) {
            //change
            if(images.length>0 && images[images.length-1].type == "text"){
                //长度大于1，且最后一个数组是数字
                this.setState({
                    text_font_props: Object.assign({},images[images.length-1].font,{
                        content:images[images.length-1].content
                    })
                })
            }else if(images.length>0 && images[images.length-1].type == "image"){
                //图片
            }
        }else {
            //new
            this.setState({
                text_font_props: {
                    color: "rgb(0, 0, 0)",
                    family: 'Pacifico',
                    size:"15px",
                    weight: "bolder"
                }
            })
            document.getElementById("text-customization-input").value = ""            
        }

        //点击完后，此处处理逻辑，如果
        // 我的点击有图片就是图片，没有图片采用默认数据
    }
    
    show_material = (e) => {
        const {
            images
        } = this.props.store

        this.setState({
            show_material: !this.state.show_material
        })
    }

    handleDownload = (e) =>{
        // const a = document.createElement("a")
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
            canvas_background.crossOrigin = "anonymous"
            // a.href = canvas_background.toDataURL("image/png")
            window.canvas_image_base64 = canvas_background.toDataURL("image/png")
            canvas_background.toBlob(function(blob){
                window.canvas_image_blob = blob
            })
            // a.download=true
            // a.click()
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
        const {
            block_props,
        } = this.props.store
        this.props.store.allHold("is_edit",false)
        const canvas_layer = this.refs._canvas.wrappedInstance.refs.canvas_layer
        let width = (canvas_layer.width * block_props.width + 5) * Math.PI
        let height = canvas_layer.height * block_props.height + 5
        let image = document.createElement("img")
        image.src = canvas_layer.toDataURL("image/png")
        image.crossOrigin = "anonymous"
        let canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext("2d")

        setTimeout(() => {
            ctx.drawImage(
                image,
                -canvas_layer.width*(1-block_props.width)/2,
                -canvas_layer.height*(1-block_props.y + 0.03),
                canvas_layer.width,
                canvas_layer.height
            )
            const image_src = canvas.toDataURL("image/png");
            toggle_show = canvas_background_3d(
                this.refs._canvas.wrappedInstance.refs.canvas_background,
                image_src,
                toggle_show
            )
            canvas.remove()
        }, 0);
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
        return (
            <Content className="content" onClick={this.handleClick}>
                <div className="content-container">
                    <div className={`${show_material ? "active":""} content-container-material`}>
                        <Tabs type="card">
                            <TabPane className="material-customization" tab="定制素材" key="1">
                                <div className="select">
                                    场景：
                                    <Select defaultValue="婚庆" style={{ width: 120 }}>
                                        <Option value="婚庆">婚庆</Option>
                                        <Option value="生日聚会">生日聚会</Option>
                                        <Option value="企业定制">企业定制</Option>
                                        <Option value="节日/纪念日">节日/纪念日</Option>
                                    </Select>
                                </div>
                                <div className="material-container-image">
                                    <span className="upload" onClick={()=>{
                                        this.refs.upload_image.click()
                                    }}>
                                        +
                                        <input onChange={this.handleUpload} type="file" ref="upload_image"/>
                                    </span>
                                    {img_list.filter((img)=> img.id>(current_page-1)*12 && img.id<=(current_page)*12 ).map((img,i)=>(
                                        <img data-drag={true} 
                                            crossOrigin="anonymous"
                                            src={img.url} 
                                            key={i} 
                                            alt={`图片素材${img.id}`}/>
                                    ))}
                                </div>
                                <Pagination className="material-pagination" size="small"simple={true} total={img_list.length} onChange={this.handlePageChange} />
                            </TabPane>
                            {
                                screen.width>768 && <TabPane className="text-customization" tab="文字定制" key="2">
                                    <div className="text-customization text-customization-content">
                                        <span className="title">内容：</span>
                                        <TextArea id="text-customization-input-pc" rows={4} />
                                    </div>
                                    <div className="text-customization text-customization-font">
                                        <span className="title">字体：</span>
                                        <Select defaultValue={text_font_props.family} style={{ width: 120 }}>
                                            <Option value="Pacifico">Pacifico</Option>
                                            <Option value="Arial">Arial</Option>
                                            <Option value="宋体">宋体</Option>
                                            <Option value="流体">流体</Option>
                                        </Select>
                                    </div>
                                    <div className="text-customization text-customization-size">
                                        <span className="title">大小：</span>
                                        <InputNumber max = {30} min = {8}
                                            defaultValue = {text_font_props.size.replace(/px/g,'')}
                                            formatter={value => `${value}px`}
                                            parser={value => value.replace(/[^\d]/g,'')}/>
                                    </div>
                                    <div className="text-customization text-customization-color">
                                        <span className="title">颜色：</span>
                                        <span className="choice">
                                            {color_list_rgb.map((color,i) => (
                                                <i style={{background:color}}
                                                    id="text-customization-color"
                                                    className={`${color==text_font_props.color ? "active":""}`}
                                                    key={i}/>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="text-customization text-customization-type">
                                        <span className="title">排版：</span>
                                        <span className="choice">
                                            <IconAlignLeft tittle="居左对齐"/>
                                            <IconAlignCenter title="居中对齐" />
                                            <IconAlignRight title="居右对齐" />
                                            <span title="粗体">B</span>
                                            <i title="斜体">I</i>
                                            <span title="中划线" className="linethrough">D</span>
                                            <span title="下划线" className="underline">U</span>
                                        </span>
                                    </div>
                                    <div className="text-customization text-customization-submit">
                                        <Button data-text={true} type="primary">
                                            {(is_edit&&images[images.length-1].type=="text") ? "修改" : "添加"}
                                        </Button>
                                    </div>
                                </TabPane>
                            }
                            {/* <TabPane tab="图片定制" key="3">
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                                <p>Content of Tab Pane 3</p>
                            </TabPane> */}
                        </Tabs>
                    </div>
                    <Canvas 
                        show_text={this.show_text}
                        ref="_canvas"/>
                    <div className="content-container-designer">
                        <Button onClick={this.handlePreview} className="btn-3d">预    览</Button>
                        <Button onClick={this.handleDownload} className="btn-2d">返回购买</Button>
                    </div>
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
                                    <span id="text-customization-font"
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
                                {(is_edit&&images[images.length-1].type=="text") ? "修改" : "添加"}
                            </Button>
                        </div>
                    </div>
                    
                </div>
                <div className="content-footer">
                    <span onClick={this.show_material}>素材<br/>📖</span>
                    <span onClick={this.show_text}> 
                        文字<br/>✏️
                    </span>
                    {/* <span>
                        设计师<br/>🙋‍
                    </span> */}
                    <span onClick={this.handlePreview}>
                        预览<br/>👊🏾
                    </span>
                    <span onClick={this.handleDownload}>
                        返回购买<br/>📷
                    </span>
                </div>
            </Content>
        )
    }
};
