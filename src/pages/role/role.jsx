import React, { Component } from 'react'
import {
	Card,
	Button,
	Table,
	Form,
	Input,
	Modal,
	message
} from 'antd'
import { reqGetRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import TreeData from './tree'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formatTime } from '../../utils/commonTool'
import { PAGE_SIZE } from '../../utils/contans'

const Item = Form.Item
class Role extends Component {

	constructor(){
		super()
		this.role_form = React.createRef()
	}

	state = {
		add_role_modal: false,
		set_role_modal: false,
		role_list: [],
		role: {}
	}

	initCloumns = () => {
		this.cloumns = [
			{
				title: '角色名称',
				dataIndex: 'name',
				key: 'name'
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				render: (create_time) => formatTime(create_time)
			},
			{
				title: '授权时间',
				dataIndex: 'auth_time',
				render: (create_time) => formatTime(create_time)
			},
			{
				title: '授权人',
				dataIndex: 'auth_name',
				key: 'auth_name'
			}
		]
	}

	getRoleList = async() => {
		const result = await reqGetRoles()
		if (result.status === 0) {
			const role_list = result.data
			this.setState({role_list})
		}
	}

	submitAddRole = () => {
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { roleName } = values
				this.props.form.resetFields()
				const result = await reqAddRole(roleName)
				if (result.status === 0) {
					message.success('添加角色成功！')
					// this.getRoleList()
					const role = result.data
					this.setState(state => ({
						roles_list: [...state.role_list, role]
					}))
				} else {
					message.error('添加角色失败！')
				}
			}
		})
    this.setState({add_role_modal: false})
	}

	cancelAddRole = () => {
		this.props.form.resetFields()
		this.setState({add_role_modal: false})
	}

	submitSetRole = async() => {
		this.cancelSetRole()
		const menus = this.role_form.current.getMenus() 
		const { role } = this.state
		const auth_name = memoryUtils.user.username
		const auth_time = (new Date()).getTime()
		const _role = {
			_id: role._id,
			menus,
			auth_name,
			auth_time
		}
		const result = await reqUpdateRole(_role)
		if (result.status === 0) {
			message.success('角色设置成功!')
			this.getRoleList()
			if (_role._id === memoryUtils.user.role_id) {
				memoryUtils.user = {}
				storageUtils.removeUser()
				this.props.history.replace('/signin')
			}
		} else {
			message.error('角色设置失败!')
		}
	}

	cancelSetRole = () => {
    this.setState({set_role_modal: false})
	}

	onRow = (role) => {
		return {
			onClick: () => {
        this.setState({role})
			}
		}
	}

	componentWillMount(){
		this.initCloumns()
	}

	componentDidMount(){
		this.getRoleList()
	}

	render () {
		const { add_role_modal, set_role_modal, role_list, role } = this.state
		const { getFieldDecorator } = this.props.form
		const title = (
			<div>
				<Button type="primary" style={{marginRight: 10}} onClick={() => this.setState({add_role_modal: true})}>创建角色</Button>
				<Button type="primary" disabled={!role._id} onClick={() => this.setState({set_role_modal: true})}>设置角色权限</Button>
			</div>
		)
		const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
		}
		const rowSelection = {
			type: 'radio',
			selectedRowKeys: [role._id],
			onSelect: (role) => {
        this.setState({role})
			}
		}
		return (
			<Card title={title}>
				<Table
				  rowKey="_id"
					dataSource={role_list}
					columns={this.cloumns}
					rowSelection={rowSelection}
					onRow={this.onRow}
					bordered
					pagination={{pageSize:PAGE_SIZE, showQuickJumper: true}}
				/>
				<Modal
					title="创建角色"
					okText="确认"
					cancelText="取消"
					visible={add_role_modal}
					onOk={this.submitAddRole}
					onCancel={this.cancelAddRole}
				>
					<Form {...formItemLayout}>
						<Item label="角色名">
							{
								getFieldDecorator('roleName',{
									rules: [
										{required: true, message: '请输入角色名称'}
									]
								})(<Input placeholder="请输入角色名称"/>) 
							}
						</Item>
					</Form>
				</Modal>
				<Modal
					title="设置角色权限"
					onText="确认"
					cancelText="取消"
					visible={set_role_modal}
					onOk={this.submitSetRole}
					onCancel={this.cancelSetRole}
				>
          <Form>
					  <Item 
						  label="角色名称" 
						  labelCol={{span: 4 }}
              wrapperCol={{ span: 18 }}
						>
              <Input value={role.name} disabled/>
					  </Item>
					  <Item>
					    <TreeData ref={this.role_form} role={role}/>
					  </Item>
				 </Form>
				</Modal>
			</Card>
		)
	}
}

export default Form.create()(Role)