//package
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Route, Redirect, } from 'react-router'
import { Provider, observer } from "mobx-react"
import { Layout, Menu, Breadcrumb } from "antd";
const { Footer } = Layout;

//local
import Header from "./components/Header.jsx"
import Content from "./components/Content.jsx"
import store from "./store/"
import "./less/index.less"

@observer
export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<Layout className='root'>
					<Header/>
					<Content />
					<Footer style={{ textAlign: 'center' }}>
						Ant Design ©2016 Created by Ant UED
					</Footer>
				</Layout>
			</Provider>
		)
	}
}



render(
	<Root />,
	document.getElementById('root')
)
