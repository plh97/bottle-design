import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Layout } from "antd";

@inject("store")
@observer
class Trigger extends Component {
	handleAllEventClick = (e) => {
		const {
			showMoreUserInfo,
		} = this.props.store
		let filterDOM = (dom) => {
			return e.nativeEvent.path.filter((index) => {
				// e.preventDefault()
				return index.id == dom
			}).length > 0
		}

		//Switch Channel
		if (e.nativeEvent.path.filter((index) => {
			return index.className == 'roomList'
		}).length > 0) {
			this.props.store.socket({
				url: 'get currentRoomInfo',
				name: e.nativeEvent.path.filter((index) => {
					return index.className == 'roomList'
				})[0].id
			})
		}
	}

	render() {
		const { children } = this.props
		return (
			<div
				className={this.props.className}
				{...this.props}
				ref={(ref) => this.container = ref}
				onClick={this.handleAllEventClick}>
				{children}
			</div>
		);
	}
}

export default Trigger;
