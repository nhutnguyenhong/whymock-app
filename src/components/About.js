import React from "react";
import { Modal, Button } from "react-bootstrap";

export default class About extends React.Component {
  render() {
    const { mode, show, handleClose } = this.props;
    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";
    return (
      <Modal size="lg" show={show} className={modeClass} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12 css-80f7ae">
              <h3>WhyMock version 3.0</h3>
              <p>End-to-End application with all features: add, edit, delete, search all mocking stubs. Included:</p>
              <p>* Administrator GUI embeded: dark mode enable, customize settings.</p>
              <p>* Real-time search, add, edit, delete, duplicate, diable mocking stubs.</p>
              <p>* Automatically adding OPTIONS stub.</p>
              <p>* Support CORS automatically for all requests.</p>
              <p>* Support context that help more people working together.</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
