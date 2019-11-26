import React from "react";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { Badge } from "react-bootstrap";


const statusDISABLE = "DISABLED";

export const Request = props => {
  var url = window.location.href;
  var arr = url.split("/");
  var result = arr[0] + "//" + arr[2];

  const copy = () => {
    const {
      node: {
        obj: { request }
      }
    } = props;
    const v =
      "curl --request " + request.method + " " + result + request.urlPattern;
    copyTextToClipboard(v);
  };
  const fallbackCopyTextToClipboard = text => {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  const copyTextToClipboard = text => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);

      return;
    }
    navigator.clipboard.writeText(text).then(
      function() {
        console.log("Async: Copying to clipboard was successful!");
        ToastsStore.success(
          "Copying to clipboard was successful. Let mock...."
        );
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };
  const HeaderComponent = () => {
    const {
      node: {
        obj: { request }
      }
    } = props;
    let content =
      request !== undefined ? (
        <table className="table">
          <tbody>
            {/* <tr>
              <td>Method</td>
              <td>{request.method}</td>
            </tr> */}
            <tr>
              <td>
                <button onClick={copy} className="btn btn-secondary btn-sm">
                  <i className="fa fa-copy" />
                </button>
                {"  " + result + request.urlPattern}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        ""
      );
    return content;
  };

  const { node } = props;
  if (node && node.name) {
    console.log(node);
    
    const { status } = node.obj.metadata;
    const isDisabled = status === statusDISABLE;
    return (
      <div className="block-area">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <span className="breadcrumb-item active" aria-current="page">
              {node.name}
            </span>
            {isDisabled? <Badge className="right-align" variant="secondary" >DISABLED</Badge> : undefined}
          </ol>
        </nav>
        <HeaderComponent />
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.BOTTOM_CENTER}
        />
      </div>
    );
  }
  return <div className="not-available">Why mock?</div>;
};
