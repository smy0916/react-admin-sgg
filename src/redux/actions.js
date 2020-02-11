import { SET_HEAD_TITLE, REVEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types'
import { reqSignIn } from '../api'
import storageUtils from '../utils/storageUtils'

export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})
export const receiveUser = (user) => ({type: REVEIVE_USER, user})
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

export const signIn = (username, password) => {
	return async dispatch => {
		const result = await reqSignIn({username,password})
		if (result.status === 0) {
			const user = result.data
			storageUtils.saveUser(user)
			dispatch(receiveUser(user))
		} else {
			const errorMsg = result.msg
      dispatch(showErrorMsg(errorMsg))
		}
	}
}

export const signOut = () => {
	storageUtils.removeUser()
	return {type: RESET_USER}
}