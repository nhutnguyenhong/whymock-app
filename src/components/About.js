import React from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";

import {hideAboutModal} from '../actions';

class About extends React.Component {
  render() {
    const { mode, show, hideAboutModal } = this.props;
    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";
    return (
      <Modal size="lg" show={show} className={modeClass} onHide={hideAboutModal}>
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
          <Button variant="secondary" onClick={hideAboutModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  ({modal,userSettings})=>({
    show: modal.about.show,
    mode: userSettings.mode,
  }),
  {
    hideAboutModal
  }
)(About);