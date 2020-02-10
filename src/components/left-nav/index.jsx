import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import MENU_LIST from '../../config/menuConfig'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu, Item } = Menu

class LeftNav extends Component {

	hasAuth = (item) => {
		const { to, isPublic } = item
		const username = memoryUtils.user.username
		const menus = memoryUtils.user.role.menus
		if (username === 'admin' || isPublic || menus.includes(to)) {
      return true
		} else if (item.children) {
			return !!item.children.find(child => menus.includes(child.to))
		}
		return false
	}

	showMenuList = (list) => {
		return list.reduce((prev, item) => {
      if (this.hasAuth(item)) {
				if (!item.children) {
					prev.push(
						<Item key={item.to}>
							<Link to={item.to}><Icon type={item.icon}/></Link>
						</Item>
					)
				} else {
					const current_item = item.children.find(c_item => this.props.location.pathname.indexOf(c_item.to))
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

export default withRouter(LeftNav)