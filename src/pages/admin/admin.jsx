import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
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
import NotFound from '../not-found/not-found'


const { Footer, Sider, Content } = Layout

class Admin extends React.Component {
	render () {
		const user = this.props.user
		if (!user || !user._id) {
			return <Redirect to='/signin' />
		}
		return (
			<Layout style={{minHeight: '100%'}}>
				<Sider>
					<LeftNav/>
				</Sider>
				<Layout>
					<Header></Header>
					<Content style={{backgroundColor: '#ddd'}}>
            <Switch>
						  <Redirect from="/" exact to="/home"/> 
						  <Route path="/home" component={Home} />
							<Route path="/category" component={Category} />
							<Route path="/product" component={Product} />
							<Route path="/role" component={Role} />
							<Route path="/user" component={User} />
							<Route path="/charts/bar" component={Bar} />
							<Route path="/charts/line" component={Line} />
							<Route path="/charts/pie" component={Pie} />
              <Route component={NotFound} />
						</Switch>
					</Content>
					<Footer style={{textAlign: 'center'}}>Footer</Footer>
				</Layout>
			</Layout>
		)
	}
}

export default connect(
	state => ({user: state.user}),
	{}
)(Admin)