import React from "react";
import _ from "lodash";

import {
  Container,
  Button,
  lightColors,
  darkColors
} from "react-floating-action-button";
import { connect } from "react-redux";
import { statusDISABLE } from "../constant/index";
import {
  editStubModal,
createStub,
deleteStub,
duplicateStub,
disableStub,
enableStub,
shareStub,
importStub,
shareGroupStub,
exportStub,
exportGroup,
} from '../actions';

const ActionButton = ({
  selectedNode,
  edit,
  enable,
  disable,
  hasDelete,
  createStub,
  editStub,
  duplicateStub,
  deleteStub,
  disableStub,
  enableStub,
  shareStub,
  shareGroupStub,
  isGroupSelected,
  exportStub,
  exportGroup
}) => {
  return (
    <Container>
      <Button
        href="#"
        tooltip="Create new stub"
        styles={{
          backgroundColor: darkColors.cyan,
          color: lightColors.white
        }}
        onClick={createStub}
        icon="fa fa-plus"
      />
      {edit && (
        <Button
          href="#"
          tooltip="Duplicate new stub"
          styles={{
            backgroundColor: darkColors.cyan,
            color: lightColors.white
          }}
          onClick={()=>duplicateStub(selectedNode.obj)}
          icon="fa fa-copy"
        />
      )}
      {hasDelete && (
        <Button
          href="#"
          tooltip="Delete stub"
          onClick={deleteStub}
          icon="fa fa-trash"
        />
      )}
      {edit && (
        <Button
          href="#"
          onClick={editStub}
          tooltip="Edit mapping"
          icon="fa fa-pencil"
          styles={{
            backgroundColor: darkColors.teal,
            color: lightColors.white
          }}
          disabled={!edit}
        />
      )}
      {disable && (
        <Button
          href="#"
          tooltip="Enable this stub"
          styles={{
            backgroundColor: darkColors.blue,
            color: lightColors.green
          }}
          onClick={enableStub}
          icon="fa fa-eye"
        />
      )}
      {enable && (
        <Button
          href="#"
          tooltip="Disable this stub"
          styles={{
            backgroundColor: darkColors.orange,
            color: lightColors.purple
          }}
          onClick={disableStub}
          icon="fa fa-ban"
        />
      )}
      {hasDelete && (
        <Button
          href="#"
          tooltip="Share this stub to context"
          onClick={()=>shareStub(selectedNode.obj)}
          icon="fa fa-share"
          styles={{
            backgroundColor: darkColors.cyan,
            color: lightColors.white
          }}
        />
      )}
      {hasDelete && (
        <Button
          href="#"
          tooltip="Download the stub"
          onClick={exportStub}
          icon="fa fa-cloud-download"
          styles={{
            backgroundColor: darkColors.cyan,
            color: lightColors.white
          }}
        />
      )}
      {isGroupSelected && (
        <Button
          href="#"
          tooltip="Download the group"
          onClick={exportGroup}
          icon="fa fa-cloud-download"
          styles={{
            backgroundColor: darkColors.cyan,
            color: lightColors.white
          }}
        />
      )}
      {isGroupSelected && (
        <Button
          href="#"
          tooltip="Share group to context"
          onClick={()=>shareGroupStub(selectedNode)}
          icon="fa fa-share-square-o"
          styles={{
            backgroundColor: darkColors.cyan,
            color: lightColors.white
          }}
        />
      )}
      <Button
        styles={{
          backgroundColor: darkColors.blue,
          color: lightColors.green
        }}
        tooltip="What do you want?"
        icon="fa fa-rocket"
        style={{ color: "green" }}
        rotate={true}
      />
    </Container>
  );
};

export default connect(
  ({ ui: { selectedNode } }) => ({
    selectedNode: selectedNode,
    edit: !selectedNode.children && selectedNode.hashId,
    hasDelete: !selectedNode.children && selectedNode.hashId,
    disable: _.get(selectedNode, "obj.metadata.status", "") === statusDISABLE,
    enable: !selectedNode.children && selectedNode.hashId && _.get(selectedNode, "obj.metadata.status", "") !== statusDISABLE,
    isGroupSelected: true && selectedNode.children
  }),
  {
    editStub:editStubModal,
    createStub,
    deleteStub,
    duplicateStub,
    disableStub,
    enableStub,
    shareStub,
    importStub,
    shareGroupStub,
    exportStub,
    exportGroup
  }
)(ActionButton);
