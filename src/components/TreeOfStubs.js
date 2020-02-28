import React from "react";
import { Treebeard } from "react-treebeard";
import _ from "lodash";
import { Badge } from "react-bootstrap";

import { darkTheme, lightTheme } from "../theme/tree";
import { connect } from "react-redux";
import { rootNodeName, statusDISABLE } from "../constant/index";
import { toggleNode, deActiveNode, selectNode } from "../actions";

const TreeItemDisplay = ({ item }) => {
  const {
    request: { method },
    name
  } = item;
  const { status } = item.metadata;
  const isDisabled = status === statusDISABLE;

  let variant = "secondary";
  switch (method) {
    case "GET":
      variant = "secondary";
      break;
    case "POST":
      variant = "info";
      break;
    case "PATCH":
      variant = "success";
      break;
    case "PUT":
      variant = "warning";
      break;
  }
  return (
    <span className={isDisabled ? " tree-item-disabled " : ""}>
      <Badge variant={variant} className="method-badge">
        {method}
      </Badge>
      {name}
    </span>
  );
};

const TreeOfStubs = ({
  context,
  rootTree,
  mode,
  selectedNode,
  deActiveNode,
  toggleNode,
  selectNode
}) => {
  const onToggle = (node, toggled) => {
    if (selectedNode.hashId) {
      deActiveNode(selectedNode);
    }
    toggleNode({ node, toggled });
    selectNode(node);
  };

  if (!rootTree || !rootTree.hashId) {
    return <div className="not-available">Not available</div>;
  }
  const renderedNodes = rootTree.children.map(group => {
    const children = group.children.map(node => {
      return {
        ...node,
        name: <TreeItemDisplay item={node.obj} />
      };
    });
    return {
      ...group,
      children
    };
  });
  const data = {
    ...rootTree,
    name: context ? _.startCase(context) : rootNodeName,
    children: [...renderedNodes]
  };
  return (
    <Treebeard
      data={data}
      onToggle={onToggle}
      style={mode === "dard" ? darkTheme : lightTheme}
    />
  );
};

export default connect(
  state => ({
    rootTree: state.ui.rootTree,
    mode: state.userSettings.mode,
    context: state.context,
    selectedNode: state.ui.selectedNode
  }),
  {
    toggleNode,
    deActiveNode,
    selectNode
  }
)(TreeOfStubs);
