import React from "react";
import { Modal, Button } from "react-bootstrap";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import _ from "lodash";

import { useState , useEffect} from "react";

export const EditStub = props => {
  const [tempRequestValue, setTempRequestValue] = useState(null);
  const [tempResponseValue, setTempResponseValue] = useState(null);
  const [entryName, setEntryName] = useState(null);

  useEffect(() => {
    handleDefaultValue();
  }, [props.data]);

  const handleDefaultValue = () => {
    setEntryName(undefined);
  }
  const handleSave = () => {
    if (tempRequestValue || tempResponseValue || entryName) {
      props.saveChangeHandler(_.cloneDeep(entryName), _.cloneDeep(tempRequestValue), _.cloneDeep(tempResponseValue));
    }
  };
  const modeClass = props.mode==='dard'?'dard-mode':'';
  return props.data && props.data.obj ? (
    <Modal size="lg" show={props.show} onHide={props.handleClose} className={modeClass}>
      <Modal.Header closeButton>
        <Modal.Title>Editing stub {props.data.obj.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-sm-12">
            <h3>Request</h3>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text inputLabel" id="basic-addon1">
                  Name
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={entryName || props.data.obj.name}
                onChange={val => setEntryName(val.target.value)}
              />
            </div>
            <JSONInput
              id="a_unique_id"
              placeholder={props.data.obj.request}
              locale={locale}
              width="100%"
              height="200px"
              onChange={value => setTempRequestValue(value.jsObject)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h3>Response</h3>

            <JSONInput
              id="b_unique_id"
              placeholder={props.data.obj.response}
              locale={locale}
              width="100%"
              height="450px"
              onChange={value => setTempResponseValue(value.jsObject)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
