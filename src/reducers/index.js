import { combineReducers } from "redux";

import userSettingReducer from "./userSettingReducer";
import modalReducer from "./modalReducer";
import uiReducer from "./uiReducer";
import mappingReducer from "./mappingReducer";
import contextReducer from "./contextReducer";

export default combineReducers({
  userSettings: userSettingReducer,
  modal: modalReducer,
  ui: uiReducer,
  mapping: mappingReducer,
  context: contextReducer,
});
