import React, { Component } from 'react'
import { Card, Table, message, Modal, Select, Input, Button, Form } from 'antd'
import { reqGetUsers, reqAddUpdateUser, reqDeleteUser } from '../../api/index'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/contans'

const Item = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
class User extends Component {
	state = {
		user_list: [],
		role_list: [],
		table_loading: false,
		add_update_user: false,
		isUpdate: false,
		user: {}
	}

	initColumns = () => {
		this.columns = [
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username'
			},
			{
				title: '邮箱',
				dataIndex: 'email',
				key: 'email'
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone'
			},
			{
				title: '角色',
				render: (user) => this.role_names[user.role_id]
			},
			{
				title: '操作',
				render: (user) => (
					<div>
						<LinkButton onClick={() => { this.setState({ add_update_user: true, user, isUpdate: true }) }}>修改</LinkButton>
						<LinkButton onClick={() => this.showDeleteUser(user)}>删除</LinkButton>
					</div>
				)
			}
		]
	}

	initRoleName = (roles) => {
		const role_names = roles.reduce((prev, curr) => {
			prev[curr._id] = curr.name
			return prev
		}, {})
		this.role_names = role_names
	}

	getUsers = async () => {
		this.setState({ table_loading: true })
		const result = await reqGetUsers()
		if (result.status === 0) {
			const user_list = result.data.users
			const role_list = result.data.roles
			this.initRoleName(role_list)
			this.setState({ user_list, role_list })
		}
		this.setState({ table_loading: false })
	}

	submitUser = () => {
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				if (this.state.user) { values._id = this.state.user._id }
				const result = await reqAddUpdateUser(values)
				if (result.status === 0) {
					if (this.state.isUpdate) {
						this.getUsers()
					} else {
						const user = result.data
						this.setState(state => ({
							user_list: [...state.user_list, user]
						}))
					}
					message.success('添加用户成功！')
				} else {
					message.error('添加用户失败！')
				}
				this.cacelUser()
			}
		})
	}

	cacelUser = () => {
		this.props.form.resetFields()
		this.setState({ add_update_user: false })
	}

	showDeleteUser = (user) => {
		confirm({
			title: '删除用户',
			content: `确定要删除${user.username}吗？`,
			okText: '确定',
			okType: 'warging',
			cancelText: '取消',
			onOk: async () => {
				const result = await reqDeleteUser(user._id)
				if (result.status === 0) {
					message.success('删除用户成功！')
					this.getUsers()
				} else {
					message.error('删除用户失败！')
				}
			},
			onCancel: () => { }
		})
	}

	componentWillMount () {
		this.initColumns()
	}

	componentDidMount () {
		this.getUsers()
	}

	render () {
		const { user_list, add_update_user, role_list, isUpdate, user, table_loading } = this.state
		const { getFieldDecorator } = this.props.form
		const title = (
			<div>
				<Button type="primary" style={{ marginRight: 10 }} onClick={() => { this.setState({ add_update_user: true }) }}>创建用户</Button>
			</div>
		)
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
		}
		return (
			<Card title={title}>
				<Table
					bordered
					dataSource={user_list}
					columns={this.columns}
					rowKey="_id"
					loading={table_loading}
					pagination={{pageSize:PAGE_SIZE, showQuickJumper:true}}
				/>
				<Modal
					title={isUpdate ? "修改用户" : "添加用户"}
					visible={add_update_user}
					okText="确定"
					canelText="取消"
					onOk={this.submitUser}
					onCancel={this.cacelUser}
				>
					<Form {...formItemLayout}>
						<Item label="用户名">
							{
								getFieldDecorator('username', {
									initialValue: user.username,
									rules: [{ required: true, message: "必须输入用户名！" }]
								})(<Input placeholder="请输入用户名" />)
							}
						</Item>
						<Item label="密码">
							{
								getFieldDecorator('password', {
									initialValue: user.password,
									rules: [{ required: true, message: "必须输入密码！" }]
								})(<Input type="password" disabled={isUpdate} placeholder="请输入密码" />)
							}
						</Item>
						<Item label="手机号">
							{
								getFieldDecorator('phone', {
									initialValue: user.phone
								})(<Input placeholder="请输入手机号" />)
							}
						</Item>
						<Item label="邮箱">
							{
								getFieldDecorator('email', {
									initialValue: user.email
								})(<Input placeholder="请输入邮箱" />)
							}
						</Item>
						<Item label="角色">
							{
								getFieldDecorator('role_id', {
									initialValue: user.role_id
								})(
									<Select
										placeholder="请选择用户角色"
									>
										{
											role_list.length > 0 && role_list.map(role => (
												<Option key={role._id} value={role._id}>{role.name}</Option>
											))
										}
									</Select>
								)
							}
						</Item>
					</Form>
				</Modal>
			</Card>
		)
	}
}

export default Form.create()(User)