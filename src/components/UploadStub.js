import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactJson from "react-json-view";
import PerfectScrollbar from "react-perfect-scrollbar";
import _ from "lodash";

import { connect } from "react-redux";
import { hideuploadStub, importStub } from "../actions";

const UploadStub = ({
  context,
  show,
  mode,
  handleClose,
  theme,
  importStub
}) => {
  const [data, setData] = useState({ rawData: {} });

  useEffect(() => {
    if (!show) {
      setData({ rawData: {} });
    }
  }, [show]);

  const onFileLoad = event => {
    const content = event.target.result;
    setData({ rawData: JSON.parse(content) });
  };
  const onChooseFile = (event, onLoadFileHandler) => {
    if (typeof window.FileReader !== "function")
      throw "The file API isn't supported on this browser.";
    let input = event.target;
    if (!input)
      throw "The browser does not properly implement the event object";
    if (!input.files)
      throw "This browser does not support the `files` property of the file input.";
    if (!input.files[0]) return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
  };

  const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, "g"), replace);
  };
  const removeContextFromUrl = (context, url) => {
    if (context) {
      //replace special / by another fake string
      const fakeString = "-XUX-";
      url = replaceAll(url, "/", fakeString);
      url = fakeString + url.replace(fakeString + context + fakeString, "");
      url = replaceAll(url, fakeString, "/");
    }
    return url;
  };

  const map = d => {
    if (!d.request) {
      return undefined;
    }
    const data = {
      ...d,
      id: undefined,
      uuid: undefined,
      response: { ...d.response, body: JSON.stringify(d.response.body) }
    };

    if (context) {
      //the url should be apply the context
      data.request = {
        ...data.request,
        urlPattern:
          "/" +
          context +
          removeContextFromUrl(
            _.get(data, "metadata.context", undefined),
            data.request.urlPattern
          )
      };
    } else {
      //the url should be apply the context
      data.request = {
        ...data.request,
        urlPattern: removeContextFromUrl(
          _.get(data, "metadata.context", undefined),
          data.request.urlPattern
        )
      };
    }
    data.metadata = { ...d.metadata, context: context ? context : undefined };
    return data;
  };
  const handleSave = () => {
    let sendData = [];

    if (_.isArray(data.rawData)) {
      sendData = data.rawData.filter(d => d.request).map(d => map(d));
    } else {
      const postedData = map(data.rawData);
      if (postedData) {
        postedData.response.body = JSON.stringify(postedData.response.body);
        sendData.push(postedData);
      }
    }
if(sendData.length===0){
  return;
}
    importStub({
      mappings: sendData,
      importOptions: {
        duplicatePolicy: "IGNORE",
        deleteAllNotInImport: false
      }
    });
  };
  const modeClass = mode === "dard" ? "dard-mode" : "light-mode";

  return (
    <Modal
      size="lg"
      show={show}
      className={`${modeClass} uploadStub`}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Upload stubs for{" "}
          <span className="badge badge-info">
            {(context ? _.startCase(context) : "Default") + " context"}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Please choose the exported file and we can play with it immediately:
        <br></br>
        <br></br>
        <input
          accept=".json"
          type="file"
          onChange={event =>
            onChooseFile(event, (elementId, event) =>
              onFileLoad(elementId, event)
            )
          }
        />
        <br></br>
        <br></br>
        <div className="json">
          <PerfectScrollbar>
            <ReactJson
              theme={theme}
              id="a_unique_id"
              displayDataTypes={false}
              className="react-json-view"
              src={data.rawData}
            />
          </PerfectScrollbar>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect(
  state => ({
    show: state.modal.uploadStub.show,
    context: state.context
  }),
  {
    handleClose: hideuploadStub,
    importStub
  }
)(UploadStub);
