import React, { createRef } from "react";
import { Modal, Button } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";

export default class Context extends React.Component {
  contextRef = createRef();
  newContextRef = createRef();

  saveChangeHandler = () => {
    var obj = {
      newContext: this.newContextRef.current.value,
      chooseContext: this.contextRef.current.value 
    };
    this.props.handleSaveChanges(obj);
    this.props.handleClose();
  };
  getCurrentURL = ()=>{
    var url = window.location.href;
  var arr = url.split("/");
  var result = arr[0] + "//" + arr[2];
  return result;
  }
  render() {
    const { mode, show, handleClose,handleDefaultContext, contexts = [], context } = this.props;
    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";

    return (
      <Modal size="lg" show={show} className={modeClass} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Context { context ? "(currently as " + context +")": "" }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12">
              <h3>You can select existing one from:</h3>

              <FormControl as="select" id="theme" ref={this.contextRef}>
                <option value="" key="empty">--Please choose context--</option>
                {contexts.map(context => <option value={context} key={context}>{context}</option>)}
              </FormControl>
              <br></br>
              <h3>Or can create a new context: </h3>
              <input  type="text"
                className="form-control"
                placeholder="context name"
                aria-label="Context"
                aria-describedby="basic-addon1"
                ref={this.newContextRef}
               />
               <br></br>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="dark" onClick={handleDefaultContext} style={{position: 'absolute',left:'10px'}}>
            Back to default context
          </Button>
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
