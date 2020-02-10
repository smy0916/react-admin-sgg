
import React  from 'react'
import { Tree } from 'antd'
import MENU_LIST from '../../config/menuConfig'
import PropTypes from 'prop-types'

const { TreeNode } = Tree

class TreeData extends React.Component {
  static propTypes = {
    role: PropTypes.object
  }

  constructor(props){
    super(props)
    const checkedKeys = props.role.menus
    this.state = {
      expandedKeys: [],
      checkedKeys,
    }
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }

  getMenus = () => this.state.checkedKeys

  renderTreeNodes = data => {
    return data.reduce((prev, item) => {
      prev.push(
        <TreeNode title={item.title} key={item.to} dateRef={item}>
          {item.children ? this.renderTreeNodes(item.children) : null}
        </TreeNode>)   
      return prev 
    }, [])
  } 

  componentWillMount() {
    this.treeNodes = this.renderTreeNodes(MENU_LIST)  
  }
  
  componentWillReceiveProps(props) {
    this.setState({checkedKeys: props.role.menus})
  }
    
  render() {
    return (
      <Tree
        defaultExpandAll={Boolean(true)}
        checkable
        onExpand={this.onExpand}
        autoExpandParent={Boolean(true)}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
      >
        <TreeNode title="平台权限" key="all">
          {this.treeNodes}
        </TreeNode>
      </Tree>
    )
  }
}

export default TreeData