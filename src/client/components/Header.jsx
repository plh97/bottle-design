import React, { Component } from 'react'
import { Layout } from 'antd'
import { inject, observer } from "mobx-react"
import { colorList } from '../../../config/client.js'
const { Header } = Layout

@inject("store")
@observer
export default class header extends Component {
	render() {
		return (
			<Header className="header">
				<div className="search">
					<input placeholder="请输入搜索关键词" type="text" />
					<span>搜索</span>
				</div>
				<div className="search-list">
					<span>茅塔</span>
					<span>茅塔</span>
					<span>茅塔</span>
					<span>茅塔</span>
					<span>茅塔</span>
				</div>
			</Header>
		)
	}
};
