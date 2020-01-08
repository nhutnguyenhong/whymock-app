import React, { PureComponent } from "react";
import logoWireMock from "../../public/wiremock.png";
import PerfectScrollbar from "react-perfect-scrollbar";

import _ from "lodash";
import { __esModule } from "react-treebeard/dist";
import { Request } from "./Request";
import { Response } from "./Response";
import { EditStub } from "./EditStub";
import { ActionButton } from "./ActionButton";
import { CreateStub } from "./CreateStub";
import { ImportStub } from "./ImportStub";
import querySearch from "stringquery";
import Select from "react-select";
import {
  getMappings,
  deleteStub,
  saveStub,
  createStub
} from "../services/WireMockService";
import { TreeOfStubs } from "./TreeOfStubs";
import { SplitButton, Dropdown, Badge } from "react-bootstrap";
import { saveSetting, getUserSetting } from "../services/userProfileService";
import Setting from "./Setting";
import About from "./About";
import Context from "./Context";

const statusDISABLE = "DISABLED";

export default class WhyMock extends PureComponent {
  state = {
    activeStub: {},
    edit: false,
    delete: false,
    // mode:"light",
    userSettings: { mode: "dard" }
  };
  onToggle = (node, toggled, isSetActive = true) => {
    const { cursor, data } = this.state;
    if (cursor) {
      cursor.active = false;
      this.setState({ cursor });
    }
    if (isSetActive) {
      node.active = true;
    }
    if (node.children) {
      node.toggled = toggled;
      this.setState({ edit: false, delete: false });
    } else {
      this.setActiveNode(node);
      //change URL:
      const { id, context } = querySearch(this.props.location.search);
      this.changeHistoryUrl(node.obj.id !== id? node.obj.id : undefined, context)
    }
    this.setState({ cursor: node, data: Object.assign({}, data) });
  };

  changeHistoryUrl = (id, context) => {
      let params = [];
      if (id) {
      params.push(`id=${id}`);
      }
      if (context) {
        params.push(`context=${context}`);
      }
      this.props.history.push({
        pathname: "/",
        search: `?${_.join(params, "&")}`
      });
  };

  setActiveNode = node => {
    this.setState({
      activeStub: node,
      edit: true,
      delete: true
    });
  };
  resetActiveNode = () => {
    this.setState({
      activeStub: {},
      edit: false,
      delete: false
    });
  };
  componentDidMount = () => {
    this.handleContextFromURLParams();
    this.getAllMapping();
    getUserSetting(userSettings => {
      this.setState({ ...userSettings });
    });
  };
  getAllMapping = (needReset = false, selectContext) => {
    let context = selectContext? selectContext :this.getContextFromURL();
    context = context && context === 'default'? '' : context;
    getMappings(context? 'context=' + context : undefined,data => {
      this.updateMappings(data, needReset);
      this.handleURLParams();
    });
  };

  updateMappings = (data, needReset) => {
    const maps = this.prepareDataForTree(data);
    const context = this.state.context;
    if (maps.length >= 0 || needReset) {
      this.setState({
        data: { name: context? _.startCase(context): "WhyMock", toggled: true, children: [...maps] }
      });

      //how the request
      this.setState({
        ...this.setActiveNode({}),
        edit: false,
        delete: false
      });
    }
  };

  prepareDataForTree = data => {
    //only get the stub has name
    const dataHasName = data.mappings.filter(
      item =>
        item.name &&
        item.metadata &&
        item.metadata.file_name &&
        item.request.method !== "OPTIONS"
    );
    const allNames = [];
    const groupDataByFileName = dataHasName.reduce((obj, item) => {
      obj[item.metadata.file_name] = obj[item.metadata.file_name] || [];
      const hashId = this._getHashId() + this._getHashId();
      let node = {
        name: <TreeItemDisplay item={item} />,
        obj: item,
        hashSuggestedId: hashId
      };
      allNames.push(this.getSuggestedItem(item, hashId));
      try {
        node.obj.response.body = JSON.parse(node.obj.response.body);
      } catch (exception) {}
      obj[item.metadata.file_name].push(node);
      return obj;
    }, {});
    const treeNodes = Object.keys(groupDataByFileName)
      .map(function(key) {
        return {
          name: key,
          children: [...groupDataByFileName[key]]
        };
      })
      .sort((a, b) =>
        this._stringComparator(a.name.toLowerCase(), b.name.toLowerCase())
      );

    //prepare all groups for auto complete
    const groupNamesforAutocomplete = this.convertToAutoCompleteArray(
      groupDataByFileName
    );
    this.setState({
      suggestedItems: allNames,
      allGroups: groupNamesforAutocomplete
    });
    return treeNodes;
  };
  convertToAutoCompleteArray = allGroups => [
    ...Object.keys(allGroups)
      .map((key, index) => ({ value: key, label: key }))
      .sort((a, b) =>
        this._stringComparator(a.value.toLowerCase(), b.value.toLowerCase())
      )
  ];
  _stringComparator = (a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };
  getSuggestedItem = (item, hashId) => ({
    value: hashId,
    label:
      item.request.method + " " + item.name + "  " + item.request.urlPattern
  });
  _getHashId = () => Math.floor(Math.random() * 100000);

  editStub = () => this.setState({ show: true });

  createStub = () => this.setState({ copyObj: null, showCreatedModal: true });

  importStub = () => this.setState({ copyObj: null, showImportModal: true });
  
  shareStub = () => this.setState({
    copyObj: {..._.cloneDeep(this.state.cursor.obj), share:true},
    showCreatedModal: true
  });

  duplicateStub = () => {
    this.setState({
      copyObj: _.cloneDeep(this.state.cursor.obj),
      showCreatedModal: true
    });
  };

  handleClose = () => this.setState({ show: false });

  handleCloseCreateView = () =>
    this.setState({ copyObj: null, showCreatedModal: false });

  deleteStub = () => {
    const { name, id } = { ...this.state.cursor.obj };
    let confirmOnDelete = true;
    if (this.state && this.state.userSettings) {
      confirmOnDelete = this.state.userSettings.confirmOnDelete;
    }

    if (confirmOnDelete) {
      if (confirm('Can you confirm delete "' + name + '" ?')) {
        deleteStub(id, () => {
          this.deleteNode(id);
        });
      }
    } else {
      deleteStub(id, () => {
        this.deleteNode(id);
      });
    }
  };

  disableStub = () => {
    const stub = { ...this.state.cursor.obj };
    stub.response.body = JSON.stringify(stub.response.body);
    stub.metadata.status = statusDISABLE;
    saveStub(stub, () => {
      this.updateStub(stub);
    });
  };
  enableStub = () => {
    const stub = { ...this.state.cursor.obj };
    stub.response.body = JSON.stringify(stub.response.body);
    stub.metadata = { file_name: stub.metadata.file_name };
    saveStub(stub, () => {
      this.updateStub(stub);
    });
  };
  handleSaveChange = (name, request, response) => {
    const stub = { ...this.state.cursor.obj };
    stub.request = request || stub.request;
    stub.response = response || stub.response;
    stub.response.body = JSON.stringify(stub.response.body);
    stub.name = name || stub.name;

    saveStub(stub, () => {
      this.setState({ show: false });
      this.updateStub(stub);
    });
  };

  updateStub = stub => {
    const [dataTree, , foundTreeNode] = this.findTreeNodeAndParent(
      item => item.obj.id == stub.id
    );
    stub.response.body = JSON.parse(stub.response.body);
    foundTreeNode.obj = stub;
    foundTreeNode.name = <TreeItemDisplay item={stub} />;
    this.setState({ data: dataTree });
  };

  handleSaveNew = data =>
    createStub(data, response => {
      this.setState({ showCreatedModal: false });
      if(response.metadata && response.metadata.context){
        if(this.state.context && response.metadata.context === this.state.context){
          this.addNewNodeToTree(response);
        }
      }else{
        if(!this.state.context){
          this.addNewNodeToTree(response);
        }
      }
      
    });

  handleSuggestedItemChanged = seletedItem => {
    if (!seletedItem.value) {
      return;
    }
    const [, foundGroupTreeNode, foundTreeNode] = this.findTreeNodeAndParent(
      item => item.hashSuggestedId == seletedItem.value
    );

    this.onToggle(foundGroupTreeNode, true, false);
    this.onToggle(foundTreeNode, true);
  };

  handleStubFromURL = id => {
    if (!id) {
      return;
    }
    const [, foundGroupTreeNode, foundTreeNode] = this.findTreeNodeAndParent(
      item => item.obj.id == id
    );

    this.onToggle(foundGroupTreeNode, true, false);
    this.onToggle(foundTreeNode, true);
  };
  handleURLParams = () => {
    const { id } = querySearch(this.props.location.search);
    this.handleStubFromURL(id);
  };

  findTreeNodeAndParent = conditionFunc => {
    const dataTree = { ...this.state.data };
    if (!dataTree || !dataTree.children) {
      return [];
    }
    let foundTreeNode = {};
    let foundGroupTreeNode = {};
    dataTree.children.forEach(group => {
      const foundItem = group.children.filter(item => conditionFunc(item));
      if (foundItem.length > 0) {
        foundTreeNode = foundItem[0];
        foundGroupTreeNode = group;
      }
    });
    return [dataTree, foundGroupTreeNode, foundTreeNode];
  };

  addNewNodeToTree = node => {
    const dataTree = { ...this.state.data };
    if (!dataTree || !dataTree.children) {
      return;
    }
    let foundGroup = dataTree.children.filter(
      group => group.name === node.metadata.file_name
    );
    if (foundGroup.length === 0) {
      foundGroup = { name: node.metadata.file_name, children: [] };
      dataTree.children = [foundGroup, ...dataTree.children];
    } else {
      foundGroup = foundGroup[0];
    }
    node.response.body = JSON.parse(node.response.body);
    const newNode = {
      name: <TreeItemDisplay item={node} />,
      obj: node,
      hashSuggestedId: this._getHashId() + this._getHashId()
    };
    foundGroup.children = [newNode, ...foundGroup.children];
    this.setState({ data: dataTree });
    this.onToggle(foundGroup, true, false);
    this.onToggle(newNode, true);

    //put to the suggested group
    if (foundGroup) {
      const foundItem = this.state.allGroups.find(
        item => item.value === foundGroup.name
      );
      if (!foundItem || foundItem.length == 0) {
        this.setState({
          allGroups: [
            ...this.state.allGroups,
            { value: foundGroup.name, label: foundGroup.name }
          ]
        });
      }
    }
  };
  deleteNode = id => {
    const [dataTree, foundGroupTreeNode] = this.findTreeNodeAndParent(
      item => item.obj.id === id
    );
    const deleteIndex = foundGroupTreeNode.children.findIndex(
      node => node.obj.id === id
    );
    foundGroupTreeNode.children = foundGroupTreeNode.children.filter(
      node => node.obj.id !== id
    );
    this.setState({ data: dataTree });
    if (foundGroupTreeNode.children.length > 0 && deleteIndex > 0) {
      this.onToggle(foundGroupTreeNode.children[deleteIndex - 1]);
    } else {
      this.onToggle(foundGroupTreeNode, true);
      this.resetActiveNode();
    }
  };
  setMode = () => {
    const { userSettings } = this.state;
    let { mode } = userSettings;
    if (!mode || mode === "light") {
      mode = "dard";
    } else {
      mode = "light";
    }
    this.storeSetting({ mode });
  };

  storeSetting = data => {
    const { userSettings } = this.state;
    const newUserSettings = { userSettings: { ...userSettings, ...data } };
    this.setState(newUserSettings);
    saveSetting(newUserSettings);
  };
  saveContext = data => {
    const { userSettings } = this.state;

    let selectContext;

    if (data.newContext) {
      selectContext = data.newContext;

      let newUserSettings = { userSettings: { ...userSettings } };
      if (newUserSettings.userSettings["contexts"]) {
        newUserSettings.userSettings.contexts = Array.from(
          new Set([...newUserSettings.userSettings.contexts, data.newContext])
        );
      } else {
        newUserSettings.userSettings.contexts = [data.newContext];
      }
      this.setState(newUserSettings);
      saveSetting(newUserSettings);
    }
    if (data.chooseContext) {
      selectContext = data.chooseContext;
    }

    if (selectContext) {
      this.setState({ context: selectContext });
      //get all mapping with take care context
      this.getAllMapping(false,selectContext);

      //update url
      const { id } = querySearch(this.props.location.search);
      this.changeHistoryUrl(id,selectContext);
    }
  };

  bookmark = node => {
    const bookmarks = this.state.bookmarks;
  };

  showSettingModal = () => {
    this.setState({ showSettingModal: true });
  };
  handleCloseSettingModal = () => {
    this.setState({ showSettingModal: false });
  };
  showAboutModal = () => {
    this.setState({ showAboutModal: true });
  };
  handleCloseAboutModal = () => {
    this.setState({ showAboutModal: false });
  };
  showContextModal = () => {
    this.setState({ showContextModal: true });
  };
  handleCloseContextModal = () => {
    this.setState({ showContextModal: false });
  };

  handleDefaultContext = () => {
    const { id } = querySearch(this.props.location.search);
    this.changeHistoryUrl(id , undefined);
    this.setState({context: undefined});
    //get all mapping with take care context
    this.getAllMapping(false,'default');
    this.handleCloseContextModal();
  }

  handleContextFromURLParams = () => {
    const context = this.getContextFromURL();
    if (context) {
      this.setState({ context: context });
    }
  };

  getContextFromURL = () => {
    const { context } = querySearch(this.props.location.search);
    return context;
  }

  componentDidUpdate() {
    if (this.state.cursor && this.state.cursor.obj) {
      const { id } = querySearch(this.props.location.search);
      if (this.state.cursor.obj.id !== id) {
        this.handleURLParams();
      }
    }

    this.handleContextFromURLParams();
  }

  render() {
    const { data, suggestedItems, context } = this.state;
    let { obj } = this.state.cursor || {};
    const {
      userSettings: { mode }
    } = this.state;
    obj = obj || { metadata: {} };
    console.log(context);

    return (
      <div className={mode === "dard" ? "dard-mode" : ""}>
        <div className="container ">
          <div className="fullHeight">
            <Header
              setMode={this.setMode}
              mode={mode}
              showSettingModal={this.showSettingModal}
              showAboutModal={this.showAboutModal}
              showContextModal={this.showContextModal}
              context={context}
            >
              <SuggestedStubs
                suggestedItems={suggestedItems}
                onItemChanged={this.handleSuggestedItemChanged}
              />
            </Header>
            <div className="row tree-view">
              <PerfectScrollbar className="col-sm-4 border-right tree-view-content">
                <TreeOfStubs
                  nodes={data}
                  onNodeSelected={this.onToggle}
                  mode={mode}
                />
              </PerfectScrollbar>
              <div className="col-sm-8 view-panel">
                <StubDetail
                  node={this.state.activeStub}
                  theme={this.state.userSettings.jsonTheme}
                  bookmark={this.bookmark}
                  context={this.state.context}
                />
              </div>
            </div>
            <EditStub
              show={this.state.show}
              handleClose={this.handleClose}
              data={this.state.cursor}
              saveChangeHandler={this.handleSaveChange}
              mode={mode}
              theme={this.state.userSettings.jsonTheme}
            />
            <CreateStub
              show={this.state.showCreatedModal}
              handleClose={this.handleCloseCreateView}
              saveChangeHandler={this.handleSaveNew}
              groups={this.state.allGroups}
              initialData={this.state.copyObj}
              mode={mode}
              theme={this.state.userSettings.jsonTheme}
              context={this.state.context}
              contexts={this.state.userSettings.contexts}
            />
            {/* <ImportStub
              show={this.state.showImportModal}
              handleClose={this.handleCloseImportView}
              saveChangeHandler={this.handleImportNew}
              groups={this.state.allGroups}
              initialData={this.state.copyObj}
              mode={mode}
            /> */}
            <ActionButton
              enable={this.state.edit && obj.metadata.status !== statusDISABLE}
              disable={this.state.edit && obj.metadata.status === statusDISABLE}
              edit={this.state.edit}
              hasDelete={this.state.delete}
              editStub={this.editStub}
              createStub={this.createStub}
              deleteStub={this.deleteStub}
              duplicateStub={this.duplicateStub}
              disableStub={this.disableStub}
              enableStub={this.enableStub}
              mode={mode}
              shareStub={this.shareStub}
              importStub={this.importStub}
            />
            <Setting
              show={this.state.showSettingModal}
              mode={mode}
              handleClose={this.handleCloseSettingModal}
              handleSaveChanges={this.storeSetting}
              settings={this.state.userSettings}
            ></Setting>
            <About
              show={this.state.showAboutModal}
              mode={mode}
              handleClose={this.handleCloseAboutModal}
            ></About>

            <Context
              show={this.state.showContextModal}
              mode={mode}
              handleSaveChanges={this.saveContext}
              handleClose={this.handleCloseContextModal}
              handleDefaultContext={this.handleDefaultContext}
              contexts={this.state.userSettings.contexts}
              context={this.state.context}
            ></Context>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

const Header = ({
  children,
  setMode,
  mode,
  context,
  showSettingModal,
  showAboutModal,
  showContextModal
}) => (
  <div className="row header-row">
    <div className="col-sm-3 header-img">
      <img alt="WhyMock" src={logoWireMock} />
    </div>
    <div className="col-sm-6 suggestionZone">{children}</div>
    <div className="col-sm-3 right-toolbar">
      <SplitButton
        alignRight
        onClick={showContextModal}
        title={
          "As " +( context ?  _.startCase(context) : "Mocker")
        }
        size="sm"
        className="button-header"
        variant="secondary"
      >
        <Dropdown.Item href="#/action-1" onClick={showContextModal}>
          <i className="fa fa-rocket"></i> Change context
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2" onClick={showSettingModal}>
          <i className="fa fa-cog"></i> Setting
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-3" onClick={showAboutModal}>
          <i className="fa fa-info-circle"></i> About
        </Dropdown.Item>
      </SplitButton>
    </div>
  </div>
);
const Footer = () => (
  <div className="row  footer header-row">
    <div className="col-sm-12 header-img" />
  </div>
);
const SuggestedStubs = ({ suggestedItems, onItemChanged }) => {
  return suggestedItems && suggestedItems.length > 0 ? (
    <Select
      options={suggestedItems}
      placeholder="search..."
      onChange={onItemChanged}
    />
  ) : null;
};

const StubDetail = ({ node, theme, bookmark,context }) => {
  return (
    <div>
      <Request node={node} bookmark={bookmark} context={context}/>
      <Response node={node} theme={theme} />
    </div>
  );
};

const TreeItemDisplay = ({ item }) => {
  const {
    request: { method },
    name
  } = item;
  const { status } = item.metadata;
  const isDisabled = status === statusDISABLE;

  let variant = "secondary";
  switch (method) {
    case "GET":
      variant = "secondary";
      break;
    case "POST":
      variant = "info";
      break;
    case "PATCH":
      variant = "success";
      break;
    case "PUT":
      variant = "warning";
      break;
  }
  return (
    <span className={isDisabled ? " tree-item-disabled " : ""}>
      <Badge variant={variant} className="method-badge">
        {method}
      </Badge>
      {name}
    </span>
  );
};
