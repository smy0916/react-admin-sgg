import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../chart/bar'
import Line from '../chart/line'
import Pie from '../chart/pie'


const { Footer, Sider, Content } = Layout

export default class Admin extends React.Component {
	render () {
		const user = memoryUtils.user
		if (!user || !user._id) {
			return <Redirect to='/signin' />
		}
		return (
			<Layout style={{height: '100%'}}>
				<Sider>
					<LeftNav/>
				</Sider>
				<Layout>
					<Header></Header>
					<Content style={{backgroundColor: '#ddd'}}>
            <Switch>
						  <Route path="/home" component={Home}></Route>
							<Route path="/category" component={Category}></Route>
							<Route path="/product" component={Product}></Route>
							<Route path="/role" component={Role}></Route>
							<Route path="/user" component={User}></Route>
							<Route path="/charts/bar" component={Bar}></Route>
							<Route path="/charts/line" component={Line}></Route>
							<Route path="/charts/pie" component={Pie}></Route>
							<Redirect to="/home"/>
						</Switch>
					</Content>
					<Footer style={{textAlign: 'center'}}>Footer</Footer>
				</Layout>
			</Layout>
		)
	}
}