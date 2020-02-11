/**
 * 包含应用中所有接口请求函数的接口
 */

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

/**
 * @name 登陆
 * @param {username} string
 * @param {password} string
 * @return
 */
export const reqSignIn = ({username, password}) => ajax('/login', 'POST', {username, password})
/**
 * @name 获取天气信息
 * @param {city} string
 * @return object
 */
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
/**
 * @name 添加类别
 * @param {parentId} string
 * @param {categoryName} string
 * @return 
 */
export const reqAddCategory = ({parentId, categoryName}) => ajax('/manage/category/add', 'POST', {parentId, categoryName})
/**
 * @name 更新类别
 * @param {categoryId} string
 * @param {categoryName} string
 * @return
 */
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', 'POST', {categoryId, categoryName})
/**
 * @name 获取一级分类/二级分类列表
 * @param {parentId} string
 * @return array
 */
export const reqCategoryList = (parentId) => ajax('/manage/category/list', 'GET', {parentId})
/**
 * @name 根据categoryId获取分类信息
 * @param {categoryId} string
 * @return category_object
 */
export const reqGetCategroy = (categoryId) => ajax('/manage/category/info', 'GET', {categoryId})
/**
 * @name 获取商品管理列表
 * @param {pageNum} number
 * @param {pageSize} number
 * @return array
 */
export const reqProductList = ({pageNum, pageSize}) => ajax('/manage/product/list', 'GET', {pageNum, pageSize})
/**
 * @name 根据ID/Name搜索产品分页列表
 * @param {pageNum} number
 * @param {pageSize} number
 * @param {productName} string
 * @param {productDesc} string
 * @return array
 */
export const reqSearchProduct = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', 'GET', {
	pageNum, 
	pageSize, 
	[searchType]: searchName
})
/**
 * @name 添加商品
 * @param {categoryId}  string  分类ID
 * @param {pCategoryId} string  父分类ID
 * @param {name}        string  商品名称
 * @param {desc}        string  商品描述
 * @param {price}       string  商品价格
 * @param {detail}      string  商品详情
 * @param {imgs}        array   商品图片名数组
 */
export const reqAndOrUpdate = (product) => ajax(`/manage/product/${product._id ? 'update' : 'add'}`, 'POST', product)
/**
 * @name 更新商品状态：上架/下线
 * @param {productId} string
 * @param {status} number
 */
export const reqUpdateStatus = ({productId, status}) => ajax('/manage/product/updateStatus', 'POST', {productId, status})
/**
 * @name 删除图片
 * @param {name} string
 */
export const reqDeleteImg = (name) => ajax('/manage/img/delete', 'POST', {name})
/**
 * @name 获取用户列表
 */
export const reqGetUsers = () => ajax('/manage/user/list', 'GET')
/**
 * @name 添加用户/更新用户
 * @param {user} object
 * @return
 */
export const reqAddUpdateUser = (user) => ajax(`/manage/user/${user._id ? 'update' : 'add'}`, 'POST', user)
/**
 * @name 删除用户
 * @param {userId} string
 */
export const reqDeleteUser = (userId) => ajax('manage/user/delete', 'POST',{userId})
/**
 * @name 获取角色列表
 */
export const reqGetRoles = () => ajax('/manage/role/list', 'GET')
/**
 * @name 添加角色
 * @param {role} object
 */
export const reqAddRole = (roleName) => ajax('/manage/role/add', 'POST', {roleName})
/**
 * @name 更新角色（给角色权限）
 * @param {role} object
 */
export const reqUpdateRole = (role) => ajax('/manage/role/update', 'POST', role)
