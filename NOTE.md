### build
$ yarn build
$ npm install -g serve
$ serve build

### antd 引入样式
  - 全部:修改 src/App.css，在文件顶部引入 antd/dist/antd.css。 
    ```css
	  // src/App.css
	  @import '~antd/dist/antd.css';
	  ```
  - 按需引入
    ```
	  $ yarn add react-app-rewired customize-cra
	  ```

	  ```json
	  /* package.json */
    "scripts": {
    -   "start": "react-scripts start",
    +   "start": "react-app-rewired start",
    -   "build": "react-scripts build",
    +   "build": "react-app-rewired build",
    -   "test": "react-scripts test",
    +   "test": "react-app-rewired test",
    }
	  ```
    > 然后在项目根目录创建一个 config-overrides.js 用于修改默认配置。

	  ```js
		module.exports = function override(config, env) {
      // do stuff with the webpack config...
      return config;
    };
	  ```

##### 使用 babel-plugin-import

> babel-plugin-import 是一个用于按需加载组件代码和样式的 babel 插件（原理），现在我们尝试安装它并修改 config-overrides.js 文件。

```
$ yarn add babel-plugin-import
```

```js
+ const { override, fixBabelImports } = require('customize-cra');

- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = override(
+   fixBabelImports('import', {
+     libraryName: 'antd',
+     libraryDirectory: 'es',
+     style: 'css',
+   }),
+ );
```

> 然后移除前面在 src/App.css 里全量添加的 @import '~antd/dist/antd.css'; 样式代码，并且按下面的格式引入模块。

```js
  // src/App.js
  import React, { Component } from 'react';
- import Button from 'antd/es/button';
+ import { Button } from 'antd';
  import './App.css';

  class App extends Component {
    render() {
      return (
        <div className="App">
          <Button type="primary">Button</Button>
        </div>
      );
    }
  }

  export default App;
```

> 最后重启 yarn start 访问页面，antd 组件的 js 和 css 代码都会按需加载

#### 高阶函数 VS 高阶组件

- 高阶函数：
  1. 一类特别的函数
    - 接受参数类型是函数
    - 返回值是函数
  2. 常见的高阶函数
    - 定时器：setTimeout/setInterval
    - Promise: Promise(() => {}) then(value => {}, reason => {})
    - 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
    - 函数对象的bind()
    - Form.create()() / getFieldDecorator()() 
  3. 高阶函数更加动态，更加具有扩展性   
- 高阶组件：
  1. 本质是一个函数
  2. 接受一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
  3. 作用：扩展组件的功能
  4. 高阶组件也是高阶函数：接受一个组件函数，返回一个新的组件函数

### async && await

1. 作用
> 简化 promise 对象的使用；不用再使用then()来指定成功和是失败的回调函数；以同步编码（没有回调函数）方式实现异步流程
2. await 位置
> 在返回 promise 的表达式左侧写 await；不想要 promise，想要 promise 异步执行的成功地value数据
3. async 位置
> await 所在函数（最近的）定义的左侧写 async  

#### jsonp 解决 ajax 跨域的原理

1. jsonp 只能解决 GET 类型的 ajax 请求跨域问题
2. jsonp 请求不是 ajax 请求，而是一般的 get 请求
3. 基本原理
  - 浏览器端：
    - 动态生成 `<script>` 来请求后台接口（src 就是接口的 url）
    - 定义好用于接收响应数据的函数（fn），并将函数名通过请求参数提交给后台（如：callback=fn)
  - 服务器端：
    - 接收到请求处理产生结果数据后，返回一个函数调用的 js 代码，并将结果作为实参传入函数调用
  - 服务器端：
    - 收到响应自动执行函数调用的 js 代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据    

### 生命周期函数

1. `componentWillMount`
2. `render`
3. `componentDidMount`：第一次 `render()`之后执行一次
  - 执行异步操作：发送 ajax 请求 / 启用定时器
4. `shouldComponentUpdate`
5. `componentUpdated`
6. `componentWillUnmount`
7. `componentDidUnmount`