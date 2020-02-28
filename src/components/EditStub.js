import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import _ from "lodash";

import { useState, useEffect } from "react";
import { ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { hideEditStub, editStub } from "../actions";

const EditStub = props => {
  const [initializeRequestValue, setInitializeRequestValue] = useState(
    props.data && props.data.obj ? props.data.obj.request : {}
  );
  const [initializeResponseValue, setInitializeResponseValue] = useState(
    props.data && props.data.obj ? props.data.obj.response : {}
  );

  const [tempRequestValue, setTempRequestValue] = useState(null);
  const [tempResponseValue, setTempResponseValue] = useState(null);
  const [toggleRequestCode, setToggleRequestCode] = useState("json");
  const [toggleResponseCode, setToggleResponseCode] = useState("json");

  const [entryName, setEntryName] = useState(null);
  const requestRawRef = useRef();
  const responseRawRef = useRef();

  useEffect(() => {
    handleDefaultValue();
  }, [props.data]);

  const handleDefaultValue = () => {
    setEntryName(undefined);
    setInitializeRequestValue(
      props.data && props.data.obj ? props.data.obj.request : {}
    );
    setInitializeResponseValue(
      props.data && props.data.obj ? props.data.obj.response : {}
    );
  };
  const handleSave = () => {
    let requestValue = tempRequestValue;
    let responseValue = tempResponseValue;

    if (toggleRequestCode === "raw") {
      if (requestRawRef && requestRawRef.current) {
        requestValue = JSON.parse(`${requestRawRef.current.value}`);
      }
    }
    if (toggleResponseCode === "raw") {
      if (responseRawRef && responseRawRef.current) {
        responseValue = JSON.parse(`${responseRawRef.current.value}`);
      }
    }

    if (requestValue || responseValue || entryName) {
      props.saveChangeHandler({
        name:_.cloneDeep(entryName),
        request:_.cloneDeep(requestValue),
        response:_.cloneDeep(responseValue)
      }
      );
    }
  };

  const Toggle = (type, value) => {
    if (type === "requestCode") {
      setToggleRequestCode(value);
      if (requestRawRef && requestRawRef.current) {
        const v = JSON.parse(requestRawRef.current.value);
        setInitializeRequestValue(v);
        setTempRequestValue(v);
      }
    } else if (type === "responseCode") {
      setToggleResponseCode(value);
      if (responseRawRef && responseRawRef.current) {
        const v = JSON.parse(responseRawRef.current.value);
        setInitializeResponseValue(v);
        setTempResponseValue(v);
      }
    }
  };
  const modeClass = props.mode === "dard" ? "dard-mode" : "light-mode";
  const jsonEditTheme = props.jsonEditTheme || "dark_vscode_tribute";

  return props.data && props.data.obj ? (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.handleClose}
      className={modeClass}
    >
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
            <ButtonGroup>
              <Button
                variant={toggleRequestCode === "json" ? "info" : "secondary"}
                onClick={() => Toggle("requestCode", "json")}
              >
                <i className="fa fa-indent" aria-hidden="true"></i>
              </Button>
              <Button
                variant={toggleRequestCode === "raw" ? "info" : "secondary"}
                onClick={() => Toggle("requestCode", "raw")}
              >
                <i className="fa fa-code" aria-hidden="true"></i>
              </Button>
            </ButtonGroup>
            {toggleRequestCode === "raw" && (
              <textarea
                ref={requestRawRef}
                defaultValue={JSON.stringify(
                  initializeRequestValue,
                  null,
                  "\t"
                )}
              ></textarea>
            )}
            {toggleRequestCode === "json" && (
              <div className="block-area block-area-2">
                <JSONInput
                  theme={jsonEditTheme}
                  id="a_unique_id"
                  placeholder={initializeRequestValue}
                  locale={locale}
                  width="100%"
                  height="200px"
                  onChange={value => {
                    if (value.jsObject) {
                      setTempRequestValue(value.jsObject);
                      setInitializeRequestValue(value.jsObject);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h3>Response</h3>
            <ButtonGroup aria-label="Basic example">
              <Button
                variant={toggleResponseCode === "json" ? "info" : "secondary"}
                onClick={() => Toggle("responseCode", "json")}
              >
                <i className="fa fa-indent" aria-hidden="true"></i>
              </Button>
              <Button
                variant={toggleResponseCode === "raw" ? "info" : "secondary"}
                onClick={() => Toggle("responseCode", "raw")}
              >
                <i className="fa fa-code" aria-hidden="true"></i>
              </Button>
            </ButtonGroup>
            {toggleResponseCode === "raw" && (
              <textarea
                ref={responseRawRef}
                defaultValue={JSON.stringify(
                  initializeResponseValue,
                  null,
                  "\t"
                )}
              ></textarea>
            )}
            {toggleResponseCode === "json" && (
              <div className="block-area block-area-2">
                <JSONInput
                  theme={jsonEditTheme}
                  id="b_unique_id"
                  placeholder={initializeResponseValue}
                  locale={locale}
                  width="100%"
                  height="450px"
                  onChange={value => {
                    if (value.jsObject) {
                      setTempResponseValue(value.jsObject);
                      setInitializeResponseValue(value.jsObject);
                    }
                  }}
                />
              </div>
            )}
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

export default connect(
  state => ({
    mode: state.userSettings.mode,
    theme: state.userSettings.jsonTheme,
    show: state.modal.edit.show,
    data: state.ui.selectedNode,
    jsonEditTheme: state.userSettings.jsonEditTheme
  }),
  { handleClose: hideEditStub, saveChangeHandler: editStub }
)(EditStub);
