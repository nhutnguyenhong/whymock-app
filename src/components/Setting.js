import React, { createRef } from "react";
import { Modal, Button } from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { connect } from "react-redux";
import {hideSettingModal,updateUserSetting} from '../actions';

class Setting extends React.Component {
  themeRef = createRef();
  jsonthemeRef = createRef();
  jsoneditthemeRef = createRef();

  saveChangeHandler = () => {
    var obj = {
      mode: this.themeRef.current.value,
      jsonTheme: this.jsonthemeRef.current.value,
      jsonEditTheme: this.jsoneditthemeRef.current.value,
      confirmOnDelete: this.state ? this.state.confirmOnDelete : true,
    };
    this.props.updateUserSetting(obj);
    this.props.hideSettingModal();
  };

  render() {
    const { mode, show, hideSettingModal,settings } = this.props;

    let modeClass = mode === "dard" ? "dard-mode" : "";
    modeClass += " setting-modal";
    return (
      <Modal size="lg" show={show} className={modeClass} onHide={hideSettingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-3">
              <h3>Theme</h3>
            </div>
            <div className="col-sm-3">
              <FormControl as="select" id="theme" ref={this.themeRef} defaultValue={settings.mode}>
                <option value='light'>Light</option>
                <option value='dard'>Dark</option>
              </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3">
              <h3>JSON view theme</h3>
            </div>
            <div className="col-sm-3">
              <FormControl as="select" id="jsontheme" ref={this.jsonthemeRef} defaultValue={settings.jsonTheme}>
                <option>apathy</option>
                <option>ashes</option>
                <option>bespin</option>
                <option>brewer</option>
                <option>bright</option>
                <option>chalk</option>
                <option>codeschool</option>
                <option>colors</option>
                <option>eighties</option>
                <option>embers</option>
                <option>flat</option>
                <option>google</option>
                <option>grayscale</option>
                <option>grayscale</option>
                <option>greenscreen</option>
                <option>harmonic</option>
                <option>hopscotch</option>
                <option>isotope</option>
                <option>marrakesh</option>
                <option>mocha</option>
                <option>monokai</option>
                <option>ocean</option>
                <option>paraiso</option>
                <option>pop</option>
                <option>railscasts</option>
                <option>rjv</option>
                <option>shapeshifter</option>
                <option>solarized</option>
                <option>summerfruit</option>
                <option>threezerotwofour</option>
                <option>tomorrow</option>
                <option>tube</option>
                <option>twilight</option>
              </FormControl>
            </div>
            <div className="col-sm-3 vertical-middle">
              <a
                target="_blank"
                href="https://mac-s-g.github.io/react-json-view/demo/dist/"
              >
                <i className="fa fa-question"></i>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <h3>JSON edit theme</h3>
            </div>
            <div className="col-sm-4">
              <FormControl as="select" id="jsonedittheme" ref={this.jsoneditthemeRef} defaultValue={settings.jsoneditTheme}>
                <option>dark_vscode_tribute</option>
                <option>light_mitsuketa_tribute</option>
              </FormControl>
            </div>
            <div className="col-sm-3 vertical-middle">
              <a
                target="_blank"
                href="https://github.com/AndrewRedican/react-json-editor-ajrm/wiki/Built-In-Themes"
              >
                <i className="fa fa-question"></i>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <h3>Confirm on delete</h3>
            </div>
            <div className="col-sm-5">
              <BootstrapSwitchButton
                checked={settings.confirmOnDelete}
                size="sm"
                width={75}
                onlabel="Yes"
                offlabel="No"
                onChange={checked => {
                  this.setState({ confirmOnDelete: checked });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideSettingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.saveChangeHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default  connect(
  (state)=>({
    mode: state.userSettings.mode,
    settings: state.userSettings,
    show: state.modal.setting.show,
  }),
  {
    hideSettingModal,
    updateUserSetting,
  }
)(Setting);