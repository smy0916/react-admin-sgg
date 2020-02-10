import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
	Card,
	Icon,
	List
} from 'antd'
import { reqGetCategroy } from '../../api/index'
import { BASE_IMG_URL } from '../../utils/contans'

const { Item } = List

export default class ProductDetail extends Component {
	state = {
		category_name: '',
		product_name: '',
	}

	async componentDidMount () {
		const { pCategoryId, categoryId } = this.props.location.state.product
		if (categoryId === '0') {
			const result = await reqGetCategroy(categoryId)
			const category_name = result.data.name
			this.setState({ category_name })
		} else {
			const results = await Promise.all([
				reqGetCategroy(categoryId),
				reqGetCategroy(pCategoryId)
			])
			const category_name = results[0].data.name
			const product_name = results[1].data.name
			this.setState({
				category_name,
				product_name
			}) 
		}
	}

	render () {
		const { name, desc, price, detail, imgs } = this.props.location.state.product
		const { category_name, product_name } = this.state
		const title = (
			<div>
				<Link to="/product"><Icon type="arrow-left" /></Link>
				<span className="title">商品详情</span>
			</div>
		)
		return (
			<Card title={title} className="product-detail">
				<Item>
					<span className="left">商品名称：</span>
					<span>{name}</span>
				</Item>
				<Item>
					<span className="left">商品描述：</span>
					<span>{desc}</span>
				</Item>
				<Item>
					<span className="left">商品价格：</span>
					<span>{price} 元</span>
				</Item>
				<Item>
					<span className="left">所属分类：</span>
					<span>{category_name}{product_name ? ` --> ${product_name}` : product_name}</span>
				</Item>
				<Item>
					<span className="left">商品图片：</span>
					{
						imgs.map(img => (
							<img key={img} src={BASE_IMG_URL + img} alt={img} />
						))
					}
				</Item>
				<Item>
					<span className="left">商品详情：</span>
					<span dangerouslySetInnerHTML={{ __html: detail }}></span>
				</Item>
			</Card>
		)
	}
}