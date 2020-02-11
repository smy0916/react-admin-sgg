import { INCREMENT, DECREMENT } from './action-types'
const reducer = function (state=1, action) {
	switch(action.type){
		case INCREMENT:
			return state + action.data
		case DECREMENT:
			return state - action.data
		default:
		  return state 	
	}
}

export default reducer