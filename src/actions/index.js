import { createAction } from "redux-actions";
import {
  SHOW_ABOUT_MODAL,
  HIDE_ABOUT_MODAL,
  USER_SETTING_UPDATE_MODE,
  USER_SETTING_UPDATE,
  EXPAND_WHOLE_TREE,
  SHOW_SETTING_MODAL,
  HIDE_SETTING_MODAL,
  USER_SETTING_UPDATE_SUCCESS,
  USER_SETTING_TOGGLE_LAYOUT,
  LOAD_USER_SETTING,
  SELECT_NODE,
  COLLAPSE_WHOLE_TREE,
  EDIT_STUB,
  DELETE_STUB,
  TOGGLE_NODE_BY_ID,
  DUPLICATE_STUB,
  DISABLE_STUB,
  ENABLE_STUB,
  SHARE_STUB,
  IMPORT_STUB,
  CREATE_STUB,
  SHARE_GROUP_STUB,
  EXPORT_STUB,
  EXPORT_GROUP_STUB,
  HIDE_CREATE_STUB,
  RESET_MAPPING,
  LOAD_ALL_MAPPINGS,
  LOAD_ALL_MAPPINGS_SUCCESS,
  LOAD_NODES_SUCCESS,
  LOAD_SUGGESTED_ITEMS,
  LOAD_SUGGESTED_ITEMS_SUCCESS,
  LOAD_GROUP_NAME,
  LOAD_GROUP_NAME_SUCCESS,
  TOGGLE_NODE,
  DEACTIVE_NODE,
  UPLOAD_STUB,
  HIDE_UPLOAD_STUB,
  IMPORT_STUB_SUCCESS,
  SHOW_CONTEXT_MODAL,
  HIDE_CONTEXT_MODAL,
  ADD_NEW_CONTEXT,
  ADD_NEW_CONTEXT_SUCCESS,
  BACK_TO_DEFAULT_CONTEXT,
  SWITCH_TO_NEW_CONTEXT,
  SAVE_STUB_SUCCESS,
  CREATE_NEW_STUB,
  CREATE_NEW_STUB_SUCCESS,
  ADD_NEW_NODE_TO_TREE,
  HIDE_SHARE_GROUP_STUB,
  DELETE_STUB_SUCCESS,
  SHARE_GROUP,
  EDIT_STUB_MODAL,
  HIDE_EDIT_STUB_MODAL,
  EDIT_STUB_SUCCESS,
  CHANGE_URL
} from "./actions";

export const showAboutModal = createAction(SHOW_ABOUT_MODAL);
export const hideAboutModal = createAction(HIDE_ABOUT_MODAL);

export const showContextModal = createAction(SHOW_CONTEXT_MODAL);
export const hideContextModal = createAction(HIDE_CONTEXT_MODAL);

export const showSettingModal = createAction(SHOW_SETTING_MODAL);
export const hideSettingModal = createAction(HIDE_SETTING_MODAL);

export const updateMode = createAction(USER_SETTING_UPDATE_MODE);
export const toggleLayout = createAction(USER_SETTING_TOGGLE_LAYOUT);

export const loadUserSetting = createAction(LOAD_USER_SETTING);
export const updateUserSetting = createAction(USER_SETTING_UPDATE);
export const updateUserSettingSuccess = createAction(
  USER_SETTING_UPDATE_SUCCESS
);

export const selectNode = createAction(SELECT_NODE);

//Action buttons
export const editStubModal = createAction(EDIT_STUB_MODAL);
export const hideEditStubModal = createAction(HIDE_EDIT_STUB_MODAL);
export const editStub = createAction(EDIT_STUB);
export const editStubSuccess = createAction(EDIT_STUB_SUCCESS);

export const createStub = createAction(CREATE_STUB);
export const hideCreateStub = createAction(HIDE_CREATE_STUB);

export const deleteStub = createAction(DELETE_STUB);
export const deleteStubSuccess = createAction(DELETE_STUB_SUCCESS);

export const duplicateStub = createAction(DUPLICATE_STUB);
export const disableStub = createAction(DISABLE_STUB);
export const enableStub = createAction(ENABLE_STUB);
export const shareStub = createAction(SHARE_STUB);
export const shareGroupStub = createAction(SHARE_GROUP_STUB);
export const hideshareGroupStub = createAction(HIDE_SHARE_GROUP_STUB);
export const shareGroup = createAction(SHARE_GROUP);

export const exportStub = createAction(EXPORT_STUB);
export const exportGroup = createAction(EXPORT_GROUP_STUB);

export const uploadStub = createAction(UPLOAD_STUB);
export const hideuploadStub = createAction(HIDE_UPLOAD_STUB);
export const importStub = createAction(IMPORT_STUB);
export const importStubSuccess = createAction(IMPORT_STUB_SUCCESS);

export const resetMapping = createAction(RESET_MAPPING);
export const loadAllMappings = createAction(LOAD_ALL_MAPPINGS);
export const loadAllMappingsSuccess = createAction(LOAD_ALL_MAPPINGS_SUCCESS);
export const loadNodesSuccess = createAction(LOAD_NODES_SUCCESS);

export const loadSuggestedItems = createAction(LOAD_SUGGESTED_ITEMS);
export const loadSuggestedItemsSuccess = createAction(
  LOAD_SUGGESTED_ITEMS_SUCCESS
);

export const loadGroupNames = createAction(LOAD_GROUP_NAME);
export const loadGroupNamesSuccess = createAction(LOAD_GROUP_NAME_SUCCESS);

export const toggleNode = createAction(TOGGLE_NODE);
export const deActiveNode = createAction(DEACTIVE_NODE);
export const toggleNodeById = createAction(TOGGLE_NODE_BY_ID);

export const addNewContext = createAction(ADD_NEW_CONTEXT);
export const addNewContextSuccess = createAction(ADD_NEW_CONTEXT_SUCCESS);
export const backToDefaultContext = createAction(BACK_TO_DEFAULT_CONTEXT);
export const switchNewContext = createAction(SWITCH_TO_NEW_CONTEXT);
export const saveStubSuccess = createAction(SAVE_STUB_SUCCESS);
export const createNewStub = createAction(CREATE_NEW_STUB);
export const createNewStubSuccess = createAction(CREATE_NEW_STUB_SUCCESS);
export const addNewNodeToTree = createAction(ADD_NEW_NODE_TO_TREE);
export const changeUrl = createAction(CHANGE_URL);

export const collapseWholeTree = createAction(COLLAPSE_WHOLE_TREE);

export const expandWholeTree = createAction(EXPAND_WHOLE_TREE);
