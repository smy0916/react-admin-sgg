/**
 * 1. createStore(reducer){}
 *   - getState() 返回 state 数据
 *   - dispatch(action) 分发 action
 *   - subcribe(listener) 
 * 2. combineReducers(reducers){}
 */

// 根据指定 reducer 创建一个 store 对象并返回
export function createStore(reducer) {
	let state = reducer(undefined, {type: '@@redux/init'})
	let listeners = []
	// 返回内部的 state 数据
	function getState(){
    return state
	}

	/**
	 * 
	 * 分发 action 
	 * 1. 触发 reducer 调用，产生新的 state
	 * 2. 保存新的 state
	 * 3. 调用所有已存在的监视 回调函数
	 */
	function dispatch(action){
		const newState = reducer(state, action)
		state = newState
		listeners.forEach(listener => listener()) 
	}

	// 绑定内部 state 改变的监听回调。可以给一个 store 绑定多个监听
	function subscribe(listener){
		listeners.push(listener)
	}

	return {
		getState,
		dispatch,
		subscribe
	}
}

export function combineReducers(reducers){
  return ((state = {}, action) => {
    const newState = Object.keys(reducers).reduce((prevState, key) => {
			prevState[key] = reducers[key](state[key], action)
			return prevState
		}, {})
    return newState
	})
}