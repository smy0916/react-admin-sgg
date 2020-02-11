import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import MENU_LIST from '../../config/menuConfig'
import './index.less'

const { SubMenu, Item } = Menu

class LeftNav extends Component {

	hasAuth = (item) => {
		const { to, isPublic } = item
		const username = this.props.user.username
		const menus = this.props.user.role.menus
		if (username === 'admin' || isPublic || menus.includes(to)) {
      return true
		} else if (item.children) {
			return !!item.children.find(child => menus.includes(child.to))
		}
		return false
	}

	showMenuList = (list) => {
		const pathname = this.props.location.pathname
		return list.reduce((prev, item) => {
      if (this.hasAuth(item)) {
				if (!item.children) {
					if (item.to === pathname || pathname.indexOf(item.to) === 0) {
						this.props.setHeadTitle(item.title)
					}
					prev.push(
						<Item key={item.to}>
							<Link to={item.to} onClick={() => this.props.setHeadTitle(item.title)}>
								<Icon type={item.icon}/>{item.title}
							</Link>
						</Item>
					)
				} else {
					const current_item = item.children.find(c_item => pathname.indexOf(c_item.to))
					if (current_item) this.openKeys = item.to
					prev.push(
						<SubMenu
						  key={item.to}
						  title={
							  <span>
								  <Icon type={item.icon} />
								  <span>{item.title}</span>
							  </span>
						  }
						>
							{this.showMenuList(item.children)}
						</SubMenu>
					)
				}
			}
			return prev
		}, [])
	}

	componentWillMount () {
		this.menu_nodes = this.showMenuList(MENU_LIST)
	}

	render () {
		let pathname = this.props.location.pathname
		if (pathname.indexOf('/product') === 0) {
			pathname = '/product'
		}
		const openKeys = [this.openKeys]

		return (
			<div className="left-nav">
				<Link to="/" className="left-nav-header">
					<img src={logo} alt="logo" />
					<h1>管理后台</h1>
				</Link>
				<div className="left-nav-menu">
					<Menu
						selectedKeys={[pathname]}
						defaultOpenKeys={openKeys}
						mode="inline"
						theme="dark"
					>
						{this.menu_nodes}
					</Menu>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({user: state.user}),
	{setHeadTitle}
)(withRouter(LeftNav))