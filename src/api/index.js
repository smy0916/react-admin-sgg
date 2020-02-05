/**
 * 包含应用中所有接口请求函数的接口
 */

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

export const signIn = ({username, password}) => ajax('/login', 'POST', {username, password})

export const addUser = (user) => ajax('/manage/user/add', 'POST', user)

export const weather = (city) => {
	return new Promise((resolve, reject) => {
		const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
	  jsonp(url, {}, (error, data) => {
		  if (!error && data.status === 'success') {
				const { dayPictureUrl, weather } = data.results[0].weather_data[0]
				resolve({ dayPictureUrl, weather_info: weather })
			} else {
				message.error('获取天气信息失败！')
			}
	  })
	})
}