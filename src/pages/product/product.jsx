import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductHome from './home'
import ProductAddAndUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'
export default class Product extends Component {
	state = {}
	render() {
		return (
			<div>
			 <Switch>
			   <Route path="/product/detail" component={ProductDetail}/>
				 <Route path="/product/addupdate" component={ProductAddAndUpdate}/>
				 <Route path="/product" exact component={ProductHome}/>
				 <Redirect to="/product"/>
			 </Switch>
			</div>
		)
	}
}