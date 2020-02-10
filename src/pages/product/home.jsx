import React, { Component } from 'react'
import {
	Card,
	Select,
	Input,
	Table,
	Button,
	Icon,
	message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProductList, reqSearchProduct, reqUpdateStatus } from  '../../api/index'
import { PAGE_SIZE } from '../../utils/contans'
const {Option} = Select 

export default class ProductHome extends Component {
	state = {
		total: 0,
		product_list: [],
		loading: false,
		searchName: '',
		searchType: 'productName',
	}

	initCloumns = () => {
    this.columns = [
			{
				title: '商品名称',
				dataIndex: 'name',
				width: 200
			},
			{
				title: '商品描述',
				dataIndex: 'desc'
			},
			{
				title: '价格',
				width: 100,
				dataIndex: 'price',
				render: (price) => '￥' + price
			},
			{
				title: '状态',
				width: 100,
				render: (product) => (
					<div>
						<Button type="primary" onClick={() => this.updateStatus(product)}>{product.status === 1 ? '下架' : '上架'}</Button>
						<span>{product.status === 1 ? '在售' : '已下架'}</span>
					</div>
				)
			},
			{
				title: '操作',
				width: 100,
				render: (product) => (
					<div>
            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
						<LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
					</div>
				)
			}
		]
	}
	
	addProduct = () => {
  
	}

	getProductList = async(pageNum) => {
		this.setState({loading: true})
		this.pageNum = pageNum
		const { searchName, searchType } = this.state
		let result
		if (searchName) {
      result = await reqSearchProduct({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
		} else {
			result = await reqProductList({pageNum, pageSize:PAGE_SIZE})
		}
		this.setState({loading: false})
		if (result.status === 0) {
		  this.setState({
				total: result.data.total,
				product_list: result.data.list
			})
		}
	}

	updateStatus = async(product) => {
		const { _id, status } = product
		const _status = status === 1 ? 2 : 1
		const result = await reqUpdateStatus({_id, _status})
		if (result.status === 0) {
			message.success(`商品${_status === 1 ? '上架':'下架'}成功！`)
			this.getProductList(this.pageNum)
		}
	}

	componentWillMount(){
    this.initCloumns()
	}

	componentDidMount(){
    this.getProductList(1)
	}

	render () {
		const { product_list, total, loading, searchType, searchName } = this.state
		const title = (
		  <div>
				<Select 
					style={{width: 120}}
					value={searchType}
					onChange={(value) => this.setState({searchType:value})}
				>
					<Option value="productName">按名称搜索</Option>
					<Option value="productDesc">按描述搜索</Option>
				</Select>
				<Input 
					style={{width: 120, margin: '0 15px'}} 
					placeholder="关键字" 
					value={searchName}
					onChange={(e) => this.setState({searchName: e.target.value})}
				/>
				<Button onClick={() => this.getProductList(1)} type="primary">搜索</Button>
		  </div>
		)
		const extra = (<Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}><Icon type="plus"/>添加</Button>)
		return (
			<div>
				<Card title={title} extra={extra}>
					<Table
					  rowKey="_id"
						columns={this.columns}
						dataSource={product_list}
						bordered
						loading={loading}
            pagination={{
							total, 
							defaultPageSize: PAGE_SIZE, 
							showQuickJumper: true, 
							onChange: this.getProductList,
              current: this.pageNum  
					  }}
					/>
				</Card>
			</div>
		)
	}
}