import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { weather } from '../../api/index'
import { formatTime } from '../../utils/commonTool'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import MENU_LIST from '../../config/menuConfig'
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

	getTitle = () => {
		const path = this.props.location.pathname
		let title
		MENU_LIST.forEach(item => {
			if (item.to === path) {
				title = item.title
			} else if (item.children) {
				const _item = item.children.find(cItem => cItem.to === path)
				if (_item) title = _item.title
			}
		})
		return title
	}

	signOut = () => {
		Modal.confirm({
			title: '确认退出？',
			content: '',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				storageUtils.removeUser()
			  memoryUtils.user = {}
			  this.props.history.replace('/signin')
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
		const username = memoryUtils.user.username
		const title = this.getTitle()
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

export default withRouter(Header)