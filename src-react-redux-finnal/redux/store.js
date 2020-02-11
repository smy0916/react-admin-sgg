// import { createStore, applyMiddleware } from 'redux'
import { createStore } from '../lib/redux'
import reducer from './reducer'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'

export default createStore(reducer)
// export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))