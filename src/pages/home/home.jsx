import React, { Component } from 'react'
import './home.less'
export default class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	render() {
		return (
		  <div className="home">欢迎使用后台管理系统</div>
		)
	}
}