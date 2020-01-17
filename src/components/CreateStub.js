import React from "react";
import { Modal, Button } from "react-bootstrap";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import FormControl from "react-bootstrap/FormControl";
import _ from "lodash";

const PLACEHOLDERDATA = {
  request: {
    urlPattern: "/path",
    method: "GET"
  },
  response: {
    status: 200,
    headers: {
      "content-type": "application/json"
    },
    body: { field: "value" }
  }
};

const removeContextFromUrl = (context, url) => {
  return context ? "/" + _.trimStart(url, "/" + context) : url;
};
export const CreateStub = props => {
  const [userEnterResponse, setUserEnterResponse] = useState(
    _.cloneDeep(PLACEHOLDERDATA.response)
  );
  const [response, setResponse] = useState(
    _.cloneDeep(PLACEHOLDERDATA.response)
  );

  const groupNameRef = useRef();
  const entryNameRef = useRef();
  const urlPatternRef = useRef();
  const methodNameRef = useRef("GET");
  const contextRef = useRef();

  const handleDefaultValue = () => {
    if (props.initialData && props.initialData.metadata) {
      const { initialData } = props;
      groupNameRef.current.value = initialData.metadata.file_name;
      entryNameRef.current.value = initialData.name;
      methodNameRef.current.value = initialData.request.method;
      urlPatternRef.current.value = removeContextFromUrl(
        props.context,
        initialData.request.urlPattern
      ) || '';
      setResponse(initialData.response);
      setUserEnterResponse(initialData.response);
    } else {
      setResponse(_.cloneDeep(PLACEHOLDERDATA.response));
    }
  };

  useEffect(() => {
    handleDefaultValue();
  }, [props.initialData]);

  const handleClose = () => {
    methodNameRef.current.value = "GET";
    setResponse(PLACEHOLDERDATA.response);
    props.handleClose();
  };
  const handleSave = () => {
    const context = props.initialData && props.initialData.share
      ? contextRef.current.value
      : props.context;
    const data = {
      name: entryNameRef.current.value || Math.random() * (+100 - +1) + +1,
      metadata: {
        file_name: groupNameRef.current.value || "unknown",
        context: context
      },
      request: {
        urlPattern:
          (context ? "/" + context : "") + urlPatternRef.current.value,
        method: methodNameRef.current.value
      },
      response: userEnterResponse,
      persistent: true
    };
    if (typeof data.response.body !== "string") {
      data.response.body = JSON.stringify(data.response.body);
    }
    props.saveChangeHandler(data);
  };
  const selectGroup = seletedItem => {
    if (seletedItem.value <= 0) {
      return;
    }
    groupNameRef.current.value = seletedItem.value;
  };
  const { groups, context, initialData, contexts=[] } = props;
  if (!groups) {
    return null;
  }
  const modeClass = props.mode === "dard" ? "dard-mode" : "";
  const isSharingContext = initialData && initialData.share;

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={handleClose}
      className={modeClass}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isSharingContext ? "Share mock to another context" : "New mock"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="card-header">Request</div>
                <div className="input-group mb-3 field-group-with-complete">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text inputLabel"
                      id="basic-addon1"
                    >
                      Group
                    </span>
                  </div>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="group"
                    ref={groupNameRef}
                  />
                  <div className="input-group-append suggestion-list">
                    <Select
                      options={groups}
                      placeholder="select group"
                      onChange={selectGroup}
                    />
                  </div>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text inputLabel"
                      id="basic-addon1"
                    >
                      Name
                    </span>
                  </div>
                  <FormControl
                    type="text"
                    placeholder="name"
                    ref={entryNameRef}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text inputLabel"
                      id="basic-addon1"
                    >
                      URL Pattern
                    </span>
                  </div>
                  {context && !isSharingContext ? (
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text form-control"
                        id="basic-addon1"
                      >
                        /{context}
                      </span>
                    </div>
                  ) : (
                    undefined
                  )}

                  {isSharingContext ? (
                    <div className="input-group-prepend">
                      <FormControl as="select" id="context" ref={contextRef}>
                        {contexts.map(c => (
                          <option value={c} key={c}>
                            /{c}
                          </option>
                        ))}
                      </FormControl>
                    </div>
                  ) : (
                    undefined
                  )}
                  <FormControl
                    type="text"
                    placeholder="/test"
                    ref={urlPatternRef}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text inputLabel"
                      id="basic-addon1"
                    >
                      Method
                    </span>
                  </div>
                  <FormControl as="select" id="sel1" ref={methodNameRef}>
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>PATCH</option>
                    <option>DELETE</option>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="card-header">Response</div>

                <JSONInput
                  id="b_unique_id"
                  placeholder={response}
                  locale={locale}
                  width="100%"
                  height="400px"
                  onChange={val => {
                    setUserEnterResponse(val.jsObject);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Stub
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
