import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
	static propTypes = {
		setForm: PropTypes.func.isRequired,
		categorys: PropTypes.array.isRequired,
		parentId: PropTypes.string.isRequired
	}

	componentWillMount () {
		this.props.setForm(this.props.form)
	}

	render () {
		const { getFieldDecorator } = this.props.form
		const { categorys, parentId } = this.props
		return (
			<Form>
				<Item>
					<div>
						<div>所属分类</div>
						{
							getFieldDecorator('parentId', {
								initialValue: parentId
							})(
								<Select>
									<Option value="0">一级分类</Option>
									{
										categorys.map(item =>
											<Option
												value={item._id}
												key={item._id}
											>
												{item.name}
											</Option>
										)
									}
								</Select>
							)
						}
					</div>
				</Item>
				<Item>
					<div>
						<div>类别名称</div>
						{
							getFieldDecorator('categoryName', {
								initialValue: '',
								rules: [
									{
										required: true,
										message: '必须输入类别名称'
									}
								]
							})(
								<Input placeholder="请输入类别名称" />
							)
						}
					</div>
				</Item>
			</Form>
		)
	}
}

export default Form.create()(AddForm)