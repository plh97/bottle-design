import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Layout } from "antd";

@inject("store")
@observer
class Trigger extends Component {
	constructor(){
		super()
		this.state = {
			mouseDown:true,
			img_url:""
		}
	}

	handleAllEventClick = (e) => {

	}

	mouseDown = (e) => {
	}

	// mouseMove = (e) => {
	// 	console.log("鼠标移动事件",e);
	// }

	mouseUp = (e) => {
		console.log('释放鼠标',e);
	}

	render() {
		const { children } = this.props
		return (
			<div
				className={this.props.className}
				{...this.props}
				ref={(ref) => this.container = ref}
				// onMouseDown={this.mouseDown}
				// onMouseMove={this.mouseMove}
				// onMouseUp={this.mouseUp}
				onClick={this.handleAllEventClick}>
				{children}
			</div>
		);
	}
}

export default Trigger;
