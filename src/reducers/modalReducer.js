import _ from "lodash";

import {
  SHOW_ABOUT_MODAL,
  HIDE_ABOUT_MODAL,
  SHOW_SETTING_MODAL,
  HIDE_SETTING_MODAL,
  EDIT_STUB_MODAL,
  CREATE_STUB,
  HIDE_CREATE_STUB,
  SHARE_STUB,
  HIDE_EDIT_STUB_MODAL,
  HIDE_SHARE_GROUP_STUB,
  HIDE_SHARE_STUB,
  SHARE_GROUP_STUB,
  UPLOAD_STUB,
  HIDE_UPLOAD_STUB,
  SHOW_CONTEXT_MODAL,
  HIDE_CONTEXT_MODAL,
  ADD_NEW_CONTEXT_SUCCESS,
  DUPLICATE_STUB
} from "../actions/actions";

const initialState = {
  about: {
    show: false
  },
  setting: {
    show: false,
    settings: {}
  },
  edit: {
    show: false
  },
  create: {
    show: false,
    copyObj: {}
  },
  share: {
    show: false
  },
  shareGroup: {
    show: false
  },
  uploadStub: {
    show: false
  },
  context: {
    show: false
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ABOUT_MODAL:
      return {
        ...state,
        about: { ...state.about, show: true }
      };
    case HIDE_ABOUT_MODAL:
      return {
        ...state,
        about: { ...state.about, show: false }
      };
    case SHOW_SETTING_MODAL:
      return {
        ...state,
        setting: { ...state.setting, show: true }
      };
    case HIDE_SETTING_MODAL:
      return {
        ...state,
        setting: { ...state.setting, show: false }
      };
    case EDIT_STUB_MODAL:
      return {
        ...state,
        edit: { ...state.edit, show: true }
      };
    case HIDE_EDIT_STUB_MODAL:
      return {
        ...state,
        edit: { ...state.edit, show: false }
      };

    case CREATE_STUB:
      return {
        ...state,
        create: { ...state.create, show: true }
      };
    case DUPLICATE_STUB:
      return {
        ...state,
        create: {
          ...state.create,
          show: true,
          copyObj: _.cloneDeep(action.payload)
        }
      };
    case SHARE_STUB:
      return {
        ...state,
        create: {
          ...state.create,
          show: true,
          copyObj: { ..._.cloneDeep(action.payload), share: true }
        }
      };
    case HIDE_CREATE_STUB:
      return {
        ...state,
        create: { ...state.create, show: false, copyObj: {} }
      };
    case SHARE_STUB:
      return {
        ...state,
        share: { ...state.share, show: true }
      };
    case HIDE_SHARE_STUB:
      return {
        ...state,
        share: { ...state.share, show: false }
      };
    case SHARE_GROUP_STUB:
      let currentGroup = undefined;
      if (action.payload.children) {
        currentGroup = action.payload.name;
      } else {
        currentGroup = action.payload.obj.metadata.file_name;
      }
      const fromContext = action.payload.children
        ? _.get(action.payload, "children[0].obj.metadata.context", "")
        : action.payload.obj.metadata.context;
      return {
        ...state,
        shareGroup: {
          ...state.shareGroup,
          show: true,
          currentGroup,
          fromContext
        }
      };
    case HIDE_SHARE_GROUP_STUB:
      return {
        ...state,
        shareGroup: {
          ...state.shareGroup,
          show: false,
          currentGroup: undefined,
          fromContext: undefined
        }
      };
    case UPLOAD_STUB:
      return {
        ...state,
        uploadStub: { ...state.uploadStub, show: true }
      };
    case HIDE_UPLOAD_STUB:
      return {
        ...state,
        uploadStub: { ...state.uploadStub, show: false }
      };
    case SHOW_CONTEXT_MODAL:
      return {
        ...state,
        context: { ...state.context, show: true }
      };
    case HIDE_CONTEXT_MODAL:
      return {
        ...state,
        context: { ...state.context, show: false }
      };
    case ADD_NEW_CONTEXT_SUCCESS:
      return {
        ...state,
        context: { ...state.context, show: false }
      };
    default:
      return state;
  }
};
