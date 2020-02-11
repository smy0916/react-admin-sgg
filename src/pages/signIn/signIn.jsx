import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import './signIn.less'
import logo from './images/logo.png'
import { Form, Icon, Input, Button } from 'antd'
import { signIn } from '../../redux/actions'

class SignIn extends React.Component {

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields(async(err, values) => {
			if (!err) {
				const { username, password } = values
				this.props.signIn(username,password)
			} else {
        console.log('校验失败')
			}
		})
	}

	validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('必须输入密码！')
	  } else if (value.length < 4) {
		  callback('密码至少4位')
	  } else if (value.length > 12) {
		  callback('密码最多12位')
	  } else if (!/^\w+$/.test(value)) {
      callback('密码只能是数字、字母、下划线')
	  } else {
		  callback()
	  }
	}

	render () {
		
		// 如果用户已经登陆，自动跳转到 admin
		const user = this.props.user
		if (user && user._id) {
      return <Redirect to="/" />
		}

		const { getFieldDecorator } = this.props.form
		
		return (
			<div className="sign-in">
				<header className="sign-in-header">
					<img src={logo} alt="logo" />
					<h1>React项目：后台管理系统</h1>
				</header>
				<div className="sign-in-content">
				  <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
					<h2>用户登录</h2>
					<Form onSubmit={this.handleSubmit} >
						<Form.Item>
							{
								getFieldDecorator('username', {
									rules: [
										{required: true, whitespace: true, message: '请输入用户名！'},
										{min: 4, message: '用户名至少4位'},
										{max: 12, message: '用户名最多12位'},
										{pattern: /^\w+$/, message: '用户名必须是英文，数字或下划线组成'}
									]
								})(<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="请输入用户名"
								/>)
							}
						</Form.Item>
						<Form.Item>
							{
								getFieldDecorator('password', {
									rules: [{validator: this.validatePwd}]
								})(<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="请输入密码"
								/>)
							}
						</Form.Item>
						<Form.Item>
							<Button className="sign-in-button" type="primary" htmlType="submit">
								登录
              </Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		)
	}
}

const WrapSignIn = Form.create()(SignIn)
export default connect(
	state => ({user: state.user}),
	{signIn} 
)(WrapSignIn)