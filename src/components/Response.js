import React from "react";
import ReactJson from "react-json-view";
import PerfectScrollbar from 'react-perfect-scrollbar';

const ignoredHeaders = ["Access-Control-Allow-Origin","Access-Control-Allow-Methods","Access-Control-Allow-Headers"];
export const Response = ({ node, theme }) => {
  
  if (node && node.obj) {
    Object.keys(node.obj.response.headers).filter(header=> {
      if(ignoredHeaders.filter(h=>h === header).length > 0){
        delete node.obj.response.headers[header];
      }
    });
    return (
      <div className="block-area block-area-response">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <span className="breadcrumb-item active" aria-current="page">
              Mock response
            </span>
          </ol>
        </nav>
        <PerfectScrollbar>
          <ReactJson
            theme={theme}
            collapsed={false}
            displayDataTypes={false}
            className="react-json-view"
            src={node.obj.response}
          />
          </PerfectScrollbar>
      </div>
    );
  }
  return null;
};
