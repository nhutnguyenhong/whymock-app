import React from "react";
import "./App2.css";

export const App2 = () => {
  return (
    <div className="container">
      <Header />
    </div>
  );
};

const Header = () => {
  return (
    <div className="row header-row">
      <div className="col-sm-3 header-img" />
      <div className="col-sm-9" />
    </div>
  );
};
