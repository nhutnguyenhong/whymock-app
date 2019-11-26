import React, { createRef } from "react";
import { Modal, Button } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";

export default class Context extends React.Component {
  contextRef = createRef();

  saveChangeHandler = () => {
    var obj = {
      context: this.contextRef.current.value,
    };
    this.props.handleSaveChanges(obj);
    this.props.handleClose();
  };

  render() {
    const { mode, show, handleClose,settings } = this.props;
    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";
    console.log('context',show);
    
    return (
      <Modal size="lg" show={show} className={modeClass} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Context</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-3">
              <h3>Context</h3>
            </div>
            <div className="col-sm-3">
              <FormControl as="select" id="theme" ref={this.contextRef}>
                <option value='light'>Light</option>
                <option value='dard'>Dark</option>
              </FormControl>
            </div>
          </div>

          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.saveChangeHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
