import storageUtils from '../utils/storageUtils'
import { combineReducers } from 'redux'
import { SET_HEAD_TITLE, REVEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types'
/**
 * 用来管理头部标题的reducer函数
 */
const initialHeadTitle = '首页'
function headTitle(state = initialHeadTitle, action){
  switch(action.type){
		case SET_HEAD_TITLE:
			return action.data
		default:
			return state
	}
}

/**
 * 用来管理user的reducer函数
 */
const initialUser = storageUtils.getUser()
function user(state = initialUser, action){
  switch(action.type){
		case REVEIVE_USER:
			return action.user
	  case SHOW_ERROR_MSG:
			const errorMsg = action.errorMsg
			return {...state, errorMsg}
		case RESET_USER:
      return {}
		default:
			return state
	}
}

export default combineReducers({
	headTitle,
	user
})