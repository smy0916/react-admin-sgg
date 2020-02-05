import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// 读取 local 中保存的 user
const user = storageUtils.getUser()
if (user) {
  memoryUtils.user = user
}

ReactDOM.render(<App/>, document.getElementById('root'))