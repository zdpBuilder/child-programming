/* eslint-disable react/destructuring-assignment,react/require-default-props,object-shorthand,array-callback-return,no-empty */
import React from 'react';
import { Input, Tree } from 'antd';
import PropTypes from 'prop-types';

/**
 * @Description 树组件
 * @Author zdp
 */

const { TreeNode } = Tree;

class TreeExample extends React.Component {
  state = {
    checkedKeys: [],
    submitKeys: [],
    selectedKeys: [],
  };

  componentDidMount() {
    if (this.props.defaultAuthority) {
      this.setState({ checkedKeys: this.props.defaultAuthority.split(',') });
    }
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
  };

  onCheck = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys);

    const submitKeys = e.halfCheckedKeys.concat(checkedKeys);

    this.setState({ checkedKeys, submitKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} defaultExpandAll>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props.props;
    return (
      <div>
        {getFieldDecorator(this.props.formFieldPropsKey, {
          initialValue: this.state.submitKeys.join(','),
        })(<Input type="hidden" />)}
        {/* <p>已经授权节点：<div style={{fontWeight:"800"}}>{this.state.checkedVlaues}</div></p> */}
        <Tree
          checkable
          // onExpand={this.onExpand}
          // expandedKeys={this.state.expandedKeys}
          //  autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
          defaultExpandAll
        >
          {this.renderTreeNodes(this.props.treeData)}
        </Tree>
      </div>
    );
  }
}
TreeExample.propTypes = {
  defaultAuthority: PropTypes.string, // 初始化的值
  props: PropTypes.object.isRequired, // 表单属性
  treeData: PropTypes.array.isRequired, // 树数据
  formFieldPropsKey: PropTypes.string.isRequired, // 序列化名称 相当于<input /> 标签中的name
};
export default TreeExample;
