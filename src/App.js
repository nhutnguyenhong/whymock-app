import React, { Component } from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import "./App.css";
import WhyMock from "./components/WhyMock";
import {BrowserRouter} from "react-router-dom";
import {Route} from 'react-router';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={WhyMock}></Route>
      </BrowserRouter>
    );
  }
}
export default App;
