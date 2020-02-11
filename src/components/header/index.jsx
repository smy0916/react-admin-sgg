import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../redux/actions'
import { weather } from '../../api/index'
import { formatTime } from '../../utils/commonTool'
import LinkButton from '../link-button'
import { Modal } from 'antd'
import './index.less'

class Header extends Component {
	state = {
		dayPictureUrl: '',
		currentTime: formatTime(Date.now()),
		weather_info: ''
	}

	getWeatherInfo = async (city) => {
		const { dayPictureUrl, weather_info } = await weather(city)
		this.setState({
			dayPictureUrl,
			weather_info
		})
	}

  getTime = () => {
		this.timer = setInterval(() => {
			const currentTime = formatTime(Date.now())
			this.setState({currentTime})
		})
	}

	signOut = () => {
		Modal.confirm({
			title: '确认退出？',
			content: '',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				this.props.signOut()
			}
		})
	}

	componentDidMount () {
		this.getWeatherInfo('beijing')
		this.getTime()
	}

	componentWillUnmount() {
    clearInterval(this.timer)
	}

	render () {
		const { dayPictureUrl, weather_info, currentTime } = this.state
		const username = this.props.user.username
		const title = this.props.headTitle
		return (
			<div className="header">
				<div className="header-top">
		      欢迎,<span> {username}</span>
					<LinkButton onClick={this.signOut}>退出</LinkButton>
				</div>
				<div className="header-bottom">
		<div className="header-bottom-left">{title}</div>
					<div className="header-bottom-right">
		        <span>{currentTime}</span>
						<img src={dayPictureUrl} alt="weather" />
						<span>{weather_info}</span>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({headTitle: state.headTitle, user: state.user}),
	{signOut}
)(withRouter(Header))