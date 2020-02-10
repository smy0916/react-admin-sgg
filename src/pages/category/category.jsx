import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../api/index'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateFrom from './update-form'
import { PAGE_SIZE } from '../../utils/contans'

export default class Category extends Component {
	state = {
		categorys: [],
		sub_categorys: [],
		loading: false,
		parentId: '0',
		parentName: '',
		modal_status: 0, // 0:都不显示,1:显示添加,2:显示更新
		current_category: null,
	}

	initColumns = () => {
		this.columns = [
			{
				title: '分类名称',
				dataIndex: 'name'
			},
			{
				title: '操作',
				width: 300,
				align: 'right',
				render: (category) => (
					<span>
						<LinkButton onClick={() => { this.openUpdateCategory(category) }}>修改分类</LinkButton>
						{
							this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null
						}
					</span>
				)
			}
		]
	}

	getCategoryList = async (parentId) => {
		this.setState({ loading: true })
		parentId = parentId || this.state.parentId
		const result = await reqCategoryList(parentId)
		this.setState({ loading: false })

		if (result.status === 0) {
			const categorys = result.data
			if (parentId === '0') {
				this.setState({ categorys })
			} else {
				this.setState({ sub_categorys: categorys })
			}
		} else {
			message.error('获取分类列表失败！')
		}
	}

	showSubCategorys = (category) => {
		this.setState({
			parentId: category._id,
			parentName: category.name
		}, () => {
			this.getCategoryList(category._id)
		})
	}

	showCategorys = () => {
		this.setState({
			parentId: '0',
			parentName: '',
			sub_categorys: []
		})
	}

	openUpdateCategory = (category) => {
		this.category = category
		this.setState({ modal_status: 2 })
	}

	updateCategory = () => {
		this.form.validateFields(async(err, values) => {
       if (!err) {
				this.setState({ modal_status: 0 })
				const categoryId = this.category._id
				const {categoryName} = values
				this.form.resetFields()
				const result = await reqUpdateCategory({ categoryId, categoryName })
				if (result.status === 0) {
					this.getCategoryList()
				}
			 }
		})
	}

	addCategory = () => {
		// 进行表单验证
		this.form.validateFields(async(err, values) => {
			if (!err) {
				this.setState({ modal_status: 0 })
				const { parentId, categoryName } = values
				this.form.resetFields()
				const result = await reqAddCategory({
					parentId, categoryName
				})
				if (result.status === 0) {
					// 添加分类是当前分类时
					if (parentId === this.state.parentId || parentId === '0') {
						this.getCategoryList(parentId)
					}
				}
			}
		})

	}

	openAddCategoryModal = () => {
		this.setState({ modal_status: 1 })
	}

	handleCancelModal = () => {
		this.form.resetFields()
		this.setState({ modal_status: 0 })
	}

	componentWillMount () {
		this.initColumns()
	}

	componentDidMount () {
		this.getCategoryList()
	}

	render () {
		const { categorys, loading, parentId, parentName, sub_categorys, modal_status } = this.state
		const category = this.category || {}
		const title = parentId === '0' ? (<span>一级分类列表</span>) : (
			<span>
				<LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
				<Icon style={{ marginRight: 5 }} type="arrow-right" />
				<span>{parentName}</span>
			</span>
		)

		const extra = (
			<Button onClick={this.openAddCategoryModal} type="primary">
				<Icon type="plus" />
				添加
			</Button>
		)

		return (
			<div>
				<Card title={title} extra={extra}>
					<Table
						loading={loading}
						rowKey='_id'
						bordered
						dataSource={parentId === '0' ? categorys : sub_categorys}
						columns={this.columns}
						pagination={{pageSize:PAGE_SIZE, showQuickJumper:true}}
					/>
				</Card>
				<Modal
					title="添加分类"
					cancelText="取消"
					okText="确定"
					visible={modal_status === 1}
					onOk={this.addCategory}
					onCancel={this.handleCancelModal}
				>
					<AddForm
						categorys={categorys}
						parentId={parentId}
						setForm={(form) => { this.form = form }}
					/>

				</Modal>
				<Modal
					title="更新分类"
					cancelText="取消"
					okText="确定"
					visible={modal_status === 2}
					onOk={this.updateCategory}
					onCancel={this.handleCancelModal}
				>
					<UpdateFrom
						categoryName={category.name}
						setForm={(form) => { this.form = form }}
					/>
				</Modal>
			</div>
		)
	}
}