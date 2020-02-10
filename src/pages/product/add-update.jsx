import React, { Component } from 'react'
import {
	Card,
	Input,
	Form,
	Cascader,
	Icon,
	Button,
	message
} from 'antd'
import LinkButton from '../../components/link-button'
import PicturesWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategoryList, reqAndOrUpdate } from '../../api/index'

const Item = Form.Item
const TextArea = Input.TextArea

class ProductAddAndUpdate extends Component {

	constructor(){
		super()
		this.pw = React.createRef()
		this.editor = React.createRef()
	}

	state = {
		loading: false,
		img_url: '',
		options: [],
	}

	validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
			callback()
		} else {
			callback('价格必须大于0！')
		}
	}

	initOptions = async(categorys) => {
		const { isUpdate, product } = this
		const { pCategoryId } = product
    const options = categorys.map(c => ({
			value: c._id,
			label: c.name,
			isLeaf: false
		}))

		if (isUpdate && pCategoryId !== '0') {
			const sub_categorys = await this.getCategorys(pCategoryId)
			const sub_options = sub_categorys.map(c => ({
				value: c._id,
			  label: c.name,
			  isLeaf: true
			}))
			const targetOption = options.find(o => o.value === pCategoryId)
			if (targetOption) targetOption.children = sub_options
		}
  
		this.setState({options})
	}

	getCategorys = async(parentId) => {
		const result = await reqCategoryList(parentId)
		if (result.status === 0) {
			const categorys = result.data
			if (parentId === '0') {
			  this.initOptions(categorys)
			} else {
				return categorys
			}
		}
	}

	submit = () => {
		this.props.form.validateFields(async(err, values) => {
			if (!err) {
				const {name, desc, price, categoryIds} = values
				let categoryId , pCategoryId
				if (categoryIds.length === 1) {
					pCategoryId = '0'
					categoryId = categoryIds[0]
				} else {
					pCategoryId = categoryIds[0]
					categoryId = categoryIds[1]
				}
				const imgs = this.pw.current.getImgs()
				const detail = this.editor.current.getDetail()
				const product = { name, desc, price, categoryId, pCategoryId, imgs, detail }
				if (this.isUpdate) {
					product._id = this.product._id
				}
				
				const result = await reqAndOrUpdate(product)
				if (result.status === 0) {
					message.success(`${this.isUpdate ? '更新' : '添加'}成功！`)
				} else {
					message.error(`${this.isUpdate ? '更新' : '添加'}失败！`)
				}
				this.props.history.goBack()
			}
		})
	}

	loadData = async(selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
		targetOption.loading = true
		
		const sub_categorys = await this.getCategorys(targetOption.value)
		targetOption.loading = false

		if (sub_categorys && sub_categorys.length >0) {
			const options = sub_categorys.map(s => ({
				value: s._id,
				label: s.name,
				isLeaf: true
			}))
			targetOption.children = options
		} else {
			targetOption.isLeaf = true
		}
		this.setState({
			options: [...this.state.options],
		})  
	}

	componentWillMount(){
		const product = this.props.location.state
		this.isUpdate = !!product
		this.product = product || {}
	}
	
	componentDidMount(){
		this.getCategorys('0')
	}

	render () {
		const { options } = this.state
		const { product, isUpdate } = this
		const { name, desc, price, imgs, detail } = product
		const { pCategoryId, categoryId } = product
		const categoryIds = []
		const { getFieldDecorator } = this.props.form

		if (isUpdate) {
		  if (pCategoryId === '0') {
        categoryIds.push(pCategoryId)
			} else {
				categoryIds.push(pCategoryId, categoryId)
			}
		}

		const title = (
			<div>
				<LinkButton onClick={() => this.props.history.goBack()}>
					<Icon style={{fontSize: 16, marginRight: 5}} type="arrow-left" />
				</LinkButton>
				<span>{isUpdate ? '修改商品' : '添加商品'}</span>
			</div>
		)

		const formItemLayout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 8 },
		}

		return (
			<Card
				className="product-addupate"
				title={title}
			>
				<Form {...formItemLayout}>
					<Item label="商品名称">
						{
							getFieldDecorator('name', {
								initialValue: name,
								rules: [{ required: true, message: '必须输入商品名称！' }]
							})(<Input placeholder="请输入商品名称" />)
						}
					</Item>
					<Item label="商品描述">
						{
							getFieldDecorator('desc', {
								initialValue: desc,
								rules: [{ required: true, message: '必须输入商品描述！' }]
							})(<TextArea placeholder="请输入商品描述" rows={4} />)
						}
					</Item>
					<Item label="商品价格">
						{
							getFieldDecorator('price', {
								initialValue: price,
								rules: [
									{ required: true, message: '必须输入商品描述！' }, 
									{validator: this.validatePrice}
								]
							})(<Input placeholder="请输入商品价格" type="number" addonAfter="元" />)
						}
					</Item>
					<Item label="商品分类">
						{
							getFieldDecorator('categoryIds', {
								initialValue: categoryIds,
								rules: [{ required: true }]
							})(<Cascader options={options} loadData={this.loadData}/>)
						}
					</Item>
					<Item label="商品图片">
					  <PicturesWall ref={this.pw} imgs={imgs}/>
					</Item>
					<Item label="商品详情"   labelCol={{ span: 2 }} wrapperCol={{ span: 14 }}>
					  <RichTextEditor ref={this.editor} detail={detail}/>
					</Item>
				</Form>
				<Button type="primary" onClick={this.submit}>提交</Button>
			</Card>
		)
	}
}

export default Form.create()(ProductAddAndUpdate)