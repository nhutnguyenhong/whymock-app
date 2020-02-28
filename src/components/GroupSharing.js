import React, { createRef } from "react";
import { Modal, Button } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import _ from "lodash";
import { Badge } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";
import {hideshareGroupStub,shareGroup} from '../actions';

class GroupSharing extends React.Component {
  contextRef = createRef();
  newContextRef = createRef();

  saveChangeHandler = () => {
    var obj = {
      shareContext: this.contextRef.current.value,
      fromGroup: this.props.currentGroup,
      currentNode: this.props.currentNode,
    };
    this.props.handleSaveChanges(obj);
    this.props.handleClose();
  };

  render() {
    const {
      mode,
      show,
      handleClose,
      contexts = [],
      context,
      currentGroup,
      currentNode={},
      fromContext = "Default"
    } = this.props;
    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";

    return (
      <Modal size="lg" show={show} className={modeClass} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {context ? "Hey " + _.startCase(context) + "," : ""} Sharing group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-5">
              <Alert
                key="fromGroup"
                variant="dark"
                className="share-group-alert"
              >
                You are sharing the group <br></br>
                {currentNode.rootNode?<Badge variant="warning" className="method-badge">
                  {currentGroup}
                </Badge>:<Badge variant="success" className="method-badge">
                  {currentGroup}
                </Badge>}
              </Alert>
            </div>
            <div className="col-sm-2">
              <Alert
                key="fromGroup"
                variant="dark"
                className="share-group-alert share-group-alert-separator"
              > to <br></br>
                <i className="fa fa-arrow-right" />
              </Alert>
            </div>
            <div className="col-sm-5">
              <Alert
                key="fromGroup"
                variant="dark"
                className="share-group-alert"
              >
                another context with name <br></br>
                <FormControl as="select" id="theme" ref={this.contextRef}>
                  <option value="" key="empty">
                    --Please choose context--
                  </option>
                  {contexts.map(context => (
                    <option value={context} key={context}>
                      {context}
                    </option>
                  ))}
                </FormControl>
              </Alert>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.saveChangeHandler}>
            Start to share
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  ({ context, modal, userSettings ,ui}) => ({
    show: modal.shareGroup.show,
    mode: userSettings.mode,
    contexts: userSettings.contexts,
    context,
    currentGroup: modal.shareGroup.currentGroup,
    fromContext: modal.shareGroup.fromContext, 
    currentNode:ui.selectedNode,
  }),
  {
    handleClose: hideshareGroupStub,
    handleSaveChanges:shareGroup,
  }
)(GroupSharing);